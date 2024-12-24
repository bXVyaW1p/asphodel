import { loadAsphodelLibrary, USB } from "./asphodel";


// use your own path here
const lib = loadAsphodelLibrary("/home/gg/Desktop/asphodel/build/libasphodel.so")
let usb = new USB(lib);
let devices = usb.findDevices(5);

devices.forEach((device) => {
    device.open();
})

devices.forEach((device)=>{
    device.close();
})

usb.deinit()