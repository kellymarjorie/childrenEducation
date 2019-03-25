const SerialPort = require("serialport");
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);
const port = process.env.PORT || 8080;
let socketClients = [];

server.listen(port, function () {
    console.log(`Server listening at port ${port}`);
});

app.use(express.static(__dirname + '/../Frontend'));

socket.on("connect", function (client) {
    console.log("New Connection!");
    socketClients.push(client);
});

const serialPort = new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200,
    parser: new SerialPort.parsers.Readline("\n")
});

//FAKE: Remove this block once arduino is connected
setInterval(function() {
    let rnd1 = parseInt(Math.random() * 400);
    let rnd2 = parseInt(Math.random() * 400);
    console.log(`Emit:${rnd1} - ${rnd2}`);
    socketClients.forEach((item) => {
        item.emit('coords', { 
            value: rnd1 + "," + rnd2 
        });
    });
}, 1000);
//*****/

serialPort.on('open',function(){
    serialPort.on('data', function(data){
        const serialData = data.toString();
        console.log(serialData);
        socketClients.forEach((item) => {
            item.emit('coords', { 
                value: serialData 
            });
        });
    });
});