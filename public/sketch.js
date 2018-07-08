/* SHOGI SUMMER 2018 LOUIS MOLLICK */

// written in Atom, p5js Framework cuz idk how HTML works
let side = "black";
let matrix=[1,0,0,1,0,0];
let imgs = [];
imgs["black"] = [];
imgs["white"] = [];

// // Use the Singleton pattern
// // to make sure that only one Client object exists
// var Client;

// (function () {
//   var instance;
//   Client = function Client() {
//     if (instance) {
//       return instance;
//     }

//     // Set the instance variable and return it onwards
//     instance = this;

//     // Connect websocket to Server
//     this.connect();
//     console.log("Client started");
//   };
// }());

// Client.prototype.connect = function() {
//   var connString = config.protocol + config.domain + ':' + config.clientport;

//   console.log("Websocket connection string:", connString, config.wsclientopts);

//   var self = this;

//   this.socket = io.connect(connString, config.wsclientopts);

//   // Handle error event
//   this.socket.on('error', function (err) {  
//     console.log("Websocket 'error' event:", err);
//   });

//   // Handle connection event
//   this.socket.on('connect', function () { 
//     console.log("Websocket 'connected' event with params:", self.socket);
//     document.getElementById('top').innerHTML = "Connected.";
//   });

function preload(){
	imgs["black"]["pawn"] = loadImage("game_assets/bpawn.png");
	imgs["black"]["promoted pawn"] = loadImage("game_assets/bpawn_prom.png");
	imgs["black"]["lance"] = loadImage("game_assets/blance.png");
	imgs["black"]["promoted lance"] = loadImage("game_assets/blance_prom.png");
	imgs["black"]["knight"] = loadImage("game_assets/bknight.png");
	imgs["black"]["promoted knight"] = loadImage("game_assets/bknight_prom.png");
	imgs["black"]["silver"] = loadImage("game_assets/bsilver.png");
	imgs["black"]["promoted silver"] = loadImage("game_assets/bsilver_prom.png");
	imgs["black"]["gold"] = loadImage("game_assets/bgold.png");
	imgs["black"]["rook"] = loadImage("game_assets/brook.png");
	imgs["black"]["dragon"] = loadImage("game_assets/brook_prom.png");
	imgs["black"]["bishop"] = loadImage("game_assets/bbishop.png");
	imgs["black"]["horse"] = loadImage("game_assets/bbishop_prom.png");
	imgs["black"]["king"] = loadImage("game_assets/bking.png");
	imgs["white"]["pawn"] = loadImage("game_assets/wpawn.png");
	imgs["white"]["promoted pawn"] = loadImage("game_assets/wpawn_prom.png");
	imgs["white"]["lance"] = loadImage("game_assets/wlance.png");
	imgs["white"]["promoted lance"] = loadImage("game_assets/wlance_prom.png");
	imgs["white"]["knight"] = loadImage("game_assets/wknight.png");
	imgs["white"]["promoted knight"] = loadImage("game_assets/wknight_prom.png");
	imgs["white"]["silver"] = loadImage("game_assets/wsilver.png");
	imgs["white"]["promoted silver"] = loadImage("game_assets/wsilver_prom.png");
	imgs["white"]["gold"] = loadImage("game_assets/wgold.png");
	imgs["white"]["rook"] = loadImage("game_assets/wrook.png");
	imgs["white"]["dragon"] = loadImage("game_assets/wrook_prom.png");
	imgs["white"]["bishop"] = loadImage("game_assets/wbishop.png");
	imgs["white"]["horse"] = loadImage("game_assets/wbishop_prom.png");
	imgs["white"]["king"] = loadImage("game_assets/wking.png");
}

function setup() {
	createCanvas(600, 600);

	game = new Game(imgs);

	let resetButton = createButton("RESET THIS BITCH");
	resetButton.mousePressed(() => {
		socket.emit('reset');
		game.resetGame();
	});

	let sideButton = createButton("I sexually identify as a color");
	sideButton.mousePressed(() => flipBoard());
	
	var socket = io.connect('http://shogi2-shogiii.1d35.starter-us-east-1.openshiftapps.com');
	
	console.log("WORK DAMNIT");
  	// We make a named event called 'mouse' and write an
  	// anonymous callback function
  	socket.on('move',
    // When we receive data
    function(data) {
		console.log('we got a board');
      	game.setGame(data.turn, data.oldSqHeld, data.oldSqX, data.oldSqY,
			data.newSqColor, data.newSqType, data.newSqX, data.newSqY);
		updateSide();
		game.show();
    } );

	socket.on('reset',
    // When we receive the reset event triggerrrrrr
    function() {
		console.log('resetiingggg');
      	game.resetGame();
		game.show();
    } );

	socket.on('gameover',
    // When we receive the reset event triggerrrrrr
    function(data) {
		console.log('game over dude, game over');
      	game.gameOver(data);
    } );

	game.show();
}

function sendGame(turn, oldSq, newSq) {
  	console.log('sending board')
	var pack = {
		turn: turn,
		oldSqHeld: oldSq.held,
		oldSqX : oldSq.x,
		oldSqY : oldSq.y,
		newSqColor : newSq.piece.color,
		newSqType : newSq.piece.type,
		newSqX : newSq.x,
		newSqY : newSq.y,
	};
  	// Send that object to the socket
  	socket.emit('move',pack);
}

function sendGameOver(winner){
	console.log('sending the games overs bruh')
	socket.emit('gameover', winner);
}

function mousePressed(){
	let moose = getXY(mouseX,mouseY); //get flipped mouse coords

	if (!game.isStopped()){
		for (let i=0; i < game.size ; i++){
			for (let j=0; j < game.size ; j++){
				if(game.isSquareClicked(moose.x, moose.y, game.board[i][j])){
					game.clickedBoard(game.board[i][j], side);
				}
			}
		}
		for (var piece in game.jail[side]){
			if(game.isSquareClicked(moose.x,moose.y,game.jail[side][piece])){
				game.clickedJail(game.jail[side][piece]);
			}
		}
	}
	updateSide();
	game.show();
}

function updateSide(){
	resetMatrix();
	applyMatrix(matrix[0],matrix[1],matrix[2],matrix[3],matrix[4],matrix[5]);
}

function flipBoard(){
	if (side == "black"){
		side = "white";
	}
	else{side = "black"}
	resetMatrix();
	mtranslate(width,height);
	mrotate(PI);
	applyMatrix(matrix[0],matrix[1],matrix[2],matrix[3],matrix[4],matrix[5]);
}

function mtranslate(x,y){
    matrix[4] += matrix[0] * x + matrix[2] * y;
    matrix[5] += matrix[1] * x + matrix[3] * y;
}

function mrotate(radians){
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var m11 = matrix[0] * cos + matrix[2] * sin;
    var m12 = matrix[1] * cos + matrix[3] * sin;
    var m21 = -matrix[0] * sin + matrix[2] * cos;
    var m22 = -matrix[1] * sin + matrix[3] * cos;
    matrix[0] = m11;
    matrix[1] = m12;
    matrix[2] = m21;
    matrix[3] = m22;
}

function getXY(mouseX,mouseY){
	newX = mouseX * matrix[0] + mouseY * matrix[2] + matrix[4];
	newY = mouseX * matrix[1] + mouseY * matrix[3] + matrix[5];
	return({x:newX,y:newY});
}
