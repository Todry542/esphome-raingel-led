#pragma once

#include "esphome/core/component.h"
#include "esphome/core/helpers.h"
#include "esphome/components/ble_client/ble_client.h"
#include "esphome/components/esp32_ble_tracker/esp32_ble_tracker.h"
#include "esphome/components/light/light_output.h"
#include "esphome/components/light/light_state.h"

#ifdef USE_ESP32

#include <esp_gattc_api.h>

// Raingel Protocol (DoHome). Reference:
// https://github.com/Francesco149/lucente/blob/master/docs/protocols/raingel.md
// - GATT Service AE30, Write-Without-Response on characteristic AE01.
// - Packets [opcode][args...] without checksum: 01 power, 02 brightness 0-100,
//   03 R G B 00 00 00, 07 mode. No state feedback.

namespace esphome {
namespace raingel {

using namespace esphome::ble_client;
namespace espbt = esphome::esp32_ble_tracker;

class RaingelLight : public Component, public light::LightOutput, public BLEClientNode {
 public:
  void setup() override {}
  void loop() override;
  void dump_config() override;

  // --- light::LightOutput ---
  light::LightTraits get_traits() override;
  void write_state(light::LightState *state) override;

  // --- UUID ---
  void set_service_uuid16(uint16_t uuid) { this->service_uuid_ = espbt::ESPBTUUID::from_uint16(uuid); }
  void set_service_uuid32(uint32_t uuid) { this->service_uuid_ = espbt::ESPBTUUID::from_uint32(uuid); }
  void set_service_uuid128(uint8_t *uuid) { this->service_uuid_ = espbt::ESPBTUUID::from_raw(uuid); }
  void set_char_uuid16(uint16_t uuid) { this->char_uuid_ = espbt::ESPBTUUID::from_uint16(uuid); }
  void set_char_uuid32(uint32_t uuid) { this->char_uuid_ = espbt::ESPBTUUID::from_uint32(uuid); }
  void set_char_uuid128(uint8_t *uuid) { this->char_uuid_ = espbt::ESPBTUUID::from_raw(uuid); }

  // --- GATT ---
  void gattc_event_handler(esp_gattc_cb_event_t event, esp_gatt_if_t gattc_if,
                           esp_ble_gattc_cb_param_t *param) override;

  // --- Effects ---
  // mode 0 = return to static mode (returns color + brightness).
  void set_effect(uint8_t mode, uint8_t sub_param, uint8_t color_count, const uint8_t *palette,
                  uint8_t brightness = 100);
  // RGB: mode_id 0 (static) to 4. Palette 0-29.
  void set_effect_rgb(uint8_t mode_id, uint8_t palette_index, uint8_t speed = 50, uint8_t brightness = 100);
  // Magic: mode_id 1 to 18. Palette 0-18.
  void set_effect_magic(uint8_t mode_id, uint8_t palette_index, uint8_t speed = 50, uint8_t brightness = 100);

 protected:
  static constexpr uint8_t MASK_POWER = 0x01;
  static constexpr uint8_t MASK_BRIGHTNESS = 0x02;
  static constexpr uint8_t MASK_COLOR = 0x04;
  static constexpr uint8_t MASK_ALL = MASK_POWER | MASK_BRIGHTNESS | MASK_COLOR;

  int ble_retry_count_{0};

  struct State {
    bool on{false};
    uint8_t brightness{0};
    uint8_t r{0}, g{0}, b{0};
  };

  // Returns true if the packet was accepted by the BLE stack (or aborted if invalid).
  bool write_packet_(const uint8_t *packet, uint8_t len);
  void resync_all_() { this->pending_mask_ = MASK_ALL; }

  struct PaletteInfo {
    uint8_t count;
    uint8_t bytes[4];
  };
  static const PaletteInfo kPalettes_[30];
  struct MagicPalette {
    uint8_t n_colors;
    uint8_t bytes[4];
  };
  static const MagicPalette kMagicPalettes_[19];

  bool validate_palette(uint8_t palette_index, bool is_magic);

  espbt::ESPBTUUID service_uuid_;
  espbt::ESPBTUUID char_uuid_;
  uint16_t char_handle_{0};
  esp_gatt_char_prop_t char_props_{0};
  esp_gatt_write_type_t write_type_{ESP_GATT_WRITE_TYPE_NO_RSP};

  State desired_{};
  State sent_{};
  uint8_t pending_mask_{0};

  bool effect_pending_{false};
  uint8_t effect_packet_[20];
  uint8_t effect_packet_len_{0};
};

}  // namespace raingel
}  // namespace esphome

#endif  // USE_ESP32
