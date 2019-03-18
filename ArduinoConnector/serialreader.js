const SerialPort = require("serialport");

const serialPort = new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200,
    parser: new SerialPort.parsers.Readline("\n")
});

serialPort.on('open',function(){
    
    serialPort.on('data', function(data){
        //We need to EMIT on socket.io
        //and the UI can catch what is happening
        //with the board
        //TIP: Check for negatives... some time the sonar doesn't work good.
        console.log(data.toString());
    });
});