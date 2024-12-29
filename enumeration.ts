import { CHANNEL_TYPE_COMPOSITE_STRAIN, CHANNEL_TYPE_FAST_STRAIN, CHANNEL_TYPE_LINEAR_ACCEL, CHANNEL_TYPE_PACKED_ACCEL, CHANNEL_TYPE_SLOW_ACCEL, CHANNEL_TYPE_SLOW_STRAIN, ChannelInfoWrapper, createDeviceDecoder, DeviceWrapper, Format, getTestLib, StreamAndChannelsWrapper, StreamInfoWrapper, TCP, UnitFormatterWrapper, USB, Version } from "./asphodel"
import { API } from "./asphodel"
import { loadAsphodelLibrary } from "./asphodel"

const lib = loadAsphodelLibrary("/home/gg/Desktop/asphodel/build/libasphodel.so")
//const lib = getTestLib();


const api = new API(lib)
const version = new Version(lib);
const tcp = new TCP(lib);
const usb = new USB(lib);
let fmt = new Format(lib)

function printBootloaderInfo(dev: DeviceWrapper) {
    if (dev.supportsBootloaderCommands()) {
        console.log("Bootloader commands supported")

        let info = dev.getBootLoaderPageInfo(255)
        console.log("Bootloader info: ", info.page_info.slice(0, info.entries_available))

        let b = dev.getBootLoaderblockSizes(255)
        console.log("Bootloader blocksizes: ", b.block_sizes.slice(0, b.available))
    }
}

function printRemoteInfo(dev: DeviceWrapper) {
    if (dev.supportsRemoteCommands()) {
        console.log("Remote commands supported")
        let st = dev.getRemoteStatus()
        console.log("Remotes status: ", st)
    }
}

function printRadioInfo(dev: DeviceWrapper) {
    if (dev.supportsRadioCommands()) {
        console.log("Radio commands supported")
        let st = dev.getRadioStatus()
        console.log("Radio status: ", st)

        let vs = dev.getRadioCtlVars(255)
        console.log("radio control variables: ", vs.vars.slice(0, vs.indexes_reported))

        let ser = dev.getRadioDefaultSerial()
        console.log("default_serial: ", ser)
    }
}

function printRfPowerInfo(dev: DeviceWrapper) {
    if (dev.supportsRfPowerCommands()) {
        console.log("Rf power commands supported")
        let status = dev.getRfpowerStatus()
        console.log("Power enabled: ", status)

        let vs = dev.getRfPowerCtlVars(255)
        console.log("Rf power control variables: ", vs.vars.slice(0, vs.indexes))
    }
}

function printLowLevelInfo(dev: DeviceWrapper) {
    let count1 = dev.getGPIOPortCount()
    console.log("GPIO port count: ", count1)

    for (let i = 0; i < count1; i++) {
        console.log("GPIO port: ", i)
        let name = dev.getGPIOPortName(i)
        console.log("name: ", name)

        let info = dev.getGPIOPortInfo(i)
        console.log("    input_pins=", info.getInputPins());
        console.log("    output_pins=", info.getOutputPins());
        console.log("    floating_pins=", info.getFloatingPins());
        console.log("    loaded_pins=", info.getLoadedPins());
        console.log("    overridden_pins=", info.getOverriddenPins());


        let values = dev.getGPIOPortValues(i)
        console.log("pin_values: ", values)
    }

    let count = dev.getInfoRegionCount()
    console.log("info region counts: ", count)

    for (let i = 0; i < count; i++) {
        console.log("info region: ", i)

        let name = dev.getInfoRegionName(i)
        console.log("name: ", name)

        let info = dev.getInfoRegion(i, 255)
        console.log("values: ", info.info_region.slice(0, info.nbytes))
    }

    let info = dev.getStackInfo()
    console.log("Stack info: ", info)
}

function printSettingCategoryInfo(dev: DeviceWrapper) {
    let count = dev.getSettingCategoryCount()
    console.log("Setting category count: ", count);

    for (let i = 0; i < count; i++) {
        console.log("setting category: ", i)
        let name = dev.getSettingCategoryName(i)
        console.log("Name: ", name)

        let res = dev.getSettingCategorySetting(i, 255)
        console.log("settings: ", res.res.slice(0, res.length))
    }
}

