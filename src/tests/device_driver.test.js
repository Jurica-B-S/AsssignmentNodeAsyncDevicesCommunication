const ipc = require("node-ipc");

const DeviceDriver = require("../classes/device_driver_class");

const device = new DeviceDriver("DeviceDriver", ipc);

test("Initialization of DeviceDriver", () => {
  expect(device.ipc).toBe(ipc);
  expect(device.ipc.config.id).toEqual("DeviceDriver");
  expect(device.ipc.config.retry).toEqual(1500);
  expect(device.ipc.config.silent).toEqual(true);
  expect(device.client).toEqual(null);
  expect(device.interval).toEqual(1000);
  expect(device.interval_id).toEqual(null);
  expect(device.simulation_interval_id).toEqual(null);
  expect(device.transmission_line_free).toEqual(true);
});
