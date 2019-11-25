var hf = require("../helper_functions/functions.js");

class Instrument {
  constructor(name = "Instrument", ipc) {
    this.ipc = ipc;
    this.ipc.config.id = name; // name of the server
    this.ipc.config.retry = 1500;
    this.ipc.config.silent = true;
    this.server = null; //reference to the socket  - initialized
    this.current_message = []; //array that holds charachters of command being transmitted
    this.array_of_valid_commands = ["S\n"]; //valid command array - simulating instrument with only one command
    this.posible_states = ["stable", "overload", "underload", "busy"]; //Instrument states
    this.posible_units = ["kg", "g", "mg", "t"]; //possible units for random generation of Instrument states
    this.response = null; //response that is logged when valid command arrive
    this.state_interval_id = null; //simulating state of instrument with an interval
    this.state_change_interval = 5000; //every 5 sec state of the instrument chages
    this.timeout_checker = false; // we wait for the next charachter maximum 6 sec - if not then timeout. "\n" determines the end of the transmisson
    this.message_timeout = 6000; //6sec - if no message comes in 6 seconds then reached the timeout
  }
  start() {
    //simulate first state
    this.stateSimulation();
    //this.sendLogMessage(`${this.ipc.config.id} online`);
    this.initilizeEventListeners();
    //start listening for connections
    this.server = this.ipc.server;
    this.server.start();
    //start simulating states every x seconds
    this.state_interval_id = setInterval(
      () => this.stateSimulation(),
      this.state_change_interval
    );
  }
  initilizeEventListeners() {
    this.ipc.serve(() => {
      this.sendLogMessage("Listening...");
      this.server.on("message", (data, socket) =>
        this.messageArrived(data, socket)
      );
      this.server.on("socket.disconnected", () => {
        this.sendLogMessage("Device driver has disconnected!");
      });
    });
  }

  messageArrived(data, socket) {
    if (data === "\n") {
      this.current_message.push(data);
      this.printRecievedInHex(this.current_message);
      this.checkValidityOfMessage(socket, this.current_message);
      this.timeout_checker = null;
    } else {
      this.current_message.push(data);
      this.printRecievedInHex(this.current_message);
      this.timeout_checker = { socket, time: Date.now() };
    }
  }
  //hex representation od recieved chars
  printRecievedInHex(message) {
    let array_of_hex = message.map(item => "'" + hf.AsciiToHex(item) + "'");
    let message_to_print = message
      .map(item => (item === "\n" ? "\\n" : item))
      .join("");
    this.sendLogMessage(
      "Received: [" + array_of_hex + "] is " + '"' + message_to_print + '"'
    );
  }

  checkValidityOfMessage(socket = null, message) {
    if (socket === null || message === undefined) {
      return;
    }
    let original_message_string = message.join("");
    switch (original_message_string) {
      case "S\n": {
        this.sendLogMessage("Command recognized");
        this.sendLogMessage(this.response, "\nListening.");
        this.current_message = [];
        this.server.emit(socket, "message");
        break;
      }
      default: {
        this.sendLogMessage(
          "\nERROR:'" +
            message.map(item => (item === "\n" ? "\\n" : item)).join("") +
            "' is not a valid command\n"
        );
        this.sendLogMessage("Listening...");
        this.current_message = [];
        this.server.emit(socket, "message");
      }
    }
  }

  //This is where i simulate some possible states instrument could be in
  //4 states : "stable", "overload", "underload", "busy"
  //for each stae i prepare a response and save it to this.response
  //I want to have more stable states 70% rest of the states 30% - 10%each
  stateSimulation() {
    let state = this.getRandomStateOffApp();
    this.checkTimeout();

    switch (state) {
      //stable
      case this.posible_states[0]: {
        this.response =
          "S S " +
          hf.randomNumber(0, 10e6 - 1) +
          "." +
          hf.randomNumber(0, 9) +
          "" +
          hf.randomNumber(0, 9) +
          " " +
          this.posible_units[hf.randomNumber(0, this.posible_units.length - 1)];
        break;
      }
      //overload
      case this.posible_states[1]: {
        this.response = "S +";
        break;
      }
      //underload
      case this.posible_states[2]: {
        this.response = "S -";
        break;
      }
      //busy
      case this.posible_states[3]: {
        this.response = "S I";
        break;
      }
      default: {
        this.response = "ERROR";
      }
    }
    //console.log(this.response);
  }

  getRandomStateOffApp() {
    let i = null;
    //i - index for selectin command from an array of available commands
    //i=0 - Instrument state that returns a weight 70% probability
    //i=1 - Instrument state that returns overload 10% probability
    //i=2 - Instrument state that returns underload 10% probability
    //i=3 - Instrument state that returns busy 10% probability
    switch (hf.randomNumber(0, 9)) {
      case 1: {
        i = 1;
        break;
      }
      case 2: {
        i = 2;
        break;
      }
      case 3: {
        i = 3;
        break;
      }
      default: {
        i = 0;
      }
    }
    return this.posible_states[i];
  }

  checkTimeout() {
    if (this.timeout_checker !== null) {
      if (Date.now() - this.timeout_checker.time > this.message_timeout) {
        this.current_message = [];
        this.server.emit(this.timeout_checker.socket, "message");
        this.sendLogMessage("Timeout detected - commands must end with \\n");
        this.timeout_checker = null;
      }
    }
  }

  sendLogMessage() {
    console.log(...arguments);
  }
}

module.exports = Instrument;
