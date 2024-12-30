import * as koffi from "koffi";


export enum AsphodelError {
    ASPHODEL_SUCCESS = 0,
    
    // negative numbers are internally generated. positive numbers come from the device.
    
    // The following errors were originally taken directly from LibUSB. Now they're converted internally
    ASPHODEL_ERROR_IO = -1, // LIBUSB_ERROR_IO
    // -2 used to be LIBUSB_ERROR_INVALID_PARAM, now translated to ASPHODEL_BAD_PARAMETER
    ASPHODEL_ACCESS_ERROR = -3, // LIBUSB_ERROR_ACCESS
    ASPHODEL_NO_DEVICE = -4, // LIBUSB_ERROR_NO_DEVICE
    // -5 used to be LIBUSB_ERROR_NOT_FOUND, now translated to ASPHODEL_NOT_FOUND
    ASPHODEL_BUSY = -6, // LIBUSB_ERROR_BUSY
    ASPHODEL_TIMEOUT = -7, // LIBUSB_ERROR_TIMEOUT
    ASPHODEL_OVERFLOW = -8, // LIBUSB_ERROR_OVERFLOW
    ASPHODEL_PIPE_ERROR = -9, // LIBUSB_ERROR_PIPE
    ASPHODEL_INTERRUPTED = -10, // LIBUSB_ERROR_INTERRUPTED
    // -11 used to be LIBUSB_ERROR_NO_MEM, now tranlated to ASPHODEL_NO_MEM
    ASPHODEL_NOT_SUPPORTED = -12, // LIBUSB_ERROR_NOT_SUPPORTED
    
    ASPHODEL_TRANSPORT_ERROR = -50, // unknown/unspecified LibUSB error gets converted here
    ASPHODEL_STALL = -51, // translated from LIBUSB_TRANSFER_STALL
    ASPHODEL_CANCELLED = -52, // translated from LIBUSB_TRANSFER_CANCELLED
    
    
    ASPHODEL_NO_MEM = -101, // a malloc call returned NULL
    ASPHODEL_BAD_REPLY_LENGTH = -102, // got a reply from the device of unexpected length
    ASPHODEL_MALFORMED_REPLY = -103, // reply packet was too short to be a reply
    ASPHODEL_MALFORMED_ERROR = -104, // error packet was too short to contain the error code
    ASPHODEL_MISMATCHED_TRANSACTION = -105, // got an unexpected transaction id
    ASPHODEL_MISMATCHED_COMMAND = -106, // got an unexpected command response
    ASPHODEL_TRANSFER_ERROR = -107, // got an unknown error during a transfer
    ASPHODEL_INVALID_DESCRIPTOR = -108, // a usb descriptor is badly formed
    ASPHODEL_FULL_TRANSACTION_TABLE = -109, // the transaction table has no open spots
    ASPHODEL_DEVICE_CLOSED = -110, // the device is closed
    ASPHODEL_BAD_PARAMETER = -111, // passed an invalid parameter to a function
    ASPHODEL_COUNTER_FORMAT_UNSUPPORTED = -112, // could not create a counter decoder
    ASPHODEL_CHANNEL_FORMAT_UNSUPPORTED = -113, // could not create a channel decoder
    ASPHODEL_STREAM_ID_FORMAT_UNSUPPORTED = -114, // could not create a stream id decoder
    ASPHODEL_TOO_MANY_TRIES = -115, // Tried too many times without success.
    ASPHODEL_BAD_STREAM_PACKET_SIZE = -116, // stream packet not a multiple of the endpoint size
    ASPHODEL_BAD_CHANNEL_TYPE = -117, // tried to use an unsupported channel type in a channel specific call
    ASPHODEL_OUTGOING_PACKET_TOO_LONG = -118, // tried to send an outgoing packet too long for the device
    ASPHODEL_BAD_STREAM_RATE = -119, // stream rate is unintelligible
    ASPHODEL_NOT_FOUND = -120, // couldn't find a device
    ASPHODEL_NO_RESOURCES = -121, // not enough computer resources (more general than no memory)
    ASPHODEL_UNREACHABLE = -122, // host or network unreachable
    ASPHODEL_UNINITIALIZED = -123, // host or network unreachable
    // NOTE: remember to update asphodel_error_name() implementation when adding more error codes
};


// Asphodel protocol version 2.3.3
// NOTE: use the functions in asphodel_version.h to access the protocol version
export const ASPHODEL_PROTOCOL_VERSION_MAJOR = 0x02
export const ASPHODEL_PROTOCOL_VERSION_MINOR = 0x03
export const ASPHODEL_PROTOCOL_VERSION_SUBMINOR = 0x03

// USB class/subclass defines
// use one ASPHODEL_PROTOCOL_TYPE_* as the USB protocol definition
export const ASPHODEL_USB_CLASS = 0xFF // 0xFF: vendor specific USB class
export const ASPHODEL_USB_SUBCLASS = 0x01 // 0x01: Generic Sensor

// protocol types to define various implementations
export const ASPHODEL_PROTOCOL_TYPE_BASIC = 0x00 // 0x00: basic (minimum) implementation
export const ASPHODEL_PROTOCOL_TYPE_RF_POWER = 0x01 // 0x01: RF Power protocol extension
export const ASPHODEL_PROTOCOL_TYPE_RADIO = 0x02 // 0x02: radio interface controlling a remote interface
export const ASPHODEL_PROTOCOL_TYPE_REMOTE = 0x04 // 0x04: remote interface (controlled by a radio interface)
export const ASPHODEL_PROTOCOL_TYPE_BOOTLOADER = 0x08 // 0x08: firmware bootloader

// general information commands
export const CMD_GET_PROTOCOL_VERSION = 0x00
export const CMD_GET_BOARD_INFO = 0x01
export const CMD_GET_USER_TAG_LOCATIONS = 0x02
export const CMD_GET_BUILD_INFO = 0x03
export const CMD_GET_BUILD_DATE = 0x04
export const CMD_GET_CHIP_FAMILY = 0x05
export const CMD_GET_CHIP_MODEL = 0x06
export const CMD_GET_CHIP_ID = 0x07

// NVM commands
export const CMD_GET_NVM_SIZE = 0x08
export const CMD_ERASE_NVM = 0x09
export const CMD_WRITE_NVM = 0x0A
export const CMD_READ_NVM = 0x0B

// Flush/Reinit communication pipes
export const CMD_FLUSH = 0x0C

// reset commands
export const CMD_RESET = 0x0D
export const CMD_GET_BOOTLOADER_INFO = 0x0E
export const CMD_BOOTLOADER_JUMP = 0x0F

// LED commands
export const CMD_GET_RGB_COUNT = 0x10
export const CMD_GET_RGB_VALUES = 0x11
export const CMD_SET_RGB = 0x12
export const CMD_SET_RGB_INSTANT = 0x13
export const CMD_GET_LED_COUNT = 0x14
export const CMD_GET_LED_VALUE = 0x15
export const CMD_SET_LED = 0x16
export const CMD_SET_LED_INSTANT = 0x17

// state commands
export const CMD_GET_RESET_FLAG = 0x18
export const CMD_CLEAR_RESET_FLAG = 0x19
export const CMD_GET_NVM_MODIFIED = 0x1a
export const CMD_GET_NVM_HASH = 0x1b
export const CMD_GET_SETTING_HASH = 0x1c

// extra build info
export const CMD_GET_COMMIT_ID = 0x1d
export const CMD_GET_REPO_BRANCH = 0x1e
export const CMD_GET_REPO_NAME = 0x1f

// stream commands
export const CMD_GET_STREAM_COUNT_AND_ID = 0x20
export const CMD_GET_STREAM_CHANNELS = 0x21
export const CMD_GET_STREAM_FORMAT = 0x22
export const CMD_ENABLE_STREAM = 0x23
export const CMD_WARM_UP_STREAM = 0x24
export const CMD_GET_STREAM_STATUS = 0x25
export const CMD_GET_STREAM_RATE_INFO = 0x26

// channel commands
export const CMD_GET_CHANNEL_COUNT = 0x30
export const CMD_GET_CHANNEL_NAME = 0x31
export const CMD_GET_CHANNEL_INFO = 0x32
export const CMD_GET_CHANNEL_COEFFICIENTS = 0x33
export const CMD_GET_CHANNEL_CHUNK = 0x34
export const CMD_CHANNEL_SPECIFIC = 0x35
export const CMD_GET_CHANNEL_CALIBRATION = 0x36

// power supply check commands
export const CMD_GET_SUPPLY_COUNT = 0x40
export const CMD_GET_SUPPLY_NAME = 0x41
export const CMD_GET_SUPPLY_INFO = 0x42
export const CMD_CHECK_SUPPLY = 0x43

// control variable commands
export const CMD_GET_CTRL_VAR_COUNT = 0x50
export const CMD_GET_CTRL_VAR_NAME = 0x51
export const CMD_GET_CTRL_VAR_INFO = 0x52
export const CMD_GET_CTRL_VAR = 0x53
export const CMD_SET_CTRL_VAR = 0x54