function printCustomEnumInfo(dev: DeviceWrapper) {
    let counts = dev.getCustomEnumCounts(255)
    console.log("Custom enum count: ", counts.length)

    for (let i = 0; i < counts.length; i++) {
        console.log("Custom enum: ", i)

        for (let j = 0; j < counts.res[i]; j++) {
            let name = dev.getCustomEnumValueName(i, j)
            console.log("Name: ", name)
        }
    }
}

function printSettingInfo(dev: DeviceWrapper) {
    let count = dev.getSettingCount()
    console.log("Settings Count: ", count)


    for (let i = 0; i < count; i++) {
        let name = dev.getSettingName(i)
        console.log("name: ", name)

        let info = dev.getSettingInfo(i)
        switch (info.getType()) {
            default:
        }

        let def = dev.getSettingDefault(i, 255)
        console.log("Default bytes: ", def)
    }
}

function printCtrlVarInf0(dev: DeviceWrapper) {
    let count = dev.getCtrlVarCount()
    console.log("Control variable count: ", count)
    for (let i = 0; i < count; i++) {
        console.log("constrol variable: ", i)
        let name = dev.getCtrlVarName(i)
        console.log("Name: ", name)

        let info = dev.getCtrlVarInfo(i)
        console.log(`unit_type=${info.getUnitType()}`)
        console.log(`minimum=${info.getMinimum()}, maximum=${info.getMaximum()}`)
        console.log(`scale=${info.getScale()} offset=${info.getOffset()}`)

        //dev.getCtrlVar(i).then((v)=>{
        //    let converted_value = v * 
        //})
    }
}

function printSupplyInfo(dev: DeviceWrapper) {
    let count = dev.getSupplyCount()
    console.log("Supply count: ", count)

    for (let i = 0; i < count; i++) {
        let name = dev.getSupplyName(i)
        console.log("name: ", name)

        let info = dev.getSupplyInfo(i)
        console.log(`unit type=${info.getUnitType()} (${api.getUnitTypeName(info.getUnitType())})`)
        console.log(`is_battery: ${info.isBattery()}, nominal: ${info.getNominal()}`)
        console.log(`scale: ${info.getScale()}, offset: ${info.getoffset()}`)

        let val = dev.checkSupply(i, 20)
        console.log(val)
    }
}

function printDecoderInfo(device: DeviceWrapper) {
    let count = device.getStreamCount()
    let streamchannel: StreamAndChannelsWrapper[] = []

    for (let i = 0; i < count.count; i++) {
        let stream = device.getStream(i)
        let channels: ChannelInfoWrapper[] = []
        if (stream.getChannelCount() == 0) {
            throw new Error(`Error: stream ${i} has 0 channels!`)
        } else {
            let channel_ndexes = stream.getChannelIndexList();
            for (let j = 0; j < stream.getChannelCount(); j++) {
                channels.push(device.getChannel(channel_ndexes[j]))
            }
        }
        streamchannel.push(new StreamAndChannelsWrapper(i, stream, channels))

    }

    let device_decoder = createDeviceDecoder(device.lib, streamchannel, count.filler_bits, count.id_bits)
    console.log(`Device decoder: streams=${device_decoder.streams()}, id_byte_offset=${device_decoder.getIdByteOffset()}`)
    let decoders = device_decoder.getDecoders();
    let ids = device_decoder.getStreamIds();
    decoders.forEach((d, i) => {
        console.log("Stream decoder: ", i);
        console.log(`id=${ids[i]}, counter_byte_offset=${d.getCounterByteOffset()}, channels=${d.getChannels()}`)

        d.getDecoders().forEach((cd, j) => {
            console.log("Channel decoder: ", j);
            console.log(`name: ${cd.getChannelName()}`);
            console.log(`channel_bit_offset=${cd.getChannelBitOffset()}, samples=${cd.getSamples()}, subchannels=${cd.getSubChannels()}`)
        })
    })
}

