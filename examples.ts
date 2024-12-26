import { loadAsphodelLibrary, USB } from "./asphodel";


// use your own path here
const lib = loadAsphodelLibrary("/home/gg/Desktop/asphodel/build/libasphodel.so")
let usb = new USB(lib);
usb.findDevices(5).then((devices)=>{
    devices.forEach((device) => {
        device.open();
    })
    
    devices.forEach((device)=>{
        device.close();
    })
})

usb.deinit()