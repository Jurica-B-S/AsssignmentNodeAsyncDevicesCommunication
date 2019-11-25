const ipc = require("node-ipc");

const Instrument = require("./classes/instrument_class");

let i = new Instrument("Instrument", ipc);
i.start();
