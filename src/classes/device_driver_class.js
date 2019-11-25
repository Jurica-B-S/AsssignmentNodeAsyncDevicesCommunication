const hp = require("../helper_functions/functions");

class DeviceDriver {
  constructor(name = "DeviceDriver", ipc, connecting_to = "Instrument") {
    this.ipc = ipc; //see ipc module
    this.ipc.config.id = name; //name of the client
    this.ipc.config.retry = 1500; //time in ms - retrying connection to server
    this.ipc.config.silent = true; // no default logging
    this.connecting_to = connecting_to; //name of a device to
    this.client = null; //helper varibale to store a conncetion reference after connecting to Instrument
    this.interval = 1000; // using JS generators to send chars of a command every one second - simulating async comm
    this.interval_id = null; // saving id so i can clear the interval
    this.simulation_interval = 1000; //simulating sending different commands
    this.simulation_interval_id = null; // saving id so i can clear the interval
    this.transmission_line_free = true; //i dont want to send a new command before last command got delivered
    //- this is the state of the tranmsission line
  }
  start() {
    //this.sendLogMessage(`${this.ipc.config.id} is online`);
    this.connectAndInit();
    //starting the simulation of sending commands
    this.simulation_interval_id = setInterval(
      () => this.deviceDriverSimulation(),
      3000
    );
  }
  connectAndInit() {
    //setting event listeners
    this.ipc.connectTo(this.connecting_to, () => {
      this.ipc.of[this.connecting_to].on("connect", () => {
        //setting the reference of the connection to the client variable
        this.client = this.ipc.of[this.connecting_to];
        this.sendLogMessage("Connected to instrument");
      });
      this.ipc.of[this.connecting_to].on("disconnect", () => {
        clearInterval(this.simulation_interval_id);
        this.sendLogMessage("disconnected from Instrument");
      });
      this.ipc.of[this.connecting_to].on("message", () => {
        this.transmission_line_free = true;
        this.sendLogMessage("Transmission finished");
      });
    });
  }
  sendCommand(event_name, commandString) {
    //sending command - char by char - transmission line free status changed to false
    this.transmission_line_free = false;
    this.sendLogMessage(
      "Sending command: Send stable weight value",
      '\nSending: "' +
        commandString
          .split("")
          .map(x => (x === "\n" ? "\\n" : x))
          .join("") +
        '"'
    );
    //simulate async command generation using JS generator
    let generator = this.generatorOfCommand(commandString);
    let generator_object = null;
    this.interval_id = setInterval(() => {
      generator_object = generator.next();
      if (generator_object.done === false) {
        this.client.emit(event_name, generator_object.value);
      } else {
        this.client.emit(event_name, generator_object.value);
        clearInterval(this.interval_id);
      }
    }, this.interval);
  }
  //sending each charachter of the comand one by one until
  //there is a "\n" charachter or there is an end of the string
  //here is where the simulation of async communication happens
  *generatorOfCommand(commandString) {
    let i = 0;
    while (commandString[i] !== "\n" && i < commandString.length - 1) {
      yield commandString[i];
      i++;
    }
    return commandString[i];
  }
  //sending random commands - 4 commands
  //1 defined in Instrument - "S\n"
  //3 others are not defined - error response from the Instrument
  deviceDriverSimulation() {
    if (this.transmission_line_free) {
      let commands = ["S\n", "Sopo\n", "Sava", "BlaB\n"];
      let command = commands[hp.randomNumber(0, commands.length - 1)];
      this.sendCommand("message", command);
    } else {
      this.sendLogMessage("...");
    }
  }
  sendLogMessage() {
    console.log(...arguments);
  }
}

module.exports = DeviceDriver;