function printChannelSpecificinfo(dev: DeviceWrapper) {
    let cnt = dev.getChannelCount()
    console.log(`Channel specifics for ${cnt} channels`)

    for (let i = 0; i < cnt; i++) {
        let channel = dev.getChannel(i)
        if (
            channel.getChannelType() == CHANNEL_TYPE_SLOW_STRAIN ||
            channel.getChannelType() == CHANNEL_TYPE_FAST_STRAIN ||
            channel.getChannelType() == CHANNEL_TYPE_COMPOSITE_STRAIN
        ) {
            let bridge_count = channel.getStrainBridgeCount();

            for (let bridge_index = 0; bridge_index < bridge_count; bridge_index++) {
                let subchannel_index = channel.getStrainBridgeSubchannel(bridge_index) as number
                let values = channel.getStrainBridgeValues(bridge_index)

                console.log(`Bridge: ${bridge_index} (subchannel_index=${subchannel_index})`)
                console.log(`positive sense = ${values[0]}`)
                console.log(`negative sense = ${values[1]}`)
                console.log(`bridge element nominal = ${values[2]}`)
                console.log(`bridge element minimum = ${values[3]}`)
                console.log(`bridge element maximum = ${values[4]}`)
            }
        } else if (
            channel.getChannelType() == CHANNEL_TYPE_SLOW_ACCEL ||
            channel.getChannelType() == CHANNEL_TYPE_PACKED_ACCEL ||
            channel.getChannelType() == CHANNEL_TYPE_LINEAR_ACCEL
        ) {
            let limits = channel.getAccelSelfTestLimits()
            //try {
            //let formatter = new UnitFormatterWrapper(lib, 
            //    channel.getUnitType(), 
            //    channel.getMinimum(),
            //    channel.getMaximum(),
            //    channel.getResolution(),
            //    1
            //)


            //} catch(e) {
            console.log(`   X axis self test difference: min=${limits[0]}, max=${limits[1]}`)
            console.log(`   Y axis self test difference: min=${limits[2]}, max=${limits[3]}`)
            console.log(`   Z axis self test difference: min=${limits[4]}, max=${limits[5]}`)

            //}
        } else {
            console.log(`Channel ${i} No specifics`)
        }

        channel.free()
    }
}

function printChannelInfo(dev: DeviceWrapper) {

    let count = dev.getChannelCount()
    console.log("Channel count: ", count);

    for (let i = 0; i < count; i++) {
        let name = dev.getChannelName(i)
        console.log("Name: ", name)

        let info = dev.getChannelInfo(i)
        console.log(`channel type: ${info.getChannelType()} (${api.getChannelTypeName(info.getChannelType())})`)
        console.log(`unit_type: ${info.getUnitType()} (${api.getUnitTypeName(info.getUnitType())})`)
        console.log(`filler_bits: ${info.getFillerBits()}, data_bits: ${info.getDataBits()}`)
        console.log(`samples: ${info.getSamples()}, bits_per_sample: ${info.getBitsPerSample()}`)
        console.log(`minimum: ${info.getMinimum()}, maximum: ${info.getMaximum()}, resolution: ${info.getResolution()}`)
        console.log(`chunk_count: ${info.getChunkCount()}`)
        for (let j = 0; j < info.getChunkCount(); j++) {
            dev.getChannelChunk(i, j, 255).then((chunk) => {
                console.log(chunk.chunk.slice(0, chunk.chunk_size))
            })
        }

        let coefs = dev.getChannelCoefficients(i, 255)
        console.log("Coefficients: ", coefs.coeficients.slice(0, coefs.coeficients_present))

        let cb = dev.getChannelCalibration(i)
        if (cb.available == 0) {
            console.log("No calibration info")
        } else {
            console.log(`calibration base setting=${cb.callibration.getBaseSettingIndex()}, calibration resolution setting=${cb.callibration.getResolutionSettingIndex()}`)
            console.log(`calibration scale=${cb.callibration.getScale()}, calibration offset=${cb.callibration.getOffset()}`)
            console.log(`calibration minimum=${cb.callibration.getMinimum()}, calibration max=${cb.callibration.getMaximum()}`)
        }
    }
}

function printStreamInfo(dev: DeviceWrapper) {
    let count = dev.getStreamCount()
    console.log("Stream count: ", count);

    for (let i = 0; i < count.count; i++) {
        console.log("Stream: ", i);
        let stream_channels = dev.getStreamChannels(i, 255)
        console.log("channels: ", stream_channels.indexes.slice(0, stream_channels.number_of_channels))

        const fmt = dev.getStreamFormat(i)
        console.log(`filler_bits=${fmt.getFillerBits()}, counter_bits=${fmt.getCounterBits()}`)
        console.log(`rate=${fmt.getRate()}, rate_error=${fmt.getRateError()}`)
        console.log(`warm_up_delay=${fmt.getWarmUpDelay()}`)

        const info = dev.getStreamRateInfo(i)
        console.log("Stream rate info: ", info)

        const status = dev.getStreamStatus(i)
        console.log("Stream status: ", status)
    }

}

