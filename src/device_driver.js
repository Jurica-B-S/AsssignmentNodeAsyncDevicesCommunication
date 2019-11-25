const ipc = require("node-ipc");

const DeviceDriver = require("./classes/device_driver_class");

let d = new DeviceDriver("Device_driver", ipc);
d.start();
