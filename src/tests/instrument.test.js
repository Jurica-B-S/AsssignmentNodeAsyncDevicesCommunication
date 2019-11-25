const ipc = require("node-ipc");
const Instrument = require("../classes/instrument_class");

const instrument = new Instrument("Instrument", ipc);

beforeEach(() => {
  instrument.start();
});

describe("Initialization of Instrument", () => {
  test("Check if initialized to expected values", () => {
    expect(instrument.ipc).toBe(ipc);
    expect(instrument.ipc.config.id).toEqual("Instrument");
    expect(instrument.ipc.config.retry).toEqual(1500);
    expect(instrument.ipc.config.silent).toEqual(true);
    expect(instrument.server).toEqual(instrument.ipc.server);
    expect(instrument.current_message).toEqual([]);
    expect(instrument.array_of_valid_commands).toEqual(["S\n"]);
    expect(instrument.posible_states).toEqual([
      "stable",
      "overload",
      "underload",
      "busy"
    ]);
    expect(instrument.posible_units).toEqual(["kg", "g", "mg", "t"]);
    expect(typeof instrument.response).toEqual("string");
    expect(typeof instrument.state_interval_id).toEqual("number");
    expect(instrument.timeout_checker).toEqual(false);
    expect(instrument.message_timeout).toEqual(6000);
  });
});

describe("Check events incoming commands to Instrument", () => {
  test(`Message "S\n"`, () => {
    let outputData = "";
    let message = "";
    let storeLog = inputs => (outputData = inputs);
    instrument.sendLogMessage = jest.fn(storeLog);
    instrument.messageArrived("S", null);
    expect(outputData).toBe("Received: " + "['0x53'] is " + '"S"');
    instrument.messageArrived("\n", null);
    expect(outputData).toBe("Received: " + "['0x53','0x0a'] is " + '"S\\n"');
  });
  test(`Message "BlaB\n"`, () => {
    let outputData = "";
    instrument.current_message = [];
    let storeLog = inputs => (outputData = inputs);
    instrument.sendLogMessage = jest.fn(storeLog);
    instrument.messageArrived("B", null);
    expect(outputData).toBe("Received: " + "['0x42'] is " + '"B"');
    instrument.messageArrived("l", null);
    expect(outputData).toBe("Received: " + "['0x42','0x6c'] is " + '"Bl"');
    instrument.messageArrived("a", null);
    expect(outputData).toBe(
      "Received: " + "['0x42','0x6c','0x61'] is " + '"Bla"'
    );
    instrument.messageArrived("B", null);
    expect(outputData).toBe(
      "Received: " + "['0x42','0x6c','0x61','0x42'] is " + '"BlaB"'
    );
    instrument.messageArrived("\n", null);
    expect(outputData).toBe(
      "Received: " + "['0x42','0x6c','0x61','0x42','0x0a'] is " + '"BlaB\\n"'
    );
  });
});

describe("Check incoming commands writing to Screen", () => {});
