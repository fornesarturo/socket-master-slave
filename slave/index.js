var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ioClient = require('socket.io-client')("http://10.43.92.32:3000");
var msgArray = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

ioClient.on('message', function(msg){
  console.log(msg);
  io.to(serverID).emit('message', "ppepino");
  //msgArray.push(msg)
});

ioClient.emit('message', "hola soy gera");

http.listen(3000, function(){

});
