var express = require('express');
var app = express();
var server = require('http').Server(app);

var io = require('socket.io').listen(server);

server.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP);

io.sockets.on('connection', function (socket) {
          console.log("We have a new client: " + socket.id);
        
          socket.on('move', function(data) {
              console.log("new move");
              socket.broadcast.emit('move', data);
          });
          socket.on('reset', function() {
              console.log("new move");
              socket.broadcast.emit('reset');
          });
          socket.on('move', function(data) {
              console.log("new reset");
              socket.broadcast.emit('move', data);
          });
          socket.on('gameover', function(data) {
              console.log("new game over dude");
              socket.broadcast.emit('gameover', data);
          });
          socket.on('disconnect', function(data) {
              console.log("Client has disconnected");
          });
});