async function printLedInfo(dev: DeviceWrapper) {
    let count = dev.getRGBCount()
    console.log("RGB Count: ", count)
    for (let i = 0; i < count; i++) {
        console.log("   RGB: ",
            dev.getRGBValues(i))
    }

    let led_count = dev.getLEDCount()
    console.log("LED count: ", led_count)
    for (let i = 0; i < led_count; i++) {
        console.log(`       LED ${i} value: ${dev.getLEDValue(i)}`)
    }
}

async function printNvmInfo(dev: DeviceWrapper) {
    const nvm_size = dev.getNVMSize()
    console.log("       NVM size: ", nvm_size);
    const locations = dev.getUserTagLocations();
    console.log("       User Tag Locations: ", locations);
    const user_tag_1 = dev.readUserTagString(locations[0], locations[1])
    console.log("       User Tag 1: ", user_tag_1)
    const user_tag_2 = dev.readUserTagString(locations[2], locations[3])
    console.log("           User Tag 1: ", user_tag_2)
    const nvm = dev.readNVMSection(locations[4], locations[5])
    console.log("           General Bytes: ", nvm)
    const nvm2 = dev.readNVMSection(0, nvm_size as number)
    console.log("           NVM Data: ", nvm2)

}

function printDeviceInfo(device: DeviceWrapper) {
    console.log("   Location String: ", device.locationString());
    console.log("   Serial Number: ", device.getSerialNumber());
    console.log("   Max Incoming Param Len: ", device.getMaxIncomingParamLength())
    console.log("   Max Outgoing Param Len: ", device.getMaxOutgoingParamLength())
    console.log("   Stream Packet Len: ", device.getStreamPacketLength())
    console.log("   Protocal Version: ", device.getProtocalVersionString())
    console.log("   Board info: ", device.getBoardInfo())
    console.log("   Build info: ", device.getBuildInfo())
    console.log("   Build date: ", device.getBuildDate())
    console.log("   Chip Family: ", device.getChipFamily())
    console.log("   Chip Model: ", device.getChipModel())
    console.log("   Chip ID: ", device.getChipID())
    console.log("   Bootloader Info: ", device.getBootloaderInfo())
    printNvmInfo(device);
    printLedInfo(device)
    printStreamInfo(device)
    printChannelInfo(device)
    printChannelSpecificinfo(device)
    printDecoderInfo(device)
    printSupplyInfo(device)
    printCtrlVarInf0(device)
    printSettingInfo(device)
    printCustomEnumInfo(device)
    printSettingCategoryInfo(device)
    printSettingInfo(device)
    printLowLevelInfo(device)
    printRfPowerInfo(device)
    printRadioInfo(device)
    printRemoteInfo(device)
    printBootloaderInfo(device)
}


function printRemoteDeviceInfo(dev: DeviceWrapper, serial: number) {
    let remote = dev.getRemoteDevice()
    remote.open()
    dev.connectRadio(serial)
    remote.waitForConnect(1000);
    printDeviceInfo(remote)
    dev.stopRadio()
    remote.close()
    remote.free()
}


async function main() {
    console.log("Library protocol Version: ", version.protocolVersionString())
    console.log("Library Build Info: ", version.buildInfo());
    console.log("Library Build Date: ", version.buildDate());
    console.log("Library USB Backend Version: ", usb.backendVersion())

    const usb_devices = usb.findDevices()
    const tcp_devices = tcp.findDevices()

    const devices = usb_devices.concat(tcp_devices);

    console.log(`Found ${devices.length} devices!`)

    devices.forEach((device) => {
        device.open()
        printDeviceInfo(device)

        if(device.supportsRadioCommands()) {
            console.log("scanning fo remotes devices")
            device.startRadioScan()
            setTimeout(()=>{
                device.stopRadio()
                let serials = device.getRadioScanResults(255)

                    let sorted = serials.sort();
                    console.log("Radio Scan results: ", sorted)
                    sorted.forEach((serial)=>{
                        printRemoteDeviceInfo(device, serial)
                    })
            }, 200)
        }
    })

}

main()