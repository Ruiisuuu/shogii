var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(server_port, function(){
  console.log('listening on *:8080');
});



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


