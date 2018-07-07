
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

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
