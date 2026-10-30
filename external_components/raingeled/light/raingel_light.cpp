#include "raingel_light.h"
#include "esphome/core/log.h"
#include "esphome/core/helpers.h"
#include <cmath>

#ifdef USE_ESP32
namespace esphome {
namespace raingel {

static const char *const TAG = "raingel_light";

light::LightTraits RaingelLight::get_traits() {
  light::LightTraits traits;
  traits.set_supported_color_modes({light::ColorMode::RGB});
  return traits;
}

void RaingelLight::dump_config() {
  ESP_LOGCONFIG(TAG, "Raingel Light:");
  char service_buf[esp32_ble::UUID_STR_LEN];
  char char_buf[esp32_ble::UUID_STR_LEN];
  this->service_uuid_.to_str(service_buf);
  this->char_uuid_.to_str(char_buf);
  ESP_LOGCONFIG(TAG,
                "  Parent             : %s\n"
                "  Service UUID       : %s\n"
                "  Characteristic UUID: %s",
                this->parent()->address_str(), service_buf, char_buf);
}

void RaingelLight::gattc_event_handler(esp_gattc_cb_event_t event, esp_gatt_if_t gattc_if,
                                       esp_ble_gattc_cb_param_t *param) {
  switch (event) {
    case ESP_GATTC_SEARCH_CMPL_EVT: {
      auto *chr = this->parent()->get_characteristic(this->service_uuid_, this->char_uuid_);
      if (chr == nullptr) {
        char service_buf[esp32_ble::UUID_STR_LEN];
        char char_buf[esp32_ble::UUID_STR_LEN];
        ESP_LOGW(TAG, "Characteristic %s absent from service %s", this->char_uuid_.to_str(char_buf),
                 this->service_uuid_.to_str(service_buf));
        break;
      }
      this->char_handle_ = chr->handle;
      this->char_props_ = chr->properties;
      if (this->char_props_ & ESP_GATT_CHAR_PROP_BIT_WRITE_NR) {
        this->write_type_ = ESP_GATT_WRITE_TYPE_NO_RSP;
      } else if (this->char_props_ & ESP_GATT_CHAR_PROP_BIT_WRITE) {
        this->write_type_ = ESP_GATT_WRITE_TYPE_RSP;
      } else {
        ESP_LOGE(TAG, "Characteristic does not support writing");
        break;
      }
      this->node_state = espbt::ClientState::ESTABLISHED;
      this->ble_retry_count_ = 0;
      ESP_LOGD(TAG, "Connected to tube, full state resync");
      this->resync_all_();
      break;
    }
    case ESP_GATTC_WRITE_CHAR_EVT: {
      if (param->write.handle == this->char_handle_ && param->write.status != 0) {
        ESP_LOGW(TAG, "Write rejected by tube (status=0x%02x)", param->write.status);
      }
      break;
    }
    case ESP_GATTC_DISCONNECT_EVT: {
      this->char_handle_ = 0;
      this->effect_pending_ = false;
      this->node_state = espbt::ClientState::IDLE;
      break;
    }
    default:
      break;
  }
}

void RaingelLight::write_state(light::LightState *state) {
  State next;
  next.on = state->current_values.get_state() > 0.5f;
  next.brightness =
      static_cast<uint8_t>(std::lroundf(clamp(state->current_values.get_brightness(), 0.0f, 1.0f) * 100.0f));
  float red, green, blue;
  state->current_values_as_rgb(&red, &green, &blue);
  next.r = static_cast<uint8_t>(std::lroundf(clamp(red, 0.0f, 1.0f) * 255.0f));
  next.g = static_cast<uint8_t>(std::lroundf(clamp(green, 0.0f, 1.0f) * 255.0f));
  next.b = static_cast<uint8_t>(std::lroundf(clamp(blue, 0.0f, 1.0f) * 255.0f));
  this->desired_ = next;

  uint8_t mask = 0;
  if (next.on != this->sent_.on)
    mask |= MASK_POWER;
  if (next.brightness != this->sent_.brightness)
    mask |= MASK_BRIGHTNESS;
  if (next.r != this->sent_.r || next.g != this->sent_.g || next.b != this->sent_.b)
    mask |= MASK_COLOR;
  this->pending_mask_ |= mask;
}

void RaingelLight::loop() {
  if (this->char_handle_ == 0 || this->node_state != espbt::ClientState::ESTABLISHED)
    return;

  // One packet per loop iteration. The "sent" state is only updated and the "pending"
  // bit only cleared if the write was accepted by the BLE stack: otherwise retry.
  const State &next = this->desired_;
  if (this->effect_pending_) {
    if (this->write_packet_(this->effect_packet_, this->effect_packet_len_))
      this->effect_pending_ = false;
  } else if (this->pending_mask_ & MASK_POWER) {
    uint8_t packet[] = {0x01, static_cast<uint8_t>(next.on ? 1 : 0)};
    if (this->write_packet_(packet, static_cast<uint8_t>(sizeof(packet)))) {
      this->pending_mask_ &= ~MASK_POWER;
      this->sent_.on = next.on;
    }
  } else if (this->pending_mask_ & MASK_BRIGHTNESS) {
    uint8_t packet[] = {0x02, next.brightness};
    if (this->write_packet_(packet, static_cast<uint8_t>(sizeof(packet)))) {
      this->pending_mask_ &= ~MASK_BRIGHTNESS;
      this->sent_.brightness = next.brightness;
    }
  } else if (this->pending_mask_ & MASK_COLOR) {
    uint8_t packet[] = {0x03, next.r, next.g, next.b, 0x00, 0x00, 0x00};
    if (this->write_packet_(packet, static_cast<uint8_t>(sizeof(packet)))) {
      this->pending_mask_ &= ~MASK_COLOR;
      this->sent_.r = next.r;
      this->sent_.g = next.g;
      this->sent_.b = next.b;
    }
  } else {
    return;
  }
}

void RaingelLight::set_effect_rgb(uint8_t mode_id, uint8_t palette_index, uint8_t speed, uint8_t brightness) {
  if (!validate_palette(palette_index, false)) {
    ESP_LOGW(TAG, "Invalid RGB palette: %u (max 29)", palette_index);
    return;
  }
  if (mode_id > 4) {
    ESP_LOGW(TAG, "Invalid RGB mode: %u (0-4)", mode_id);
    return;
  }
  const PaletteInfo &p = kPalettes_[palette_index];
  this->set_effect(mode_id, speed, p.count, p.bytes, brightness);
}

// Catalog extracted from the Raingel APK (com.raingel.app, am.doit.dohome.strip.bean.Mode).
// Palette = hex string from the app converted to bytes (2 colors per byte, nibbles).
// index: (count, bytes) / app: Mode(id, "palette", count)
// colors: 0 red, 1 green, 2 blue, 3 yellow, 4 cyan, 5 violet, 6 orange, 7 white
const RaingelLight::PaletteInfo RaingelLight::kPalettes_[30] = {
    {2, {0x67}},                                  // "67"      orange & white
    {2, {0x56}},                                  // "56"      violet & orange
    {2, {0x45}},                                  // "45"      cyan & violet
    {2, {0x34}},                                  // "34"      yellow & cyan
    {2, {0x23}},                                  // "23"      blue & yellow
    {2, {0x12}},                                  // "12"      green & blue
    {2, {0x01}},                                  // "01"      red & green
    {3, {0x56, 0x70}},                            // "5670"    violet-orange-white
    {3, {0x45, 0x60}},                            // "4560"    cyan-violet-orange
    {3, {0x34, 0x50}},                            // "3450"    yellow-cyan-violet
    {3, {0x23, 0x40}},                            // "2340"    blue-yellow-cyan
    {3, {0x12, 0x30}},                            // "1230"    green-blue-yellow
    {3, {0x01, 0x20}},                            // "0120"    red-green-blue
    {4, {0x45, 0x67}},                            // "4567"    cyan-violet-orange-white
    {4, {0x34, 0x56}},                            // "3456"    yellow-cyan-violet-orange
    {4, {0x23, 0x45}},                            // "2345"    blue-yellow-cyan-violet
    {4, {0x12, 0x34}},                            // "1234"    green-blue-yellow-cyan
    {4, {0x01, 0x23}},                            // "0123"    red-green-blue-yellow
    {5, {0x34, 0x56, 0x70}},                      // "345670"  yellow-cyan-violet-orange-white
    {5, {0x23, 0x45, 0x60}},                      // "234560"  blue-yellow-cyan-violet-orange
    {5, {0x12, 0x34, 0x50}},                      // "123450"  green-blue-yellow-cyan-violet
    {5, {0x01, 0x23, 0x40}},                      // "012340"  red-green-blue-yellow-cyan
    {6, {0x23, 0x45, 0x67}},                      // "234567"  blue-yellow-cyan-violet-orange-white
    {6, {0x12, 0x34, 0x56}},                      // "123456"  green-blue-yellow-cyan-violet-orange
    {6, {0x01, 0x23, 0x45}},                      // "012345"  red-green-blue-yellow-cyan-violet
    {7, {0x06, 0x31, 0x42, 0x50}},                // "06314250" rainbow 7 mixed
    {7, {0x12, 0x34, 0x56, 0x70}},                // "12345670" green-white (7)
    {7, {0x01, 0x23, 0x45, 0x60}},                // "01234560" red-orange (7)
    {8, {0x06, 0x31, 0x42, 0x57}},                // "06314257" rainbow 8 mixed
    {8, {0x01, 0x23, 0x45, 0x67}},                // "01234567" rainbow 8
};

void RaingelLight::set_effect_magic(uint8_t mode_id, uint8_t palette_index,
                                   uint8_t speed, uint8_t brightness) {
  if (!validate_palette(palette_index, true)) {
    ESP_LOGW(TAG, "Invalid Magic palette: %u (max 18)", palette_index);
    return;
  }
  if (mode_id == 0 || mode_id > 18) {
    ESP_LOGW(TAG, "Invalid Magic mode: %u (1-18)", mode_id);
    return;
  }
  const MagicPalette &p = kMagicPalettes_[palette_index];
  this->set_effect(mode_id, speed, p.n_colors, p.bytes, brightness);
}

// "Magic" palettes catalog from the app (bean.Mode, colorValue of MAGIC_MODES):
// 5-byte block = [N] + 8 nibbles (2 per byte) of indices 0..7, zero-padded.
const RaingelLight::MagicPalette RaingelLight::kMagicPalettes_[19] = {
    {0x02, {0x01, 0x00, 0x00, 0x00}},  // red & green
    {0x02, {0x02, 0x00, 0x00, 0x00}},  // red & blue
    {0x02, {0x12, 0x00, 0x00, 0x00}},  // green & blue
    {0x03, {0x01, 0x20, 0x00, 0x00}},  // red-green-blue (3)
    {0x03, {0x23, 0x40, 0x00, 0x00}},  // blue-yellow-cyan (3)
    {0x03, {0x45, 0x60, 0x00, 0x00}},  // cyan-violet-orange (3)
    {0x04, {0x01, 0x23, 0x00, 0x00}},  // red-green-blue-yellow (4)
    {0x04, {0x12, 0x34, 0x00, 0x00}},  // green-blue-yellow-cyan (4)
    {0x04, {0x23, 0x45, 0x00, 0x00}},  // blue-yellow-cyan-violet (4)
    {0x05, {0x01, 0x23, 0x40, 0x00}},  // red to cyan (5)
    {0x05, {0x12, 0x34, 0x50, 0x00}},  // green to violet (5)
    {0x05, {0x23, 0x45, 0x60, 0x00}},  // blue to orange (5)
    {0x06, {0x01, 0x23, 0x45, 0x00}},  // red to violet (6)
    {0x06, {0x12, 0x34, 0x56, 0x00}},  // green to orange (6)
    {0x06, {0x23, 0x45, 0x67, 0x00}},  // blue to white (6)
    {0x07, {0x01, 0x23, 0x45, 0x60}},  // red to orange (7)
    {0x07, {0x12, 0x34, 0x56, 0x70}},  // green to white (7)
    {0x07, {0x06, 0x31, 0x42, 0x50}},  // rainbow 7 (mixed)
    {0x08, {0x01, 0x23, 0x45, 0x67}},  // rainbow 8
};

void RaingelLight::set_effect(uint8_t mode, uint8_t sub_param, uint8_t color_count, const uint8_t *palette,
                              uint8_t brightness) {
  if (mode == 0) {
    // Return to static mode: re-send color + brightness (not power).
    this->effect_pending_ = false;
    this->pending_mask_ |= (MASK_COLOR | MASK_BRIGHTNESS);
    return;
  }
  uint8_t num_bytes = (color_count + 1) / 2;
  if (5 + num_bytes > 20) {
    ESP_LOGE(TAG, "Effect packet too long (%u bytes, max 20)", 5 + num_bytes);
    return;
  }
  this->effect_packet_[0] = 0x07;
  this->effect_packet_[1] = mode;
  this->effect_packet_[2] = sub_param;
  this->effect_packet_[3] = brightness > 100 ? 100 : brightness;  // cap brightness at 100
  this->effect_packet_[4] = color_count;
  for (uint8_t i = 0; i < num_bytes; ++i) {
    this->effect_packet_[5 + i] = palette[i];
  }
  this->effect_packet_len_ = 5 + num_bytes;
  this->pending_mask_ = 0;  // do not overwrite effect with static color
  this->effect_pending_ = true;
}

bool RaingelLight::write_packet_(const uint8_t *data, uint8_t len) {
  if (this->char_handle_ == 0)
    return false;
  if (data == nullptr || len == 0 || len > 20) {
    ESP_LOGW(TAG, "Invalid packet (%u bytes), aborted", len);
    return false;
  }
  esp_err_t err = esp_ble_gattc_write_char(this->parent()->get_gattc_if(), this->parent()->get_conn_id(),
                                           this->char_handle_, len,
                                           const_cast<uint8_t *>(data), this->write_type_,
                                           ESP_GATT_AUTH_REQ_NONE);
  if (err != ESP_OK) {
    this->ble_retry_count_++;
    ESP_LOGW(TAG, "GATT write error err=%d, attempt %d/3", err, this->ble_retry_count_);
    if (this->ble_retry_count_ >= 3) {
      ESP_LOGE(TAG, "Write failed after 3 attempts, full resync");
      this->ble_retry_count_ = 0;
      this->resync_all_();
    }
    return false;
  }
  this->ble_retry_count_ = 0;
  return true;
}

bool RaingelLight::validate_palette(uint8_t palette_index, bool is_magic) {
  if (is_magic) {
    return palette_index < 19;
  }
  return palette_index < 30;
}

}  // namespace raingel
}  // namespace esphome
#endif
