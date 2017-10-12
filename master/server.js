const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ioClient = require('socket.io-client');

global.socketArray = []

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'))


io.on('connect', function(socket){
	console.log('A user connected: ' + socket['id']);
	socketArray.push(socket['id']);
	socket.emit('connectedUsers', socket['id']);
	socket.on('disconnect', function(){
		console.log('User disconnected');
		let socketIndex = socketArray.indexOf(socket['id']);
		socketArray.splice(socketIndex);
		socket.emit('disconnectedUser', socket['id']);
	});
});

io.on('sendSplittedMessage', function(messageArray){
	var array = messageArray;
	var j = 0;
	for(var i = 0; i<socketArray.length; i++){
		sendMessage(array, j, socketArray[i]);
		sendMessage(array, j+1, socketArray[i]);
		j++;
	}
});

io.on('recoverMessage', function(msg){
	for(var i = 0; i<socketArray.length; i++){
		io.to(socketArray[i]).emit('sendMsg', msg)
	}
});

function sendMessage(array, index, socketId){
	var message = {message: array[index%3], index: index%3}
	console.log(message + " enviando")
	io.to(socketId).emit('splitMsg', message)
}

http.listen(3006, function(){
	console.log('listening on *:3006');
});
