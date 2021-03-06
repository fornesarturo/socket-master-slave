var app = require('express')();
var http = require('http').Server(app);
var ioClient = require('socket.io-client')("http://10.43.50.254:3006");
var msgArray = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

ioClient.on('splitMsg', function(msg){
  msgArray.push(msg);
  console.log(msg);
  if(msgArray.length == 2) {
    console.log(msgArray[0].index + " \t\t| " + msgArray[1].index)
    console.log(msgArray[0].message + " \t| " + msgArray[1].message)
  }
});

ioClient.on('sendMsg', function(msg){
  console.log("Pidiendome cosas");
  ioClient.emit('mergeMsg', msgArray.pop());
});

ioClient.on('deleteArray', function(msg){
  console.log("Dump all my stuff :(");
  msgArray = [];
})

ioClient.emit('message', "Hola Cassandra. Soy Arturo. Duraznio");
