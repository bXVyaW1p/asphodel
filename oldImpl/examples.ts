import { loadAsphodelLibrary, TCP, USB } from "./asphodel";

const main = async () => {
  // use your own path here
  const lib = loadAsphodelLibrary(
    "/Users/carmelofiorello/Haptica/LibUsb/Upwork/asphodel/asphodel/builds/osx/arm64/libasphodel.dylib"
  );
  let usb = new USB(lib);
  let devices = await usb.findDevices(5);

  console.log("Found devices: ", devices.length);

  for (const device of devices) {
    device.open();
    const deviceInfo = await device.getBoardInfo();
    console.log("Device info: ", deviceInfo);
    await device.setRGBValues(0, { r: 0, g: 255, b: 0 }, true);
    // print all channels

    const all = await device.getStreamCount();

    console.log("Channels all: ", all);
  }

  devices.forEach((device) => {
    device.close();
    device.free();
  });

  usb.deinit();

  let tcp = new TCP(lib);
  tcp.findDevices(5).then((devices) => {
    devices.forEach((d) => {
      d.open();
    });
    devices.forEach((d) => {
      d.close();
      d.free();
    });
  });
};

main();
