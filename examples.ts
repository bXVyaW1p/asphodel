import { loadAsphodelLibrary, TCP, USB } from "./asphodel";

const libUsbPath =     //"/Users/carmelofiorello/Haptica/LibUsb/Upwork/asphodel/asphodel/builds/osx/arm64/libasphodel.dylib"
  "C:\\Users\\Carmelo\\Desktop\\asphodel\\asphodel\\builds\\windows\\x64\\Asphodel64.dll";

const main = async () => {

  process.env.PATH = `${process.env.PATH};C:\\Users\\Carmelo\\Desktop\\asphodel\\asphodel\\builds\\windows\\x64`;
  // use your own path here
  const lib = loadAsphodelLibrary(
    libUsbPath
  );
  console.log("Library loaded");
  let usb = new USB(lib);
  let devices = usb.findDevices();

  console.log("Found USB devices: ", devices.length);

  for (const device of devices) {
    device.open();
    const deviceInfo = device.getBoardInfo();
    console.log("Device info: ", deviceInfo);
    device.setRGBValues(0, { r: 0, g: 255, b: 0 }, true);
    // print all channels

    const all = device.getStreamCount();

    console.log("Channels all: ", all);
  }

  devices.forEach((device) => {
    device.close();
    device.free();
  });

  usb.deinit();

  let tcp = new TCP(lib);
  const tcpDevices = tcp.findDevices();
  console.log("Found TCP devices: ", tcpDevices.length);

  tcpDevices.forEach((d) => {
    d.open();
  });
  tcpDevices.forEach((d) => {
    d.close();
    d.free();
  });

};

main();
