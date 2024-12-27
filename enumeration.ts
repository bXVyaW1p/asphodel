import { CHANNEL_TYPE_COMPOSITE_STRAIN, CHANNEL_TYPE_FAST_STRAIN, CHANNEL_TYPE_LINEAR_ACCEL, CHANNEL_TYPE_PACKED_ACCEL, CHANNEL_TYPE_SLOW_ACCEL, CHANNEL_TYPE_SLOW_STRAIN, ChannelInfoWrapper, createDeviceDecoder, DeviceWrapper, Format, StreamAndChannelsWrapper, StreamInfoWrapper, TCP, UnitFormatterWrapper, USB, Version } from "./asphodel"
import { API } from "./asphodel"
import { loadAsphodelLibrary } from "./asphodel"

const lib = loadAsphodelLibrary("/home/gg/Desktop/asphodel/build/libasphodel.so")

const api = new API(lib)
const version = new Version(lib);
const tcp = new TCP(lib);
const usb = new USB(lib);
let fmt = new Format(lib)

function printBootloaderInfo(dev: DeviceWrapper) {
    if(dev.supportsBootloaderCommands()) {
        console.log("Bootloader commands supported")

        dev.getBootLoaderPageInfo(255).then((info)=>{
            console.log("Bootloader info: ", info.page_info.slice(0, info.entries_available))
        })

        dev.getBootLoaderblockSizes(255).then((b)=>{
            console.log("Bootloader blocksizes: ", b.block_sizes.slice(0, b.available))
        })
    }
} 

function printRemoteInfo(dev: DeviceWrapper) {
    if(dev.supportsRemoteCommands()) {
        console.log("Remote commands supported")
        dev.getRemoteStatus().then((st)=>{
            console.log("Remotes status: ", st)
        })
    }
}

function printRadioInfo(dev: DeviceWrapper) {
    if(dev.supportsRadioCommands()) {
        console.log("Radio commands supported")
        dev.getRadioStatus().then((st)=>{
            console.log("Radio status: ", st)
        })

        dev.getRadioCtlVars(255).then((vs)=>{
            console.log("radio control variables: ", vs.vars.slice(0, vs.indexes_reported))
        })

        dev.getRadioDefaultSerial().then((ser)=>{
            console.log("default_serial: ", ser)
        })
    }
}

function printRfPowerInfo(dev: DeviceWrapper) {
    if(dev.supportsRfPowerCommands()) {
        console.log("Rf power commands supported")
        dev.getRfpowerStatus().then((status)=>{
            console.log("Power enabled: ", status)
        })

        dev.getRfPowerCtlVars(255).then((vs)=>{
            console.log("Rf power control variables: ", vs.vars.slice(0, vs.indexes))
        })
    }
}

function printLowLevelInfo(dev: DeviceWrapper) {
    dev.getGPIOPortCount().then((count)=>{
        console.log("GPIO port count: ", count)

        for(let i = 0; i < count; i++) {
            console.log("GPIO port: ", i)
            dev.getGPIOPortName(i).then((name)=>{
                console.log("name: ", name)
            })

            dev.getGPIOPortInfo(i).then((info)=>{
                console.log("    input_pins=\n", info.getInputPins());
                console.log("    output_pins=\n", info.getOutputPins());
                console.log("    floating_pins=\n", info.getFloatingPins());
                console.log("    loaded_pins=\n", info.getLoadedPins());
                console.log("    overridden_pins=\n", info.getOverriddenPins());
        
            })

            dev.getGPIOPortValues(i).then((values)=>{
                console.log("pin_values: ", values)
            })
        }
    })

    dev.getInfoRegionCount().then((count)=>{
        console.log("info region counts: ", count)

        for(let i = 0; i < count; i++) {
            console.log("info region: ", i)

            dev.getInfoRegionName(i).then((name)=>{
                console.log("name: ",name)
            })

            dev.getInfoRegion(i, 255).then((info)=>{
                console.log("values: ", info.info_region.slice(0, info.nbytes))
            })
        }
    })

    dev.getStackInfo().then((info)=>{
        console.log("Stack info: ", info)
    })
}

