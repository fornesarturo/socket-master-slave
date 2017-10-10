

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ioClient = require('socket.io-client');

var socketArray = []
var message = "¡hola a todos, esclavosh!";
var receivedMsg = [];
var messageArray = sliceMessage(message);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var i = 0;

io.on('connection', function(socket){

	console.log('A user connected: ' + socket['id']);
	socketArray.push(socket['id']);

	setTimeout(function(){
		socket.emit('sendMsg', "Denme todo su dinero!");
		console.log("que pedo kchorros")
	}, 10000);

	function sendMessage(index){
		var message = {message: messageArray[index%3], index: index%3}
		console.log(message + " enviando")
		socket.emit('splitMsg', message);
	}

	sendMessage(i);
	sendMessage(i+1);
	i++;

	socket.on('disconnect', function(){
		console.log('user disconnected');
		let socketIndex = socketArray.indexOf(socket['id']);
		socketArray.splice(socketIndex);
		console.log(socketArray);
		i--;
	});

	socket.on('message', function(msg){
		console.log("Received message from \'"+ socket['id'] +"\': " + msg);
	});

	socket.on('mergeMsg', function(msg){
		console.log(msg.index)
		receivedMsg[msg.index] = msg.message;
		console.log("dándome");
		if(receivedMsg[0]&&receivedMsg[1]&&receivedMsg[2]){
			console.log(receivedMsg[0]+""+receivedMsg[1]+""+receivedMsg[2])
		}else{
			socket.emit('sendMsg', "Give me more, slaves");
		}
	})

});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

function sliceMessage(message){
  var parts = [];
  var numOfLetters = message.length/3;
  var start = 0;
  for(var i=1; i<= 3; i++){
    var part = message.slice(start, numOfLetters*i);
    start+=numOfLetters;
    parts.push(part);
  }
  return parts;
}