// settings commands
export const CMD_GET_SETTING_COUNT = 0x60
export const CMD_GET_SETTING_NAME = 0x61
export const CMD_GET_SETTING_INFO = 0x62
export const CMD_GET_SETTING_DEFAULT = 0x63
export const CMD_GET_CUSTOM_ENUM_COUNTS = 0x64
export const CMD_GET_CUSTOM_ENUM_VALUE_NAME = 0x65
export const CMD_GET_SETTING_CATEGORY_COUNT = 0x66
export const CMD_GET_SETTING_CATEGORY_NAME = 0x67
export const CMD_GET_SETTING_CATERORY_SETTINGS = 0x68

// device mode commands
export const CMD_SET_DEVICE_MODE = 0x70
export const CMD_GET_DEVICE_MODE = 0x71

// RF Power commands (only supported by ASPHODEL_PROTOCOL_TYPE_RF_POWER)
export const CMD_ENABLE_RF_POWER = 0x80
export const CMD_GET_RF_POWER_STATUS = 0x81
export const CMD_GET_RF_POWER_CTRL_VARS = 0x82
export const CMD_RESET_RF_POWER_TIMEOUT = 0x83

// Radio commands (only supported by ASPHODEL_PROTOCOL_TYPE_RADIO)
export const CMD_STOP_RADIO = 0x90
export const CMD_START_RADIO_SCAN = 0x91
export const CMD_GET_RADIO_SCAN_RESULTS = 0x92
export const CMD_CONNECT_RADIO = 0x93
export const CMD_GET_RADIO_STATUS = 0x94
export const CMD_GET_RADIO_CTRL_VARS = 0x95
export const CMD_GET_RADIO_DEFAULT_SERIAL = 0x96
export const CMD_START_RADIO_SCAN_BOOT = 0x97
export const CMD_CONNECT_RADIO_BOOT = 0x98
export const CMD_GET_RADIO_EXTRA_SCAN_RESULTS = 0x99
export const CMD_GET_RADIO_SCAN_POWER = 0x9F

// Remote commands (only supported by ASPHODEL_PROTOCOL_TYPE_REMOTE)
export const CMD_STOP_REMOTE = 0x9A
export const CMD_RESTART_REMOTE = 0x9B
export const CMD_GET_REMOTE_STATUS = 0x9C
export const CMD_RESTART_REMOTE_APP = 0x9D
export const CMD_RESTART_REMOTE_BOOT = 0x9E
// NOTE: 0x9F is grouped above with the radio commands

// Bootloader commands (only supported by ASPHODEL_PROTOCOL_TYPE_BOOTLOADER)
export const CMD_BOOTLOADER_START_PROGRAM = 0xA0
export const CMD_GET_BOOTLOADER_PAGE_INFO = 0xA1
export const CMD_GET_BOOTLOADER_BLOCK_SIZES = 0xA2
export const CMD_START_BOOTLOADER_PAGE = 0xA3
export const CMD_WRITE_BOOTLOADER_CODE_BLOCK = 0xA4
export const CMD_FINISH_BOOTLOADER_PAGE = 0xA5
export const CMD_VERIFY_BOOTLOADER_PAGE = 0xA6

// Commands for low-level hardware interaction. Used for testing.
export const CMD_GET_GPIO_PORT_COUNT = 0xE0
export const CMD_GET_GPIO_PORT_NAME = 0xE1
export const CMD_GET_GPIO_PORT_INFO = 0xE2
export const CMD_GET_GPIO_PORT_VALUES = 0xE3
export const CMD_SET_GPIO_PORT_MODES = 0xE4
export const CMD_DISABLE_GPIO_PORT_OVERRIDES = 0xE5
export const CMD_GET_BUS_COUNTS = 0xE6
export const CMD_SET_SPI_CS_MODE = 0xE7
export const CMD_DO_SPI_TRANSFER = 0xE8
export const CMD_DO_I2C_WRITE = 0xE9
export const CMD_DO_I2C_READ = 0xEA
export const CMD_DO_I2C_WRITE_READ = 0xEB
export const CMD_DO_RADIO_FIXED_TEST = 0xEC
export const CMD_DO_RADIO_SWEEP_TEST = 0xED

// Commands for querying device info regions. Used for testing.
export const CMD_GET_INFO_REGION_COUNT = 0xF0
export const CMD_GET_INFO_REGION_NAME = 0xF1
export const CMD_GET_INFO_REGION = 0xF2

// Misc internal testing commands. Seriously, don't use these.
export const CMD_GET_STACK_INFO = 0xF3

// Commands for echoing various bytes back to the host. Used for testing.
export const CMD_ECHO_RAW = 0xFC
export const CMD_ECHO_TRANSACTION = 0xFD
export const CMD_ECHO_PARAMS = 0xFE

// Error reply
export const CMD_REPLY_ERROR = 0xFF

// Error codes
export const ERROR_CODE_UNSPECIFIED = 0x01
export const ERROR_CODE_MALFORMED_COMMAND = 0x02
export const ERROR_CODE_UNIMPLEMENTED_COMMAND = 0x03
export const ERROR_CODE_BAD_CMD_LENGTH = 0x04
export const ERROR_CODE_BAD_ADDRESS = 0x05
export const ERROR_CODE_BAD_INDEX = 0x06
export const ERROR_CODE_INVALID_DATA = 0x07
export const ERROR_CODE_UNSUPPORTED = 0x08
export const ERROR_CODE_BAD_STATE = 0x09
export const ERROR_CODE_I2C_ERROR = 0x0A
export const ERROR_CODE_INCOMPLETE = 0x0B
// NOTE: remember to update asphodel_error_name() implementation when adding more error codes

// Unit types
export const UNIT_TYPE_NONE = 0 // should not be converted to any other unit
export const UNIT_TYPE_LSB = 1 // LSB (directly from an ADC or similar)
export const UNIT_TYPE_PERCENT = 2 // percent (unitless * 100)
export const UNIT_TYPE_VOLT = 3 // voltage
export const UNIT_TYPE_AMPERE = 4 // current
export const UNIT_TYPE_WATT = 5 // power
export const UNIT_TYPE_OHM = 6 // electrical resistance
export const UNIT_TYPE_CELSIUS = 7 // temperature
export const UNIT_TYPE_PASCAL = 8 // pressure
export const UNIT_TYPE_NEWTON = 9 // force
export const UNIT_TYPE_M_PER_S = 10 // velocity
export const UNIT_TYPE_M_PER_S2 = 11 // acceleration / gravity
export const UNIT_TYPE_DB = 12 // logarithmic (unitless)
export const UNIT_TYPE_DBM = 13 // logarithmic (power)
export const UNIT_TYPE_STRAIN = 14 // strain (unitless)
export const UNIT_TYPE_HZ = 15 // frequency
export const UNIT_TYPE_SECOND = 16 // time
export const UNIT_TYPE_LSB_PER_CELSIUS = 17 // LSB per unit temperature
export const UNIT_TYPE_GRAM_PER_S = 18 // mass flow
export const UNIT_TYPE_L_PER_S = 19 // liquid volumetric flow (see also UNIT_TYPE_M3_PER_S)
export const UNIT_TYPE_NEWTON_METER = 20 // torque
export const UNIT_TYPE_METER = 21 // length
export const UNIT_TYPE_GRAM = 22 // mass
export const UNIT_TYPE_M3_PER_S = 23 // volumetric flow (see also UNIT_TYPE_L_PER_S)
// NOTE: remember to update asphodel_unit_type_name() implementation when adding more unit types
export const UNIT_TYPE_COUNT = 24 // note: use asphodel_get_unit_type_count() to get this number

// Channel Types
export const CHANNEL_TYPE_LINEAR = 0
export const CHANNEL_TYPE_NTC = 1
export const CHANNEL_TYPE_ARRAY = 2
export const CHANNEL_TYPE_SLOW_STRAIN = 3
export const CHANNEL_TYPE_FAST_STRAIN = 4
export const CHANNEL_TYPE_SLOW_ACCEL = 5
export const CHANNEL_TYPE_PACKED_ACCEL = 6
export const CHANNEL_TYPE_COMPOSITE_STRAIN = 7
export const CHANNEL_TYPE_LINEAR_ACCEL = 8
export const CHANNEL_TYPE_BIG_ENDIAN_FLOAT32 = 9
export const CHANNEL_TYPE_BIG_ENDIAN_FLOAT64 = 10
export const CHANNEL_TYPE_LITTLE_ENDIAN_FLOAT32 = 11
export const CHANNEL_TYPE_LITTLE_ENDIAN_FLOAT64 = 12
// NOTE: remember to update asphodel_channel_type_name() implementation when adding more channel types
export const CHANNEL_TYPE_COUNT = 13 // note use asphodel_get_channel_type_count() to get this number

// Supply check result bit masks
export const ASPHODEL_SUPPLY_LOW_BATTERY = 0x01
export const ASPHODEL_SUPPLY_TOO_LOW = 0x02
export const ASPHODEL_SUPPLY_TOO_HIGH = 0x04

