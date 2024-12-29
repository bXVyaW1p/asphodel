import { CHANNEL_TYPE_COMPOSITE_STRAIN, CHANNEL_TYPE_FAST_STRAIN, CHANNEL_TYPE_LINEAR_ACCEL, CHANNEL_TYPE_PACKED_ACCEL, CHANNEL_TYPE_SLOW_ACCEL, CHANNEL_TYPE_SLOW_STRAIN, ChannelInfoWrapper, createDeviceDecoder, DeviceWrapper, Format, getStreamingCounts, StreamAndChannelsWrapper, StreamInfoWrapper, TCP, UnitFormatterWrapper, USB, Version } from "./asphodel"
import { API } from "./asphodel"
import { loadAsphodelLibrary } from "./asphodel"

const lib = loadAsphodelLibrary("/home/gg/Desktop/asphodel/build/libasphodel.so")

const api = new API(lib)
const version = new Version(lib);
const tcp = new TCP(lib);
let fmt = new Format(lib)
const usb = new USB(lib);

function getch() {
    return new Promise((resolve)=>{
        process.stdin.resume()
        process.stdin.once("data", (data)=>{
            process.stdin.pause()
            resolve(data)
        })
    })
}

async function createDeviceInfo(device: DeviceWrapper) {
    let serial_number = device.getSerialNumber()
    let stream_count = await device.getStreamCount()
    let scs :StreamAndChannelsWrapper[] = []
    for(let i = 0; i < stream_count.count; i++) {
        let channels: ChannelInfoWrapper[] = []
        device.getStream(i).then((stream)=>{
            let channel_indexes = stream.getChannelIndexList()
            for(let j = 0; j < stream.getChannelCount(); j++) {
                device.getChannel(channel_indexes[j]).then((ch)=>{
                    channels.push(ch);
                })
            }
            scs.push(new StreamAndChannelsWrapper(i, stream, channels))
        })
    }

    let dev_decoder = createDeviceDecoder(lib, scs, stream_count.filler_bits, stream_count.id_bits)

    dev_decoder.getDecoders().forEach((decoder, i)=>{
        decoder.setLostPacketCallback((current, last)=>{
            console.log(`Lost ${(last-current)-1} packets on ${serial_number} stream ${i}`)
        })
    })

    dev_decoder.setUnknownIdCallback((id)=>{
        console.log(`unknown device id: ${id} on ${serial_number}`, )
    })

    return {
        decoder: dev_decoder,
        info_array: scs,
        serial_number: serial_number,
        stream_count: stream_count
    }

}

async function main() {
    while(true) {
        let devices = await usb.findDevices()

        if(devices.length == 0) {
            console.log("No devices found! press enter to rescan...")
            await getch()
            usb.poll(100);
            continue
        }

        console.log(`Found ${devices.length} devices!`)

        devices.forEach(async (device)=>{
            device.open()
            createDeviceInfo(device).then(async (info)=>{
                console.log(`Enabling ${info.stream_count.count} streams `)

                let response_time = 0.1;
                let buffer_time = 0.5;
                let timeout = 1000;

                let streaming_counts = getStreamingCounts(lib, info.info_array, response_time, buffer_time, timeout)

                console.log("Transfer count: ", streaming_counts.tranfer_count)

                device.startStreamingPackets(streaming_counts.packet_count, streaming_counts.tranfer_count, streaming_counts.timeout,
                     (status, data, packet_size, packet_count)=>{
                    if(status == 0) {
                        for(let p = 0; p < packet_count; p++) {
                            info.decoder.decode(data.slice(p*packet_size))
                        }
                    } else {
                        console.log(`Bad status ${status} in streaming callback`)
                    }
                })

                for(let j = 0; j < info.stream_count.count; j++) {
                    await device.enableStream(info.info_array[j].stream_id, true)
                }
                
                console.log("press enter to restart data collection...\n")
                await getch();

                //info.info_array.forEach((item, i) =>{
                console.log(`Disabling: ${info.stream_count} streams from ${info.serial_number} `)

                for(let j = 0; j < info.stream_count.count; j++) {
                    await device.enableStream(info.info_array[j].stream_id, false)
                }                
            })
            
            device.stopStreamingPackets();
            device.poll(10);
            device.close();
            device.free()
        })
    }
}

main()
usb.deinit()