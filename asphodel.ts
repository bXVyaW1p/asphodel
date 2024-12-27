import * as StructType from 'ref-struct-napi';
import * as UnionType from 'ref-union-napi';
import * as ArrayType from 'ref-array-napi'
import * as ffi from 'ffi-napi';
import * as ref from 'ref-napi';

//let dummy = loadAsphodelLibrary("");



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

const AsphodelCommandCallback = "void*"

const Device = StructType({
    protocal: ffi.types.int,
    location_string: ffi.types.CString,
    open_device: ffi.Function("int", [ref.refType("void")]),
    close_device: ffi.Function("int", [ref.refType("void")]),
    free_device: ffi.Function("int", [ref.refType("void")]),
    get_serial_number: ffi.Function("int", [ref.refType("void"), "uint8*", ref.types.size_t]),
    do_transfer: ffi.Function("int", ["void*", "uint8", "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]),
    do_transfer_reset: ffi.Function("int", ["void*", "uint8", "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]),
    start_streaming_packets: ffi.Function("int", ["void*", "int", "int", "uint", AsphodelCommandCallback, "void*"]),
    stop_streaming_packets: ffi.Function("int", ["void*"]),
    get_stream_packets_blocking: ffi.Function("int", ["void*", "uint8*", "int*", "int"]),
    get_max_incoming_param_length: ffi.Function(ffi.types.size_t, ["void*"]),
    get_max_outgoing_param_length: ffi.Function(ffi.types.size_t, ["void*"]),
    get_stream_packet_length: ffi.Function(ffi.types.size_t, ["void*"]),
    poll_device: ffi.Function("int", ["void*", "int", "int*"]),
    set_connect_callback: ffi.Function("int", ["void*", AsphodelCommandCallback, "void*"]),
    wait_for_connect: ffi.Function("int", ["void*", "uint"]),
    get_remote_device: ffi.Function("int", ["void*", "void**"]),
    reconnect_device: ffi.Function("int", ["void*", "void**"]),
    error_callback: ffi.Function("int", ["void*", "int", "void*"]),
    error_closure: "void*",
    reconnect_device_bootloader: ffi.Function("int", ["void*", "int", "void*"]),
    reconnect_device_application: ffi.Function("int", ["void*", "int", "void*"]),
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


const StreamInfo = StructType({
    channel_index_list: ArrayType("uint8"),
    channel_count: "uint8",
    filler_bits: "uint8",
    counter_bits: "uint8",
    rate: "float",
    rate_error: "float",
    warm_up_delay: "float"
})

const ChannelInfo = StructType({
    name: ArrayType("uint8"),
    name_length: "uint8",
    channel_type: "uint8",
    unit_type: "uint8",
    filler_bits: "uint16",
    data_bits: "uint16",
    samples: "uint8",
    bits_per_sample: "uint16",
    minimum: "float",
    maximum: "float",
    resolution: "float",
    coefficients: ArrayType("float"),
    coefficients_length: "uint8",
    chunks: ArrayType(ArrayType("uint8")),
    chunk_lengths: ArrayType("uint8"),
    chunk_count: "uint8"
})

const ChannelCallibration = StructType({
    // NOTE: the five calibration settings are always in order as: unit, scale, offset, minimum and maximum.
    base_setting_index: "int", // index of the first setting (i.e. unit)
    resolution_setting_index: "int", // may optionally be an invalid setting number
    scale: "float",
    offset: "float",
    minimum: "float", // if not finite (e.g. NaN), then no min setting available
    maximum: "float" // if not finite (e.g. NaN), then no max setting available
})

const CtrlVarInfo = StructType({
    name: ArrayType("uint8"),
    name_length: "uint8",
    unit_type: "uint8",
    minimum: "int32",
    maximum: "int32",
    scale: "float",
    offset: "float"
})

const AsphodelDecodeCallback = "void*"

const ChannelDecoder = StructType({
    decode: ffi.Function("void", ["void*", "uint64", "uint8*"]),
    free_decoder: ffi.Function("void", ["void*"]),
    reset: ffi.Function("void", ["void*"]),
    set_conversion_factor: ffi.Function("void", ["double", "double"]),
    channel_bit_offset: "uint16",
    samples: ffi.types.size_t,
    channel_name: ffi.types.CString,
    subchannels: ffi.types.size_t,
    subchannel_names: ArrayType(ffi.types.CString),
    callback: AsphodelDecodeCallback,
    closure: "void*"
})

const AsphodelCounterDecoderFunc = "void*"
const AsphodelLostPacketCallback = "void*"

const ChannelDecoderPtr = ref.refType(ChannelDecoder)
const StreamDecoder = StructType({
    decode: ffi.Function("void", ["void*", "uint8*"]),
    free_decoder: ffi.Function("void", ["void*"]),
    reset: ffi.Function("void", ["void*"]),
    last_count: "uint64",
    counter_byte_offset: ffi.types.size_t,
    counter_decoder: AsphodelCounterDecoderFunc,
    channels: ffi.types.size_t,
    decoders: ArrayType(ChannelDecoderPtr),
    lost_packet_callback: AsphodelLostPacketCallback,
    lost_packet_closure: "void*",
    used_bits: "uint16"
})

const StreamDecoderPtr = ref.refType(StreamDecoder)
const AsphodelUnknownIDCallback = "void*"
const AsphodelIDDecoderFunc = "void*"

const DeviceDecoder = StructType({
    decode: "void*",
    free_decoder: "void*",
    reset: "void*",
    id_byte_offset: ffi.types.size_t,
    id_decoder: AsphodelIDDecoderFunc,
    streams: ffi.types.size_t,
    stream_ids: ArrayType("uint8"),
    decoders: ArrayType(StreamDecoderPtr),
    unknown_id_callback: AsphodelUnknownIDCallback,
    unknown_id_closure: "void*",
    used_bits: "uint16"
})

const StreamInfoPtr = ref.refType(StreamInfo)
const ChannelInfoPtr = ref.refType(ChannelInfo)


const StreamAndChannels = StructType({
    stream_id: "uint8",
    stream_info: StreamInfoPtr,
    channel_info: ref.refType(ChannelInfoPtr)
})

const GPIOPortInfo = StructType({
    name: ArrayType("uint8"),
    name_length: "uint8",
    input_pins: "uint32", // pins that are inputs (i.e. their read value cannot be controlled)
    output_pins: "uint32", // pins that are outputs
    floating_pins: "uint32", // pins that are not connected to anything
    loaded_pins: "uint32", // output pins that are loaded (i.e. they may not respond to pull-up or pull-down)
    overridden_pins: "uint32" // pins that are connected to dedicated hardware functionality, and cannot be controlled

})

const ExtraScanResult = StructType({
    serial_number: "uint32",
    asphodel_type: "uint8",
    device_mode: "uint8",
    _reserved: "uint16"
})

const ByteSetting = StructType({
    nvm_word: "uint16",
    nvm_word_byte: "uint8"
})

const ByteArraySetting = StructType({
    nvm_word: "uint16", // where the first array element is stored (at byte 0)
    maximum_length: "uint8", // maximum array length
    length_nvm_word: "uint16", // where the actual length is stored
    length_nvm_word_byte: "uint8" // byte offset in the word (0-3)
})

const StringSetting = StructType({
    nvm_word: "uint16",
    maximum_length: "uint8"
})

const Int32Setting = StructType({
    nvm_word: "uint16", // where the int32_t is stored
    minimum: "int32",
    maximum: "int32"
})

const Int32ScaledSetting = StructType({
    nvm_word: "uint16", // where the int32_t is stored
    minimum: "int32",
    maximum: "int32",
    unit_type: "uint8",
    scale: "float",
    offset: "float"
})

const FloatSetting = StructType({
    nvm_word: "uint16", // where the float is stored
    minimum: "float",
    maximum: "float",
    unit_type: "uint8",
    scale: "float",
    offset: "float"
})

const FloatArraySetting = StructType({
    nvm_word: "uint16", // where the first float is stored
    minimum: "float",
    maximum: "float",
    unit_type: "uint8",
    scale: "float",
    offset: "float",
    maximum_length: "uint8", // maximum array length
    length_nvm_word: "uint16", // where the actual length is stored
    length_nvm_word_byte: "uint8" // 0-3
})

const CustomEnumSetting = StructType({
    nvm_word: "uint16",
    nvm_word_byte: "uint8", // 0-3
    custom_enum_index: "uint8"
})

const SettingInfo = StructType({
    name: ref.refType("uint8"),
    name_length: "uint8",
    default_bytes: ArrayType("uint8"),
    default_bytes_length: "uint8",
    setting_type: "uint8",
    u: UnionType({
        byte_setting: ByteSetting,
        byte_array_setting: ByteArraySetting,
        string_setting: StringSetting,
        int32_setting: Int32Setting,
        int32_scaled_setting: Int32ScaledSetting,
        float_setting: FloatSetting,
        float_array_setting: FloatArraySetting,
        custom_enum_setting: CustomEnumSetting
    })
})

//SettingInfo.

const SupplyInfo = StructType({
    name: ArrayType("uint8"),
    name_length: "uint8",
    unit_type: "uint8",
    is_battery: "uint8",
    nominal: "int32",
    scale: "float",
    offset: "float"
})

const TcpAdvInfo = StructType({
    tcp_version: "uint8",
    connected: "uint8",
    max_incoming_param_length: ffi.types.size_t,
    max_outgoing_param_length: ffi.types.size_t,
    stream_packet_length: ffi.types.size_t,
    protocol_type: "int",
    serial_number: ffi.types.CString,
    board_rev: "uint8",
    board_type: ffi.types.CString,
    build_info: ffi.types.CString,
    build_date: ffi.types.CString,
    user_tag1: ffi.types.CString,
    user_tag2: ffi.types.CString,
    remote_max_incoming_param_length: ffi.types.size_t,
    remote_max_outgoing_param_length: ffi.types.size_t,
    remote_stream_packet_length: ffi.types.size_t
})

export const ASPHODEL_TCP_FILTER_DEFAULT = 0x0 // default parameters used by asphodel_tcp_find_devices()
export const ASPHODEL_TCP_FILTER_PREFER_IPV6 = 0x0 // when a device SN is discovered on multiple protocols return only IPv6
export const ASPHODEL_TCP_FILTER_PREFER_IPV4 = 0x1 // when a device SN is discovered on multiple protocols return only IPv4
export const ASPHODEL_TCP_FILTER_ONLY_IPV6 = 0x2 // only search for devices using IPv6
export const ASPHODEL_TCP_FILTER_ONLY_IPV4 = 0x3 // only search for devices using IPv4
export const ASPHODEL_TCP_FILTER_RETURN_ALL = 0x4 // return each protocol instance of all devices found

const UnitFormatter = StructType({
    format_bare: ffi.Function("int", ["void*", "uint8*", ffi.types.size_t, "double"]),
    format_ascii: ffi.Function("int", ["void*", "uint8*", ffi.types.size_t, "double"]),
    format_utf8: ffi.Function("int", ["void*", "uint8*", ffi.types.size_t, "double"]),
    format_html: ffi.Function("int", ["void*", "uint8*", ffi.types.size_t, "double"]),
    free: ffi.Function("void", ["void*"]),
    unit_ascii: ffi.types.CString,
    unit_utf8: ffi.types.CString,
    unit_hmtl: ffi.types.CString,
    conversion_scale: "double",
    conversion_offset: "double"
})

//console.log("DEVICE SIZE: ", Device.size);
//console.log("CC: ", ChannelCallibration.size);
//console.log("CI: ", ChannelInfo.size)
//console.log("SI: ", StreamInfo.size)
//console.log("CV: ", CtrlVarInfo.size)
//console.log("CD: ", ChannelDecoder.size)
//console.log("SD: ", StreamDecoder.size)
//console.log("DD: ", DeviceDecoder.size)
//console.log("GP: ", GPIOPortInfo.size)
//console.log("SE: ", SettingInfo.size)
//console.log("TCP: ", TcpAdvInfo.size)
//console.log("UF: ", UnitFormatter.size)


const DevicePtr = ref.refType(Device)
const ChannelCallibrationPtr = ref.refType(ChannelCallibration)
const CtrlVarInfoPtr = ref.refType(CtrlVarInfo)
const StreamAndChannelsPtr = ref.refType(StreamAndChannels)
const DeviceDecoderPtr = ref.refType(DeviceDecoder)
const GPIOPortInfoPtr = ref.refType(GPIOPortInfo)
const ExtraScanResultPtr = ref.refType(ExtraScanResult)
const SettingInfoPtr = ref.refType(SettingInfo)
const SupplyInfoPtr = ref.refType(SupplyInfo)
const UnitFormatterPtr = ref.refType(UnitFormatter)

//ffi.Function("void", ["int", "void*"])

export function loadAsphodelLibrary(path: string) {
    return ffi.Library(path, {
        // asphodel_api.h
        'asphodel_error_name': ["string", ["int32"]],  // Function with no arguments and void return type
        'asphodel_unit_type_name': ["string", ["uint8"]],
        'asphodel_get_unit_type_count': ["uint8", []],
        'asphodel_channel_type_name': ["string", ["uint8"]],
        'asphodel_get_channel_type_count': ["uint8", []],
        'asphodel_setting_type_name': ["string", ["uint8"]],
        'asphodel_get_setting_type_count': ["uint8", []],

        // asphodel_version.h
        'asphodel_get_library_protocol_version': ["uint16", []],
        'asphodel_get_library_protocol_version_string': ["string", []],
        'asphodel_get_library_build_info': ["string", []],
        'asphodel_get_library_build_date': ["string", []],

        // asphodel_mem_test.h
        'asphodel_mem_test_supported': ["int32", []],
        'asphodel_mem_test_set_limit': ["void", ["int"]],
        'asphodel_mem_test_get_limit': ["int", []],

        // asphodel_device.h
        "asphodel_get_protocol_version": ["int", [DevicePtr, "uint16*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_protocol_version_blocking": ["int", [DevicePtr, "uint16*"]],
        "asphodel_get_protocol_version_string": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_protocol_version_string_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
        "asphodel_get_board_info": ["int", [DevicePtr, "void*", "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_board_info_blocking": ["int", [DevicePtr, "void*", "void*", ffi.types.size_t]],
        "asphodel_get_user_tag_locations": ["int", [DevicePtr, "void*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_user_tag_locations_blocking": ["int", [DevicePtr, "void*"]],
        "asphodel_get_build_info": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_build_info_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
        "asphodel_get_build_date": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_build_date_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
        "asphodel_get_commit_id": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_commit_id_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],

        "asphodel_get_repo_branch": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_repo_branch_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],

        "asphodel_get_repo_name": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_repo_name_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],

        "asphodel_get_chip_family": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_chip_family_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],

        "asphodel_get_chip_model": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_chip_model_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],

        "asphodel_get_chip_id": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_chip_id_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],

        "asphodel_get_nvm_size": ["int", [DevicePtr, ref.refType(ffi.types.size_t), AsphodelCommandCallback, "void*"]],
        "asphodel_get_nvm_size_blocking": ["int", [DevicePtr, ref.refType(ffi.types.size_t)]],

        "asphodel_erase_nvm": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_erase_nvm_blocking": ["int", [DevicePtr]],

        "asphodel_write_nvm_raw": ["int", [DevicePtr, ffi.types.size_t, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_write_nvm_raw_blocking": ["int", [DevicePtr, ffi.types.size_t, "void*", ffi.types.size_t]],

        "asphodel_write_nvm_section": ["int", [DevicePtr, ffi.types.size_t, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_write_nvm_section_blocking": ["int", [DevicePtr, ffi.types.size_t, "void*", ffi.types.size_t]],

        "asphodel_read_nvm_raw": ["int", [DevicePtr, ffi.types.size_t, "void*", ref.refType(ffi.types.size_t), AsphodelCommandCallback, "void*"]],
        "asphodel_read_nvm_raw_blocking": ["int", [DevicePtr, ffi.types.size_t, "void*", ref.refType(ffi.types.size_t)]],

        "asphodel_read_nvm_section": ["int", [DevicePtr, ffi.types.size_t, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_read_nvm_section_blocking": ["int", [DevicePtr, ffi.types.size_t, "void*", ffi.types.size_t]],

        "asphodel_read_user_tag_string": ["int", [DevicePtr, ffi.types.size_t, ffi.types.size_t, "void*", AsphodelCommandCallback, "void*"]],
        "asphodel_read_user_tag_string_blocking": ["int", [DevicePtr, ffi.types.size_t, ffi.types.size_t, "void*"]],

        "asphodel_write_user_tag_string": ["int", [DevicePtr, ffi.types.size_t, ffi.types.size_t, "void*", AsphodelCommandCallback, "void*"]],
        "asphodel_write_user_tag_string_blocking": ["int", [DevicePtr, ffi.types.size_t, ffi.types.size_t, "void*"]],

        "asphodel_get_nvm_modified": ["int", [DevicePtr, "void*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_nvm_modified_blocking": ["int", [DevicePtr, "void*"]],

        "asphodel_get_nvm_hash": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_nvm_hash_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],

        "asphodel_get_setting_hash": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_setting_hash_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],

        "asphodel_flush": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_flush_blocking": ["int", [DevicePtr]],

        "asphodel_reset": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_reset_blocking": ["int", [DevicePtr]],

        "asphodel_get_bootloader_info": ["int", [DevicePtr, "void*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_bootloader_info_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],

        "asphodel_bootloader_jump": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_bootloader_jump_blocking": ["int", [DevicePtr]],

        "asphodel_get_reset_flag": ["int", [DevicePtr, "void*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_reset_flag_blocking": ["int", [DevicePtr, "void*"]],

        "asphodel_clear_reset_flag": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_clear_reset_flag_blocking": ["int", [DevicePtr]],

        "asphodel_get_rgb_count": ["int", [DevicePtr, "void*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_rgb_count_blocking": ["int", [DevicePtr, "void*"]],

        "asphodel_get_rgb_values": ["int", [DevicePtr, "int", "void*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_rgb_values_blocking": ["int", [DevicePtr, "int", "void*"]],

        "asphodel_set_rgb_values": ["int", [DevicePtr, "int", "void*", "int", AsphodelCommandCallback, "void*"]],
        "asphodel_set_rgb_values_blocking": ["int", [DevicePtr, "int", "void*", "int"]],

        "asphodel_set_rgb_values_hex": ["int", [DevicePtr, "int", "uint32", "int", AsphodelCommandCallback, "void*"]],
        "asphodel_set_rgb_values_hex_blocking": ["int", [DevicePtr, "int", "uint32", "int"]],

        "asphodel_get_led_count": ["int", [DevicePtr, "void*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_led_count_blocking": ["int", [DevicePtr, "void*"]],

        "asphodel_get_led_value": ["int", [DevicePtr, "int", "void*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_led_value_blocking": ["int", [DevicePtr, "int", "void*"]],

        "asphodel_set_led_value": ["int", [DevicePtr, "int", "uint8", "int", AsphodelCommandCallback, "void*"]],
        "asphodel_set_led_value_blocking": ["int", [DevicePtr, "int", "uint8", "int"]],

        "asphodel_set_device_mode": ["int", [DevicePtr, "uint8", AsphodelCommandCallback, "void*"]],
        "asphodel_set_device_mode_blocking": ["int", [DevicePtr, "uint8"]],


        "asphodel_get_device_mode": ["int", [DevicePtr, "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_device_mode_blocking": ["int", [DevicePtr, "uint8*"]],

        // asphodel_bootloader.h
        "asphodel_bootloader_start_program": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_bootloader_start_program_blocking": ["int", [DevicePtr]],

        "asphodel_get_bootloader_page_info": ["int", [DevicePtr, "uint32*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_bootloader_page_info_blocking": ["int", [DevicePtr, "uint32*", "uint8*"]],

        "asphodel_get_bootloader_block_sizes": ["int", [DevicePtr, "uint16*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_bootloader_block_sizes_blocking": ["int", [DevicePtr, "uint16*", "uint8*"]],

        "asphodel_start_bootloader_page": ["int", [DevicePtr, "uint32", "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_start_bootloader_page_blocking": ["int", [DevicePtr, "uint32", "uint8*", ffi.types.size_t]],

        "asphodel_write_bootloader_code_block": ["int", [DevicePtr, "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_write_bootloader_code_block_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t]],

        "asphodel_write_bootloader_page": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint16*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_write_bootloader_page_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint16*", ffi.types.size_t]],

        "asphodel_finish_bootloader_page": ["int", [DevicePtr, "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_finish_bootloader_page_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t]],

        "asphodel_verify_bootloader_page": ["int", [DevicePtr, "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_verify_bootloader_page_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t]],

        // asphodel_stream.h
        "asphodel_get_stream_count": ["int", [DevicePtr, "int*", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_stream_count_blocking": ["int", [DevicePtr, "int*", "uint8*", "uint8*"]],

        "asphodel_get_stream": ["int", [DevicePtr, "int", ref.refType(StreamInfoPtr), AsphodelCommandCallback, "void*"]],
        "asphodel_get_stream_blocking": ["int", [DevicePtr, "int", ref.refType(StreamInfoPtr)]],

        "asphodel_free_stream": ["int", [StreamInfoPtr]],

        "asphodel_get_stream_channels": ["int", [DevicePtr, "int", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_stream_channels_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

        "asphodel_get_stream_format": ["int", [DevicePtr, "int", StreamInfoPtr, AsphodelCommandCallback, "void*"]],
        "asphodel_get_stream_format_blocking": ["int", [DevicePtr, "int", StreamInfoPtr]],

        "asphodel_enable_stream": ["int", [DevicePtr, "int", "int", AsphodelCommandCallback, "void*"]],
        "asphodel_enable_stream_blocking": ["int", [DevicePtr, "int", "int"]],

        "asphodel_warm_up_stream": ["int", [DevicePtr, "int", "int", AsphodelCommandCallback, "void*"]],
        "asphodel_warm_up_stream_blocking": ["int", [DevicePtr, "int", "int"]],

        "asphodel_get_stream_status": ["int", [DevicePtr, "int", "int*", "int*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_stream_status_blocking": ["int", [DevicePtr, "int", "int*", "int*"]],

        "asphodel_get_stream_rate_info": ["int", [DevicePtr, "int", "int*", "int*", "int*", "float*", "float*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_stream_rate_info_blocking": ["int", [DevicePtr, "int", "int*", "int*", "int*", "float*", "float*"]],

        "asphodel_get_channel_count": ["int", [DevicePtr, "int*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_channel_count_blocking": ["int", [DevicePtr, "int*"]],

        "asphodel_get_channel": ["int", [DevicePtr, "int", ref.refType(ChannelInfoPtr), AsphodelCommandCallback, "void*"]],
        "asphodel_get_channel_blocking": ["int", [DevicePtr, "int", ref.refType(ChannelInfoPtr)]],

        "asphodel_free_channel": ["int", [ChannelInfoPtr]],

        "asphodel_get_channel_name": ["int", [DevicePtr, "int", "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_channel_name_blocking": ["int", [DevicePtr, "int", "uint8*", ref.refType("uint8")]],

        "asphodel_get_channel_info": ["int", [DevicePtr, "int", ChannelInfoPtr, AsphodelCommandCallback, "void*"]],
        "asphodel_get_channel_info_blocking": ["int", [DevicePtr, "int", ChannelInfoPtr]],

        "asphodel_get_channel_coefficients": ["int", [DevicePtr, "int", "float*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_channel_coefficients_blocking": ["int", [DevicePtr, "int", "float*", "uint8*"]],

        "asphodel_get_channel_chunk": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_channel_chunk_blocking": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8*"]],

        "asphodel_channel_specific": ["int", [DevicePtr, "int", "uint8*", "uint8", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_channel_specific_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8", "uint8*", "uint8*"]],

        "asphodel_get_channel_calibration": ["int", [DevicePtr, "int", "int*", ChannelCallibrationPtr, AsphodelCommandCallback, "void*"]],
        "asphodel_get_channel_calibration_blocking": ["int", [DevicePtr, "int", "int*", ChannelCallibrationPtr]],


        // asphodel_channel_specific.h
        "asphodel_get_strain_bridge_count": ["int", [ChannelInfoPtr, "int*"]],
        "asphodel_get_strain_bridge_subchannel": ["int", [ChannelInfoPtr, "int", ref.refType(ffi.types.size_t)]],
        "asphodel_get_strain_bridge_values": ["int", [ChannelInfoPtr, "int", "float*"]],
        "asphodel_set_strain_outputs": ["int", [DevicePtr, "int", "int", "int", "int", AsphodelCommandCallback, "void*"]],
        "asphodel_set_strain_outputs_blocking": ["int", [DevicePtr, "int", "int", "int", "int"]],
        "asphodel_check_strain_resistances": ["int", [ChannelInfoPtr, "int", "double", "double", "double", "double*", "double*", "int*"]],
        "asphodel_get_accel_self_test_limits": ["int", [ChannelInfoPtr, "float*"]],
        "asphodel_enable_accel_self_test": ["int", [DevicePtr, "int", "int", AsphodelCommandCallback, "void*"]],
        "asphodel_enable_accel_self_test_blocking": ["int", [DevicePtr, "int", "int"]],
        "asphodel_check_accel_self_test": ["int", [ChannelInfoPtr, "double*", "double*", "int*"]],

        // asphodel_ctrl_var.h

        "asphodel_get_ctrl_var_count": ["int", [DevicePtr, "int*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_ctrl_var_count_blocking": ["int", [DevicePtr, "int*"]],

        "asphodel_get_ctrl_var_name": ["int", [DevicePtr, "int", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_ctrl_var_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

        "asphodel_get_ctrl_var_info": ["int", [DevicePtr, "int", CtrlVarInfoPtr, AsphodelCommandCallback, "void*"]],
        "asphodel_get_ctrl_var_info_blocking": ["int", [DevicePtr, "int", CtrlVarInfoPtr]],

        "asphodel_get_ctrl_var": ["int", [DevicePtr, "int", "int32*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_ctrl_var_blocking": ["int", [DevicePtr, "int", "int32*"]],

        "asphodel_set_ctrl_var": ["int", [DevicePtr, "int", "int32", AsphodelCommandCallback, "void*"]],
        "asphodel_set_ctrl_var_blocking": ["int", [DevicePtr, "int", "int32"]],

        // asphodel_decode.h
        "asphodel_create_channel_decoder": ["int", [ChannelInfoPtr, "uint16", ref.refType(ChannelDecoderPtr)]],
        "asphodel_create_stream_decoder": ["int", [ArrayType(StreamAndChannels), "uint16", ref.refType(StreamDecoderPtr)]],
        "asphodel_create_device_decoder": ["int", [ArrayType(StreamAndChannels), "uint8", "uint8", "uint8", ref.refType(DeviceDecoder)]],
        "asphodel_get_streaming_counts": ["int", [ArrayType(StreamAndChannels), "uint8", "double", "double", "int*", "int*", "int*"]],

        // asphodel_device_type.h
        "asphodel_supports_rf_power_commands": ["int", [DevicePtr]],
        "asphodel_supports_radio_commands": ["int", [DevicePtr]],
        "asphodel_supports_remote_commands": ["int", [DevicePtr]],
        "asphodel_supports_bootloader_commands": ["int", [DevicePtr]],

        // asphodel_low_level.h
        "asphodel_get_gpio_port_count": ["int", [DevicePtr, "int*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_gpio_port_count_blocking": ["int", [DevicePtr, "int*"]],

        "asphodel_get_gpio_port_name": ["int", [DevicePtr, "int", "uint8*", "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_gpio_port_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

        "asphodel_get_gpio_port_info": ["int", [DevicePtr, "int", GPIOPortInfoPtr, AsphodelCommandCallback, "void*"]],
        "asphodel_get_gpio_port_info_blocking": ["int", [DevicePtr, "int", GPIOPortInfoPtr]],

        "asphodel_get_gpio_port_values": ["int", [DevicePtr, "int", "uint32*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_gpio_port_values_blocking": ["int", [DevicePtr, "int", "uint32*"]],

        "asphodel_set_gpio_port_modes": ["int", [DevicePtr, "int", "uint8", "uint32", AsphodelCommandCallback, "void*"]],
        "asphodel_set_gpio_port_modes_blocking": ["int", [DevicePtr, "int", "uint8", "uint32"]],

        "asphodel_disable_gpio_overrides": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_disable_gpio_overrides_blocking": ["int", [DevicePtr]],

        "asphodel_get_bus_counts": ["int", [DevicePtr, "int*", "int*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_bus_counts_blocking": ["int", [DevicePtr, "int*", "int*"]],

        "asphodel_set_spi_cs_mode": ["int", [DevicePtr, "int", "uint8", AsphodelCommandCallback, "void*"]],
        "asphodel_set_spi_cs_mode_blocking": ["int", [DevicePtr, "int", "uint8"]],

        "asphodel_do_spi_transfer": ["int", [DevicePtr, "int", "uint8*", "uint8*", "uint8", AsphodelCommandCallback, "void*"]],
        "asphodel_do_spi_transfer_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*", "uint8"]],

        "asphodel_do_i2c_write_read": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8", "uint8*", "uint8", AsphodelCommandCallback, "void*"]],
        "asphodel_do_i2c_write_read_blocking": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8", "uint8*", "uint8"]],

        "asphodel_do_i2c_write": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8", AsphodelCommandCallback, "void*"]],
        "asphodel_do_i2c_write_blocking": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8"]],

        "asphodel_do_i2c_read": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8", AsphodelCommandCallback, "void*"]],
        "asphodel_do_i2c_read_blocking": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8"]],


        "asphodel_do_radio_fixed_test": ["int", [DevicePtr, "uint16", "uint16", "uint8", AsphodelCommandCallback, "void*"]],
        "asphodel_do_radio_fixed_test_blocking": ["int", [DevicePtr, "uint16", "uint16", "uint8"]],

        "asphodel_do_radio_sweep_test": ["int", [DevicePtr, "uint16", "uint16", "uint16", "uint16", "uint8", AsphodelCommandCallback, "void*"]],
        "asphodel_do_radio_sweep_test_blocking": ["int", [DevicePtr, "uint16", "uint16", "uint16", "uint16", "uint8"]],

        "asphodel_get_info_region_count": ["int", [DevicePtr, "int*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_info_region_count_blocking": ["int", [DevicePtr, "int*"]],

        "asphodel_get_info_region_name": ["int", [DevicePtr, "int", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_info_region_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

        "asphodel_get_info_region": ["int", [DevicePtr, "int", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_info_region_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

        "asphodel_get_stack_info": ["int", [DevicePtr, "uint32*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_stack_info_blocking": ["int", [DevicePtr, "uint32*"]],

        "asphodel_echo_raw": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_echo_raw_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint8*", ref.refType(ffi.types.size_t)]],


        "asphodel_echo_transaction": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_echo_transaction_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint8*", ref.refType(ffi.types.size_t)]],


        "asphodel_echo_params": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_echo_params_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint8*", ref.refType(ffi.types.size_t)]],

        // radio.h
        "asphodel_stop_radio": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_stop_radio_blocking": ["int", [DevicePtr]],

        "asphodel_start_radio_scan": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_start_radio_scan_blocking": ["int", [DevicePtr]],

        "asphodel_get_raw_radio_scan_results": ["int", [DevicePtr, "uint32*", ref.refType(ffi.types.size_t), AsphodelCommandCallback, "void*"]],
        "asphodel_get_raw_radio_scan_results_blocking": ["int", [DevicePtr, ArrayType("uint32"), ref.refType(ffi.types.size_t)]],

        "asphodel_get_radio_scan_results": ["int", [DevicePtr, "uint32*", ref.refType(ffi.types.size_t), AsphodelCommandCallback, "void*"]],
        "asphodel_get_radio_scan_results_blocking": ["int", [DevicePtr, "uint32*", ref.refType(ffi.types.size_t)]],

        "asphodel_free_radio_scan_results": ["int", ["uint32*"]],

        "asphodel_get_raw_radio_extra_scan_results": ["int", [DevicePtr, ExtraScanResultPtr, ref.refType(ffi.types.size_t), AsphodelCommandCallback, "void*"]],
        "asphodel_get_raw_radio_extra_scan_results_blocking": ["int", [DevicePtr, ExtraScanResultPtr, ref.refType(ffi.types.size_t)]],

        "asphodel_get_radio_extra_scan_results": ["int", [DevicePtr, ExtraScanResultPtr, ref.refType(ffi.types.size_t), AsphodelCommandCallback, "void*"]],
        "asphodel_get_radio_extra_scan_results_blocking": ["int", [DevicePtr, ExtraScanResultPtr, ref.refType(ffi.types.size_t)]],

        "asphodel_free_radio_extra_scan_results": ["int", [ExtraScanResultPtr]],


        "asphodel_get_radio_scan_power": ["int", [DevicePtr, "uint32*", "uint8*", ffi.types.size_t, AsphodelCommandCallback, "void*"]],
        "asphodel_get_radio_scan_power_blocking": ["int", [DevicePtr, "uint32*", "uint8*", ffi.types.size_t]],

        "asphodel_connect_radio": ["int", [DevicePtr, "uint32", AsphodelCommandCallback, "void*"]],
        "asphodel_connect_radio_blocking": ["int", [DevicePtr, "uint32"]],


        "asphodel_get_radio_status": ["int", [DevicePtr, "int*", "uint32*", "uint8*", "int*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_radio_status_blocking": ["int", [DevicePtr, "int*", "uint32*", "uint8*", "int*"]],

        "asphodel_get_radio_ctrl_vars": ["int", [DevicePtr, "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_radio_ctrl_vars_blocking": ["int", [DevicePtr, "uint8*", "uint8*"]],

        "asphodel_get_radio_default_serial": ["int", [DevicePtr, "uint32*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_radio_default_serial_blocking": ["int", [DevicePtr, "uint32*"]],

        "asphodel_start_radio_scan_boot": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_start_radio_scan_boot_blocking": ["int", [DevicePtr]],

        "asphodel_connect_radio_boot": ["int", [DevicePtr, "uint32", AsphodelCommandCallback, "void*"]],
        "asphodel_connect_radio_boot_blocking": ["int", [DevicePtr, "uint32"]],

        "asphodel_stop_remote": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_stop_remote_blocking": ["int", [DevicePtr]],

        "asphodel_restart_remote": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_restart_remote_blocking": ["int", [DevicePtr]],

        "asphodel_get_remote_status": ["int", [DevicePtr, "int*", "uint32*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_remote_status_blocking": ["int", [DevicePtr, "int*", "uint32*", "uint8*"]],



        "asphodel_restart_remote_app": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_restart_remote_app_blocking": ["int", [DevicePtr]],


        "asphodel_restart_remote_boot": ["int", [DevicePtr, AsphodelCommandCallback, "void*"]],
        "asphodel_restart_remote_boot_blocking": ["int", [DevicePtr]],

        // asphodel_rf_power.h
        "asphodel_enable_rf_power": ["int", [DevicePtr, "int", AsphodelCommandCallback, "void*"]],
        "asphodel_enable_rf_power_blocking": ["int", [DevicePtr, "int"]],

        "asphodel_get_rf_power_status": ["int", [DevicePtr, "int*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_rf_power_status_blocking": ["int", [DevicePtr, "int*"]],

        "asphodel_get_rf_power_ctrl_vars": ["int", [DevicePtr, "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_rf_power_ctrl_vars_blocking": ["int", [DevicePtr, "uint8*", "uint8*"]],

        "asphodel_reset_rf_power_timeout": ["int", [DevicePtr, "uint32", AsphodelCommandCallback, "void*"]],
        "asphodel_reset_rf_power_timeout_blocking": ["int", [DevicePtr, "uint32"]],
        
        
        
        //setting.h
        "asphodel_get_setting_count": ["int", [DevicePtr, "int*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_setting_count_blocking": ["int", [DevicePtr, "int*"]],

        "asphodel_get_setting_name": ["int", [DevicePtr, "int", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_setting_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

        "asphodel_get_setting_info": ["int", [DevicePtr, "int", SettingInfoPtr, AsphodelCommandCallback, "void*"]],
        "asphodel_get_setting_info_blocking": ["int", [DevicePtr, "int", SettingInfoPtr]],

        "asphodel_get_setting_default": ["int", [DevicePtr, "int", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_setting_default_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

        "asphodel_get_custom_enum_counts": ["int", [DevicePtr, "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_custom_enum_counts_blocking": ["int", [DevicePtr, "uint8*", "uint8*"]],

        "asphodel_get_custom_enum_value_name": ["int", [DevicePtr, "int", "int", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_custom_enum_value_name_blocking": ["int", [DevicePtr, "int", "int", "uint8*", "uint8*"]],

        "asphodel_get_setting_category_count": ["int", [DevicePtr, "int*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_setting_category_count_blocking": ["int", [DevicePtr, "int*"]],

        "asphodel_get_setting_category_name": ["int", [DevicePtr, "int", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_setting_category_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

        "asphodel_get_setting_category_settings": ["int", [DevicePtr, "int", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_setting_category_settings_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],


        //asphodel_supply.h
        "asphodel_get_supply_count": ["int", [DevicePtr, "int*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_supply_count_blocking": ["int", [DevicePtr, "int*"]],

        "asphodel_get_supply_name": ["int", [DevicePtr, "int", "uint8*", "uint8*", AsphodelCommandCallback, "void*"]],
        "asphodel_get_supply_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

        "asphodel_get_supply_info": ["int", [DevicePtr, "int", SupplyInfoPtr, AsphodelCommandCallback, "void*"]],
        "asphodel_get_supply_info_blocking": ["int", [DevicePtr, "int", SupplyInfoPtr]],

        "asphodel_check_supply": ["int", [DevicePtr, "int", "int32", "uint8*", "int", AsphodelCommandCallback, "void*"]],
        "asphodel_check_supply_blocking": ["int", [DevicePtr, "int", "int32*", "uint8*", "int"]],

        // asphodel_tcp.h
        "asphodel_tcp_get_advertisement": [ref.refType(TcpAdvInfo), [DevicePtr]],
        "asphodel_tcp_devices_supported": ["int", []],
        "asphodel_tcp_init": ["int", []],
        "asphodel_tcp_deinit": ["int", []],
        "asphodel_tcp_find_devices": ["int", [ref.refType(DevicePtr), ref.refType(ffi.types.size_t)]],
        "asphodel_tcp_find_devices_filter": ["int", [ref.refType(DevicePtr), ref.refType(ffi.types.size_t), "uint32"]],
        "asphodel_tcp_poll_devices": ["int", ["int"]],
        "asphodel_tcp_create_device": ["int", ["uint8*", "uint16", "int", "uint8*", ref.refType(DevicePtr)]],


        // asphodel_unit_format.h
        "asphodel_create_unit_formatter": [UnitFormatterPtr, ["uint8", "double", "double", "double", "int"]],
        "asphodel_create_custom_unit_formatter": [UnitFormatterPtr, ["double", "double", "double", "uint8*", "uint8*", "uint8*"]],
        "asphodel_format_value_ascii": ["int", ["uint8*", ffi.types.size_t, "uint8", "double", "int", "double"]],
        "asphodel_format_value_utf8": ["int", ["uint8*", ffi.types.size_t, "uint8", "double", "int", "double"]],
        "asphodel_format_value_html": ["int", ["uint8*", ffi.types.size_t, "uint8", "double", "int", "double"]],

        // asphodel_usb.h
        "asphodel_usb_devices_supported": ["int", []],
        "asphodel_usb_init": ["int", []],
        "asphodel_usb_deinit": ["void", []],
        "asphodel_usb_find_devices": ["int", ["void*", ref.refType(ffi.types.size_t)]],
        "asphodel_usb_poll_devices": ["int", ["int"]],
        "asphodel_usb_get_backend_version": ["string", []],
    });

}

import * as os from 'node:os'

export class UnitFormatterWrapper{
    lib: any;
    inner: ref.Pointer<any>
    constructor(
        lib: any,
        unit_type: number,
        minimum: number,
        maximum: number,
        resolution: number, 
        use_metric: number
    ) {
        this.lib = lib
        const fmter: ref.Pointer<any> = this.lib.asphodel_create_unit_formatter(unit_type, minimum, maximum, resolution, use_metric)
        if(fmter.isNull()) {
            throw new Error("Failed to create unit formatter");
        }
        this.inner = fmter;
    }

    public formatBare(buffer_size: number, value: number){
        let buf = Buffer.alloc(buffer_size);
        checkForError(this.lib, this.inner.deref().format_bare(this.inner, buf, buffer_size, value))
        return buf.toString("utf-8")
    }

    public formatAscii(buffer_size: number, value: number){
        let buf = Buffer.alloc(buffer_size);
        checkForError(this.lib, this.inner.deref().format_ascii(this.inner, buf, buffer_size, value))
        return buf.toString("utf-8")
    }

    public formatUtf8(buffer_size: number, value: number){
        let buf = Buffer.alloc(buffer_size);
        checkForError(this.lib, this.inner.deref().format_utf8(this.inner, buf, buffer_size, value))
        return buf.toString("utf-8")
    }

    public formatHtml(buffer_size: number, value: number){
        let buf = Buffer.alloc(buffer_size);
        checkForError(this.lib, this.inner.deref().format_html(this.inner, buf, buffer_size, value))
        return buf.toString("utf-8")
    }

    public free() {
        this.inner.deref().free(this.inner)
    }

    public getUnitAscii() {
        return this.inner.deref().unit_ascii
    }

    public getUnitUtf8() {
        return this.inner.deref().unit_utf8
    }

    public getUnitHtml() {
        return this.inner.deref().unit_hmtl
    }

    public getConversionScale() {
        return this.inner.deref().conversion_scale
    }

    public getConversionOffset() {
        return this.inner.deref().conversion_offset
    }
}

export class Format{
    lib: any

    constructor(lib:any) {
        this.lib = lib;
    }

    public formatValueAscii(buffer_size:number, unit_type:number, resolution:number, usemetric: number, value:number){
        let buf = Buffer.alloc(buffer_size);
       checkForError(this.lib, this.lib.asphodel_format_value_ascii(buf, buffer_size, unit_type, resolution, usemetric, value))
       return buf.toString("utf-8")
    }

    public formatValueUtf8(buffer_size:number, unit_type:number, resolution:number, usemetric: number, value:number){
        let buf = Buffer.alloc(buffer_size);
       checkForError(this.lib, this.lib.asphodel_format_value_utf8(buf, buffer_size, unit_type, resolution, usemetric, value))
       return buf.toString("utf-8")
    }

    public formatValueHtml(buffer_size:number, unit_type:number, resolution:number, usemetric: number, value:number){
        let buf = Buffer.alloc(buffer_size);
       checkForError(this.lib, this.lib.asphodel_format_value_html(buf, buffer_size, unit_type, resolution, usemetric, value))
       return buf.toString("utf-8")
    }
}

export class API {
    lib: any
    constructor(lib: any) {
        this.lib = lib
    }

    public getErrorName(code: number) {
        return this.lib.asphodel_error_name(code)
    }

    public getUnitTypeName(unit_type: number) {
        return this.lib.asphodel_unit_type_name(unit_type)
    }

    public getUnitTypeCount() {
        return this.lib.asphodel_get_unit_type_count();
    }

    public getChannelTypeName(channel_type: number) {
        return this.lib.asphodel_channel_type_name(channel_type)
    }

    public getChannelTypeCount() {
        return this.lib.asphodel_get_channel_type_count()
    }

    public getSettingTypeName(channel_type: number) {
        return this.lib.asphodel_setting_type_name(channel_type)
    }

    public getSettingTypeCount() {
        return this.lib.asphodel_get_setting_type_count()
    }
}


function checkForError(lib: any, code: number) {
    let api = new API(lib)
    if(code != 0) {
        throw new Error(api.getErrorName(code))
    }
}


export class ByteSettingWrapper {
    inner: any

    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
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
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
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
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
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
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
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
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
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
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
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
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
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

    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
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

export class GPIOPortinfoWrapper {
    inner: any
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
    }

    public getName() {
        let len = this.inner.deref().name_length
        return this.inner.deref().name.buffer.reinterpret(len).toString("utf-8")
    }

    public getInputPins() {
        return this.inner.deref().input_pins
    }

    public getOutputPins() {
        return this.inner.deref().output_pins
    }

    public getFloatingPins() {
        return this.inner.deref().floating_pins
    }

    public getLoadedPins() {
        return this.inner.deref().loaded_pins
    }

    public getOverriddenPins() {
        return this.inner.deref().overridden_pins
    }
}

export class SettingInfoWrapper {
    inner: any
    string: any

    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
    }

    public getType() {
        return this.inner.deref().setting_type
    }

    public getSetting() {
        //return this.inner.deref().setting_type
        let union = this.inner.deref().u;
        switch (this.inner.deref().setting_type) {
            case SETTING_TYPE_BYTE: return new ByteSettingWrapper(this.lib, union.byte_setting)
            case SETTING_TYPE_BYTE_ARRAY: return new ByteArraySettingWrapper(this.lib, union.byte_array_setting)
            case SETTING_TYPE_INT32: return new Int32SettingWrapper(this.lib, union.int32_setting)
            case SETTING_TYPE_INT32_SCALED: return new Int32ScaledSettingWrapper(this.lib, union.int32_scaled_setting)
            case SETTING_TYPE_FLOAT: return new FloatSettingWrapper(this.lib, union.float_setting)
            case SETTING_TYPE_FLOAT_ARRAY: return new FloatArraySettingWrapper(this.lib, union.float_array_setting)
            case SETTING_TYPE_CUSTOM_ENUM: return new CustomEnumSettingWrapper(this.lib, union.custom_enum_setting)
            case SETTING_TYPE_STRING: return new StringSettingWrapper(this.lib, union.string_setting)
            default:
                throw new Error("Invalid setting type")
        }
    }

    public defaultBytes() {
        let len = this.inner.deref().default_bytes_length
        var resbuff = new Uint8Array(len)
        let ptr = this.inner.deref().default_bytes.buffer.reinterpret(len);
        ptr.copy(resbuff)
        return resbuff  
    }
}

export class StreamInfoWrapper {
    inner: any
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
        this.lib = lib
    }

    public getChannelIndexList() {
        let b = this.inner.deref().channel_index_list.buffer.reinterpret(this.inner.deref().channel_count)
        let a = new Uint8Array(b.length);
        b.copy(a);
        return a;
    }

    public getChannelCount() {
        return this.inner.deref().channel_count
    }

    public getFillerBits() {
        return this.inner.deref().filler_bits
    }

    public getCounterBits() {
        return this.inner.deref().counter_bits
    }

    public getRate() {
        return this.inner.deref().rate
    }

    public getRateError() {
        return this.inner.deref().rate_error
    }

    public getWarmUpDelay() {
        return this.inner.deref().warm_up_delay
    }

    public free() {
        this.lib.asphodel_free_stream(this.inner)
    }
}

export class ChannelDecoderWrapper {
    inner: any
    cb: any
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
    }

    public decode(counter: number, buff: Uint8Array) {
        let b = Buffer.from(buff)
        this.inner.deref().decode(this.inner, counter, b)
    }

    public free() {
        this.inner.deref().free_decoder(this.inner)
    }


    public reset() {
        this.inner.deref().reset(this.inner)
    }

    public setConversionFactor(scale: number, offset: number) {
        this.inner.deref().set_conversion_factor(this.inner, scale, offset)
    }

    public getChannelBitOffset() {
        return this.inner.deref().channel_bit_offset
    }

    public getSamples() {
        return this.inner.deref().samples
    }

    public getChannelName() {
        return this.inner.deref().channel_name
    }

    public getSubChannels() {
        let cnt = this.inner.deref().subchannels
        let b2 = this.inner.deref().subchannel_names.buffer.reinterpret(ffi.types.size_t.size * cnt);

        let strings: string[] = [];

        for (let i = 0; i < cnt; i++) {
            let b = ref.alloc(ArrayType("uint8"));
            if (ffi.types.size_t.size == 4) {
                if (os.endianness() == "BE") {
                    b.writeUInt32BE(b2.readUInt32BE(i * 4))
                    let reint: Buffer = b.deref().buffer.reinterpret(128);
                    strings.push(reint.toString("utf-8", 0, reint.indexOf(0)))
                } else {
                    b.writeUInt32LE(b2.readUInt32LE(i * 4))
                    let reint: Buffer = b.deref().buffer.reinterpret(128);
                    strings.push(reint.toString("utf-8", 0, reint.indexOf(0)))
                }
            } else {
                if (os.endianness() == "BE") {
                    b.writeBigUInt64BE(b2.readBigUInt64BE(i * 8))
                    let reint: Buffer = b.deref().buffer.reinterpret(128);
                    strings.push(reint.toString("utf-8", 0, reint.indexOf(0)))
                } else {
                    b.writeBigUInt64LE(b2.readBigUInt64LE(i * 8))
                    let reint: Buffer = b.deref().buffer.reinterpret(128);
                    strings.push(reint.toString("utf-8", 0, reint.indexOf(0)))
                }
            }
        }
        return strings
    }

    public setDecodeCallback(cb: (counter: number, data: Float64Array, samples: number, subchannels: number) => void) {
        this.cb = ffi.Callback("void", ["uint64", "double*", ffi.types.size_t, ffi.types.size_t, "void*"],
            (__conter: number, __data: ref.Pointer<any>, __samples: number, __subchannels: number, cls) => {
                let fb = __data.reinterpret(ffi.types.double.size * __samples * __subchannels)
                let floats = new Float64Array(__samples * __subchannels)
                for (let i = 0; i < floats.length; i++) {
                    floats[i] = os.endianness() == "LE" ? fb.readDoubleLE(i * ffi.types.double.size) : fb.readDoubleBE(i * ffi.types.double.size)
                }
                cb(__conter, floats, __samples, __subchannels);
            })

        let new_inner = this.inner.deref();
        new_inner.callback = this.cb;
        this.inner.set(new_inner);
    }

}


export class StreamDecoderWrapper {
    inner: any
    cb: any
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
    }

    public decode(counter: number, buff: Uint8Array) {
        let b = Buffer.from(buff)
        this.inner.deref().decode(this.inner, counter, b)
    }

    public free() {
        this.inner.deref().free_decoder(this.inner)
    }


    public reset() {
        this.inner.deref().reset(this.inner)
    }

    public getLastCount() {
        return this.inner.deref().last_count
    }

    public getCounterByteOffset() {
        return this.inner.deref().counter_byte_offset
    }

    public getUsedBits() {
        return this.inner.deref().used_bits
    }

    public counterDecoder(buffer: Uint8Array, last: number): number {
        let b = Buffer.from(buffer);
        return this.inner.deref().counter_decoder(b, last);
    }

    public setLostPacketCallback(cb: (last: number) => void) {
        this.cb = ffi.Callback("void", ["uint64", "void*"],
            (__last: number, cls) => {
                cb(__last);
            })

        let new_inner = this.inner.deref();
        new_inner.lost_packet_callback = this.cb;
        this.inner.set(new_inner);
    }

    public getChannels() {
        return this.inner.deref().channels;
    }

    public getDecoders() {
        let cnt = this.inner.deref().channels;
        let b2 = this.inner.deref().decoders.buffer.reinterpret(ffi.types.size_t.size * cnt);
        let decoders: ChannelDecoderWrapper[] = []
        for (let i = 0; i < cnt; i++) {
            let b = ref.alloc(ChannelDecoderPtr);
            if (ffi.types.size_t.size == 4) {
                if (os.endianness() == "BE") {
                    b.writeUInt32BE(b2.readUInt32BE(i * 4))
                    decoders.push(new ChannelDecoderWrapper(this.lib, b.deref()))
                } else {
                    b.writeUInt32LE(b2.readUInt32LE(i * 4))
                    decoders.push(new ChannelDecoderWrapper(this.lib, b.deref()))
                }
            } else {
                if (os.endianness() == "BE") {
                    b.writeBigUInt64BE(b2.readBigUInt64BE(i * 8))
                    decoders.push(new ChannelDecoderWrapper(this.lib, b.deref()))
                } else {
                    b.writeBigUInt64LE(b2.readBigUInt64LE(i * 8))
                    decoders.push(new ChannelDecoderWrapper(this.lib, b.deref()))
                }
            }
        }
        return decoders
    }
}

export class DeviceDecoderWrapper {
    inner: any
    cb: any

    lib: any;
    constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
    }


    public decode(counter: number, buff: Uint8Array) {
        let b = Buffer.from(buff)
        this.inner.deref().decode(this.inner, counter, b)
    }

    public free() {
        this.inner.deref().free_decoder(this.inner)
    }


    public reset() {
        this.inner.deref().reset(this.inner)
    }

    public getIdByteOffset() {
        return this.inner.deref().id_byte_offset
    }

    public idDecoder(buffer: Uint8Array) {
        let b = Buffer.from(buffer)
        return this.inner.deref().id_decoder(b)
    }

    public streams() {
        return this.inner.deref().streams
    }

    public getStreamIds() {
        let b = this.inner.deref().stream_ids.buffer.reinterpret(this.inner.deref().streams)
        let a = new Uint8Array(b.length);
        b.copy(a);
        return a;
    }

    public getDecoders() {
        let cnt = this.inner.deref().streams;
        let b2 = this.inner.deref().decoders.buffer.reinterpret(ffi.types.size_t.size * cnt);
        let decoders: StreamDecoderWrapper[] = []
        for (let i = 0; i < cnt; i++) {
            let b = ref.alloc(StreamDecoderPtr);
            if (ffi.types.size_t.size == 4) {
                if (os.endianness() == "BE") {
                    b.writeUInt32BE(b2.readUInt32BE(i * 4))
                    decoders.push(new StreamDecoderWrapper(this.lib, b.deref()))
                } else {
                    b.writeUInt32LE(b2.readUInt32LE(i * 4))
                    decoders.push(new StreamDecoderWrapper(this.lib, b.deref()))
                }
            } else {
                if (os.endianness() == "BE") {
                    b.writeBigUInt64BE(b2.readBigUInt64BE(i * 8))
                    decoders.push(new StreamDecoderWrapper(this.lib, b.deref()))
                } else {
                    b.writeBigUInt64LE(b2.readBigUInt64LE(i * 8))
                    decoders.push(new StreamDecoderWrapper(this.lib, b.deref()))
                }
            }
        }
        return decoders
    }

    public setUnknownIdCallback(cb: (id: number) => void) {
        this.cb = ffi.Callback("void", ["uint8", "void*"],
            (__id: number, cls) => {
                cb(__id);
            })

        let new_inner = this.inner.deref();
        new_inner.unknown_id_closure = this.cb;
        this.inner.set(new_inner);
    }
}

export class ChannelInfoWrapper {
    inner: any
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
    }

    public getName() {
        return this.inner.deref().name.buffer.reinterpret(this.inner.deref().name_length).toString("utf-8")
    }

    public getChannelType() {
        return this.inner.deref().channel_type
    }

    public getUnitType() {
        return this.inner.deref().unit_type
    }

    public getFillerBits() {
        return this.inner.deref().filler_bits
    }

    public getDataBits() {
        return this.inner.deref().data_bits
    }

    public getSamples() {
        return this.inner.deref().samples
    }

    public getBitsPerSample() {
        return this.inner.deref().bits_per_sample
    }

    public getMinimum() {
        return this.inner.deref().minimum
    }

    public getMaximum() {
        return this.inner.deref().maximum
    }

    public getResolution() {
        return this.inner.deref().resolution
    }

    public getCoefficients() {
        let len = this.inner.deref().coefficients_length;
        let b: Buffer = this.inner.deref()
            .coefficients.buffer.reinterpret(ffi.types.float.size * len)
        let floats = new Float32Array(len)
        for (let i = 0; i < len; i++) {
            floats[i] = os.endianness() == "LE" ? b.readFloatLE(i * ffi.types.float.size) : b.readFloatBE(i * ffi.types.float.size)
        }
        return floats
    }

    public getChunkCount() {
        return this.inner.deref().chunk_count;
    }

    public getChunks() {
        let count = this.inner.deref().chunk_count;
        let list: Buffer = this.inner.deref().chunks.buffer.reinterpret(count * ffi.types.size_t.size);
        let lengths: Buffer = this.inner.deref().chunk_lengths.buffer.reinterpret(count)

        let chunks: Uint8Array[] = []

        lengths.forEach((len, i) => {

            let b = ref.alloc(ArrayType("uint8"));
            if (ffi.types.size_t.size == 4) {
                if (os.endianness() == "BE") {
                    b.writeUInt32BE(list.readUInt32BE(i * 4))
                } else {
                    b.writeUInt32LE(list.readUInt32LE(i * 4))
                }
            } else {
                if (os.endianness() == "BE") {
                    b.writeBigUInt64BE(list.readBigUInt64BE(i * 8))
                } else {
                    b.writeBigUInt64LE(list.readBigUInt64LE(i * 8))
                }
            }

            let rb = b.deref().buffer.reinterpret(len)
            let curr = new Uint8Array(len);
            rb.copy(curr)
            chunks.push(curr)
        })
        return chunks
    }

/** Free a channel created by asphodel_get_channel() or asphodel_get_channel_blocking(). Channels created any other way
 must NOT be used with this function. */
    public free() {
        this.lib.asphodel_free_channel(this.inner)
    }

    public getStrainBridgeCount() {
        let bc = ref.alloc("int");
        checkForError(this.lib,this.lib.asphodel_get_strain_bridge_count(this.inner, bc));
        return bc.deref()
    }

    public getStrainBridgeSubchannel(bridge_index: number) {
        let si = ref.alloc(ffi.types.size_t)
        checkForError(this.lib,this.lib.asphodel_get_strain_bridge_subchannel(this.inner, bridge_index, si));
        return si.deref();
    }

    public getStrainBridgeValues(bridge_index: number) {
        let fb = Buffer.alloc(ffi.types.float.size * 4)
        checkForError(this.lib,this.lib.asphodel_get_strain_bridge_values(this.inner, bridge_index, fb))
        let floats = new Float32Array(4)
        for (let i = 0; i < 4; i++) {
            floats[i] = os.endianness() == "LE" ? fb.readFloatLE(i * ffi.types.float.size) : fb.readFloatBE(i * ffi.types.float.size)
        }
        return floats
    }

    public checkStrainResistances(bridge_index: number, baseline: number, positive_high: number, negative_high: number) {
        let pr = ref.alloc("double");
        let nr = ref.alloc("double");
        let p = ref.alloc("int")
        checkForError(this.lib,this.lib.asphodel_check_strain_resistances(this.inner, bridge_index, baseline, positive_high, negative_high, pr, nr, p))
        return {
            positive_resistance: pr.deref(),
            negative_resistance: nr.deref(),
            passed: p.deref()
        }
    }

    public getAccelSelfTestLimits() {
        let fb = Buffer.alloc(ffi.types.float.size * 6)
        checkForError(this.lib,this.lib.asphodel_get_accel_self_test_limits(this.inner, fb))
        let floats = new Float32Array(6)
        for (let i = 0; i < 6; i++) {
            floats[i] = os.endianness() == "LE" ? fb.readFloatLE(i * ffi.types.float.size) : fb.readFloatBE(i * ffi.types.float.size)
        }
        return floats
    }

    public checkAccelSelfTest(disabled: Float64Array, enabled: Float64Array) {
        if (disabled.length != 3 || enabled.length != 3) {
            throw new Error("inputs must be length 3");
        }
        let bd = Buffer.alloc(3 * ffi.types.double.size)
        let be = Buffer.alloc(3 * ffi.types.double.size)
        for (let i = 0; i < 3; i++) {
            be.writeDoubleLE(enabled[i], i * ffi.types.double.size)
            bd.writeDoubleLE(disabled[i], i * ffi.types.double.size)
        }
        let pas = ref.alloc("int");
        checkForError(this.lib, this.lib.asphodel_check_accel_self_test(this.inner, bd, be, pas));
        return pas.deref();
    }

}

export class StreamAndChannelsWrapper {
    inner: any
    si: any
    cib: any
    stream_id: number

    lib: any; constructor(stream_id: number, stream_info: StreamInfoWrapper, channel_infos: ChannelInfoWrapper[]) {
        if (stream_info.getChannelCount() != channel_infos.length) {
            throw new Error("StreamInfo.channel_count != channel_infos.length");
        }
        this.stream_id = stream_id;
        let cib = Buffer.alloc(ChannelInfoPtr.size * channel_infos.length);
        channel_infos.forEach((item, i) => {
            let buv: ref.Pointer<any> = item.inner;
            if (ffi.types.size_t.size == 4) {
                if (os.endianness() == "BE") {
                    cib.writeUInt32BE(buv.address(), i * ffi.types.size_t.size)
                } else {
                    cib.writeUInt32LE(buv.address(), i * ffi.types.size_t.size)
                }
            } else {
                if (os.endianness() == "BE") {
                    cib.writeBigUInt64BE(BigInt(buv.address()), i * ffi.types.size_t.size)
                } else {
                    cib.writeBigUInt64LE(BigInt(buv.address()), i * ffi.types.size_t.size)
                }
            }
        })

        let back = ref.alloc(StreamAndChannels)
        back.writeUInt8(stream_id, 0);
        if (ffi.types.size_t.size == 4) {
            if (os.endianness() == "BE") {
                back.writeUInt32BE(stream_info.inner.address(), 1 * ffi.types.size_t.size)
                back.writeUInt32BE(cib.address(), 2 * ffi.types.size_t.size)
            } else {
                back.writeUInt32LE((stream_info.inner.address()), 1 * ffi.types.size_t.size)
                back.writeUInt32LE((cib.address()), 2 * ffi.types.size_t.size)
            }
        } else {
            if (os.endianness() == "BE") {
                back.writeBigUInt64BE(BigInt(stream_info.inner.address()), 1 * ffi.types.size_t.size)
                back.writeBigUInt64BE(BigInt(cib.address()), 2 * ffi.types.size_t.size)
            } else {
                back.writeBigUInt64LE(BigInt(stream_info.inner.address()), 1 * ffi.types.size_t.size)
                back.writeBigUInt64LE(BigInt(cib.address()), 2 * ffi.types.size_t.size)
            }
        }
        this.inner = back;
        //new StreamAndChannels(back)
        this.cib = cib
        this.si = stream_info
    }

    public getStreamId() {
        return this.stream_id
    }
}

export class SupplyInfoWrapper {
    inner: any

    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
    }

    public getName() {
        return this.inner.deref().name.buffer.reinterpret(this.inner.deref().name_length).toString("utf-8")
    }

    public getUnitType() {
        return this.inner.deref().unit_type
    }

    public isBattery() {
        return this.inner.deref().is_battery
    }

    public getNominal() {
        return this.inner.deref().nominal
    }

    public getScale() {
        return this.inner.deref().scale
    }

    public getoffset() {
        return this.inner.deref().offset
    }
}

export class ChannelCallibrationWrapper {
    inner: any
    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
    }

    public getBaseSettingIndex() {
        return this.inner.deref().base_setting_index
    }

    public getResolutionSettingIndex() {
        return this.inner.deref().resolution_setting_index
    }

    public getScale() {
        return this.inner.deref().scale
    }

    public getOffset() {
        return this.inner.deref().offset
    }

    public getMinimum() {
        return this.inner.deref().minimum
    }

    public getMaximum() {
        return this.inner.deref().maximum
    }
}

export class CtrlVarInfoWrapper {
    inner: any
    lib: any; 
    constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
    }

    public getName() {
        return this.inner.deref().name.buffer.reinterpret(this.inner.deref().name_length).toString("utf-8")
    }

    public getUnitType() {
        return this.inner.deref().unit_type
    }

    public getScale() {
        return this.inner.deref().scale
    }

    public getOffset() {
        return this.inner.deref().offset
    }

    public getMinimum() {
        return this.inner.deref().minimum
    }

    public getMaximum() {
        return this.inner.deref().maximum
    }
}

export class TcpAdvInfoWrapper {
    inner: any

    lib: any; constructor(lib: any, inner: any) {
        this.inner = inner; this.lib = lib;
    }

    public getTcpVersion() {
        return this.inner.deref().tcp_version
    }

    public connected() {
        return this.inner.deref().connected
    }

    public getMaxIncomingParamLength() {
        return this.inner.deref().max_incoming_param_length
    }

    public getMaxOutgoingParamLength() {
        return this.inner.deref().max_outgoing_param_length
    }

    public getStreamPacketLength() {
        return this.inner.deref().stream_packet_length
    }

    public getProtocolType() {
        return this.inner.deref().protocol_type
    }

    public getSerialNumber(): string {
        return this.inner.deref().serial_number
    }

    public getBoardRev() {
        return this.inner.deref().board_rev
    }

    public getBoardType() {
        return this.inner.deref().board_type
    }

    public getBuildInfo() {
        return this.inner.deref().build_info
    }

    public getBuildDate() {
        return this.inner.deref().build_date
    }

    public userTag1() {
        return this.inner.deref().user_tag1
    }

    public userTag2() {
        return this.inner.deref().user_tag2
    }

    public getRemoteMaxIncomingParamLength() {
        return this.inner.deref().remote_max_incoming_param_length
    }

    public getRemoteMaxOutgoingParamLength() {
        return this.inner.deref().remote_max_outgoing_param_length
    }

    public getRemoteStreamPacketLength() {
        return this.inner.deref().remote_stream_packet_length
    }
}


export class ExtraScanResultWrapper {
    inner: any
    constructor(inner: any) {
        this.inner = inner
    }

    public getSerialNumber() {
        return this.inner.serial_number
    }

    public getAsphodelType() {
        return this.inner.asphodel_type
    }

    public getDeviceMode() {
        return this.inner.device_mode
    }
}

export class DeviceWrapper {
    inner: ref.Pointer<any>
    transfer_cb: any
    streaming_cb: any
    connect_cb: any
    error_cb: any


    lib: any; 
    constructor(lib: any, inner: any) {
        this.inner = inner; 
        this.lib = lib;
    }

/**
Open the device for usage. Must be called before any others.
 * 
 */
    public open() {
        checkForError(this.lib,this.inner.deref().open_device(this.inner))
    }
/**
Close the device and release any shared resources (e.g. usb handles, tcp sockets).

 */
    public close() {
        this.inner.deref().close_device(this.inner)
    }
/**
	Free memory held by the device.

 */
    public free() {
        this.inner.deref().free_device(this.inner)
    }
/**
	Copy the device's serial number (UTF-8 encoded) into the specified buffer.
	The copy will be null terminated, and use at most buffer_size bytes (including the null).
	
 * @returns 
 */
    public getSerialNumber(): string {
        let buf = Buffer.alloc(64);
        checkForError(this.lib,this.inner.deref().get_serial_number(this.inner, buf, 64))
        return buf.toString("utf-8")
    }
/**
	Start an Asphodel command transfer. The specified callback will be called when finished.
 
 * @param command 
 * @param parameters 
 * @param callback 
 */
    public doTransfer(command: number, parameters: number[], callback: (status: number, params: Uint8Array) => void) {
        let buf = Buffer.from(new Uint8Array(parameters));

        this.transfer_cb = ffi.Callback("void", ["int", "uint8*", ffi.types.size_t, "void*"], (status: number, params: ref.Pointer<any>, param_length: number, closure) => {
            var resbuff = new Uint8Array(param_length);
            ref.reinterpret(params, param_length).copy(resbuff)
            callback(status, resbuff)
        })

        checkForError(this.lib,this.inner.deref().do_transfer(this.inner, command, buf, buf.length, this.transfer_cb, buf))
    }
/**

	Start an Asphodel command transfer that does not return (e.g. reset, bootloader jump).
	The specified callback will be called when the transfer is finished.
	
 * @param command 
 * @param parameters 
 * @param callback 
 */
    public doTransferReset(command: number, parameters: number[], callback: (status: number, params: Uint8Array) => void) {
        let buf = Buffer.from(new Uint8Array(parameters));

        this.transfer_cb = ffi.Callback("void", ["int", "uint8*", ffi.types.size_t, "void*"], (status: number, params: ref.Pointer<any>, param_length: number, closure) => {
            var resbuff = new Uint8Array(param_length);
            ref.reinterpret(params, param_length).copy(resbuff)
            callback(status, resbuff)
        })

        checkForError(this.lib,this.inner.deref().do_transfer_reset(this.inner, command, buf, buf.length, this.transfer_cb, buf))
    }
/**

	Start a continuous set of stream transfers. The specified callback will be called after each transfer is
	finished. The timeout is specified in milliseconds. The packet_count specifies how many packets should be lumped
	together, if possible. The transfer_count specifies how many transfers should be run in parallel, to avoid
	losing data while handling received data. The poll_device function must be called continually to receive data.
	
 * @param packet_count 
 * @param transfer_count 
 * @param timeout 
 * @param callback 
 */
    public startStreamingPackets(packet_count: number, transfer_count: number, timeout: number,
        callback: (status: number, data: Uint8Array, packet_size: number, packet_count: number) => void
    ) {
        this.streaming_cb = ffi.Callback(
            "int", ["int", "uint8*", ffi.types.size_t, ffi.types.size_t, "void*"],
            (status: number, stream_data: ref.Pointer<any>, packet_size: number, packet_count__: number, closure) => {
                let total_packets_size = packet_size * packet_count__;
                var ubuf = new Uint8Array(total_packets_size);
                ref.reinterpret(stream_data, total_packets_size).copy(ubuf)
                callback(status, ubuf, packet_size, packet_count__);
            }
        )
        checkForError(this.lib,this.inner.deref().start_streaming_packets(this.inner, packet_count, transfer_count, timeout, this.streaming_cb, ref.NULL))
    }
/**
	Stop the transfers started with start_streaming_packets.

 */
    public stopStreamingPackets() {
        checkForError(this.lib,this.inner.deref().stop_streaming_packets(this.inner));
    }
/**

Return the size of individual stream packets. Data collected with read_stream_packets will be a multiple of
this size.
 * @returns 
 */
    public getStreamPacketLength() {
        return this.inner.deref().get_stream_packet_length(this.inner);
    }
/**
	Return the maximum length of the outgoing parameters on this device.

 * @returns 
 */
    public getMaxOutgoingParamLength() {
        return this.inner.deref().get_max_outgoing_param_length(this.inner);
    }
/**
	Return the maximum length of the incoming parameters on this device.

 * @returns 
 */
    public getMaxIncomingParamLength() {
        return this.inner.deref().get_max_incoming_param_length(this.inner);
    }
/**
	Get streaming packets in a blocking fashion. Do not mix with startStreamingPackets(). The buffer must be able
	to hold at least count bytes. NOTE: count should be a multiple of getStreamPacketLength().
	
 * @param count 
 * @param timeout 
 * @returns 
 */
    public async getStreamPackets(count: number, timeout: number) {
        let packet_length = this.getStreamPacketLength();
        if (count % packet_length != 0) {
            throw new Error(`count must be multiple of ${packet_length}`)
        }
        let buf = Buffer.alloc(count);
        let countptr = ref.alloc(ffi.types.int, count)
        checkForError(this.lib,this.inner.deref().get_stream_packets_blocking(this.inner, buf, countptr, timeout))
        let resbuff = new Uint8Array(countptr.deref());
        ref.reinterpret(buf, countptr.deref()).copy(resbuff)
        return resbuff
    }
/**
	Used to convert non-blocking functions to blocking ones by calling this in a loop.

 * @param milliseconds 
 * @returns 
 */
    public poll(milliseconds: number): number {
        var completed = ref.alloc(ffi.types.int, 0);
        checkForError(this.lib,(this.inner.deref().poll_device(this.inner, milliseconds, completed)))
        return completed.deref();
    }
/**
	Set the connect callback. If the device is already connected, this will immediately call the callback. The
	callback will be called whenever the device experiences a connect or disconnect. Call this function with a NULL
	callback to remove any previously registered callback. This function is implemented for all device types, but
	really only makes sense in the context of remote devices. Non-remote devices will immediately call the callback
	with the connect parameter set. Non-remote devices will never have a disconnect event.
	
 * @param callback 
 */
    public setConnectCallBack(callback: (status: number, connected: number) => void) {
        this.connect_cb = ffi.Callback("void", ["int", "int", "void*"],
            (status: number, connected: number, closure) => {
                callback(status, connected)
            })
        checkForError(this.lib,this.inner.deref().set_connect_callback(this.inner, this.connect_cb, ref.NULL))
    }
/**
	This will wait for the device to be connected. NOTE: this will override any existing callback set with
	`setConnectCallback()`. This function is implemented for all device types, but really only makes sense in the
	context of remote devices. Non-remote devices will return immediately.
	
 * @param timeout 
 */
    public waitForConnect(timeout: number) {
        this.inner.deref().wait_for_connect(this.inner, timeout)
    }
/**

	Return the radio's remote device. This function will return an error for non-radio devices. The device should be
	freed with free() as usual.
 * @returns 
 */
    public getRemoteDevice(): DeviceWrapper {
        let pointer = ref.alloc(ref.refType(Device));
        checkForError(this.lib,this.inner.deref().get_remote_device(this.inner, pointer))
        return new DeviceWrapper(this.lib, pointer.deref())
    }
/**
	This function will try to find another AsphodelDevice_t that has the same location string as the current device.
	This can be used after a device is reset or disconnected. NOTE: this may return the same device! In that case
	the old device should *not* be freed!
 * @returns 
 */
    public ReconnectDevice(): DeviceWrapper {
        let pointer = ref.alloc(ref.refType(Device));
        checkForError(this.lib,this.inner.deref().reconnect_device(this.inner, pointer))
        return new DeviceWrapper(this.lib, pointer.deref())
    }
/**

	Like `reconnectDevice()`, but this will try to connect to an asphodel compatible bootloader for the device.
	The only time this makes sense is after a call to `asphodelBootloaderJump()` on a device with an Asphodel
	bootloader. All other situations should use `reconnectDevice()` directly.
 * @returns 
 */
    public ReconnectDeviceBootloader(): DeviceWrapper {
        let pointer = ref.alloc(ref.refType(Device));
        checkForError(this.lib,this.inner.deref().reconnect_device_bootloader(this.inner, pointer))
        return new DeviceWrapper(this.lib, pointer.deref())
    }
/**

	Like `reconnectDevice()`, but this will try to connect to a non-bootloader device. The only time this makes sense
	is after a call to `bootloaderStartProgram()` on an Asphodel bootloader. All other situations should
	use `reconnectDevice()` directly.
 * @returns 
 */
    public ReconnectDeviceApplication(): DeviceWrapper {
        let pointer = ref.alloc(ref.refType(Device));
        checkForError(this.lib,this.inner.deref().reconnect_device_application(this.inner, pointer))
        return new DeviceWrapper(this.lib, pointer.deref())
    }
/**
	This callback will be called whenever there is a device error that cannot be associated with a function call.
	NOTE: because of race conditions, the callback and closure should not be altered while the device is in use.
	
 * @param callback 
 */
    public errorCallback(callback: (devicewrapper: DeviceWrapper, status: number) => void) {
        this.error_cb = ffi.Callback("int", ["void*", "int", "void*"],
            (dev, status: number, closure) => {
                callback(this, status)
            })

        let new_device = this.inner.deref();
        new_device.error_callback = this.error_cb;
        this.inner.set(new_device)
    }

    /**Holds one of ASPHODEL_PROTOCOL_TYPE_* */
    public protocalType() {
        return this.inner.deref().protocol_type
    }
    /** A string that uniquely specifies the device location. Will be the same as long as the device is connected, even
     across different processes. May change after the device is restarted or reconnected. The string is null
     terminated UTF-8. */
    public locationString(): string {
        return this.inner.deref().location_string
    }

    /** A string that specifies the asphodel transport type used by the device (e.g. "usb", "tcp").
        The string is null terminated UTF-8. */

    public transportType(): string {
        return this.inner.deref().transport_type
    }
/**
Return the protocol version supported by this device.
 
 * @returns 
 */
    public async getProtocalVersion() {
        let ptr = ref.alloc(ffi.types.uint16);
        checkForError(this.lib,this.lib.asphodel_get_protocol_version_blocking(this.inner, ptr));
        return ptr.deref();
    }
/**
 * 
 * @returns 
 */
    public async getProtocalVersionString() {
        let buffer = Buffer.alloc(128);
        checkForError(this.lib,this.lib.asphodel_get_protocol_version_string_blocking(this.inner, buffer, buffer.length));
        return buffer.toString("utf-8");
    }
/**
Return the board revision number along with board name in string form (UTF-8).

 * @returns 
 */
    public async getBoardInfo() {
        let revptr = ref.alloc("uint8");
        let buffer = Buffer.alloc(64);
        checkForError(this.lib,this.lib.asphodel_get_board_info_blocking(this.inner, revptr, buffer, buffer.length));
        return {
            revision: revptr.deref(),
            board_name: buffer.toString("utf-8", 0, buffer.indexOf(0))
        }
    }
/**
Fill an array with the user tag offsets and lengths. Locations must be an arary of length 6.

 * @returns 
 */
    public async getUserTagLocations() {
        let buffer = Buffer.alloc(6 * ffi.types.size_t.size);
        checkForError(this.lib,this.lib.asphodel_get_user_tag_locations_blocking(this.inner, buffer));
        let ubuf64: any = new BigUint64Array(6)
        let arch64 = ["arm64", "loong64", "ppc64", "riscv64", "x64"];
        let a32 = false;
        let ubuf32 = new Uint32Array(6)
        if (!arch64.includes(os.arch())) {
            a32 = true;
        }
        for (let i = 0; i < 6; i++) {
            if (os.endianness() == "BE") {
                if (a32) {
                    ubuf32[i] = buffer.readInt32BE(i * 4);
                } else {
                    ubuf64[i] = buffer.readBigUInt64BE(i * 8)
                }
            } else {
                if (a32) {
                    ubuf32[i] = buffer.readInt32LE(i * 4);
                } else {
                    ubuf64[i] = buffer.readBigUInt64LE(i * 8)
                }
            }


        }
        if (a32) return ubuf32;
        return ubuf64
    }
/**
Return the build info of the device's firmware in string form (UTF-8).

 * @returns 
 */
    public async getBuildInfo() {
        let buf = Buffer.alloc(128);
        checkForError(this.lib,this.lib.asphodel_get_build_info_blocking(this.inner, buf, buf.length));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Return the build date of the device's firmware in string form (UTF-8).

 * @returns 
 */
    public async getBuildDate() {
        let buf = Buffer.alloc(64);
        checkForError(this.lib,this.lib.asphodel_get_build_date_blocking(this.inner, buf, buf.length));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Return the commit id of the device's firmware in string form (UTF-8).

 * @returns 
 */
    public async getCommitID() {
        let buf = Buffer.alloc(64);
        checkForError(this.lib,this.lib.asphodel_get_commit_id_blocking(this.inner, buf, buf.length));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Return the repository branch name of the device's firmware (UTF-8).
 
 * @returns 
 */
    public async getRepoBranch() {
        let buf = Buffer.alloc(64);
        checkForError(this.lib,this.lib.asphodel_get_repo_branch_blocking(this.inner, buf, buf.length));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Return the repository name of the device's firmware (UTF-8).

 * @returns 
 */
    public async getRepoName() {
        let buf = Buffer.alloc(64);
        checkForError(this.lib,this.lib.asphodel_get_repo_name_blocking(this.inner, buf, buf.length));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Return the chip family of the device's processor (e.g. "XMega") in string form (UTF-8).
 * 
 */
    public async getChipFamily() {
        let buf = Buffer.alloc(64);
        checkForError(this.lib,this.lib.asphodel_get_chip_family_blocking(this.inner, buf, buf.length));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Return the chip model of the device's processor (e.g. "ATxmega256A3U") in string form (UTF-8).

 * @returns 
 */
    public async getChipModel() {
        let buf = Buffer.alloc(64);
        checkForError(this.lib,this.lib.asphodel_get_chip_model_blocking(this.inner, buf, buf.length));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Return the chip ID of the processor in string form (UTF-8).

 * @returns 
 */
    public async getChipID() {
        let buf = Buffer.alloc(64);
        checkForError(this.lib,this.lib.asphodel_get_chip_id_blocking(this.inner, buf, buf.length));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Return the size of the NVM region in bytes.

 * @returns 
 */
    public async getNVMSize() {
        let ptr = ref.alloc(ffi.types.size_t);
        checkForError(this.lib,this.lib.asphodel_get_nvm_size_blocking(this.inner, ptr));
        return ptr.deref()
    }
/**
Erase the NVM region.

 */
    public async eraseNVM() {
        checkForError(this.lib,this.lib.asphodel_erase_nvm_blocking(this.inner))
    }
/**
Write bytes to the NVM region. The start_address is given in bytes, and must be a multiple of 4.
The length of the data must be a multiple of 4 and must be at most 2 less than the device's maximum outgoing
parameter length. See write_nvm_section for a more user friendly function.

 * @param buff 
 * @param start_address 
 */
    public async writeNVMRaw(buff: Uint8Array, start_address: number) {
        let b = Buffer.from(buff);
        checkForError(this.lib,this.lib.asphodel_write_nvm_raw_blocking(this.inner, start_address, b, b.length))
    }

/**
Write bytes to the NVM region. The start_address is given in bytes, and must be a multiple of 4.
The length of the data must be a multiple of 4.
 * @param buff 
 * @param start_address 
 */
    public async writeNVMSection(buff: Uint8Array, start_address: number) {
        let b = Buffer.from(buff);
        checkForError(this.lib,this.lib.asphodel_write_nvm_section_blocking(this.inner, start_address, b, b.length))
    }

/**

Read bytes from the NVM region. The start_address is given in bytes, and must be a multiple of 4.
The number of bytes read is controlled by the device. The length parameter specifies the maximum number of bytes to
write into data. See asphodel_read_nvm_section for a more user friendly function.

 * @param start_address 
 * @param len 
 * @returns 
 */
    public async readNVmRaw(start_address: number, len: number) {
        let b = Buffer.alloc(len);
        let lenptr = ref.alloc(ref.types.size_t, len);
        checkForError(this.lib,this.lib.asphodel_read_nvm_raw_blocking(this.inner, start_address, b, lenptr))
        let ubuf = new Uint8Array(lenptr.deref() as number)
        b.copy(ubuf);
        return ubuf;
    }
/**
Read a number of bytes from a specific section of the NVM region. The start_address is given in bytes, and must be
a multiple of 4. Will read exactly 'length' number of bytes into data.

 * @param start_address 
 * @param len 
 * @returns 
 */
    public async readNVMSection(start_address: number, len: number) {
        let b = Buffer.alloc(len);
        checkForError(this.lib,this.lib.asphodel_read_nvm_section_blocking(this.inner, start_address, b, len))
        let ubuf = new Uint8Array(len)
        b.copy(ubuf);
        return ubuf;
    }
/**
Read a string from a user tag location. Offset and length are in bytes, and must be a multiple of 4 (guaranteed if
they came from the get_user_tag_locations). Buffer will be written with a null-terminated UTF-8 string. Up to
length+1 bytes will be written to the buffer.
 * @param offset 
 * @param length 
 * @returns 
 */
    public async readUserTagString(offset: number, length: number) {
        let buf = Buffer.alloc(length + 5);
        checkForError(this.lib,this.lib.asphodel_read_user_tag_string_blocking(this.inner, offset, length, buf));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**

Write a string to a user tag location. Erases and rewrites the NVM. Offset and length are in bytes, and must be a
multiple of 4 (guaranteed if they came from the get_user_tag_locations). Buffer should be a null-terminated UTF-8
string. Additional bytes in the location will be filled with zeros.
 * @param buffer 
 * @param offset 
 * @param size 
 */
    public async writeUserTagString(buffer: string, offset: number, size: number) {
        let b = Buffer.from(buffer);
        checkForError(this.lib,this.lib.asphodel_write_user_tag_string_blocking(this.inner, offset, size, b))
    }
/**
The returned modified value is true (1) when the device NVM has been modified since its last reset. This can
indicate that the device is using a stale configuration, different from what the device settings might indicate.
 * @returns 
 */
    public async getNVMModified() {
        let ptr = ref.alloc("uint8")
        checkForError(this.lib,this.lib.asphodel_get_nvm_modified_blocking(this.inner, ptr));
        return ptr.deref();
    }


/**
Return the hash of the NVM region data in string form (UTF-8). Intended for use in determining when cached NVM data
is valid when reconnecting to a device.
 * @returns 
 */
    public async getNVMHash() {
        let buf = Buffer.alloc(128);
        checkForError(this.lib,this.lib.asphodel_get_nvm_hash_blocking(this.inner, buf, buf.length));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Return the hash of the current device settings in string form (UTF-8). Intended for use in determining when cached
device information (streams, etc) is valid when reconnecting to a device.
 * @returns 
 */
    public async getSettingHash() {
        let buf = Buffer.alloc(128);
        checkForError(this.lib,this.lib.asphodel_get_nvm_hash_blocking(this.inner, buf, buf.length));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Performs a "soft" reset. Flushes any device side communication and disables any enabled streams.
 * 
 */
    public async flush() {
        checkForError(this.lib,this.lib.asphodel_flush_blocking(this.inner));
    }
/**
Reset the device.
 * 
 */
    public async reset() {
        checkForError(this.lib,this.lib.asphodel_reset_blocking(this.inner));
    }
/**
Return the bootloader info string for the device (e.g. "XMega AES") in string form (UTF-8).

 * @returns 
 */
    public async getBootloaderInfo() {
        let buf = Buffer.alloc(128);
        checkForError(this.lib,this.lib.asphodel_get_bootloader_info_blocking(this.inner, buf, buf.length));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Reset the device and start the device's bootloader.
 * 
 */
    public async bootloaderJump() {
        checkForError(this.lib,this.lib.asphodel_bootloader_jump_blocking(this.inner));
    }
/**

Flag returned is 1 if the device has been reset since the last time the reset flag has been cleared. Otherwise the
flag is 0. See also asphodel_clear_reset_flag. The combination of these two functions can be used to verify that a
device has actually reset, since the reset command itself does not give feedback due to the device disconnecting
during the command.
 * @returns 
 */
    public async getResetFlag() {
        let ptr = ref.alloc("uint8")
        checkForError(this.lib,this.lib.asphodel_get_reset_flag_blocking(this.inner, ptr));
        return ptr.deref();
    }
/**
Will clear the reset flag on the device. See asphodel_get_reset_flag for usage details.
 * 
 */
    public async clearResetFlag() {
        checkForError(this.lib,this.lib.asphodel_clear_reset_flag_blocking(this.inner));
    }
/**
Return the number of RGB LEDs present.
 * 
 * @returns 
 */
    public async getRGBCount() {
        let ptr = ref.alloc("int")
        checkForError(this.lib,this.lib.asphodel_get_rgb_count_blocking(this.inner, ptr));
        return ptr.deref();
    }
/**
Return the present setting of a specific RGB LED.
values must be a length 3 array.
 * @param index 
 * @returns 
 */
    public async getRGBValues(index: number) {
        let buf = Buffer.alloc(3);
        checkForError(this.lib,this.lib.asphodel_get_rgb_values_blocking(this.inner, index, buf));
        return {
            r: buf.at(0), g: buf.at(1), b: buf.at(2)
        }
    }
/**
Set the value of a specific RGB LED.
values must be a length 3 array. The instant parameter is a boolean (0/1).

 * @param index 
 * @param values 
 * @param instant 
 */
    public async setRGBValues(index: number, values: { r: number, g: number, b: number }, instant: boolean) {
        let buf = Buffer.alloc(3);
        buf[0] = values.r;
        buf[1] = values.g;
        buf[2] = values.b;
        checkForError(this.lib,this.lib.asphodel_set_rgb_values_blocking(this.inner, index, buf, instant ? 1 : 0));
    }
/**
Set the value of a specific RGB LED. Convenience function for specifying colors in hex.
The instant parameter is a boolean (0/1).
 * @param index 
 * @param values 
 * @param instant 
 */
    public async setRGBValuesHex(index: number, values: number, instant: boolean) {
        checkForError(this.lib,this.lib.asphodel_set_rgb_values_hex_blocking(this.inner, index, values, instant ? 1 : 0));
    }

/**
Return the number of stand-alone (not RGB) LEDs present.
 
 * @returns 
 */
    public async getLEDCount() {
        let ptr = ref.alloc("int")
        checkForError(this.lib,this.lib.asphodel_get_led_count_blocking(this.inner, ptr));
        return ptr.deref();
    }
/**
Return the present setting of the specific LED.

 * @param index 
 * @returns 
 */
    public async getLEDValue(index: number) {
        let ptr = ref.alloc("uint8");
        checkForError(this.lib,this.lib.asphodel_get_led_value_blocking(this.inner, index, ptr));
        return ptr.deref()
    }
/**
Set the value of a specific LED. The instant parameter is a boolean (0/1).

 * @param index 
 * @param value 
 * @param instant 
 */
    public async setLEDValue(index: number, value: number, instant: boolean) {
        checkForError(this.lib,this.lib.asphodel_set_led_value_blocking(this.inner, index, value, instant ? 1 : 0));
    }
/**
Set the mode of the device to a specific value.
 * @param mode 
 */
    public async setMode(mode: number) {
        checkForError(this.lib,this.lib.asphodel_set_device_mode_blocking(this.inner, mode));
    }
/**
Return the present setting of the device mode.

 * @param index 
 * @returns 
 */
    public async getMode(index: number) {
        let ptr = ref.alloc("uint8");
        checkForError(this.lib,this.lib.asphodel_get_device_mode_blocking(this.inner, ptr));
        return ptr.deref()
    }
/**
Return the number of settings present.
 * 
 * @returns 
 */
    public async getSettingCount() {
        let ptr = ref.alloc("int");
        checkForError(this.lib,this.lib.asphodel_get_setting_count_blocking(this.inner, ptr));
        return ptr.deref();
    }
/**

Return the name of a specific setting in string form (UTF-8). The length parameter should hold the maximum number of
bytes to write into buffer. Upon completion, the length parameter will hold the length of the setting name not
including the null terminator. The length parameter may be set larger than its initial value if the buffer was not
big enough to hold the entire setting name. 
 * @param index 
 * @returns 
 */
    public async getSettingName(index: number) {
        let buf = Buffer.alloc(128);
        let ptr = ref.alloc("int", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_setting_name_blocking(this.inner, index, buf, ptr));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Fill an array with the default bytes for the specified setting. The length parameter should hold the maximum number
of bytes to write into the array. When the command is finished, the length parameter will hold the size of the
default bytes (as opposed to the number of bytes actually written to the array).
 * @param index 
 * @param length 
 * @returns 
 */
    public async getSettingDefault(index: number, length:number) {
        let buf = Buffer.alloc(length);
        let ptr = ref.alloc("int", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_setting_default_blocking(this.inner, index, buf, ptr))
        let ubuf = new Uint8Array(length);
        buf.copy(ubuf)
        return {
            defaults: ubuf,
            size: ptr.deref()
        }
    }
/**
Return the number of elements for each custom enumeration on the device. The length parameter should hold the
maximum number of counts to write into the array. When the command is finished it will hold the number of custom
enumerations present on the device (as opposed to the number of counts actually written to the array).

 * @param length 
 * @returns 
 */
    public async getCustomEnumCounts(length:number) {
        let buf = Buffer.alloc(length);
        let ptr = ref.alloc("int", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_custom_enum_counts_blocking(this.inner, buf, ptr))
        let ubuf = new Uint8Array(length);
        buf.copy(ubuf)
        return {res: ubuf, length: ptr.deref()}
    }

/**
Return the name of a specific custom enumeration value in string form (UTF-8). The length parameter should hold the
maximum number of bytes to write into buffer. Upon completion, the length parameter will hold the length of the
custom enumeration value name not including the null terminator. The length parameter may be set larger than its
initial value if the buffer was not big enough to hold the entire channel name.
 * @param index 
 * @param value 
 * @returns 
 */
    public async getCustomEnumValueName(index: number, value: number) {
        let buf = Buffer.alloc(128);
        let ptr = ref.alloc("int", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_custom_enum_value_name_blocking(this.inner, index, value, buf, ptr));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Return the number of setting categories present.

 * @returns 
 */
    public async getSettingCategoryCount() {
        let ptr = ref.alloc("int");
        checkForError(this.lib,this.lib.asphodel_get_setting_category_count_blocking(this.inner, ptr));
        return ptr.deref();
    }
/**
Return the name of a specific setting category in string form (UTF-8). The length parameter should hold the maximum
number of bytes to write into buffer. Upon completion, the length parameter will hold the length of the setting
category name not including the null terminator. The length parameter may be set larger than its initial value if
the buffer was not big enough to hold the entire setting category name.

 * @param index 
 * @returns 
 */
    public async getSettingCategoryName(index: number) {
        let buf = Buffer.alloc(128);
        let ptr = ref.alloc("int", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_setting_category_name_blocking(this.inner, index, buf, ptr));
        return buf.toString("utf-8", 0, ptr.deref());
    }
/**
Return the setting indexes for a specific setting category. The length parameter should hold the maximum number of
indexes to write into the array. When the command is finished it will hold the number of settings present on the
setting category (as opposed to the number of indexes actually written to the array).
 * @param index 
 * @param length 
 * @returns 
 */
    public async getSettingCategorySetting(index: number, length:number) {
        let buf = Buffer.alloc(length);
        let ptr = ref.alloc("int", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_setting_category_settings_blocking(this.inner, index, buf, ptr))
        let ubuf = new Uint8Array(length);
        buf.copy(ubuf)
        return {res: ubuf, length: ptr.deref()}
    }
/**
Write the information for a specific setting into setting_info.
 * 
 * @param index 
 * @returns 
 */
    public async getSettingInfo(index: number) {
        let ptr = ref.alloc(SettingInfo);
        checkForError(this.lib,this.lib.asphodel_get_setting_info_blocking(this.inner, index, ptr));
        return new SettingInfoWrapper(this.lib, ptr)
    }
/**
Return the number of GPIO ports present.
 * 
 * @returns 
 */
    public async getGPIOPortCount() {
        let ptr = ref.alloc("int");
        checkForError(this.lib,this.lib.asphodel_get_gpio_port_count_blocking(this.inner, ptr));
        return ptr.deref();
    }
/**
Return the name of a specific GPIO port in string form (UTF-8). The length parameter should hold the maximum number
of bytes to write into buffer. Upon completion, the length parameter will hold the length of the GPIO port name not
including the null terminator. The length parameter may be set larger than its initial value if the buffer was not
big enough to hold the entire GPIO port name.
 * @param index 
 * @returns 
 */
    public async getGPIOPortName(index: number) {
        let buf = Buffer.alloc(128);
        let ptr = ref.alloc("uint8", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_gpio_port_name_blocking(this.inner, index, buf, ptr));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Write the information for a specific GPIO port into gpio_port_info.
 * 
 * @param index 
 * @returns 
 */
    public async getGPIOPortInfo(index: number) {
        let ptr = ref.alloc(GPIOPortInfo);
        checkForError(this.lib,this.lib.asphodel_get_gpio_port_info_blocking(this.inner, index, ptr));
        return new GPIOPortinfoWrapper(this.lib, ptr)
    }
/**
Get the pin values of a specific GPIO port.
 * 
 * @param index 
 * @returns 
 */
    public async getGPIOPortValues(index: number) {
        let ptr = ref.alloc("uint32");
        checkForError(this.lib,this.lib.asphodel_get_gpio_port_values_blocking(this.inner, index, ptr));
        return ptr.deref()
    }
/**
Set the pin mode for a set of pins on a specific GPIO port.
 * 
 * @param index 
 * @param mode 
 * @param pins 
 */
    public async setGPIOPortMode(index: number, mode: number, pins: number) {
        checkForError(this.lib,this.lib.asphodel_set_gpio_port_modes_blocking(this.inner, index, mode, pins));
    }
/**
Disable hardware overrides on all GPIO pins. Only a device reset can restore the device to normal operations.
 * 
 */
    public async disableGPIOOverrides() {
        checkForError(this.lib,this.lib.asphodel_disable_gpio_overrides_blocking(this.inner));
    }
/**
Return the number of SPI and I2C busses present.
 * 
 * @returns 
 */
    public async getBusCounts() {
        let spi = ref.alloc("int");
        let i2c = ref.alloc("int");
        checkForError(this.lib,this.lib.asphodel_get_bus_counts_blocking(this.inner, spi, i2c))
        return { spi: spi.deref(), i2c: i2c.deref() }
    }
/**
Set the CS mode for a specific SPI bus.
 * 
 * @param index 
 * @param cs_mode 
 */
    public async setSpiCsMode(index: number, cs_mode: number) {
        checkForError(this.lib,this.lib.asphodel_set_spi_cs_mode_blocking(this.inner, index, cs_mode))
    }
/**
Does a transfer on the specified SPI bus. The TX data is transmitted. The RX data buffer must be at least as long
as the transmission length.
 * @param index 
 * @param tx_data 
 * @param data_length 
 * @returns 
 */
    public async doSpiTransfer(index: number, tx_data: Uint8Array, data_length: number) {
        let txbuf = Buffer.from(tx_data);
        let rxbuf = Buffer.alloc(data_length);
        checkForError(this.lib,this.lib.asphodel_do_spi_transfer_blocking(this.inner, index, txbuf, rxbuf, data_length))
        let ubuf = new Uint8Array(data_length);
        rxbuf.copy(ubuf);
        return ubuf
    }
/**
Does a write to the given 7-bit address on the specified I2C bus.
 * 
 * @param index 
 * @param addr 
 * @param tx_data 
 */
    public async doI2cWrite(index: number, addr: number, tx_data: Uint8Array) {
        let txbuf = Buffer.from(tx_data);
        checkForError(this.lib,this.lib.asphodel_do_i2c_write_blocking(this.inner, index, addr, txbuf, txbuf.length))
    }
/**
Does a read from the given 7-bit address on the specified I2C bus.
 * 
 * @param index 
 * @param addr 
 * @param read_length 
 * @returns 
 */
    public async doI2cRead(index: number, addr: number, read_length: number) {
        let txbuf = Buffer.alloc(read_length);
        checkForError(this.lib,this.lib.asphodel_do_i2c_read_blocking(this.inner, index, addr, txbuf, txbuf.length))
        let ubuf = new Uint8Array(read_length)
        txbuf.copy(ubuf)
        return ubuf
    }
/**
Does a write, then a read from the given 7-bit address on the specified I2C bus.
 * 
 * @param index 
 * @param addr 
 * @param read_length 
 * @returns 
 */
    public async doI2cWriteRead(index: number, addr: number, txdata: Uint8Array, read_length: number) {
        let rxbuf = Buffer.alloc(read_length);
        let txbuf = Buffer.from(txdata)
        checkForError(this.lib,this.lib.asphodel_do_i2c_write_read_blocking(this.inner, index, addr, txbuf, txbuf.length, rxbuf, read_length))
        let ubuf = new Uint8Array(read_length)
        rxbuf.copy(ubuf)
        return ubuf
    }
/**
Do a fixed channel test with the radio hardware. For testing purposes only.
 * 
 * @param channel 
 * @param duration 
 * @param mode 
 */
    public async doRadioFixedTest(channel: number, duration: number, mode: number) {
        checkForError(this.lib,this.lib.asphodel_do_radio_fixed_test_blocking(this.inner, channel, duration, mode))
    }
/**
Do a sweep test with the radio hardware. For testing purposes only.

 * @param start_channel 
 * @param stop_channel 
 * @param hop_interval 
 * @param hop_count 
 * @param mode 
 */
    public async doRadioSweepTest(start_channel: number, stop_channel: number, hop_interval: number, hop_count: number, mode: number) {
        checkForError(this.lib,this.lib.asphodel_do_radio_sweep_test_blocking(this.inner, start_channel, stop_channel, hop_interval, hop_count, mode))
    }
/**
Return the number of info regions present. For testing purposes only.

 * @returns 
 */
    public async getInfoRegionCount() {
        let ptr = ref.alloc("int");
        checkForError(this.lib,this.lib.asphodel_get_info_region_count_blocking(this.inner, ptr));
        return ptr.deref()
    }
/**
Return the name of a specific info region in string form (UTF-8). The length parameter should hold the maximum number
of bytes to write into buffer. Upon completion, the length parameter will hold the length of the info region name not
including the null terminator. The length parameter may be set larger than its initial value if the buffer was not
big enough to hold the entire info region name. For testing purposes only.

 * @param index 
 * @returns 
 */
    public async getInfoRegionName(index: number) {
        let buf = Buffer.alloc(128);
        let ptr = ref.alloc("uint8", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_info_region_name_blocking(this.inner, index, buf, ptr));
        return buf.toString("utf-8", 0, ptr.deref());
    }
/**
Reads data from a specific info region. The length parameter should hold the maximum number of bytes to write into
the array. When the command is finished it will hold the number of bytes present in the info region (as opposed to
the number of bytes actually written to the array). For testing purposes only.

 * @param index 
 * @returns 
 */
    public async getInfoRegion(index: number, length:number) {
        let buf = Buffer.alloc(length);
        let ptr = ref.alloc("uint8", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_info_region_blocking(this.inner, index, buf, ptr));
        let ubuf = new Uint8Array(length)
        buf.copy(ubuf, 0, 0, length)
        return {
            info_region: ubuf,
            nbytes: ptr.deref()
        }
    }
/**
Get stack info. stack_info should point to an array of size 2. stack_info[0] is free bytes. stack_info[1] is used
bytes. For testing purposes only.
 * @returns 
 */
    public async getStackInfo() {
        let buf = Buffer.alloc(2 * 4);
        checkForError(this.lib,this.lib.asphodel_get_stack_info_blocking(this.inner, buf));
        return { free: buf.readInt32LE(0), used: buf.readInt32LE(4) }
    }
/**
Echo raw bytes. For testing purposes only.
 * 
 * @param data 
 * @returns 
 */
    public async echoRaw(data: Uint8Array) {
        let rxbuf = Buffer.alloc(data.length);
        let txbuf = Buffer.from(data)
        let lptr = ref.alloc(ffi.types.size_t, data.length)
        checkForError(this.lib,this.lib.asphodel_echo_raw_blocking(this.inner, txbuf, txbuf.length, rxbuf, lptr))
        let ubuf = new Uint8Array(lptr.deref() as number)
        rxbuf.copy(ubuf)
        return ubuf
    }
/**
Echo bytes as transaction. For testing purposes only.
 * 
 * @param data 
 * @returns 
 */
    public async echoTransaction(data: Uint8Array) {
        let rxbuf = Buffer.alloc(data.length);
        let txbuf = Buffer.from(data)
        let lptr = ref.alloc(ffi.types.size_t, data.length)
        checkForError(this.lib,this.lib.asphodel_echo_transaction_blocking(this.inner, txbuf, txbuf.length, rxbuf, lptr))
        let ubuf = new Uint8Array(lptr.deref() as number)
        rxbuf.copy(ubuf)
        return ubuf
    }
/**
Echo parameters. For testing purposes only.
 * @param data 
 * @returns 
 */
    public async echoParams(data: Uint8Array) {
        let rxbuf = Buffer.alloc(data.length);
        let txbuf = Buffer.from(data)
        let lptr = ref.alloc(ffi.types.size_t, data.length)
        checkForError(this.lib,this.lib.asphodel_echo_params_blocking(this.inner, txbuf, txbuf.length, rxbuf, lptr))
        let ubuf = new Uint8Array(lptr.deref() as number)
        rxbuf.copy(ubuf)
        return ubuf
    }
/**
Return the number of streams present and ID size information
 * 
 * @returns 
 */
    public async getStreamCount() {
        let fil = ref.alloc("uint8", 0)
        let id = ref.alloc("uint8", 0)
        let co = ref.alloc("int", 0)
        checkForError(this.lib,this.lib.asphodel_get_stream_count_blocking(this.inner, co, fil, id));
        return {
            count: co.deref(),
            id_bits: id.deref(),
            filler_bits: fil.deref()
        }
    }
/**
 * 
Allocate and fill a AsphodelStreamInfo_t structure. Must be freed with asphodel_free_stream() when finished.
 * 
 * @param index 
 * @returns 
 */
    public async getStream(index: number) {
        let st = ref.alloc(ref.refType(StreamInfo));
        checkForError(this.lib,this.lib.asphodel_get_stream_blocking(this.inner, index, st))
        return new StreamInfoWrapper(this.lib, st.deref())
    }
/**
 * Return the channel indexes for a specific stream. The length parameter should hold the maximum number of indexes to
write into the array. When the command is finished it will hold the number of channels present on the stream (as
opposed to the number of indexes actually written to the array).

 * @param index 
 * @param len 
 * @returns 
 */
    public async getStreamChannels(index: number, len: number) {
        let arr = Buffer.alloc(len)
        let lenptr = ref.alloc("uint8", len)
        checkForError(this.lib,this.lib.asphodel_get_stream_channels_blocking(this.inner, index, arr, lenptr));
        let iarr = new Uint8Array(len);
        arr.copy(iarr);
        return {
            indexes: iarr,
            number_of_channels: lenptr.deref()
        }
    }
/**
Write the stream information for a specific stream into stream_info.
 * 
 * @param index 
 * @returns 
 */
    public async getStreamFormat(index: number) {
        let st = ref.alloc(StreamInfo);
        checkForError(this.lib,this.lib.asphodel_get_stream_format_blocking(this.inner, index, st))
        return new StreamInfoWrapper(this.lib, st)
    }
/**
Enable or disable a specific stream. The enable parameter is a boolean (0/1).
 * 
 * @param index 
 * @param enable 
 */
    public async enableStream(index: number, enable: boolean) {
        checkForError(this.lib,this.lib.asphodel_enable_stream_blocking(this.inner, index, enable ? 1 : 0))
    }
/**
 Enable or disable a specific stream's warm up function. The enable parameter is a boolean (0/1).
 * 
 * @param index 
 * @param enable 
 */
    public async warmUpStream(index: number, enable: boolean) {
        checkForError(this.lib,this.lib.asphodel_warm_up_stream_blocking(this.inner, index, enable ? 1 : 0))
    }
/**
Return the enable and warm up status of a specific stream.
 * 
 * @param index 
 * @returns 
 */
    public async getStreamStatus(index: number) {
        let en = ref.alloc("int");
        let wa = ref.alloc("int");
        checkForError(this.lib,this.lib.asphodel_get_stream_status_blocking(this.inner, index, en, wa));
        return {
            enable: en.deref(),
            warm_up: wa.deref()
        }
    }
/**
 * Return stream rate channel information. The available parameter is a boolean (0/1). NOTE: if available is zero then
 the other function outputs have not been written.

 * @param index 
 * @returns 
 */
    public async getStreamRateInfo(index: number) {
        let avail = ref.alloc("int")
        let ci = ref.alloc("int", 0)
        let inv = ref.alloc("int", 0)
        let sca = ref.alloc("float", 0)
        let off = ref.alloc("float", 0)

        checkForError(this.lib,this.lib.asphodel_get_stream_rate_info_blocking(this.inner, index, avail, ci, inv, sca, off));

        return {
            available: avail.deref(),
            channel_index: ci.deref(),
            invert: inv.deref(),
            scale: sca.deref(),
            offset: off.deref()
        }
    }
/**
Return the number of channels present.
 * 
 * @returns 
 */
    public async getChannelCount() {
        let count = ref.alloc("int")
        checkForError(this.lib,this.lib.asphodel_get_channel_count_blocking(this.inner, count));
        return count.deref()
    }
/**
 Allocate and fill a AsphodelChannelInfo_t structure. Must be freed with asphodel_free_channel() when finished.
 * 
 * @param index 
 * @returns 
 */
    public async getChannel(index: number) {
        let st = ref.alloc(ref.refType(ChannelInfo));
        checkForError(this.lib,this.lib.asphodel_get_channel_blocking(this.inner, index, st))
        return new ChannelInfoWrapper(this.lib, st.deref())
    }
/**
 * 
Return the name of a specific channel in string form (UTF-8). The length parameter should hold the maximum number
of bytes to write into buffer. Upon completion, the length parameter will hold the length of the channel name
not including the null terminator. The length parameter may be set larger than its initial value if the buffer
was not big enough to hold the entire channel name.
 * @param index 
 * @returns 
 */
    public async getChannelName(index: number) {
        let buf = Buffer.alloc(128);
        let ptr = ref.alloc("uint8", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_channel_name_blocking(this.inner, index, buf, ptr));
        return buf.toString("utf-8", 0, ptr.deref());
    }
/**
Write the channel information for a specific channel into channel_info.
 * 
 * @param index 
 * @returns 
 */
    public async getChannelInfo(index: number) {
        let st = ref.alloc(ChannelInfo);
        checkForError(this.lib,this.lib.asphodel_get_channel_info_blocking(this.inner, index, st))
        return new ChannelInfoWrapper(this.lib, st)
    }
/**
  Fill an array with the coefficients from the specified channel. The length parameter should hold the maximum number
of coefficients to write into the array. When the command is finished it will hold the number of coefficients
present on the channel (as opposed to the number of coefficients actually written to the array).

 * @param index 
 * @param length 
 * @returns 
 */
    public async getChannelCoefficients(index: number, length: number) {
        let fbuf = Buffer.alloc(ffi.types.float.size * length);
        let lptr = ref.alloc("uint8", length)
        checkForError(this.lib,this.lib.asphodel_get_channel_coefficients_blocking(this.inner, index, fbuf, lptr))
        let floats = new Float32Array(length)
        for (let i = 0; i < length; i++) {
            floats[i] = os.endianness() == "LE" ? fbuf.readFloatLE(i * ffi.types.float.size) : fbuf.readFloatBE(i * ffi.types.float.size)
        }
        return {
            coeficients: floats,
            coeficients_present: lptr.deref()
        }
    }
/**
Fill an array with a chunk for the specified channel. The length parameter should hold the maximum number
of bytes to write into the array. When the command is finished, the length parameter will hold the size of the
chunk (as opposed to the number of bytes actually written to the array).

 * @param index 
 * @param chunk_number 
 * @param length 
 * @returns 
 */
    async getChannelChunk(index: number, chunk_number: number, length: number) {
        let chbuff = Buffer.alloc(length);
        let lptr = ref.alloc("uint8", length);
        checkForError(this.lib,this.lib.asphodel_get_channel_chunk_blocking(this.inner, index, chunk_number, chbuff, lptr));
        let ubuf = new Uint8Array(length);
        chbuff.copy(ubuf);
        return {
            chunk: ubuf,
            chunk_size: lptr.deref()
        }
    }
/**
Performa a channel specific transfer. The format of the data depends on the channel type. The reply_length parameter
should hold the maximum number of bytes to write into the reply array. When the command is finished, the
reply_length parameter will hold the size of the recieved reply (as opposed to the number of bytes actually written
to the reply array). 
 * @param index 
 * @param data 
 * @param reply_len 
 * @returns 
 */
    public async channelSpecific(index: number, data: Uint8Array, reply_len:number) {
        let rbuf = Buffer.alloc(reply_len);
        let rlen = ref.alloc("uint8", reply_len);
        let dbuf = Buffer.from(data);
        checkForError(this.lib,this.lib.asphodel_channel_specific_blocking(this.inner, index, dbuf, dbuf.length, rbuf, rlen));
        let rar = new Uint8Array(reply_len);
        rbuf.copy(rar)
        return {
            reply: rar,
            received_reply_size: rlen.deref()
        }
    }
/**
Return channel calibration information. The available parameter is a boolean (0/1). NOTE: if available is zero then
the calibration structure values have not been written. 
 * @param index 
 * @returns 
 */
    public async getChannelCalibration(index: number) {
        let avail = ref.alloc("int")
        let ptr = ref.alloc(ChannelCallibration);
        checkForError(this.lib,this.lib.asphodel_get_channel_calibration_blocking(this.inner, index, avail, ptr));
        return {
            available: avail.deref(),
            callibration: new ChannelCallibrationWrapper(this.lib, ptr)
        }
    }
/**
Return the number of supplies present.
 * 
 * @returns 
 */
    public async getSupplyCount() {
        let cnt = ref.alloc("int", 0)
        checkForError(this.lib,this.lib.asphodel_get_supply_count_blocking(this.inner, cnt));
        return cnt.deref();
    }
/**
 * Return the name of a specific supply in string form (UTF-8). The length parameter should hold the maximum number
of bytes to write into buffer. Upon completion, the length parameter will hold the length of the supply name not
including the null terminator. The length parameter may be set larger than its initial value if the buffer was not
big enough to hold the entire supply name.

 * @param index 
 * @returns 
 */
    public async getSupplyName(index: number) {
        let buf = Buffer.alloc(128);
        let ptr = ref.alloc("uint8", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_supply_name_blocking(this.inner, index, buf, ptr));
        return buf.toString("utf-8", 0, buf.indexOf(0));
    }
/**
Write the supply information for a specific supply into supply_info.
 * 
 */
    public async getSupplyInfo(index: number) {
        let ptr = ref.alloc(SupplyInfo);
        checkForError(this.lib,this.lib.asphodel_get_supply_info_blocking(this.inner, index, ptr));
        return new SupplyInfoWrapper(this.lib, ptr)
    }
/**
 * Perform a measurement on the specified supply. If tries is greater than zero, this will no more than this many
transfers before returning a status of `ASPHODEL_TOO_MANY_TRIES`. Otherwise, will try indefinitely.

 * @param index 
 * @param tries 
 * @returns 
 */
    public async checkSupply(index: number, tries: number) {
        var m = ref.alloc("uint32");
        var r = ref.alloc("uint8")
        if(m.isNull()) {
            throw new Error("Failed to allocate memmory")
        }

        if(r.isNull()) {
            throw new Error("Failed to allocate memmory")
        }

        checkForError(this.lib,this.lib.asphodel_check_supply_blocking(this.inner, index, m, r, tries));
        return {
            measurement:m.deref(),
            result: r.deref()
        }
    }
/**
    returns a pointer to the advertisement structure
 * 
 * @returns 
 */
    public TCPGetAdvertisement() {
        let ptr = this.lib.asphodel_tcp_get_advertisement(this.inner);
        return new TcpAdvInfoWrapper(this.lib, ptr)
    }
/**
Enable or disable the RF power output.
 * 
 * @param enable 
 */
    public async enableRfPower(enable: boolean) {
        checkForError(this.lib,this.lib.asphodel_enable_rf_power_blocking(this.inner, enable ? 1 : 0))
    }
/**
Retrieve the enabled state of the RF power output.
 * 
 * @returns 
 */
    public async getRfpowerStatus() {
        let st = ref.alloc("int", 0);
        checkForError(this.lib,this.lib.asphodel_get_rf_power_status_blocking(this.inner, st));
        return st.deref()
    }
/**
 * Return the control variable indexes that are related to RF power transmission. The length parameter should hold the
maximum number of indexes to write into the array. When the command is finished it will hold the number of indexes
reported by the device (as opposed to the number of indexes actually written to the array).

 * @param len 
 * @returns 
 */
    public async getRfPowerCtlVars(len: number) {
        let arr = Buffer.alloc(len)
        let lenptr = ref.alloc("uint8", len)
        checkForError(this.lib,this.lib.asphodel_get_rf_power_ctrl_vars_blocking(this.inner, arr, lenptr));
        let iarr = new Uint8Array(len);
        arr.copy(iarr);
        return {
            vars: iarr,
            indexes: lenptr.deref()
        }
    }
/**
 * Sets or resets the RF Power timeout. The timeout parameter is specified in milliseconds. If the timeout duration
passes without the device receiving another timeout reset command, then the device will disable the RF power output
(if applicable). Sending a timeout value of 0 will disable the timeout functionality.

 * @param timeout 
 */
    public async resetRfPowerTimeout(timeout: number) {
        checkForError(this.lib,this.lib.asphodel_reset_rf_power_timeout_blocking(this.inner, timeout));
    }
/**
Start the main program from the bootloader. Implicitly resets the device, like `reset()`.
 * 
 */
    public async bootLoaderStartProgram() {
        checkForError(this.lib,this.lib.asphodel_bootloader_start_program_blocking(this.inner))
    }
/**
 * Returns page information from the bootloader. The length parameter should hold the maximum number of entries to
write into the array. When the command is finished it will hold the number of entries available on the device (as
opposed to the number of entries actually written to the array). Entries are paris of page count and page size, in
that order. The total number of pages is the sum of all page counts. The total number of bytes is the sum of the
products of each entry pair (i.e. page count * page size).

 * @param length 
 * @returns 
 */
    public async getBootLoaderPageInfo(length: number) {
        let buf = Buffer.alloc(length * 4);
        let l = ref.alloc("uint8", length);
        checkForError(this.lib,this.lib.asphodel_get_bootloader_page_info_blocking(this.inner, buf, l));
        let ub = new Uint32Array(length);
        for (let i = 0; i < ub.length; i++) {
            ub[i] = os.endianness() == "LE" ? buf.readUint32LE(i * ffi.types.float.size) : buf.readUint32BE(i * ffi.types.float.size)
        }
        return {
            page_info: ub,
            entries_available: l.deref()
        }
    }
/**
 * Fill an array with the allowed code block sizes for the device. The length parameter should hold the maximum number
of block sizes to write into the array. When the command is finished it will hold the number of block sizes
available on the device (as opposed to the number of block sizes actually written to the array).
The array of code block sizes will be sorted, ascending. There will be no duplicates, and all values will be greater
than zero.
 * @param length 
 * @returns 
 */
    public async getBootLoaderblockSizes(length: number) {
        let buf = Buffer.alloc(length * 2);
        let l = ref.alloc("uint8", length);
        checkForError(this.lib,this.lib.asphodel_get_bootloader_block_sizes_blocking(this.inner, buf, l));
        let ub = new Uint16Array(length);
        for (let i = 0; i < ub.length; i++) {
            ub[i] = os.endianness() == "LE" ? buf.readUint16LE(i * 2) : buf.readUint16BE(i * 2)
        }
        return {
            block_sizes: ub,
            available: l.deref()
        }
    }
/**
 * 
Prepares a page for writing. Must be called before writing code blocks or verifying pages. The nonce, if any, is
used by the device to decode the written code blocks.
 * @param page_number 
 * @param nonce 
 */
    public async startBootLoaderPage(page_number: number, nonce: Uint8Array) {
        let buf = Buffer.from(nonce);
        checkForError(this.lib, this.lib.asphodel_start_bootloader_page_blocking(this.inner, page_number, buf, buf.length));
    }
/**
 * Write a code block to the current page. Code blocks must be sent strictly sequentally. Blocks are only accepted by
the device in certain sizes. See `getBootloaderBlockSizes()` for allowable code block sizes.
``NOTE``: after the final code block is written to a page, the page must be finished with a call to
`finishBootloaderPage()`.
 * @param data 
 */
    public async writeBootLoaderCodeBlock(data: Uint8Array) {
        let db = Buffer.from(data);
        checkForError(this.lib,this.lib.asphodel_write_bootloader_code_block_blocking(this.inner, db, db.length));
    }
/**
 * Must be called after all code blocks for a specific page have been written. The MAC tag is used to verify the
contents of the page.
 * @param mac_tag 
 */
    public async finishBootloaderPage(mac_tag: Uint8Array) {
        let mac = Buffer.from(mac_tag)
        checkForError(this.lib,this.lib.asphodel_finish_bootloader_page_blocking(this.inner, mac, mac.length));
    }
/**
    Wrapper which calls `writeBootloaderCodeBlock()` repeatedly with valid block sizes.
 * 
 * @param data 
 * @param block_sizes 
 */
    public async writeBoatloaderPage(data: Uint8Array, block_sizes: Uint16Array) {
        let dbuf = Buffer.from(data);
        let bbuf = Buffer.alloc(block_sizes.length * 2);
        block_sizes.forEach((size, i)=>{
            os.endianness() == "LE" ? bbuf.writeUint16LE(size, i * 2) : bbuf.writeUint16BE(size, i * 2)
        })
        checkForError(this.lib, this.lib.asphodel_write_bootloader_page_blocking(this.inner, dbuf, data.length, bbuf,block_sizes.length))
    }
/**
 * Used to verify the contents of a page. The page contents are checked against the MAC tag to verify integrity.
NOTE: the `startBootloaderPage()` must be called for the page prior to verification.

 * @param mac_tag 
 */
    public async verifyBootloaderPage(mac_tag: Uint8Array) {
        let mb = Buffer.from(mac_tag);
        checkForError(this.lib,this.lib.asphodel_verify_bootloader_page_blocking(this.inner, mb, mb.length))
    }
/**
 * Supported types: `CHANNEL_TYPE_SLOW_STRAIN`, `CHANNEL_TYPE_FAST_STRAIN`, `CHANNEL_TYPE_COMPOSITE_STRAIN`
Sets the output of the sense resistors on a specified strain bridge. The side inputs are booleans (0 or 1).
Wraps a call to `channelSpecific()`.
 * @param channel_index 
 * @param bridge_index 
 * @param positive_side 
 * @param negative_side 
 */
    public async setStrainOutputs(channel_index: number, bridge_index: number, positive_side: number, negative_side: number) {
        checkForError(this.lib,this.lib.asphodel_set_strain_outputs_blocking(this.inner, channel_index, bridge_index, positive_side, negative_side))
    }
/**
 * Supported types: `CHANNEL_TYPE_SLOW_ACCEL`, `CHANNEL_TYPE_PACKED_ACCEL`, `CHANNEL_TYPE_LINEAR_ACCEL`
Enables or disables the accel channel's self test functionality. Enable is a boolean (0/1).
Wraps a call to `channelSpecific()`.
 * @param channel_index 
 * @param enable 
 */
    public async enableAccelSelfTest(channel_index: number, enable: boolean) {
        checkForError(this.lib,this.lib.asphodel_enable_accel_self_test_blocking(this.inner, channel_index, enable ? 1 : 0))
    }
/**
Return the number of control variables present.
 * 
 * @returns 
 */
    public async getCtrlVarCount() {
        let c = ref.alloc("int");
        checkForError(this.lib,this.lib.asphodel_get_ctrl_var_count_blocking(this.inner, c))
        return c.deref()
    }
/**
 * Return the name of a specific control variable in string form (UTF-8). The length parameter should hold the maximum
number of bytes to write into buffer. Upon completion, the length parameter will hold the length of the control
variable name not including the null terminator. The length parameter may be set larger than its initial value if
the buffer was not big enough to hold the entire control variable name.

 * @param index 
 * @returns 
 */
    public async getCtrlVarName(index: number) {
        let buf = Buffer.alloc(128);
        let ptr = ref.alloc("uint8", buf.length);
        checkForError(this.lib,this.lib.asphodel_get_ctrl_var_name_blocking(this.inner, index, buf, ptr));
        return buf.toString("utf-8", 0, ptr.deref());
    }
/**
Write the information for a specific control variable into ctrl_var_info.

 * 
 * @param index 
 * @returns 
 */
    public async getCtrlVarInfo(index: number) {
        let ptr = ref.alloc(CtrlVarInfo);
        checkForError(this.lib, this.lib.asphodel_get_ctrl_var_info_blocking(this.inner, index, ptr));
        return new CtrlVarInfoWrapper(this.lib, ptr)
    }
/**
Get the value of a specific control variable.
 * 
 * @param index 
 * @returns 
 */
    public async getCtrlVar(index: number) {
        let c = ref.alloc("uint32");
        checkForError(this.lib,this.lib.asphodel_get_ctrl_var_blocking(this.inner, index, c))
        return c.deref()
    }
/**
Set the value of a specific control variable.
 * 
 * @param index 
 * @param value 
 */
    public async setCtrlVar(index: number, value: number) {
        checkForError(this.lib,this.lib.asphodel_set_ctrl_var_blocking(this.inner, index, value))
    }
/**
 Stop the radio. Works on scanning, connected, and connecting radios. Has no effect on already stopped radios.
 * 
 */
    public async stopRadio() {
        checkForError(this.lib,this.lib.asphodel_stop_radio_blocking(this.inner))
    }
/**
 * Start a scan with the radio. The radio will remain scanning until stopped. Scan results can be retreived using
`getStartRadioScanResults()`. Starting a scan will remove any old scan results still in the device.

 */
    public startRadioScan() {
        checkForError(this.lib,this.lib.asphodel_start_radio_scan_blocking(this.inner))
    }

/**
 * 
 * Query the device for scanned serial numbers. The device will return at most
`floor(getMaxIncomingParamLength()/4)` serial numbers at a time. Another query should be performed to make
sure there are no more. `See getRadioScanResults()` for a more user-friendly version
 * @returns 
 */
    public async getRawRadioScanResults(length: number) {
        let res = Buffer.alloc(length * 4);
        let lptr = ref.alloc(ffi.types.size_t, length);
        checkForError(this.lib,this.lib.asphodel_get_raw_radio_scan_results_blocking(this.inner, res, lptr))
        let ub = new Uint32Array(lptr.deref() as number);
        for (let i = 0; i < ub.length; i++) {
          ub[i] = os.endianness() == "LE" ? res.readUint32LE(i * 4) : res.readUint32BE(i * 4)
        }
        return ub
    }
/**
 * Will return query the device for scanned serial numbers until no more are returned. Each array entry will be unique.
 Entries are unsorted.

 * @param length 
 * @returns 
 */
    public async getRadioScanResults(length: number) {
        let res = ref.alloc(ArrayType("uint32"));
        let lptr = ref.alloc(ffi.types.size_t, length);
        checkForError(this.lib,this.lib.asphodel_get_radio_scan_results_blocking(this.inner, res, lptr))
        let ub = new Uint32Array(lptr.deref() as number);
        let resbuff = res.deref().buffer.reinterpret(lptr.deref() as number * 4)
        for (let i = 0; i < ub.length; i++) {
            ub[i] = os.endianness() == "LE" ? resbuff.readUint32LE(i * 4) : resbuff.readUint32BE(i * 4)
        }
        this.lib.asphodel_free_radio_scan_results(resbuff)
        return ub
    }
/**Query the device for scan results. The device will return at most `floor(getMaxIncomingParamLength()/6)`
results at a time. Another query should be performed to make sure there are no more. See
`getRadioExtraScanResults()` for a more user-friendly version.

 * 
 * @param length 
 * @returns 
 */
    public async getRawRadioExtraScanResults(length: number) {
        let res = Buffer.alloc(ExtraScanResult.size * length);
        let lptr = ref.alloc(ffi.types.size_t, length);
        checkForError(this.lib,this.lib.asphodel_get_raw_radio_extra_scan_results_blocking(this.inner, res, lptr))
        let results: ExtraScanResultWrapper[] = []
        for (let i = 0; i < (lptr.deref() as number); i++) {
            results.push(new ExtraScanResultWrapper(new ExtraScanResult(res.subarray(i * ExtraScanResult.size))))
        }
        return results
    }

/**
 * Will query the device for scan results until no more are returned. Each array entry will have a unique serial
number. Entries are unsorted.

 * @param length 
 * @returns 
 */
    public async getRadioExtraScanResults(length: number) {
        let res = ref.alloc(ArrayType(ExtraScanResult));
        let lptr = ref.alloc(ffi.types.size_t, length);
        checkForError(this.lib,this.lib.asphodel_get_radio_extra_scan_results_blocking(this.inner, res, lptr))
        let results: ExtraScanResultWrapper[] = []
        let resbuff = res.deref().buffer.reinterpret(lptr.deref() as number * ExtraScanResult.size)
        for (let i = 0; i < (lptr.deref() as number); i++) {
            results.push(new ExtraScanResultWrapper(new ExtraScanResult(resbuff.subarray(i * ExtraScanResult.size))))
        }
        this.lib.asphodel_free_radio_extra_scan_results(resbuff)
        return results
    }
/**
 *  Will return the received radio power during the scan for the specified serial numbers. A power reading of `0x7F` means
there was no information for that serial number. The array length must be less than or equal to the smaller of
`(max_outgoing_param_length / 4)` and `(max_incoming_param_len / 1)`.

 * 
 * @param serials 
 * @returns 
 */
    public async getRadioScanPower(serials: Uint32Array) {
        let sb = Buffer.alloc(4 * serials.length);
        serials.forEach((s, i)=>{
            os.endianness() == "BE"? sb.writeInt32BE(s, i * 4) : sb.writeInt32LE(s, i * 4)
        })
        let res = Buffer.alloc(serials.length);
        checkForError(this.lib,this.lib.asphodel_get_radio_scan_power_blocking(this.inner, sb, res, serials.length))
        let ub = new Uint8Array(serials.length);
        res.copy(ub);
        return ub
    }
/**
 * Connect the radio's remote to a specific serial number.

 * @param serial_number 
 */
    public async connectRadio(serial_number: number) {
        checkForError(this.lib,this.lib.asphodel_connect_radio_blocking(this.inner, serial_number))
    }
/**
 * Retrieve the current state of the radio. The state of the radio can be determined from the return values as follows:
Radio Stopped: connected=0, serial_number=0, protocol_type=0, scanning=0
Radio Scanning: connected=0, serial_number=0, protocol_type=0, scanning=1
Radio Connecting: connected=0, serial_number=<sn>, protocol_type=0, scanning=0
Radio Connected: connected=1, serial_number=<sn>, protocol_type=<type>, scanning=0

 * @returns 
 */
    public async getRadioStatus() {
        let con = ref.alloc("int");
        let ser = ref.alloc("uint32");
        let pr = ref.alloc("uint8")
        let scan = ref.alloc("int");
        checkForError(this.lib,this.lib.asphodel_get_radio_status_blocking(this.inner, con, ser, pr, scan));
        return {
            connected: con.deref(),
            serial_number: ser.deref(),
            protocal_type: pr.deref(),
            scanning: scan.deref()
        }
    }
/**
 * Return the control variable indexes that are related to radio operation. The length parameter should hold the
maximum number of indexes to write into the array. When the command is finished it will hold the number of indexes
reported by the device (as opposed to the number of indexes actually written to the array).

 * @param len 
 * @returns 
 */
    public async getRadioCtlVars(len: number) {
        let arr = Buffer.alloc(len)
        let lenptr = ref.alloc("uint8", len)
        checkForError(this.lib,this.lib.asphodel_get_radio_ctrl_vars_blocking(this.inner, arr, lenptr));
        let iarr = new Uint8Array(len);
        arr.copy(iarr);
        return {
            vars: iarr,
            indexes_reported: lenptr.deref()
        }
    }
/**
 * Return the default serial number configured for use with the radio. A default serial number of 0 means no serial
number has been set as the default, or the functionality has been disabled.

 * @returns 
 */
    public async getRadioDefaultSerial() {
        let ser = ref.alloc("uint32");
        checkForError(this.lib,this.lib.asphodel_get_radio_default_serial_blocking(this.inner, ser));
        return ser.deref();
    }
/**
 * 
Start a bootloader scan with the radio. The radio will remain scanning until stopped. Scan results can be retreived
using `getStartRadioScanResults()`. Starting a scan will remove any old scan results still in the device.

 */
    public startRadioScanBoot() {
        checkForError(this.lib,this.lib.asphodel_start_radio_scan_boot_blocking(this.inner))
    }

    /**
Connect the radio's remote to a specific serial number, in bootloader mode.
     * 
     * @param serial_number 
     */
    public startConnectRadioBoot(serial_number: number) {
        checkForError(this.lib,this.lib.asphodel_connect_radio_boot_blocking(this.inner, serial_number))
    }
/**
Stop the remote's radio. Has no effect on already stopped radios.
 * 
 */
    public stopRemote() {
        checkForError(this.lib,this.lib.asphodel_stop_remote(this.inner))
    }

/**
Restarts the remote's radio, with the previously connected serial number.
 * 
 */
    public restartRemote() {
        checkForError(this.lib,this.lib.asphodel_restart_remote_blocking(this.inner))
    }
/**
 * Return the remote's status. Will provide the serial number of the currently connected (or last connected) device.
If no serial number has ever been used with the device, the serial number will be 0.

 * @returns 
 */
    public async getRemoteStatus() {
        let con = ref.alloc("int");
        let ser = ref.alloc("uint32");
        let pr = ref.alloc("uint8")
        checkForError(this.lib,this.lib.asphodel_get_remote_status_blocking(this.inner, con, ser, pr));
        return {
            connected: con.deref(),
            serial_number: ser.deref(),
            protocal_type: pr.deref(),
        }
    }

/**
Restarts the remote's radio, with the previously connected serial number. Forces the use of application mode.
 * 
 */
    public restartRemoteApp() {
        checkForError(this.lib,this.lib.asphodel_restart_remote_app_blocking(this.inner))
    }
/**
Restarts the remote's radio, with the previously connected serial number. Forces the use of bootloader mode.
 * 
 */
    public restartRemoteBoot() {
        checkForError(this.lib,this.lib.asphodel_restart_remote_boot_blocking(this.inner))
    }
/** returns `true` if the device supports RF power commands (in asphodel_rf_power.h), otherwise returns `false`
*/
    public supportsRfPowerCommands() {
        return this.lib.asphodel_supports_rf_power_commands(this.inner) == 1
    }
/**  returns `true` if the device supports radio commands (in asphodel_radio.h), otherwise returns `false`
*/
    public supportsRadioCommands() {
        return this.lib.asphodel_supports_radio_commands(this.inner) == 1
    }
/**
returns `true` if the device supports remote commands (in asphodel_radio.h), otherwise returns `false`
 * 
 */
    public supportsRemoteCommands() {
        return this.lib.asphodel_supports_remote_commands(this.inner) == 1
    }
/** 
returns `true` if the device supports bootloader commands (in asphodel_bootloader.h), otherwise returns `false`
 * 
*/
    public supportsBootloaderCommands() {
        return this.lib.asphodel_supports_bootloader_commands(this.inner) == 1
    }

}


export class Version {
    lib: any
    constructor(lib: any) {
        this.lib = lib
    }
/**
Return the protocol version supported by this device in BCD form (e.g. 0x0200).

 * @returns 
 */
    public protocolVersion() {
        return this.lib.asphodel_get_library_protocol_version()
    }
/**
 Return the protocol version supported by this device in string form (e.g. "2.0.0").

 * @returns 
 */
    public protocolVersionString() {
        return this.lib.asphodel_get_library_protocol_version_string()
    }
/**
Return the library's build info string.

 * @returns 
 */
    public buildInfo() {
        return this.lib.asphodel_get_library_build_info()
    }
/**
Return the library's build date as a string.

 * @returns 
 */
    public buildDate() {
        return this.lib.asphodel_get_library_build_date()
    }

}

export class MemTest{
    lib: any
    constructor(lib: any) {
        this.lib = lib
    }
/**
 *  returns 1 if the library has been build with memory testing support (-DASPHODEL_MEM_TEST), and 0 otherwise.
 
 * @returns 
 */
    public supported() {
        return this.lib.asphodel_mem_test_supported();
    }
/**
sets the malloc limit. -1 is no limit. 0 means next malloc call will return NULL.

 * @param limit 
 * @returns 
 */
    public setLimit(limit: number) {
        return this.lib.asphodel_mem_test_set_limit(limit)
    }

    /**
returns the current malloc limit
    
     * @returns 
     */
    public getLimit() {
        return this.lib.asphodel_mem_test_get_limit()
    }
}

/**
Create a stream decoder for the supplied stream and channels. The bit offset is the number of bits from the
beginning of the stream packet to the first bit of the stream. The stream decoder is returned via the decoder
parameter. The decoder can be freed via its free_decoder function.
 * @param lib 
 * @param stream_and_channels 
 * @param stream_bit_offset 
 * @returns 
 */
export function createStreamDecoder(lib: any, stream_and_channels: StreamAndChannelsWrapper, stream_bit_offset: number) {
    let dec = ref.alloc(StreamDecoderPtr);
    checkForError(lib,lib.asphodel_create_stream_decoder(stream_and_channels.inner, stream_bit_offset, dec));
    return new StreamDecoderWrapper(lib, dec.deref())
}
/**
Create a channel decoder for the supplied channel. The bit offset is the number of bits from the beginning of the
stream data to the first bit of the channel. The channel decoder is returned via the decoder parameter. The decoder
can be freed via its free_decoder function.
 * @param lib 
 * @param channel_info 
 * @param channel_bit_offset 
 * @returns 
 */
export function createChannelDecoder(lib: any, channel_info: ChannelInfoWrapper, channel_bit_offset: number) {
    let ptr = ref.alloc(ChannelDecoderPtr);
    checkForError(lib,lib.asphodel_create_channel_decoder(channel_info.inner, channel_bit_offset, ptr));
    return new ChannelDecoderWrapper(lib, ptr.deref());
}

/**
Create a device decoder for the supplied streams and channels. The filler bits are the number of bits from the
beginning of the stream packet to the first bit of the id. The device decoder is returned via the decoder parameter.
The decoder can be freed via its free_decoder function.
 * @param lib 
 * @param stream_and_channels 
 * @param filler_bits 
 * @param id_bits 
 * @returns 
 */
export function createDeviceDecoder(lib: any, stream_and_channels: StreamAndChannelsWrapper[], filler_bits: number, id_bits: number) {
    let cib = Buffer.alloc(StreamAndChannels.size * stream_and_channels.length);
    stream_and_channels.forEach((item, i) => {
        let buv: ref.Pointer<any> = item.inner;
        if (ffi.types.size_t.size == 4) {
            if (os.endianness() == "BE") {
                cib.set(buv, i * StreamAndChannels.size)
            } else {
                cib.set(buv, i * StreamAndChannels.size)
            }
        } else {
            if (os.endianness() == "BE") {
                cib.set(buv, i * StreamAndChannels.size)
            } else {
                cib.set(buv, i * StreamAndChannels.size)
            }
        }
    })
    
    let dec = ref.alloc(DeviceDecoderPtr);
    checkForError(lib,lib.asphodel_create_device_decoder(cib, stream_and_channels.length, filler_bits, id_bits, dec));
    return new DeviceDecoderWrapper(lib, dec.deref())
}

/**
Calculate reasonable packet count, transfer count and timeout. The info_array should contain the list of streams
that will be streamed from all at once (channel information will be ignored). Response time (in seconds) determines
how many packets should be bundled together for processing (i.e. the streaming callback will trigger with an average
period equal to the response time). The buffer time (in seconds) determines how many transfers should be active to
be able to hold enough data (i.e. if processing stalls there will be enough transfers running to hold buffer_time
seconds worth of data). The desired timeout should be passed to the function. The timeout will be increased, if
necessary, to twice the fastest packet interval (to prevent timeouts under normal circumstances).
NOTE: this function is too simplistic if not all streams in info_array will be used at the same time. In such a case
the streaming counts should be calculated some other way.
 
 * @param lib 
 * @param stream_and_channels 
 * @param response_time 
 * @param buffer_time 
 * @returns 
 */
export function getStreamingCounts(
    lib: any,
    stream_and_channels: StreamAndChannelsWrapper[], 
    response_time: number,
    buffer_time: number,

) {
    let cib = Buffer.alloc(StreamAndChannels.size * stream_and_channels.length);
    stream_and_channels.forEach((item, i) => {
        let buv: ref.Pointer<any> = item.inner;
        if (ffi.types.size_t.size == 4) {
            if (os.endianness() == "BE") {
                cib.set(buv, i * StreamAndChannels.size)
            } else {
                cib.set(buv, i * StreamAndChannels.size)
            }
        } else {
            if (os.endianness() == "BE") {
                cib.set(buv, i * StreamAndChannels.size)
            } else {
                cib.set(buv, i * StreamAndChannels.size)
            }
        }
    })
    let packet_count = ref.alloc("int")
    let tranfer_count = ref.alloc("uint32")
    let timeout = ref.alloc("uint32");
    checkForError(lib, lib.asphodel_get_streaming_counts(cib, cib.length, response_time, buffer_time, packet_count,tranfer_count, timeout))
    return {
        packet_count: packet_count.deref(),
        tranfer_count: tranfer_count.deref(),
        timeout: timeout.deref()
    }
}

class USB {
    lib: any
    /** initialize the USB portion of the library. MUST be called before asphodel_usb_find_devices()**/
    constructor(lib: any) {
        this.lib = lib;
        checkForError(this.lib, (this.lib.asphodel_usb_init()))
    }

    /** close down the USB portion of the library. asphodel_usb_init() can be called afterwards, if needed later.
     */
    public deinit() {
        this.lib.asphodel_usb_deinit();
    }


    /** returns true if the library has been build with USB device support (-DASPHODEL_USB_DEVICE), and false otherwise.
     */
    public static supported(lib:any): boolean {
        if (lib.asphodel_usb_devices_supported() == 0) {
            return false;
        }
        return true
    }

    /** Poll all USB devices at once. Implementation note: each USB device's poll_device() will poll all devices. This
    function is provided for code readability when polling multiple devices. */

    public poll(milliseconds: number) {
        checkForError(this.lib, (this.lib.asphodel_usb_poll_devices(milliseconds)))
    }

    /** Return the version string for the running version of the usb backend (libusb-1.0 in current implementations)
     */
    public backendVersion() {
        return this.lib.asphodel_usb_get_backend_version()
    }

    /** Find any Asphodel devices attached to the system via USB. The device_list parameter should be an array of
    AsphodelDevice_t pointers, with the array size pointed to by list_size. The array will be filled with pointers
    to AsphodelDevice_t structs, up to the array length. The total number of found USB devices will be written into
    the address pointed to by list_size. ALL returned devices must be freed (either immediately or at a later point)
    by the calling code by calling the AsphodelDevice_t free_device function pointer.
    */
    public async findDevices() {
        let lenPtr = ref.alloc("int", 0);
        
        checkForError(this.lib, this.lib.asphodel_usb_find_devices(ref.NULL, lenPtr))
        
        let list = Buffer.alloc(lenPtr.deref() * DevicePtr.size)
        checkForError(this.lib, this.lib.asphodel_usb_find_devices(list as ref.Pointer<unknown>, lenPtr))


        let devices: DeviceWrapper[] = [];

        for(let i = 0; i < lenPtr.deref(); i++) {
            let b = ref.alloc(ref.refType(Device));
            if(ffi.types.size_t.size == 4) {
                if(os.endianness() == "BE") {
                    b.writeUInt32BE(list.readUInt32BE(i * 4))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                } else {
                    b.writeUInt32LE(list.readUInt32LE(i * 4))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                }
            } else {
                if(os.endianness() == "BE") {
                    b.writeBigUInt64BE(list.readBigUInt64BE(i * 8))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                } else {
                    b.writeBigUInt64LE(list.readBigUInt64LE(i * 8))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                }
            }
        }
        return devices;
    }

}


class TCP {
    lib: any
    constructor(lib: any) {
        this.lib = lib
        this.lib.asphodel_tcp_init();
    }

    public deinit() {
        this.lib.asphodel_tcp_deinit();
    }

    public TCPDevicesSupported() {
        return this.lib.asphodel_tcp_devices_supported() == 1? true: false
    }

    public async findDevices() {
        let lenPtr = ref.alloc("int", 0);
        checkForError(this.lib, this.lib.asphodel_tcp_find_devices(ref.NULL, lenPtr))
        
        let list = Buffer.alloc(lenPtr.deref() * DevicePtr.size)
        checkForError(this.lib, this.lib.asphodel_tcp_find_devices(list as ref.Pointer<ref.Pointer<any>>, lenPtr))

        let devices: DeviceWrapper[] = [];

        for(let i = 0; i < lenPtr.deref(); i++) {
            let b = ref.alloc(ref.refType(Device));
            if(ffi.types.size_t.size == 4) {
                if(os.endianness() == "BE") {
                    b.writeUInt32BE(list.readUInt32BE(i * 4))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                } else {
                    b.writeUInt32LE(list.readUInt32LE(i * 4))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                }
            } else {
                if(os.endianness() == "BE") {
                    b.writeBigUInt64BE(list.readBigUInt64BE(i * 8))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                } else {
                    b.writeBigUInt64LE(list.readBigUInt64LE(i * 8))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                }
            }
        }
        return devices;
    }

    public async findDevicesFilter(flags: number) {
        let lenPtr = ref.alloc("int", 0);
        checkForError(this.lib, this.lib.asphodel_tcp_find_devices_filter(ref.NULL, lenPtr, flags))
        
        let list = Buffer.alloc(lenPtr.deref() * DevicePtr.size)
        checkForError(this.lib, this.lib.asphodel_tcp_find_devices_filter(list as ref.Pointer<ref.Pointer<any>>, lenPtr, flags))

        let devices: DeviceWrapper[] = [];

        for(let i = 0; i < lenPtr.deref(); i++) {
            let b = ref.alloc(ref.refType(Device));
            if(ffi.types.size_t.size == 4) {
                if(os.endianness() == "BE") {
                    b.writeUInt32BE(list.readUInt32BE(i * 4))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                } else {
                    b.writeUInt32LE(list.readUInt32LE(i * 4))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                }
            } else {
                if(os.endianness() == "BE") {
                    b.writeBigUInt64BE(list.readBigUInt64BE(i * 8))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                } else {
                    b.writeBigUInt64LE(list.readBigUInt64LE(i * 8))
                    devices.push(new DeviceWrapper(this.lib, b.deref()))
                }
            }
        }
        return devices;
    }

    public poll(milliseconds: number) {
        checkForError(this.lib, this.lib.asphodel_tcp_poll_devices(milliseconds))
    }

    public createDevice(host: string, port: string, timeout: number, serial: string) {
        let ptr = ref.alloc(ref.refType(Device));
        checkForError(this.lib, (this.lib.asphodel_tcp_create_device(Buffer.from(host) as any, parseInt(port), timeout, Buffer.from(serial), ptr)))
        return new DeviceWrapper(this.lib, ptr.deref())
    }
}

export {
    USB, TCP
}





export function getTestLib() {

return ffi.Library("./example.so", {
    "asphodel_usb_find_devices": ["int", ["void*", ref.refType(ffi.types.size_t)]],
    "asphodel_usb_init": ["int", []],

    'asphodel_error_name': ["string", ["int32"]],  // Function with no arguments and void return type

    
    "asphodel_get_supply_count_blocking": ["int", [DevicePtr, "int*"]],

    "asphodel_get_supply_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

    "asphodel_get_supply_info_blocking": ["int", [DevicePtr, "int", SupplyInfoPtr]],

    "asphodel_check_supply_blocking": ["int", [DevicePtr, "int", "int32*", "uint8*", "int"]],


    "asphodel_get_stream_count_blocking": ["int", [DevicePtr, "int*", "uint8*", "uint8*"]],

    "asphodel_get_stream_blocking": ["int", [DevicePtr, "int", ref.refType(StreamInfoPtr)]],

    "asphodel_free_stream": ["int", [StreamInfoPtr]],

    "asphodel_get_stream_channels_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

    "asphodel_get_stream_format_blocking": ["int", [DevicePtr, "int", StreamInfoPtr]],

    "asphodel_enable_stream_blocking": ["int", [DevicePtr, "int", "int"]],

    "asphodel_warm_up_stream_blocking": ["int", [DevicePtr, "int", "int"]],

    "asphodel_get_stream_status_blocking": ["int", [DevicePtr, "int", "int*", "int*"]],

    "asphodel_get_stream_rate_info_blocking": ["int", [DevicePtr, "int", "int*", "int*", "int*", "float*", "float*"]],

    "asphodel_get_channel_count_blocking": ["int", [DevicePtr, "int*"]],

    "asphodel_get_channel_blocking": ["int", [DevicePtr, "int", ref.refType(ChannelInfoPtr)]],

    "asphodel_free_channel": ["int", [ChannelInfoPtr]],

    "asphodel_get_channel_name_blocking": ["int", [DevicePtr, "int", "uint8*", ref.refType("uint8")]],

    "asphodel_get_channel_info_blocking": ["int", [DevicePtr, "int", ChannelInfoPtr]],

    "asphodel_get_channel_coefficients_blocking": ["int", [DevicePtr, "int", "float*", "uint8*"]],

    "asphodel_get_channel_chunk_blocking": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8*"]],

    "asphodel_channel_specific_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8", "uint8*", "uint8*"]],

    "asphodel_get_channel_calibration_blocking": ["int", [DevicePtr, "int", "int*", ChannelCallibrationPtr]],
//===========================================================setting
    "asphodel_get_setting_count_blocking": ["int", [DevicePtr, "int*"]],

    "asphodel_get_setting_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

    "asphodel_get_setting_info_blocking": ["int", [DevicePtr, "int", SettingInfoPtr]],

    "asphodel_get_setting_default_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

    "asphodel_get_custom_enum_counts_blocking": ["int", [DevicePtr, "uint8*", "uint8*"]],

    "asphodel_get_custom_enum_value_name_blocking": ["int", [DevicePtr, "int", "int", "uint8*", "uint8*"]],

    "asphodel_get_setting_category_count_blocking": ["int", [DevicePtr, "int*"]],

    "asphodel_get_setting_category_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

    "asphodel_get_setting_category_settings_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

/// =============power
    "asphodel_enable_rf_power_blocking": ["int", [DevicePtr, "int"]],

    "asphodel_get_rf_power_status_blocking": ["int", [DevicePtr, "int*"]],

    "asphodel_get_rf_power_ctrl_vars_blocking": ["int", [DevicePtr, "uint8*", "uint8*"]],

    "asphodel_reset_rf_power_timeout_blocking": ["int", [DevicePtr, "uint32"]],

/// =======radio

"asphodel_stop_radio_blocking": ["int", [DevicePtr]],

"asphodel_start_radio_scan_blocking": ["int", [DevicePtr]],

"asphodel_get_raw_radio_scan_results_blocking": ["int", [DevicePtr, ArrayType("uint32"), ref.refType(ffi.types.size_t)]],

"asphodel_get_radio_scan_results_blocking": ["int", [DevicePtr, "uint32*", ref.refType(ffi.types.size_t)]],

"asphodel_free_radio_scan_results": ["int", ["uint32*"]],

"asphodel_get_raw_radio_extra_scan_results_blocking": ["int", [DevicePtr, ExtraScanResultPtr, ref.refType(ffi.types.size_t)]],

"asphodel_get_radio_extra_scan_results_blocking": ["int", [DevicePtr, ExtraScanResultPtr, ref.refType(ffi.types.size_t)]],

"asphodel_free_radio_extra_scan_results": ["int", [ExtraScanResultPtr]],


"asphodel_get_radio_scan_power_blocking": ["int", [DevicePtr, "uint32*", "uint8*", ffi.types.size_t]],

"asphodel_connect_radio_blocking": ["int", [DevicePtr, "uint32"]],


"asphodel_get_radio_status_blocking": ["int", [DevicePtr, "int*", "uint32*", "uint8*", "int*"]],

"asphodel_get_radio_ctrl_vars_blocking": ["int", [DevicePtr, "uint8*", "uint8*"]],

"asphodel_get_radio_default_serial_blocking": ["int", [DevicePtr, "uint32*"]],

"asphodel_start_radio_scan_boot_blocking": ["int", [DevicePtr]],

"asphodel_connect_radio_boot_blocking": ["int", [DevicePtr, "uint32"]],

"asphodel_stop_remote_blocking": ["int", [DevicePtr]],

"asphodel_restart_remote_blocking": ["int", [DevicePtr]],

"asphodel_get_remote_status_blocking": ["int", [DevicePtr, "int*", "uint32*", "uint8*"]],



"asphodel_restart_remote_app_blocking": ["int", [DevicePtr]],


"asphodel_restart_remote_boot_blocking": ["int", [DevicePtr]],


// asphodel_low_level.h
"asphodel_get_gpio_port_count_blocking": ["int", [DevicePtr, "int*"]],

"asphodel_get_gpio_port_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

"asphodel_get_gpio_port_info_blocking": ["int", [DevicePtr, "int", GPIOPortInfoPtr]],

"asphodel_get_gpio_port_values_blocking": ["int", [DevicePtr, "int", "uint32*"]],

"asphodel_set_gpio_port_modes_blocking": ["int", [DevicePtr, "int", "uint8", "uint32"]],

"asphodel_disable_gpio_overrides_blocking": ["int", [DevicePtr]],

"asphodel_get_bus_counts_blocking": ["int", [DevicePtr, "int*", "int*"]],

"asphodel_set_spi_cs_mode_blocking": ["int", [DevicePtr, "int", "uint8"]],

"asphodel_do_spi_transfer_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*", "uint8"]],

"asphodel_do_i2c_write_read_blocking": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8", "uint8*", "uint8"]],

"asphodel_do_i2c_write_blocking": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8"]],

"asphodel_do_i2c_read_blocking": ["int", [DevicePtr, "int", "uint8", "uint8*", "uint8"]],


"asphodel_do_radio_fixed_test_blocking": ["int", [DevicePtr, "uint16", "uint16", "uint8"]],

"asphodel_do_radio_sweep_test_blocking": ["int", [DevicePtr, "uint16", "uint16", "uint16", "uint16", "uint8"]],

"asphodel_get_info_region_count_blocking": ["int", [DevicePtr, "int*"]],

"asphodel_get_info_region_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

"asphodel_get_info_region_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

"asphodel_get_stack_info_blocking": ["int", [DevicePtr, "uint32*"]],

"asphodel_echo_raw_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint8*", ref.refType(ffi.types.size_t)]],


"asphodel_echo_transaction_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint8*", ref.refType(ffi.types.size_t)]],


"asphodel_echo_params_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint8*", ref.refType(ffi.types.size_t)]],

            // asphodel_device.h
            "asphodel_get_protocol_version_blocking": ["int", [DevicePtr, "uint16*"]],
            
            "asphodel_get_protocol_version_string_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
            
            "asphodel_get_board_info_blocking": ["int", [DevicePtr, "void*", "void*", ffi.types.size_t]],
            
            "asphodel_get_user_tag_locations_blocking": ["int", [DevicePtr, "void*"]],
            
            "asphodel_get_build_info_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
            
            "asphodel_get_build_date_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
            
            "asphodel_get_commit_id_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
    
            "asphodel_get_repo_branch_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
    
            "asphodel_get_repo_name_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
    
            "asphodel_get_chip_family_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
    
            "asphodel_get_chip_model_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
    
            "asphodel_get_chip_id_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
    
            "asphodel_get_nvm_size_blocking": ["int", [DevicePtr, ref.refType(ffi.types.size_t)]],
    
            "asphodel_erase_nvm_blocking": ["int", [DevicePtr]],
    
            "asphodel_write_nvm_raw_blocking": ["int", [DevicePtr, ffi.types.size_t, "void*", ffi.types.size_t]],
    
            "asphodel_write_nvm_section_blocking": ["int", [DevicePtr, ffi.types.size_t, "void*", ffi.types.size_t]],
    
            "asphodel_read_nvm_raw_blocking": ["int", [DevicePtr, ffi.types.size_t, "void*", ref.refType(ffi.types.size_t)]],
    
            "asphodel_read_nvm_section_blocking": ["int", [DevicePtr, ffi.types.size_t, "void*", ffi.types.size_t]],
    
            "asphodel_read_user_tag_string_blocking": ["int", [DevicePtr, ffi.types.size_t, ffi.types.size_t, "void*"]],
    
            "asphodel_write_user_tag_string_blocking": ["int", [DevicePtr, ffi.types.size_t, ffi.types.size_t, "void*"]],
    
            "asphodel_get_nvm_modified_blocking": ["int", [DevicePtr, "void*"]],
    
            "asphodel_get_nvm_hash_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
    
            "asphodel_get_setting_hash_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
    
            "asphodel_flush_blocking": ["int", [DevicePtr]],
    
            "asphodel_reset_blocking": ["int", [DevicePtr]],
    
            "asphodel_get_bootloader_info_blocking": ["int", [DevicePtr, "void*", ffi.types.size_t]],
    
            "asphodel_bootloader_jump_blocking": ["int", [DevicePtr]],
    
            "asphodel_get_reset_flag_blocking": ["int", [DevicePtr, "void*"]],
    
            "asphodel_clear_reset_flag_blocking": ["int", [DevicePtr]],
    
            "asphodel_get_rgb_count_blocking": ["int", [DevicePtr, "void*"]],
    
            "asphodel_get_rgb_values_blocking": ["int", [DevicePtr, "int", "void*"]],
    
            "asphodel_set_rgb_values_blocking": ["int", [DevicePtr, "int", "void*", "int"]],
    
            "asphodel_set_rgb_values_hex_blocking": ["int", [DevicePtr, "int", "uint32", "int"]],
    
            "asphodel_get_led_count_blocking": ["int", [DevicePtr, "void*"]],
    
            "asphodel_get_led_value_blocking": ["int", [DevicePtr, "int", "void*"]],
    
            "asphodel_set_led_value_blocking": ["int", [DevicePtr, "int", "uint8", "int"]],
    
            "asphodel_set_device_mode_blocking": ["int", [DevicePtr, "uint8"]],
    
            "asphodel_get_device_mode_blocking": ["int", [DevicePtr, "uint8*"]],

            "asphodel_supports_rf_power_commands": ["int", [DevicePtr]],
            "asphodel_supports_radio_commands": ["int", [DevicePtr]],
            "asphodel_supports_remote_commands": ["int", [DevicePtr]],
            "asphodel_supports_bootloader_commands": ["int", [DevicePtr]],
    

        // asphodel_ctrl_var.h
        "asphodel_get_ctrl_var_count_blocking": ["int", [DevicePtr, "int*"]],

        "asphodel_get_ctrl_var_name_blocking": ["int", [DevicePtr, "int", "uint8*", "uint8*"]],

        "asphodel_get_ctrl_var_info_blocking": ["int", [DevicePtr, "int", CtrlVarInfoPtr]],

        "asphodel_get_ctrl_var_blocking": ["int", [DevicePtr, "int", "int32*"]],

        "asphodel_set_ctrl_var_blocking": ["int", [DevicePtr, "int", "int32"]],

        "asphodel_get_strain_bridge_count": ["int", [ChannelInfoPtr, "int*"]],
        "asphodel_get_strain_bridge_subchannel": ["int", [ChannelInfoPtr, "int", ref.refType(ffi.types.size_t)]],
        "asphodel_get_strain_bridge_values": ["int", [ChannelInfoPtr, "int", "float*"]],
        
        "asphodel_set_strain_outputs_blocking": ["int", [DevicePtr, "int", "int", "int", "int"]],
        "asphodel_check_strain_resistances": ["int", [ChannelInfoPtr, "int", "double", "double", "double", "double*", "double*", "int*"]],
        "asphodel_get_accel_self_test_limits": ["int", [ChannelInfoPtr, "float*"]],
        
        "asphodel_enable_accel_self_test_blocking": ["int", [DevicePtr, "int", "int"]],
        "asphodel_check_accel_self_test": ["int", [ChannelInfoPtr, "double*", "double*", "int*"]],

                // asphodel_bootloader.h
                "asphodel_bootloader_start_program_blocking": ["int", [DevicePtr]],
        
                "asphodel_get_bootloader_page_info_blocking": ["int", [DevicePtr, "uint32*", "uint8*"]],
        
                "asphodel_get_bootloader_block_sizes_blocking": ["int", [DevicePtr, "uint16*", "uint8*"]],
        
                "asphodel_start_bootloader_page_blocking": ["int", [DevicePtr, "uint32", "uint8*", ffi.types.size_t]],
        
                "asphodel_write_bootloader_code_block_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t]],
        
                "asphodel_write_bootloader_page_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t, "uint16*", ffi.types.size_t]],
        
                "asphodel_finish_bootloader_page_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t]],
        
                "asphodel_verify_bootloader_page_blocking": ["int", [DevicePtr, "uint8*", ffi.types.size_t]],
                
                
                "asphodel_create_channel_decoder": ["int", [ChannelInfoPtr, "uint16", ref.refType(ChannelDecoderPtr)]],
        "asphodel_create_stream_decoder": ["int", [ArrayType(StreamAndChannels), "uint16", ref.refType(StreamDecoderPtr)]],
        "asphodel_create_device_decoder": ["int", [ArrayType(StreamAndChannels), "uint8", "uint8", "uint8", ref.refType(DeviceDecoder)]],
        "asphodel_get_streaming_counts": ["int", [ArrayType(StreamAndChannels), "uint8", "double", "double", "int*", "int*", "int*"]],

})
}