// Setting Types
export const SETTING_TYPE_BYTE = 0
export const SETTING_TYPE_BOOLEAN = 1
export const SETTING_TYPE_UNIT_TYPE = 2
export const SETTING_TYPE_CHANNEL_TYPE = 3
export const SETTING_TYPE_BYTE_ARRAY = 4
export const SETTING_TYPE_STRING = 5
export const SETTING_TYPE_INT32 = 6
export const SETTING_TYPE_INT32_SCALED = 7
export const SETTING_TYPE_FLOAT = 8
export const SETTING_TYPE_FLOAT_ARRAY = 9
export const SETTING_TYPE_CUSTOM_ENUM = 10
// NOTE: remember to update asphodel_setting_type_name() implementation when adding more setting types
export const SETTING_TYPE_COUNT = 11 // note use asphodel_get_setting_type_count() to get this number

// GPIO pin modes
export const GPIO_PIN_MODE_HI_Z = 0
export const GPIO_PIN_MODE_PULL_DOWN = 1
export const GPIO_PIN_MODE_PULL_UP = 2
export const GPIO_PIN_MODE_LOW = 3
export const GPIO_PIN_MODE_HIGH = 4

// SPI CS modes
export const SPI_CS_MODE_LOW = 0
export const SPI_CS_MODE_HIGH = 1
export const SPI_CS_MODE_AUTO_TRANSFER = 2
export const SPI_CS_MODE_AUTO_BYTE = 3

// Strain channel specific commands
export const STRAIN_SET_OUTPUTS = 0x01

// Accel channel specific commands
export const ACCEL_ENABLE_SELF_TEST = 0x01


const asphodel_command_callback = koffi.proto("void AsphodelCommandCallback_t(int status, void * closure)")

const asphodel_transfer_callback = koffi.proto("void AsphodelTransferCallback_t(int status, const uint8_t *params, size_t param_length, void * closure)")
const streaming_callback = koffi.proto("void AsphodelStreamingCallback_t(int status, const uint8_t *stream_data, size_t packet_size, size_t packet_count, void * closure)")
const connect_callback = koffi.proto("void AsphodelConnectCallback_t(int status, int connected, void * closure)")

const proto_open_device = koffi.proto("int open_device(void * device)")
const proto_close_device = koffi.proto("void close_device(void *device)")
const proto_free_device = koffi.proto("void free_device(void *device)")
const proto_get_serial_number = koffi.proto("int get_serial_number(void *device, char *buffer, size_t buffer_size)")
const proto_do_transfer = koffi.proto("int do_transfer(void *device, uint8_t command, const uint8_t *params,size_t param_length, AsphodelTransferCallback_t *callback, void * closure)")
const proto_do_transfer_reset= koffi.proto("int do_transfer_reset(void *device, uint8_t command, const uint8_t *params,size_t param_length, AsphodelTransferCallback_t *callback, void * closure)")
const proto_start_streaming_packets= koffi.proto("int start_streaming_packets(void *device, int packet_count, int transfer_count,unsigned int timeout, AsphodelStreamingCallback_t *callback, void * closure)")
const proto_stop_streaming_packets= koffi.proto("void stop_streaming_packets(void *device)")
const proto_get_stream_packets_blocking= koffi.proto("int get_stream_packets_blocking(void *device, uint8_t *buffer, int *count,unsigned int timeout)")
const proto_get_max_incoming_param_length= koffi.proto("size_t get_max_incoming_param_length(void * device)")
const proto_get_max_outgoing_param_length= koffi.proto("size_t get_max_outgoing_param_length(void * device)")
const proto_get_stream_packet_length= koffi.proto("size_t get_stream_packet_length(void* device)")
const proto_poll_device= koffi.proto("int poll_device(void * device, int milliseconds, int *completed)")
const proto_set_connect_callback= koffi.proto("int set_connect_callback(void * device, AsphodelConnectCallback_t *callback, void * closure)")
const proto_wait_for_connect= koffi.proto("int wait_for_connect(void * device, unsigned int timeout)")
const proto_get_remote_device= koffi.proto("int get_remote_device(void* device, void **remote_device)")
const proto_reconnect_device= koffi.proto("int reconnect_device(void * device, void **reconnected_device)");
const proto_error_callback= koffi.proto("int error_callback(void * device, int status, void * closure)");
const proto_reconnect_device_bootloader= koffi.proto("int reconnect_device_bootloader(void * device, void **reconnected_device)")
const proto_reconnect_device_application= koffi.proto("int reconnect_device_application(void * device, void **reconnected_device)")

const lib = koffi.load("/Users/carmelofiorello/Haptica/LibUsb/Upwork/asphodel/asphodel/builds/osx/arm64/libasphodel.dylib")



//=============================================================================
const Device = koffi.struct("AsphodelDevice_t", {
    protocal: "int",
    location_string: "char *",
    open_device: koffi.pointer(proto_open_device),
    close_device: koffi.pointer(proto_close_device),
    free_device: koffi.pointer(proto_free_device),
    get_serial_number: koffi.pointer(proto_free_device),
    do_transfer: koffi.pointer(proto_do_transfer),
    do_transfer_reset: koffi.pointer(proto_do_transfer_reset),
    start_streaming_packets: koffi.pointer(proto_start_streaming_packets),
    stop_streaming_packets: koffi.pointer(proto_stop_streaming_packets),
    get_stream_packets_blocking: koffi.pointer(proto_get_stream_packets_blocking),
    get_max_incoming_param_length: koffi.pointer(proto_get_max_incoming_param_length),
    get_max_outgoing_param_length: koffi.pointer(proto_get_max_outgoing_param_length),
    get_stream_packet_length: koffi.pointer(proto_get_stream_packet_length),
    poll_device: koffi.pointer(proto_poll_device),
    set_connect_callback: koffi.pointer(proto_set_connect_callback),
    wait_for_connect: koffi.pointer(proto_wait_for_connect),
    get_remote_device: koffi.pointer(proto_get_remote_device),
    reconnect_device: koffi.pointer(proto_reconnect_device),
    error_callback: koffi.pointer(proto_error_callback),
    error_closure: "void*",
    reconnect_device_bootloader: koffi.pointer(proto_reconnect_device_bootloader),
    reconnect_device_application: koffi.pointer(proto_reconnect_device_application),
    implementation_info: "void*",
    
    transport_type: "string",

    reserved: "void*",
    reserved1: "void*",
    reserved2: "void*",
    reserved3: "void*",
    reserved4: "void*",
    reserved5: "void*",
    reserved6: "void*",
    reserved7: "void*",
    reserved8: "void*",
})


