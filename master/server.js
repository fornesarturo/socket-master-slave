const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

global.socketArray = []

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'))


io.on('connect', function(socket){

	socket.on('message', function(msg){
		console.log('A user connected: ' + socket['id']);
		console.log(msg);
		socketArray.push(socket['id']);
		console.log(socketArray.length+" length")
		io.emit('connectedUsers', socketArray.length);

	})

	socket.on('sendSplittedMessage', function(messageArray){

		var array = messageArray;
		var j = 0;
		for(var i = 0; i<socketArray.length; i++){
			io.to(socketArray[i]).emit('deleteArray', "Delete all, please");
			console.log("entre "+i)
			sendMessage(array, j, socketArray[i]);
			sendMessage(array, j+1, socketArray[i]);
			j++;
		}
	});

	socket.on('recoverMessage', function(msg){
		for(var i = 0; i<socketArray.length; i++){
			io.to(socketArray[i]).emit('sendMsg', msg)
		}
	});

	socket.on('mergeMsg', function(msg){
		if(msg!=undefined && msg!= null){
			io.emit('mergeResults', msg);
		}
	})

	socket.on('disconnect', function(){
		let socketIndex = socketArray.indexOf(socket['id']);
		console.log(socketIndex)
		if(socketIndex){
			console.log('User disconnected DIFERENCIADOOOO');
			let socketIndex = socketArray.indexOf(socket['id']);
			socketArray.splice(socketIndex);
			io.emit('disconnectedUser', socketArray.length);
		}
	});
});


function sendMessage(array, index, socketId){
	var message = {message: array[index%3], index: index%3}
	console.log(message + " enviando")
	io.to(socketId).emit('splitMsg', message)
}

http.listen(3006, function(){
	console.log('listening on *:3006');
	io.emit('refresh', "Location refresh");
});
