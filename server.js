self.port = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080

// socket.io initialization on the server side
self.initializeSocketIO = function() {
        self.server = require('http').createServer(self.app);
        self.io = require('socket.io').listen(self.server);
        self.io.enable('browser client minification');  // send minified client
        self.io.enable('browser client etag');          // apply etag caching logic based on version number
        self.io.enable('browser client gzip');          // gzip the file
        self.io.set('log level', 1);                    // reduce logging

        self.io.set('transports', [
                'websocket'
            ]);
        return this;
    }

self.addSocketIOEvents = function() {
        self.io.sockets.on('connection', function (socket) {
          
          console.log("We have a new client: " + socket.id);
          
          socket.on('my other event', function (data) {
            console.log(data);
          });
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
}

/**
 *  Initializes the sample application.
 */
self.initialize = function() {
    self.setupVariables();
    self.populateCache();
    self.setupTerminationHandlers();

    // Create the express server and routes.
    self.initializeServer();
    self.initializeSocketIO().addSocketIOEvents();
};