function printSettingCategoryInfo(dev: DeviceWrapper) {
    dev.getSettingCategoryCount().then((count)=>{
        console.log("Setting category count: ", count);

        for(let i = 0; i < count; i++) {
            console.log("setting category: ", i)
            dev.getSettingCategoryName(i).then((name)=>{
                console.log("Name: ", name)
            })

            dev.getSettingCategorySetting(i, 255).then((res)=>{
                console.log("settings: ", res.res.slice(0, res.length))
            })
        }
    })
}

function printCustomEnumInfo(dev: DeviceWrapper) {
    dev.getCustomEnumCounts(255).then((counts)=>{
        console.log("Custom enum count: ", counts.length)

        for(let i = 0; i < counts.length; i++) {
            console.log("Custom enum: ", i)

            for(let j = 0; j < counts.res[i]; j++) {
                dev.getCustomEnumValueName(i, j).then((name)=>{
                    console.log("Name: ", name)
                })
            }
        }
    })
}

function printSettingInfo(dev: DeviceWrapper) {
    dev.getSettingCount().then(async (count)=>{
        console.log("Settings Count: ", count)

        let nvmdata = await dev.getNVMSize().then(async (size)=>{
            const data = await dev.readNVMSection(0, size as number)
            return data
        })

        for(let i =0; i < count; i++) {
            dev.getSettingName(i).then((name)=>{
                console.log("name: ", name)
            })

            dev.getSettingInfo(i).then((info)=>{
                switch(info.getType()){
                    default:
                }
            })

            dev.getSettingDefault(i, 255).then((def)=>{
                console.log("Default bytes: ", def)
            })
        }
    })
}

function printCtrlVarInf0(dev: DeviceWrapper) {
    dev.getCtrlVarCount().then((count)=>{
        console.log("Control variable count: ", count)
        for(let i = 0; i < count; i++) {
            console.log("constrol variable: ", i)
            dev.getCtrlVarName(i).then((name)=>{
                console.log("Name: ", name)
            })

            dev.getCtrlVarInfo(i).then((info)=>{
                console.log(`unit_type=${info.getUnitType()}`)
                console.log(`minimum=${info.getMinimum()}, maximum=${info.getMaximum()}`)
                console.log(`scale=${info.getScale()} offset=${info.getOffset()}`)
            })

            //dev.getCtrlVar(i).then((v)=>{
            //    let converted_value = v * 
            //})
        }
    })
}

function printSupplyInfo(dev: DeviceWrapper) {
    dev.getSupplyCount().then((count)=>{
        console.log("Supply count: ", count)

        for(let i = 0; i < count; i++) {
            dev.getSupplyName(i).then((name)=>{
                console.log("name: ", name)
            })

            dev.getSupplyInfo(i).then((info)=>{
                console.log(`unit type=${info.getUnitType()} (${api.getUnitTypeName(info.getUnitType())})`)
                console.log(`is_battery: ${info.isBattery()}, nominal: ${info.getNominal()}`)
                console.log(`scale: ${info.getScale()}, offset: ${info.getoffset()}`)
            })

            dev.checkSupply(i, 20).then((val)=>{
                console.log(val)
            })
        }
    })
}

function printDecoderInfo(device: DeviceWrapper) {
    device.getStreamCount().then((count)=>{
        let streamchannel: StreamAndChannelsWrapper[] = []
        for(let i = 0; i < count.count; i++) {
            device.getStream(i).then((stream)=>{
                let channels: ChannelInfoWrapper[] = []
                if(stream.getChannelCount() == 0) {
                    throw new Error(`Error: stream ${i} has 0 channels!`)
                } else {
                    let channel_ndexes = stream.getChannelIndexList();
                   for(let j =0; j < stream.getChannelCount(); j++) {
                        device.getChannel(channel_ndexes[j]).then((wr)=>{
                            channels.push(wr)
                        })
                   }                   
                }
                streamchannel.push(new StreamAndChannelsWrapper(i, stream, channels))
            })
        }
        
        let device_decoder = createDeviceDecoder(device.lib, streamchannel, count.filler_bits, count.id_bits)
        console.log(`Device decoder: streams=${device_decoder.streams()}, id_byte_offset=${device_decoder.getIdByteOffset()}`)
        let decoders = device_decoder.getDecoders();
        let ids = device_decoder.getStreamIds();
        decoders.forEach((d, i)=>{
            console.log("Stream decoder: ", i);
            console.log(`id=${ids[i]}, counter_byte_offset=${d.getCounterByteOffset()}, channels=${d.getChannels()}`)

            d.getDecoders().forEach((cd, j)=>{
                console.log("Channel decoder: ", j);
                console.log(`name: ${cd.getChannelName()}`);
                console.log(`channel_bit_offset=${cd.getChannelBitOffset()}, samples=${cd.getSamples()}, subchannels=${cd.getSubChannels()}`)
            })
        })
    })
}

