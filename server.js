// Check the configuration file for more details
var config = require('./config');

// Express.js stuff
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);

// Websockets with socket.io
var io = require('socket.io')(server);

console.log("Trying to start server with config:", config.serverip + ":" + config.serverport);

// Both port and ip are needed for the OpenShift, otherwise it tries 
// to bind server on IP 0.0.0.0 (or something) and fails
server.listen(config.serverport, config.serverip, function() {
  console.log("Server running @ http://" + config.serverip + ":" + config.serverport);
});

// Allow some files to be server over HTTP
app.use(express.static('public'));

// Serve GET on http://domain/
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
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
      }
    );

    socket.on('reset',
      function() {
        // Data comes in as whatever was sent, including objects
        console.log("new resettt");
        // Send it  to all other clients
        socket.broadcast.emit('reset');
      }
    );

    socket.on('gameover',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("new game over duddee");
        // Send it  to all other clients
        socket.broadcast.emit('gameover',data);
      }
    );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);
