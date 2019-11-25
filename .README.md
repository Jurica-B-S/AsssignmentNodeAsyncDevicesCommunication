# Node Async Comm - LabForward

Node assignemnt app to simulate async communication

## Getting Started

The App is built using node.js and IPC module: https://www.npmjs.com/package/node-ipc

Puspouse of the app is to simulate async communication between instrument and a device driver. Using IPC 2 classes are developed :

- device_driver_class.js
- instrument_class.js

Main idea was to have a server (Instrument) that simulates its state - every x seconds state is changed and can be in 4 different states ["stable", "overload", "underload", "busy"].
Server waits for commands and checks if the comand is valid and checks for timeout. I simulated just one valid command "S\n". Every other command will be invalid. But it is easy to add more valid commands if our instrument has some other interesting info.

If there is a timeout or device driver sent invalid command message is sent to the driver to know that it can send again - device driver property

```
 this.transmission_line_free = true; //i dont want to send a new command before last command got delivered
```

...

### Running the simulation

First run the instrument.js file in one terminal, and after that run device_driver.js in different terminal window.

It is important to be in the directory of theese two files :)

Commands to run

First window

```
node instrument.js
```

Second window

```
node device_driver.js
```

### Testing

For testing run:

```
npm run test
```

## Authors

- **Jurica Breekalo Strbic - based on LabForward specs** -

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