function printChannelSpecificinfo(dev: DeviceWrapper) {
    dev.getChannelCount().then((cnt) => {
        console.log(`Channel specifics for ${cnt} channels`)

        for (let i = 0; i < cnt; i++) {
            dev.getChannel(i).then((channel) => {
                if (
                    channel.getChannelType() == CHANNEL_TYPE_SLOW_STRAIN ||
                    channel.getChannelType() == CHANNEL_TYPE_FAST_STRAIN ||
                    channel.getChannelType() == CHANNEL_TYPE_COMPOSITE_STRAIN
                ) {
                    let bridge_count = channel.getStrainBridgeCount();

                    for(let bridge_index = 0; bridge_index < bridge_count; bridge_index++) {
                        let subchannel_index = channel.getStrainBridgeSubchannel(bridge_index) as number
                        let values = channel.getStrainBridgeValues(bridge_index)

                        console.log(`Bridge: ${bridge_index} (subchannel_index=${subchannel_index})`)
                        console.log(`positive sense = ${values[0]}`)
                        console.log(`negative sense = ${values[1]}`)
                        console.log(`bridge element nominal = ${values[2]}`)
                        console.log(`bridge element minimum = ${values[3]}`)
                        console.log(`bridge element maximum = ${values[4]}`) 
                    }
                } else if(
                    channel.getChannelType() == CHANNEL_TYPE_SLOW_ACCEL ||
                    channel.getChannelType() == CHANNEL_TYPE_PACKED_ACCEL ||
                    channel.getChannelType() == CHANNEL_TYPE_LINEAR_ACCEL
                ){
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
            })
        }
    })
}

function printChannelInfo(dev: DeviceWrapper) {
    dev.getChannelCount().then((count) => {
        console.log("Channel count: ", count);

        for (let i = 0; i < count; i++) {
            dev.getChannelName(i).then((name) => {
                console.log("Name: ", name)
            })

            dev.getChannelInfo(i).then((info) => {
                console.log(`channel type: ${info.getChannelType()} (${api.getChannelTypeName(info.getChannelType())})`)
                console.log(`unit_type: ${info.getUnitType()} (${api.getUnitTypeName(info.getUnitType())})`)
                console.log(`filler_bits: ${info.getFillerBits()}, data_bits: ${info.getDataBits()}`)
                console.log(`samples: ${info.getSamples()}, bits_per_sample: ${info.getBitsPerSample()}`)
                console.log(`minimum: ${info.getMinimum()}, maximum: ${info.getMaximum()}, resolution: ${info.getResolution()}`)
                console.log(`chunk_count: ${info.getChunkCount()}`)
                for (let j = 0; j < info.getChunkCount(); j++) {
                    dev.getChannelChunk(i, j, 255).then((chunk) => {
                        console.log(chunk.chunk.slice(chunk.chunk_size))
                    })
                }

            })

            dev.getChannelCoefficients(i, 255).then((coefs) => {
                console.log("Coefficients: ", coefs.coeficients.slice(0, coefs.coeficients_present))
            })

            dev.getChannelCalibration(i).then((cb) => {
                if (cb.available == 0) {
                    console.log("No calibration info")
                } else {
                    console.log(`calibration base setting=${cb.callibration.getBaseSettingIndex()}, calibration resolution setting=${cb.callibration.getResolutionSettingIndex()}`)
                    console.log(`calibration scale=${cb.callibration.getScale()}, calibration offset=${cb.callibration.getOffset()}`)
                    console.log(`calibration minimum=${cb.callibration.getMinimum()}, calibration max=${cb.callibration.getMaximum()}`)
                }
            }).catch((e) => {
                if (e != "ERROR_CODE_UNIMPLEMENTED_COMMAND") {
                    throw e;
                }
            })
        }
    })
}

function printStreamInfo(dev: DeviceWrapper) {
    dev.getStreamCount().then((count) => {
        console.log("Stream count: ", count);

        for (let i = 0; i < count.count; i++) {
            console.log("Stream: ", i);
            dev.getStreamChannels(i, 255).then((stream_channels) => {
                console.log("channels: ", stream_channels.indexes.slice(0, stream_channels.number_of_channels))
            })

            dev.getStreamFormat(i).then((fmt) => {
                console.log(`filler_bits=${fmt.getFillerBits()}, counter_bits=${fmt.getCounterBits()}`)
                console.log(`rate=${fmt.getRate()}, rate_error=${fmt.getRateError()}`)
                console.log(`warm_up_delay=${fmt.getWarmUpDelay()}`)
            })

            dev.getStreamRateInfo(i).then((info) => {
                console.log("Stream rate info: ", info)
            })

            dev.getStreamStatus(i).then((status) => {
                console.log("Stream status: ", status)
            })
        }
    })

}

async function printLedInfo(dev: DeviceWrapper) {
    dev.getRGBCount().then((count) => {
        console.log("RGB Count: ", count)
        for (let i = 0; i < count; i++) {
            dev.getRGBValues(i).then((values) => {
                console.log("   RGB: ", values)
            })
        }
    })

    dev.getLEDCount().then((count) => {
        console.log("LED count: ", count)
        for (let i = 0; i < count; i++) {
            dev.getLEDValue(i).then((value) => {
                console.log(`       LED ${i} value: ${value}`)
            })
        }
    })
}

async function printNvmInfo(dev: DeviceWrapper) {
    const nvm_size = await dev.getNVMSize()
    console.log("       NVM size: ", nvm_size);
    const locations = await dev.getUserTagLocations();
    console.log("       User Tag Locations: ", locations);
    const user_tag_1 = await dev.readUserTagString(locations[0], locations[1])
    console.log("       User Tag 1: ", user_tag_1)
    const user_tag_2 = await dev.readUserTagString(locations[2], locations[3])
    console.log("           User Tag 1: ", user_tag_2)
    dev.readNVMSection(locations[4], locations[5]).then((nvm) => {
        console.log("           General Bytes: ", nvm)
    })

    dev.readNVMSection(0, nvm_size as number).then((nvm) => {
        console.log("           NVM Data: ", nvm)
    })

}

async function printDeviceInfo(device: DeviceWrapper) {
    console.log("   Location String: ", device.locationString());
    console.log("   Serial Number: ", device.getSerialNumber());
    console.log("   Max Incoming Param Len: ", device.getMaxIncomingParamLength())
    console.log("   Max Outgoing Param Len: ", device.getMaxOutgoingParamLength())
    console.log("   Stream Packet Len: ", device.getStreamPacketLength())
    console.log("   Protocal Version: ", await device.getProtocalVersionString())
    console.log("   Board info: ", await device.getBoardInfo())
    console.log("   Build info: ", await device.getBuildInfo())
    console.log("   Build date: ", await device.getBuildDate())
    console.log("   Chip Family: ", await device.getChipFamily())
    console.log("   Chip Model: ", await device.getChipModel())
    console.log("   Chip ID: ", await device.getChipID())
    console.log("   Bootloader Info: ", await device.getBootloaderInfo())
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


async function printRemoteDeviceInfo(dev: DeviceWrapper, serial:number) {
    let remote = dev.getRemoteDevice()
    remote.open()
    await dev.connectRadio(serial)
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

    const usb_devices = await usb.findDevices()
    const tcp_devices = await tcp.findDevices()

    const devices = usb_devices.concat(tcp_devices);

    console.log(`Found ${devices.length} devices!`)

    devices.forEach((device) => {
        device.open()
        printDeviceInfo(device)

        if(device.supportsRadioCommands()) {
            console.log("scanning fo remotes devices")
            device.startRadioScan()

            setTimeout(async ()=>{
                await device.stopRadio()
                device.getRadioScanResults(255).then((serials)=>{
                    let sorted = serials.sort();
                    console.log("Radio Scan results: ", sorted)

                    sorted.forEach((serial)=>{
                        printRemoteDeviceInfo(device, serial)
                    })
                })
            }, 200)
        }
    })

}

main()