const asphodel_get_protocol_version_blocking = lib.func('int asphodel_get_protocol_version_blocking(AsphodelDevice_t *device, uint16_t *version)');
const asphodel_get_protocol_version_string_blocking = lib.func('int asphodel_get_protocol_version_string_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_get_board_info_blocking = lib.func('int asphodel_get_board_info_blocking(AsphodelDevice_t *device, uint8_t *rev, char *buffer, size_t buffer_size)');
const asphodel_get_user_tag_locations_blocking = lib.func('int asphodel_get_user_tag_locations_blocking(AsphodelDevice_t *device, size_t *locations)');
const asphodel_get_build_info_blocking = lib.func('int asphodel_get_build_info_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_get_build_date_blocking = lib.func('int asphodel_get_build_date_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_get_commit_id_blocking = lib.func('int asphodel_get_commit_id_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_get_repo_branch_blocking = lib.func('int asphodel_get_repo_branch_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_get_repo_name_blocking = lib.func('int asphodel_get_repo_name_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_get_chip_family_blocking = lib.func('int asphodel_get_chip_family_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_get_chip_model_blocking = lib.func('int asphodel_get_chip_model_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_get_chip_id_blocking = lib.func('int asphodel_get_chip_id_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_get_nvm_size_blocking = lib.func('int asphodel_get_nvm_size_blocking(AsphodelDevice_t *device, size_t *size)');
const asphodel_erase_nvm_blocking = lib.func('int asphodel_erase_nvm_blocking(AsphodelDevice_t *device)');
const asphodel_write_nvm_raw_blocking = lib.func('int asphodel_write_nvm_raw_blocking(AsphodelDevice_t *device, size_t start_address, const uint8_t *data, size_t length)');
const asphodel_write_nvm_section_blocking = lib.func('int asphodel_write_nvm_section_blocking(AsphodelDevice_t *device, size_t start_address, const uint8_t *data, size_t length)');
const asphodel_read_nvm_raw_blocking = lib.func('int asphodel_read_nvm_raw_blocking(AsphodelDevice_t *device, size_t start_address, uint8_t *data, size_t *length)');
const asphodel_read_nvm_section_blocking = lib.func('int asphodel_read_nvm_section_blocking(AsphodelDevice_t *device, size_t start_address, uint8_t *data, size_t length)');
const asphodel_read_user_tag_string_blocking = lib.func('int asphodel_read_user_tag_string_blocking(AsphodelDevice_t *device, size_t offset, size_t length, char *buffer)');
const asphodel_write_user_tag_string_blocking = lib.func('int asphodel_write_user_tag_string_blocking(AsphodelDevice_t *device, size_t offset, size_t length, const char *buffer)');
const asphodel_get_nvm_modified_blocking = lib.func('int asphodel_get_nvm_modified_blocking(AsphodelDevice_t *device, uint8_t *modified)');
const asphodel_get_nvm_hash_blocking = lib.func('int asphodel_get_nvm_hash_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_get_setting_hash_blocking = lib.func('int asphodel_get_setting_hash_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_flush_blocking = lib.func('int asphodel_flush_blocking(AsphodelDevice_t *device)');
const asphodel_reset_blocking = lib.func('int asphodel_reset_blocking(AsphodelDevice_t *device)');
const asphodel_get_bootloader_info_blocking = lib.func('int asphodel_get_bootloader_info_blocking(AsphodelDevice_t *device, char *buffer, size_t buffer_size)');
const asphodel_bootloader_jump_blocking = lib.func('int asphodel_bootloader_jump_blocking(AsphodelDevice_t *device)');
const asphodel_get_reset_flag_blocking = lib.func('int asphodel_get_reset_flag_blocking(AsphodelDevice_t *device, uint8_t *flag)');
const asphodel_clear_reset_flag_blocking = lib.func('int asphodel_clear_reset_flag_blocking(AsphodelDevice_t *device)');
const asphodel_get_rgb_count_blocking = lib.func('int asphodel_get_rgb_count_blocking(AsphodelDevice_t *device, int *count)');
const asphodel_get_rgb_values_blocking = lib.func('int asphodel_get_rgb_values_blocking(AsphodelDevice_t *device, int index, uint8_t *values)');
const asphodel_set_rgb_values_blocking = lib.func('int asphodel_set_rgb_values_blocking(AsphodelDevice_t *device, int index, const uint8_t *values, int instant)');
const asphodel_set_rgb_values_hex_blocking = lib.func('int asphodel_set_rgb_values_hex_blocking(AsphodelDevice_t *device, int index, uint32_t color, int instant)');
const asphodel_get_led_count_blocking = lib.func('int asphodel_get_led_count_blocking(AsphodelDevice_t *device, int *count)');
const asphodel_get_led_value_blocking = lib.func('int asphodel_get_led_value_blocking(AsphodelDevice_t *device, int index, uint8_t *value)');
const asphodel_set_led_value_blocking = lib.func('int asphodel_set_led_value_blocking(AsphodelDevice_t *device, int index, uint8_t value, int instant)');
const asphodel_set_device_mode_blocking = lib.func('int asphodel_set_device_mode_blocking(AsphodelDevice_t *device, uint8_t mode)');
const asphodel_get_device_mode_blocking = lib.func('int asphodel_get_device_mode_blocking(AsphodelDevice_t *device, uint8_t *mode)');




//=======================================================================================
const asphodel_error_name = lib.func('asphodel_error_name', 'string', ['int']);

const asphodel_unit_type_name = lib.func('asphodel_unit_type_name', 'string', ['uint8']);

const asphodel_get_unit_type_count = lib.func('asphodel_get_unit_type_count', 'uint8', []);

const asphodel_channel_type_name = lib.func('asphodel_channel_type_name', 'string', ['uint8']);

const asphodel_get_channel_type_count = lib.func('asphodel_get_channel_type_count', 'uint8', []);

const asphodel_setting_type_name = lib.func('asphodel_setting_type_name', 'string', ['uint8']);

const asphodel_get_setting_type_count = lib.func('asphodel_get_setting_type_count', 'uint8', []);


//=========================================================================
const AsphodelDecodeCallback_t = koffi.proto('void AsphodelDecodeCallback_t(uint64_t counter, double *data, size_t samples, size_t subchannels, void *closure)');

const AsphodelCounterDecoderFunc_t = koffi.proto('uint64_t AsphodelCounterDecoderFunc_t(const uint8_t *buffer, uint64_t last)');

const AsphodelLostPacketCallback_t = koffi.proto('void AsphodelLostPacketCallback_t(uint64_t current, uint64_t last, void *closure)');

const AsphodelIDDecoderFunc_t = koffi.proto('uint8_t AsphodelIDDecoderFunc_t(const uint8_t *buffer)');

const AsphodelUnknownIDCallback_t = koffi.proto('void AsphodelUnknownIDCallback_t(uint8_t id, void *closure)');


//================================================================

const AsphodelStreamInfo_t = koffi.struct('AsphodelStreamInfo_t', {
  channel_index_list: koffi.pointer('const uint8_t'),
  channel_count: 'uint8_t',
  filler_bits: 'uint8_t',
  counter_bits: 'uint8_t',
  rate: 'float',
  rate_error: 'float',
  warm_up_delay: 'float',
});


const AsphodelChannelInfo_t = koffi.struct('AsphodelChannelInfo_t', {
  name: koffi.pointer('const uint8_t'),
  name_length: 'uint8_t',
  channel_type: 'uint8_t', 
  unit_type: 'uint8_t', 
  filler_bits: 'uint16_t', 
  data_bits: 'uint16_t', 
  samples: 'uint8_t', 
  bits_per_sample: 'int16_t', 
  minimum: 'float',
  maximum: 'float', 
  resolution: 'float',
  coefficients: koffi.pointer('const float'),
  coefficients_length: 'uint8_t', 
  chunks: koffi.pointer('const uint8_t*'),
  chunk_lengths: koffi.pointer('uint8_t'), 
  chunk_count: 'uint8_t', 
});


const AsphodelChannelCalibration_t = koffi.struct('AsphodelChannelCalibration_t', {
  base_setting_index: 'int', 
  resolution_setting_index: 'int', 
  scale: 'float',
  offset: 'float', 
  minimum: 'float', 
  maximum: 'float', 
});


const asphodel_get_stream_count_blocking = lib.func('int asphodel_get_stream_count_blocking(AsphodelDevice_t *device, int *count, uint8_t *filler_bits, uint8_t *id_bits)');

const asphodel_get_stream_blocking = lib.func('int asphodel_get_stream_blocking(AsphodelDevice_t *device, int index, AsphodelStreamInfo_t **stream_info)');

const asphodel_get_stream_channels_blocking = lib.func('int asphodel_get_stream_channels_blocking(AsphodelDevice_t *device, int index, uint8_t *channels, uint8_t *length)');

const asphodel_get_stream_format_blocking = lib.func('int asphodel_get_stream_format_blocking(AsphodelDevice_t *device, int index, AsphodelStreamInfo_t *stream_info)');

const asphodel_enable_stream_blocking = lib.func('int asphodel_enable_stream_blocking(AsphodelDevice_t *device, int index, int enable)');

const asphodel_warm_up_stream_blocking = lib.func('int asphodel_warm_up_stream_blocking(AsphodelDevice_t *device, int index, int enable)');

const asphodel_get_stream_status_blocking = lib.func('int asphodel_get_stream_status_blocking(AsphodelDevice_t *device, int index, int *enable, int *warm_up)');

const asphodel_get_stream_rate_info_blocking = lib.func('int asphodel_get_stream_rate_info_blocking(AsphodelDevice_t *device, int index, int *available, int *channel_index, int *invert, float *scale, float *offset)');

const asphodel_get_channel_count_blocking = lib.func('int asphodel_get_channel_count_blocking(AsphodelDevice_t *device, int *count)');

const asphodel_get_channel_blocking = lib.func('int asphodel_get_channel_blocking(AsphodelDevice_t *device, int index, AsphodelChannelInfo_t **channel_info)');

const asphodel_get_channel_name_blocking = lib.func('int asphodel_get_channel_name_blocking(AsphodelDevice_t *device, int index, char *buffer, uint8_t *length)');

const asphodel_get_channel_info_blocking = lib.func('int asphodel_get_channel_info_blocking(AsphodelDevice_t *device, int index, AsphodelChannelInfo_t *channel_info)');

const asphodel_get_channel_coefficients_blocking = lib.func('int asphodel_get_channel_coefficients_blocking(AsphodelDevice_t *device, int index, float *coefficients, uint8_t *length)');

const asphodel_get_channel_chunk_blocking = lib.func('int asphodel_get_channel_chunk_blocking(AsphodelDevice_t *device, int index, uint8_t chunk_number, uint8_t *chunk, uint8_t *length)');

const asphodel_channel_specific_blocking = lib.func('int asphodel_channel_specific_blocking(AsphodelDevice_t *device, int index, uint8_t *data, uint8_t data_length, uint8_t *reply, uint8_t *reply_length)');

const asphodel_get_channel_calibration_blocking = lib.func('int asphodel_get_channel_calibration_blocking(AsphodelDevice_t *device, int index, int *available, AsphodelChannelCalibration_t *calibration)');



//====================================================================


const decodePrototype = koffi.proto('void decode(void *decoder, uint64_t counter, const uint8_t *buffer)');
const free_decoderPrototype = koffi.proto('void free_decoder(void *decoder)');
const resetPrototype = koffi.proto('void reset(void *decoder)');
const set_conversion_factorPrototype = koffi.proto('void set_conversion_factor(void *decoder, double scale, double offset)');


const AsphodelChannelDecoder_t = koffi.struct("AsphodelChannelDecoder_t",{
  decode: koffi.pointer(decodePrototype),
  free_decoder: koffi.pointer(free_decoderPrototype),
  reset: koffi.pointer(resetPrototype),
  set_conversion_factor: koffi.pointer(set_conversion_factorPrototype),
  channel_bit_offset: 'uint16_t',
  samples: 'size_t',
  channel_name: 'char*',
  subchannels: 'size_t',
  subchannel_names: 'char**',
  callback: "AsphodelDecodeCallback_t*",
  closure: 'void*'
});


const decodePrototype2 = koffi.proto('void decode2(void *decoder, const uint8_t *buffer)');
const free_decoderPrototype2 = koffi.proto('void free_decoder2(void *decoder)');
const resetPrototype2 = koffi.proto('void reset2(void *decoder)');


const AsphodelStreamDecoder_t = koffi.struct("AsphodelStreamDecoder_t", {
    decode: koffi.pointer(decodePrototype2),  
    free_decoder: koffi.pointer(free_decoderPrototype2),  
    reset: koffi.pointer(resetPrototype2), 
    last_count: 'uint64_t',
    counter_byte_offset: 'size_t',
    counter_decoder: 'AsphodelCounterDecoderFunc_t*',
    channels: 'size_t',
    decoders: 'AsphodelChannelDecoder_t**',
    lost_packet_callback: 'AsphodelLostPacketCallback_t*', 
    lost_packet_closure: 'void*',
    used_bits: 'uint16_t'
  });



const decodePrototype3 = koffi.proto('void decode3(void *decoder, const uint8_t *buffer)');
const free_decoderPrototype3 = koffi.proto('void free_decoder3(void *decoder)');
const resetPrototype3 = koffi.proto('void reset3(void *decoder)');


const AsphodelDeviceDecoder_t = koffi.struct("AsphodelDeviceDecoder_t",{
    decode: koffi.pointer(decodePrototype3),  
    free_decoder: koffi.pointer(free_decoderPrototype3), 
    reset: koffi.pointer(resetPrototype3), 
    id_byte_offset: 'size_t',
    id_decoder: 'AsphodelIDDecoderFunc_t*',
    streams: 'size_t',
    stream_ids: 'uint8_t*', 
    decoders: 'AsphodelStreamDecoder_t**',
    unknown_id_callback: 'AsphodelUnknownIDCallback_t*', 
    unknown_id_closure: 'void*',
    used_bits: 'uint16_t'
  });
  

const AsphodelStreamAndChannels_t = koffi.struct("AsphodelStreamAndChannels_t", {
  stream_id: 'uint8_t',
  stream_info: 'AsphodelStreamInfo_t*',
  channel_info: 'AsphodelChannelInfo_t**'
});

// Define the function signatures for each function

// asphodel_create_channel_decoder(AsphodelChannelInfo_t *channel_info, uint16_t channel_bit_offset, AsphodelChannelDecoder_t **decoder)
const asphodel_create_channel_decoder = lib.func('asphodel_create_channel_decoder', 'int', ['AsphodelChannelInfo_t*', 'uint16_t', 'AsphodelChannelDecoder_t**']);

// asphodel_create_stream_decoder(AsphodelStreamAndChannels_t *info, uint16_t stream_bit_offset, AsphodelStreamDecoder_t **decoder)
const asphodel_create_stream_decoder = lib.func('asphodel_create_stream_decoder', 'int', ['AsphodelStreamAndChannels_t*', 'uint16_t', 'AsphodelStreamDecoder_t**']);

// asphodel_create_device_decoder(AsphodelStreamAndChannels_t *info_array, uint8_t info_array_size, uint8_t filler_bits, uint8_t id_bits, AsphodelDeviceDecoder_t **decoder)
const asphodel_create_device_decoder = lib.func('asphodel_create_device_decoder', 'int', ['AsphodelStreamAndChannels_t*', 'uint8_t', 'uint8_t', 'uint8_t', 'AsphodelDeviceDecoder_t**']);

// asphodel_get_streaming_counts(AsphodelStreamAndChannels_t *info_array, uint8_t info_array_size, double response_time, double buffer_time, int *packet_count, int *transfer_count, unsigned int *timeout)
const asphodel_get_streaming_counts = lib.func('asphodel_get_streaming_counts', 'int', ['AsphodelStreamAndChannels_t*', 'uint8_t', 'double', 'double', 'int*', 'int*', 'unsigned int*']);

//=================================================================================
// asphodel_bootloader_start_program_blocking(AsphodelDevice_t *device) -> int
const asphodel_bootloader_start_program_blocking = lib.func('asphodel_bootloader_start_program_blocking', 'int', ['AsphodelDevice_t*']);

// asphodel_get_bootloader_page_info_blocking(AsphodelDevice_t *device, uint32_t *page_info, uint8_t *length) -> int
const asphodel_get_bootloader_page_info_blocking = lib.func('asphodel_get_bootloader_page_info_blocking', 'int', ['AsphodelDevice_t*', 'uint32_t*', 'uint8_t*']);

// asphodel_get_bootloader_block_sizes_blocking(AsphodelDevice_t *device, uint16_t *block_sizes, uint8_t *length) -> int
const asphodel_get_bootloader_block_sizes_blocking = lib.func('asphodel_get_bootloader_block_sizes_blocking', 'int', ['AsphodelDevice_t*', 'uint16_t*', 'uint8_t*']);

// asphodel_start_bootloader_page_blocking(AsphodelDevice_t *device, uint32_t page_number, uint8_t *nonce, size_t length) -> int
const asphodel_start_bootloader_page_blocking = lib.func('asphodel_start_bootloader_page_blocking', 'int', ['AsphodelDevice_t*', 'uint32_t', 'uint8_t*', 'size_t']);

// asphodel_write_bootloader_code_block_blocking(AsphodelDevice_t *device, uint8_t *data, size_t length) -> int
const asphodel_write_bootloader_code_block_blocking = lib.func('asphodel_write_bootloader_code_block_blocking', 'int', ['AsphodelDevice_t*', 'uint8_t*', 'size_t']);

// asphodel_write_bootloader_page_blocking(AsphodelDevice_t *device, uint8_t *data, size_t data_length, uint16_t *block_sizes, uint8_t block_sizes_length) -> int
const asphodel_write_bootloader_page_blocking = lib.func('asphodel_write_bootloader_page_blocking', 'int', ['AsphodelDevice_t*', 'uint8_t*', 'size_t', 'uint16_t*', 'uint8_t']);

// asphodel_finish_bootloader_page_blocking(AsphodelDevice_t *device, uint8_t *mac_tag, size_t length) -> int
const asphodel_finish_bootloader_page_blocking = lib.func('asphodel_finish_bootloader_page_blocking', 'int', ['AsphodelDevice_t*', 'uint8_t*', 'size_t']);

// asphodel_verify_bootloader_page_blocking(AsphodelDevice_t *device, uint8_t *mac_tag, size_t length) -> int
const asphodel_verify_bootloader_page_blocking = lib.func('asphodel_verify_bootloader_page_blocking', 'int', ['AsphodelDevice_t*', 'uint8_t*', 'size_t']);

//===================================================================================

const asphodel_set_strain_outputs_blocking = lib.func('asphodel_set_strain_outputs_blocking', 'int', ['AsphodelDevice_t*', 'int', 'int', 'int', 'int']);

const asphodel_check_strain_resistances_blocking = lib.func('asphodel_check_strain_resistances', 'int', ['AsphodelChannelInfo_t*', 'int', 'double', 'double', 'double', 'double*', 'double*', 'int*']);

const asphodel_enable_accel_self_test_blocking = lib.func('asphodel_enable_accel_self_test_blocking', 'int', ['AsphodelDevice_t*', 'int', 'int']);

const asphodel_check_accel_self_test_blocking = lib.func('asphodel_check_accel_self_test', 'int', ['AsphodelChannelInfo_t*', 'double*', 'double*', 'int*']);

//============================================================================================


export const AsphodelCtrlVarInfo_t = koffi.struct("AsphodelCtrlVarInfo_t",{
    name: koffi.pointer("uint8_t"),  
    name_length: "uint8_t",             
    unit_type: "uint8_t",            
    minimum: "int32_t",              
    maximum: "int32_t",              
    scale: "float",                  
    offset: "float"                   
});


const asphodel_get_ctrl_var_count_blocking = lib.func('int asphodel_get_ctrl_var_count_blocking(AsphodelDevice_t *device, int *count)');

const asphodel_get_ctrl_var_name_blocking = lib.func('int asphodel_get_ctrl_var_name_blocking(AsphodelDevice_t *device, int index, char *buffer, uint8_t *length)');

const asphodel_get_ctrl_var_info_blocking = lib.func('int asphodel_get_ctrl_var_info_blocking(AsphodelDevice_t *device, int index, AsphodelCtrlVarInfo_t *ctrl_var_info)');

const asphodel_get_ctrl_var_blocking = lib.func('int asphodel_get_ctrl_var_blocking(AsphodelDevice_t *device, int index, int32_t *value)');

const asphodel_set_ctrl_var_blocking = lib.func('int asphodel_set_ctrl_var_blocking(AsphodelDevice_t *device, int index, int32_t value)');

//===================================================================================================


const asphodel_supports_rf_power_commands = lib.func('int asphodel_supports_rf_power_commands(AsphodelDevice_t *device)');

const asphodel_supports_radio_commands = lib.func('int asphodel_supports_radio_commands(AsphodelDevice_t *device)');

const asphodel_supports_remote_commands = lib.func('int asphodel_supports_remote_commands(AsphodelDevice_t *device)');

const asphodel_supports_bootloader_commands = lib.func('int asphodel_supports_bootloader_commands(AsphodelDevice_t *device)');


//==============================================================================
const AsphodelGPIOPortInfo_t = koffi.struct("AsphodelGPIOPortInfo_t", {
    name: koffi.pointer("uint8"),
    name_length: 'uint8', 
    input_pins: 'uint32',  
    output_pins: 'uint32',  
    floating_pins: 'uint32',  
    loaded_pins: 'uint32',  
    overridden_pins: 'uint32'
});


const asphodel_get_gpio_port_count_blocking = lib.func('int asphodel_get_gpio_port_count_blocking(AsphodelDevice_t *device, int *count)');
const asphodel_get_gpio_port_name_blocking = lib.func('int asphodel_get_gpio_port_name_blocking(AsphodelDevice_t *device, int index, char *buffer, uint8_t *length)');
const asphodel_get_gpio_port_info_blocking = lib.func('int asphodel_get_gpio_port_info_blocking(AsphodelDevice_t *device, int index, AsphodelGPIOPortInfo_t *gpio_port_info)');
const asphodel_get_gpio_port_values_blocking = lib.func('int asphodel_get_gpio_port_values_blocking(AsphodelDevice_t *device, int index, uint32_t *pin_values)');
const asphodel_set_gpio_port_modes_blocking = lib.func('int asphodel_set_gpio_port_modes_blocking(AsphodelDevice_t *device, int index, uint8_t mode, uint32_t pins)');
const asphodel_disable_gpio_overrides_blocking = lib.func('int asphodel_disable_gpio_overrides_blocking(AsphodelDevice_t *device)');
const asphodel_get_bus_counts_blocking = lib.func('int asphodel_get_bus_counts_blocking(AsphodelDevice_t *device, int *spi_count, int *i2c_count)');
const asphodel_set_spi_cs_mode_blocking = lib.func('int asphodel_set_spi_cs_mode_blocking(AsphodelDevice_t *device, int index, uint8_t cs_mode)');
const asphodel_do_spi_transfer_blocking = lib.func('int asphodel_do_spi_transfer_blocking(AsphodelDevice_t *device, int index, const uint8_t *tx_data, uint8_t *rx_data, uint8_t data_length)');
const asphodel_do_i2c_write_blocking = lib.func('int asphodel_do_i2c_write_blocking(AsphodelDevice_t *device, int index, uint8_t addr, const uint8_t *tx_data, uint8_t write_length)');
const asphodel_do_i2c_read_blocking = lib.func('int asphodel_do_i2c_read_blocking(AsphodelDevice_t *device, int index, uint8_t addr, uint8_t *rx_data, uint8_t read_length)');
const asphodel_do_i2c_write_read_blocking = lib.func('int asphodel_do_i2c_write_read_blocking(AsphodelDevice_t *device, int index, uint8_t addr, const uint8_t *tx_data, uint8_t write_length, uint8_t *rx_data, uint8_t read_length)');
const asphodel_do_radio_fixed_test_blocking = lib.func('int asphodel_do_radio_fixed_test_blocking(AsphodelDevice_t *device, uint16_t channel, uint16_t duration, uint8_t mode)');
const asphodel_do_radio_sweep_test_blocking = lib.func('int asphodel_do_radio_sweep_test_blocking(AsphodelDevice_t *device, uint16_t start_channel, uint16_t stop_channel, uint16_t hop_interval, uint16_t hop_count, uint8_t mode)');
const asphodel_get_info_region_count_blocking = lib.func('int asphodel_get_info_region_count_blocking(AsphodelDevice_t *device, int *count)');
const asphodel_get_info_region_name_blocking = lib.func('int asphodel_get_info_region_name_blocking(AsphodelDevice_t *device, int index, char *buffer, uint8_t *length)');
const asphodel_get_info_region_blocking = lib.func('int asphodel_get_info_region_blocking(AsphodelDevice_t *device, int index, uint8_t *data, uint8_t *length)');
const asphodel_get_stack_info_blocking = lib.func('int asphodel_get_stack_info_blocking(AsphodelDevice_t *device, uint32_t *stack_info)');
const asphodel_echo_raw_blocking = lib.func('int asphodel_echo_raw_blocking(AsphodelDevice_t *device, const uint8_t *data, size_t data_length, uint8_t *reply, size_t *reply_length)');
const asphodel_echo_transaction_blocking = lib.func('int asphodel_echo_transaction_blocking(AsphodelDevice_t *device, const uint8_t *data, size_t data_length, uint8_t *reply, size_t *reply_length)');
const asphodel_echo_params_blocking = lib.func('int asphodel_echo_params_blocking(AsphodelDevice_t *device, const uint8_t *data, size_t data_length, uint8_t *reply, size_t *reply_length)');

// ======================================================================================

//const asphodel_mem_test_supported = lib.func('int asphodel_mem_test_supported()');
//const asphodel_mem_test_set_limit = lib.func('void asphodel_mem_test_set_limit(int limit)');
//const asphodel_mem_test_get_limit = lib.func('int asphodel_mem_test_get_limit()');
//const asphodel_mem_test_malloc = lib.func('void* asphodel_mem_test_malloc(size_t size)');
//const asphodel_mem_test_free = lib.func('void asphodel_mem_test_free(void *ptr)');


//======================================================================

const AsphodelExtraScanResult_t = koffi.struct("AsphodelExtraScanResult_t",{
    serial_number: 'uint32',
    asphodel_type: 'uint8',
    device_mode: 'uint8',
    _reserved: 'uint16'
  });
  
const asphodel_stop_radio_blocking = lib.func('int asphodel_stop_radio_blocking(AsphodelDevice_t *device)');
const asphodel_start_radio_scan_blocking = lib.func('int asphodel_start_radio_scan_blocking(AsphodelDevice_t *device)');
const asphodel_get_raw_radio_scan_results_blocking = lib.func('int asphodel_get_raw_radio_scan_results_blocking(AsphodelDevice_t *device, uint32_t *serials, size_t *length)');
const asphodel_get_radio_scan_results_blocking = lib.func('int asphodel_get_radio_scan_results_blocking(AsphodelDevice_t *device, uint32_t **serials, size_t *length)');
const asphodel_get_raw_radio_extra_scan_results_blocking = lib.func('int asphodel_get_raw_radio_extra_scan_results_blocking(AsphodelDevice_t *device, AsphodelExtraScanResult_t *results, size_t *length)');
const asphodel_get_radio_extra_scan_results_blocking = lib.func('int asphodel_get_radio_extra_scan_results_blocking(AsphodelDevice_t *device, AsphodelExtraScanResult_t **results, size_t *length)');
const asphodel_get_radio_scan_power_blocking = lib.func('int asphodel_get_radio_scan_power_blocking(AsphodelDevice_t *device, const uint32_t *serials, int8_t *powers, size_t length)');
const asphodel_connect_radio_blocking = lib.func('int asphodel_connect_radio_blocking(AsphodelDevice_t *device, uint32_t serial_number)');
const asphodel_get_radio_status_blocking = lib.func('int asphodel_get_radio_status_blocking(AsphodelDevice_t *device, int *connected, uint32_t *serial_number, uint8_t *protocol_type, int *scanning)');
const asphodel_get_radio_ctrl_vars_blocking = lib.func('int asphodel_get_radio_ctrl_vars_blocking(AsphodelDevice_t *device, uint8_t *ctrl_var_indexes, uint8_t *length)');
const asphodel_get_radio_default_serial_blocking = lib.func('int asphodel_get_radio_default_serial_blocking(AsphodelDevice_t *device, uint32_t *serial_number)');
const asphodel_start_radio_scan_boot_blocking = lib.func('int asphodel_start_radio_scan_boot_blocking(AsphodelDevice_t *device)');
const asphodel_connect_radio_boot_blocking = lib.func('int asphodel_connect_radio_boot_blocking(AsphodelDevice_t *device, uint32_t serial_number)');
const asphodel_stop_remote_blocking = lib.func('int asphodel_stop_remote_blocking(AsphodelDevice_t *device)');
const asphodel_restart_remote_blocking = lib.func('int asphodel_restart_remote_blocking(AsphodelDevice_t *device)');
const asphodel_get_remote_status_blocking = lib.func('int asphodel_get_remote_status_blocking(AsphodelDevice_t *device, int *connected, uint32_t *serial_number, uint8_t *protocol_type)');
const asphodel_restart_remote_app_blocking = lib.func('int asphodel_restart_remote_app_blocking(AsphodelDevice_t *device)');
const asphodel_restart_remote_boot_blocking = lib.func('int asphodel_restart_remote_boot_blocking(AsphodelDevice_t *device)');

//===================================================================================
const asphodel_enable_rf_power_blocking = lib.func('int asphodel_enable_rf_power_blocking(AsphodelDevice_t *device, int enable)');
const asphodel_get_rf_power_status_blocking = lib.func('int asphodel_get_rf_power_status_blocking(AsphodelDevice_t *device, int *enabled)');
const asphodel_get_rf_power_ctrl_vars_blocking = lib.func('int asphodel_get_rf_power_ctrl_vars_blocking(AsphodelDevice_t *device, uint8_t *ctrl_var_indexes, uint8_t *length)');
const asphodel_reset_rf_power_timeout_blocking = lib.func('int asphodel_reset_rf_power_timeout_blocking(AsphodelDevice_t *device, uint32_t timeout)');

//========================================================================================

const asphodel_usb_devices_supported = lib.func('int asphodel_usb_devices_supported()');
const asphodel_usb_init = lib.func('int asphodel_usb_init()');
const asphodel_usb_deinit = lib.func('void asphodel_usb_deinit()');
const asphodel_usb_find_devices = lib.func('int asphodel_usb_find_devices(AsphodelDevice_t **device_list, size_t *list_size)');
const asphodel_usb_poll_devices = lib.func('int asphodel_usb_poll_devices(int milliseconds)');
const asphodel_usb_get_backend_version = lib.func('const char * asphodel_usb_get_backend_version()');

//======================================================================================
const asphodel_get_library_protocol_version = lib.func('uint16_t asphodel_get_library_protocol_version()');
const asphodel_get_library_protocol_version_string = lib.func('const char * asphodel_get_library_protocol_version_string()');
const asphodel_get_library_build_info = lib.func('const char * asphodel_get_library_build_info()');
const asphodel_get_library_build_date = lib.func('const char * asphodel_get_library_build_date()');

//===========================================================================================
const Asphodel_TCPAdvInfo_t = koffi.struct("Asphodel_TCPAdvInfo_t", {
    tcp_version: 'uint8',                          
    connected: 'uint8',                            
    max_incoming_param_length: 'size_t',          
    max_outgoing_param_length: 'size_t',          
    stream_packet_length: 'size_t',               
    protocol_type: 'int',                      
    serial_number: 'char*',                  
    board_rev: 'uint8',                            
    board_type: 'char*',                           
    build_info: 'char*',                           
    build_date: 'char*',                           
    user_tag1: 'char*',                            
    user_tag2: 'char*',                            
    remote_max_incoming_param_length: 'size_t',   
    remote_max_outgoing_param_length: 'size_t',   
    remote_stream_packet_length: 'size_t'         
});


const asphodel_tcp_get_advertisement = lib.func('Asphodel_TCPAdvInfo_t* asphodel_tcp_get_advertisement(AsphodelDevice_t* device)');
const asphodel_tcp_devices_supported = lib.func('int asphodel_tcp_devices_supported()');
const asphodel_tcp_init = lib.func('int asphodel_tcp_init()');
const asphodel_tcp_deinit = lib.func('void asphodel_tcp_deinit()');
const asphodel_tcp_find_devices = lib.func('int asphodel_tcp_find_devices(AsphodelDevice_t **device_list, size_t *list_size)');
const asphodel_tcp_find_devices_filter = lib.func('int asphodel_tcp_find_devices_filter(AsphodelDevice_t **device_list, size_t *list_size, uint32_t flags)');
const asphodel_tcp_poll_devices = lib.func('int asphodel_tcp_poll_devices(int milliseconds)');
const asphodel_tcp_create_device = lib.func('int asphodel_tcp_create_device(const char* host, uint16_t port, int timeout, const char* serial, AsphodelDevice_t **device)');

//=====================================================================
const AsphodelSupplyInfo_t = koffi.struct("AsphodelSupplyInfo_t",{
    name: 'uint8*',  
    name_length: 'uint8',   
    unit_type: 'uint8',
    is_battery: 'uint8',      
    nominal: 'int32',         
    scale: 'float',         
    offset: 'float'           
});

const asphodel_get_supply_count_blocking = lib.func('int asphodel_get_supply_count_blocking(AsphodelDevice_t *device, int *count)');
const asphodel_get_supply_name_blocking = lib.func('int asphodel_get_supply_name_blocking(AsphodelDevice_t *device, int index, char *buffer, uint8_t *length)');
const asphodel_get_supply_info_blocking = lib.func('int asphodel_get_supply_info_blocking(AsphodelDevice_t *device, int index, AsphodelSupplyInfo_t *supply_info)');
const asphodel_check_supply_blocking = lib.func('int asphodel_check_supply_blocking(AsphodelDevice_t *device, int index, int32_t *measurement, uint8_t *result, int tries)');

//=======================================================================
const AsphodelByteSetting = koffi.struct({
    nvm_word: 'uint16',
    nvm_word_byte: 'uint8'
});

const AsphodelByteArraySetting = koffi.struct({
    nvm_word: 'uint16',
    maximum_length: 'uint8',
    length_nvm_word: 'uint16',
    length_nvm_word_byte: 'uint8'
});

const AsphodelStringSetting = koffi.struct({
    nvm_word: 'uint16',
    maximum_length: 'uint8'
});

const AsphodelInt32Setting = koffi.struct({
    nvm_word: 'uint16',
    minimum: 'int32',
    maximum: 'int32'
});

const AsphodelInt32ScaledSetting = koffi.struct({
    nvm_word: 'uint16',
    minimum: 'int32',
    maximum: 'int32',
    unit_type: 'uint8',
    scale: 'float',
    offset: 'float'
});

const AsphodelFloatSetting = koffi.struct({
    nvm_word: 'uint16',
    minimum: 'float',
    maximum: 'float',
    unit_type: 'uint8',
    scale: 'float',
    offset: 'float'
});

const AsphodelFloatArraySetting = koffi.struct({
    nvm_word: 'uint16',
    minimum: 'float',
    maximum: 'float',
    unit_type: 'uint8',
    scale: 'float',
    offset: 'float',
    maximum_length: 'uint8',
    length_nvm_word: 'uint16',
    length_nvm_word_byte: 'uint8'
});

const AsphodelCustomEnumSetting = koffi.struct({
    nvm_word: 'uint16',
    nvm_word_byte: 'uint8',
    custom_enum_index: 'uint8'
});

const AsphodelSettingInfo_t = koffi.struct("AsphodelSettingInfo_t",{
    name: 'uint8*',        
    name_length: 'uint8',     
    default_bytes: 'uint8*',  
    default_bytes_length: 'uint8', 
    setting_type: 'uint8', 
    u: koffi.union({
        byte_setting: AsphodelByteSetting,
        byte_array_setting: AsphodelByteArraySetting,
        string_setting: AsphodelStringSetting,
        int32_setting: AsphodelInt32Setting,
        int32_scaled_setting: AsphodelInt32ScaledSetting,
        float_setting: AsphodelFloatSetting,
        float_array_setting: AsphodelFloatArraySetting,
        custom_enum_setting: AsphodelCustomEnumSetting
    })
});

const asphodel_get_setting_count_blocking = lib.func('int asphodel_get_setting_count_blocking(AsphodelDevice_t *device, int *count)');
const asphodel_get_setting_name_blocking = lib.func('int asphodel_get_setting_name_blocking(AsphodelDevice_t *device, int index, char *buffer, uint8_t *length)');
const asphodel_get_setting_info_blocking = lib.func('int asphodel_get_setting_info_blocking(AsphodelDevice_t *device, int index, AsphodelSettingInfo_t *setting_info)');
const asphodel_get_setting_default_blocking = lib.func('int asphodel_get_setting_default_blocking(AsphodelDevice_t *device, int index, uint8_t *default_bytes, uint8_t *length)');
const asphodel_get_custom_enum_counts_blocking = lib.func('int asphodel_get_custom_enum_counts_blocking(AsphodelDevice_t *device, uint8_t *counts, uint8_t *length)');
const asphodel_get_custom_enum_value_name_blocking = lib.func('int asphodel_get_custom_enum_value_name_blocking(AsphodelDevice_t *device, int index, int value, char *buffer, uint8_t *length)');
const asphodel_get_setting_category_count_blocking = lib.func('int asphodel_get_setting_category_count_blocking(AsphodelDevice_t *device, int *count)');
const asphodel_get_setting_category_name_blocking = lib.func('int asphodel_get_setting_category_name_blocking(AsphodelDevice_t *device, int index, char *buffer, uint8_t *length)');
const asphodel_get_setting_category_settings_blocking = lib.func('int asphodel_get_setting_category_settings_blocking(AsphodelDevice_t *device, int index, uint8_t *settings, uint8_t *length)');


export class API {

    public static getErrorName(code: number) {
        return asphodel_error_name(code)
    }

    public static getUnitTypeName(unit_type: number) {
        return asphodel_unit_type_name(unit_type)
    }

    public static getUnitTypeCount() {
        return asphodel_get_unit_type_count();
    }

    public static getChannelTypeName(channel_type: number) {
        return asphodel_channel_type_name(channel_type)
    }

    public static getChannelTypeCount() {
        return asphodel_get_channel_type_count()
    }

    public static getSettingTypeName(channel_type: number) {
        return asphodel_setting_type_name(channel_type)
    }

    public static getSettingTypeCount() {
        return asphodel_get_setting_type_count()
    }
}


function checkForError(code: number) {
    if(code != 0) {
        throw new Error(API.getErrorName(code))
    }
}

export class ByteSettingWrapper {
    inner: any

    constructor(inner: any) {
        this.inner = inner;
    }

    public getNVMWord() {
        return this.inner.nvm_word
    }

    public getNVMWordByte() {
        return this.inner.nvm_word_byte
    }
}

export class ByteArraySettingWrapper {
    inner: any
    constructor(inner: any) {
        this.inner = inner;
    }

    public getNVMWord() {
        return this.inner.nvm_word
    }

    public getMaximumLength() {
        return this.inner.maximum_length
    }

    public getLengthNVMWord() {
        return this.inner.length_nvm_word
    }

    public getLengthNVMWordByte() {
        return this.inner.length_nvm_word_byte
    }
}

export class StringSettingWrapper {
    inner: any
    constructor(inner: any) {
        this.inner = inner;
    }

    public getNVMWord() {
        return this.inner.nvm_word
    }

    public getMaximumLength() {
        return this.inner.maximum_length
    }
}

export class Int32SettingWrapper {
    inner: any
    constructor(inner: any) {
        this.inner = inner;
    }

    public getNVMWord() {
        return this.inner.nvm_word
    }

    public getMaximum() {
        return this.inner.maximum
    }

    public getMinimum() {
        return this.inner.minimum
    }

}

export class Int32ScaledSettingWrapper {
    inner: any
    constructor(inner: any) {
        this.inner = inner;
    }

    public getNVMWord() {
        return this.inner.nvm_word
    }

    public getMaximum() {
        return this.inner.maximum
    }

    public getMinimum() {
        return this.inner.minimum
    }

    public getUnitType() {
        return this.inner.unit_type
    }

    public getScale() {
        return this.inner.scale
    }

    public getOffset() {
        return this.inner.offset
    }
}

export class FloatSettingWrapper {
    inner: any
    constructor(inner: any) {
        this.inner = inner;
    }

    public getNVMWord() {
        return this.inner.nvm_word
    }

    public getMaximum() {
        return this.inner.maximum
    }

    public getMinimum() {
        return this.inner.minimum
    }

    public getUnitType() {
        return this.inner.unit_type
    }

    public getScale() {
        return this.inner.scale
    }

    public getOffset() {
        return this.inner.offset
    }
}


export class FloatArraySettingWrapper {
    inner: any
    constructor(inner: any) {
        this.inner = inner;
    }

    public getNVMWord() {
        return this.inner.nvm_word
    }

    public getMaximum() {
        return this.inner.maximum
    }

    public getMinimum() {
        return this.inner.minimum
    }

    public getUnitType() {
        return this.inner.unit_type
    }

    public getScale() {
        return this.inner.scale
    }

    public getOffset() {
        return this.inner.offset
    }

    public getMaximumLength() {
        return this.inner.maximum_length
    }

    public getLengthNVMWord() {
        return this.inner.length_nvm_word
    }

    public getLengthNVMWordByte() {
        return this.inner.length_nvm_word_byte
    }
}

export class CustomEnumSettingWrapper {
    inner: any

    constructor(inner: any) {
        this.inner = inner;
    }

    public getNVMWord() {
        return this.inner.nvm_word
    }

    public getNVMWordByte() {
        return this.inner.nvm_word_byte
    }

    public getCustomEnumIndex() {
        return this.inner.custom_enum_index
    }
}

export class SettingInfoWrapper {
    inner: any
    inner_ptr:any
    //string: any

    constructor(inner: any) {
        this.inner = inner;
    }

    public getType() {
        return this.inner.setting_type
    }

    public getSetting() {
        let union = this.inner.u;
        switch (this.inner.setting_type) {
            case SETTING_TYPE_BYTE: return new ByteSettingWrapper(union)
            case SETTING_TYPE_BYTE_ARRAY: return new ByteArraySettingWrapper(union)
            case SETTING_TYPE_INT32: return new Int32SettingWrapper(union)
            case SETTING_TYPE_INT32_SCALED: return new Int32ScaledSettingWrapper(union)
            case SETTING_TYPE_FLOAT: return new FloatSettingWrapper(union)
            case SETTING_TYPE_FLOAT_ARRAY: return new FloatArraySettingWrapper(union)
            case SETTING_TYPE_CUSTOM_ENUM: return new CustomEnumSettingWrapper(union)
            case SETTING_TYPE_STRING: return new StringSettingWrapper(union)
            default:
                throw new Error("Invalid setting type")
        }
    }

    public defaultBytes() {
        //let len = this.inner.deref().default_bytes_length
        //var resbuff = new Uint8Array(len)
        //let ptr = this.inner.deref().default_bytes.buffer.reinterpret(len);
        //ptr.copy(resbuff)
        //return resbuff  
        return koffi.decode(this.inner.default_bytes, "uint8", this.inner.default_bytes_length)
    }
}

export class DeviceWrapper {
    inner: any
    transfer_cb: any
    streaming_cb: any
    connect_cb: any
    error_cb: any


    constructor(inner: any) {
        this.inner = inner; 
    }
}


class USB {
    /** initialize the USB portion of the library. MUST be called before asphodel_usb_find_devices()**/
    public static init() {
        checkForError(asphodel_usb_init())
    }

    /** close down the USB portion of the library. asphodel_usb_init() can be called afterwards, if needed later.
     */
    public static deinit() {
        asphodel_usb_deinit();
    }


    /** returns true if the library has been build with USB device support (-DASPHODEL_USB_DEVICE), and false otherwise.
     */
    public static supported(): boolean {
        if (asphodel_usb_devices_supported() == 0) {
            return false;
        }
        return true
    }

    /** Poll all USB devices at once. Implementation note: each USB device's poll_device() will poll all devices. This
    function is provided for code readability when polling multiple devices. */

    public static poll(milliseconds: number) {
        checkForError(asphodel_usb_poll_devices(milliseconds))
    }

    /** Return the version string for the running version of the usb backend (libusb-1.0 in current implementations)
     */
    public static backendVersion() {
        return asphodel_usb_get_backend_version()
    }

    /** Find any Asphodel devices attached to the system via USB. The device_list parameter should be an array of
    AsphodelDevice_t pointers, with the array size pointed to by list_size. The array will be filled with pointers
    to AsphodelDevice_t structs, up to the array length. The total number of found USB devices will be written into
    the address pointed to by list_size. ALL returned devices must be freed (either immediately or at a later point)
    by the calling code by calling the AsphodelDevice_t free_device function pointer.
    */
    public static findDevices() {
        let lenPtr = koffi.alloc("size_t", 1);
        
        checkForError(asphodel_usb_find_devices(null, lenPtr))

        const len = koffi.decode(lenPtr, "size_t");
        
        let list = Buffer.alloc( len * koffi.sizeof(koffi.pointer(Device)))
        //let list = [{}]
        asphodel_usb_find_devices(list, lenPtr)

      let devices: DeviceWrapper[] = [];

      console.log("devides",list[0])
      let device_inners = koffi.decode(list, koffi.pointer(Device), koffi.decode(lenPtr, "size_t"))

      console.log(device_inners)

        //for(let i = 0; i < koffi.decode(lenPtr, "size_t"); i++) {
            //console.log("============")
            //let b = .alloc(ref.refType(Device));
            //if(ffi.types.size_t.size == 4) {
            //    if(os.endianness() == "BE") {
            //        b.writeUInt32BE(list.readUInt32BE(i * 4))
            //        devices.push(new DeviceWrapper(this.lib, b.deref()))
            //    } else {
            //        b.writeUInt32LE(list.readUInt32LE(i * 4))
            //        devices.push(new DeviceWrapper(this.lib, b.deref()))
            //    }
            //} else {
            //    if(os.endianness() == "BE") {
            //        b.writeBigUInt64BE(list.readBigUInt64BE(i * 8))
            //        devices.push(new DeviceWrapper(this.lib, b.deref()))
            //    } else {
            //        b.writeBigUInt64LE(list.readBigUInt64LE(i * 8))
            //        devices.push(new DeviceWrapper(this.lib, b.deref()))
            //    }
            //}
        //}
        return devices;
    }//

}

USB.init()

console.log(USB.backendVersion())
USB.findDevices()

