import esphome.codegen as cg
from esphome.components import ble_client, esp32_ble_tracker, light
import esphome.config_validation as cv
from esphome.const import (
    CONF_CHARACTERISTIC_UUID,
    CONF_ID,
    CONF_OUTPUT_ID,
    CONF_SERVICE_UUID,
)

from .. import raingel_ns

DEPENDENCIES = ["ble_client"]

RaingelLight = raingel_ns.class_(
    "RaingelLight",
    cg.Component,
    light.LightOutput,
    ble_client.BLEClientNode,
)

CONFIG_SCHEMA = light.RGB_LIGHT_SCHEMA.extend(
    {
        cv.GenerateID(CONF_OUTPUT_ID): cv.declare_id(RaingelLight),
        cv.Optional(CONF_SERVICE_UUID, default="AE30"): esp32_ble_tracker.bt_uuid,
        cv.Optional(CONF_CHARACTERISTIC_UUID, default="AE01"): esp32_ble_tracker.bt_uuid,
    }
).extend(
    cv.COMPONENT_SCHEMA
).extend(
    ble_client.BLE_CLIENT_SCHEMA
)


async def to_code(config):
    var = cg.new_Pvariable(config[CONF_OUTPUT_ID])

    if len(config[CONF_SERVICE_UUID]) == len(esp32_ble_tracker.bt_uuid16_format):
        cg.add(var.set_service_uuid16(esp32_ble_tracker.as_hex(config[CONF_SERVICE_UUID])))
    elif len(config[CONF_SERVICE_UUID]) == len(esp32_ble_tracker.bt_uuid32_format):
        cg.add(var.set_service_uuid32(esp32_ble_tracker.as_hex(config[CONF_SERVICE_UUID])))
    elif len(config[CONF_SERVICE_UUID]) == len(esp32_ble_tracker.bt_uuid128_format):
        uuid128 = esp32_ble_tracker.as_reversed_hex_array(config[CONF_SERVICE_UUID])
        cg.add(var.set_service_uuid128(uuid128))

    if len(config[CONF_CHARACTERISTIC_UUID]) == len(esp32_ble_tracker.bt_uuid16_format):
        cg.add(var.set_char_uuid16(esp32_ble_tracker.as_hex(config[CONF_CHARACTERISTIC_UUID])))
    elif len(config[CONF_CHARACTERISTIC_UUID]) == len(esp32_ble_tracker.bt_uuid32_format):
        cg.add(var.set_char_uuid32(esp32_ble_tracker.as_hex(config[CONF_CHARACTERISTIC_UUID])))
    elif len(config[CONF_CHARACTERISTIC_UUID]) == len(esp32_ble_tracker.bt_uuid128_format):
        uuid128 = esp32_ble_tracker.as_reversed_hex_array(config[CONF_CHARACTERISTIC_UUID])
        cg.add(var.set_char_uuid128(uuid128))

    await light.register_light(var, config)
    await ble_client.register_ble_node(var, config)
    await cg.register_component(var, config)
