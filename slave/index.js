var app = require('express')();
var http = require('http').Server(app);
var ioClient = require('socket.io-client')("http://10.43.53.181:3000");
var msgArray = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

ioClient.on('splitMsg', function(msg){
  msgArray.push(msg);
  console.log(msg);
  if(msgArray.length == 2) {
    console.log(msgArray[0][0].index + " \t\t| " + msgArray[1][0].index)
    console.log(msgArray[0][0].message + " \t| " + msgArray[1][0].message)
  }
});

ioClient.on('sendMsg', function(msg){
  ioClient.emit('mergeMsg', msgArray.pop());
});

ioClient.emit('message', "Hola Cassandra. Soy Miguel. Ppepnio");
