var express = require('express');
var app = express();

// Set up the server
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

http.listen(port, ip_address, function(){
  console.log( "Listening on " + ip_address + ", port " + port );
});

console.log('are we here yet');
// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('move',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("new move");
        // Send it  to all other clients
        socket.broadcast.emit('move', data);

        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");
      }
    );

    socket.on('reset',
      function() {
        // Data comes in as whatever was sent, including objects
        console.log("new resettt");
        // Send it  to all other clients
        socket.broadcast.emit('reset');

        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");
      }
    );

    socket.on('gameover',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("new game over duddee");
        // Send it  to all other clients
        socket.broadcast.emit('gameover',data);

        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");
      }
    );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);
