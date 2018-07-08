var express = require('express');
var app = express();


var server = require('http').Server(app);

app.use(express.static('public'));

var io = require('socket.io').listen(server);

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

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

server.listen(server_port, server_ip_address, 
              function () { var host = server.address().address;
                            var port = server.address().port;
                            console.log( 'Listening at http://%s:%s', host, port );
                           });

