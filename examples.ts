import { loadAsphodelLibrary, TCP, USB } from "./asphodel";


// use your own path here
const lib = loadAsphodelLibrary("/home/gg/Desktop/asphodel/build/libasphodel.so")
let usb = new USB(lib);
usb.findDevices(5).then((devices)=>{
    devices.forEach(async (device) => {
        device.open();
    })
    devices.forEach((device)=>{
        device.close();
        device.free()
    })
})

usb.deinit()


let tcp = new TCP(lib);
tcp.findDevices(5).then((devices)=>{
    devices.forEach((d)=>{
        d.open();
    })
    devices.forEach((d)=>{
        d.close()
        d.free()
    })
})

