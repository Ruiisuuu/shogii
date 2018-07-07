class Game{
    constructor(imgs){
        //constants
        this.size = 9; //because it's shogi
        this.ssq = 40; //size square
        this.pieceWidth = 25;
        this.pieceHeight = 35;
        this.imgs = imgs;

        //arrays
        this.board = [];
        for (let i=0; i < this.size ; i++){
            this.board[i] = [];
            for (let j=0; j < this.size ; j++){
                this.board[i][j] = new Square(i,j);
            }
        }
        this.jail = [];
        this.jail["black"] = [];
        this.jail["white"] = [];

        this.resetGame();
    }

    resetGame(){
        this.turn = "black"; //first turn is black
        this.winner = null;
        this.selected = null;
        this.stopped = false;

        this.initializePieces();

        this.calculateAllPossibleMoves();
    }

    initializePieces(){
        //clear board
        for (let i=0; i < this.size ; i++){
            for (let j=0; j < this.size ; j++){
                this.board[i][j].setPiece(null);
            }
        }

        //initial piece positions
        for (let i=0; i < this.size ; i++){
            //pawns
            this.board[i][2].piece = new Piece("pawn","white");
            this.board[i][6].piece = new Piece("pawn","black");
        }

        //rook
        this.board[1][1].piece = new Piece("rook","white");
        this.board[7][7].piece = new Piece("rook","black");

        //bishop
        this.board[7][1].piece = new Piece("bishop","white");
        this.board[1][7].piece = new Piece("bishop","black");

        //king
        this.board[4][0].piece = new Piece("king","white");
        this.board[4][8].piece = new Piece("king","black");

        //gold
        this.board[3][0].piece = new Piece("gold","white");
        this.board[5][0].piece = new Piece("gold","white");
        this.board[3][8].piece = new Piece("gold","black");
        this.board[5][8].piece = new Piece("gold","black");

        //silver
        this.board[2][0].piece = new Piece("silver","white");
        this.board[6][0].piece = new Piece("silver","white");
        this.board[2][8].piece = new Piece("silver","black");
        this.board[6][8].piece = new Piece("silver","black");

        //knight
        this.board[1][0].piece = new Piece("knight","white");
        this.board[7][0].piece = new Piece("knight","white");
        this.board[1][8].piece = new Piece("knight","black");
        this.board[7][8].piece = new Piece("knight","black");

        //lance
        this.board[0][0].piece = new Piece("lance","white");
        this.board[8][0].piece = new Piece("lance","white");
        this.board[0][8].piece = new Piece("lance","black");
        this.board[8][8].piece = new Piece("lance","black");

        // //initialize jails
        this.jail["black"]["pawn"] = new JailSquare(0,1,"pawn","black");
        this.jail["white"]["pawn"] = new JailSquare(6,0,"pawn","white");

        this.jail["black"]["knight"] = new JailSquare(1,1,"knight","black");
        this.jail["white"]["knight"] = new JailSquare(5,0,"knight","white");

        this.jail["black"]["lance"] = new JailSquare(2,1,"lance","black");
        this.jail["white"]["lance"] = new JailSquare(4,0,"lance","white");

        this.jail["black"]["silver"] = new JailSquare(3,1,"silver","black");
        this.jail["white"]["silver"] = new JailSquare(3,0,"silver","white");

        this.jail["black"]["gold"] = new JailSquare(4,1,"gold","black");
        this.jail["white"]["gold"] = new JailSquare(2,0,"gold","white");

        this.jail["black"]["rook"] = new JailSquare(5,1,"rook","black");
        this.jail["white"]["rook"] = new JailSquare(1,0,"rook","white");

        this.jail["black"]["bishop"] = new JailSquare(6,1,"bishop","black");
        this.jail["white"]["bishop"] = new JailSquare(0,0,"bishop","white");

    }

    getBoard(){
        return this.board;
    }

    setGame(turn, oldSqHeld, oldSqX, oldSqY, newSqColor, newSqType, newSqX, newSqY){
        if(oldSqHeld == "jail"){
            this.dropPiece(this.jail[newSqColor][newSqType], this.board[newSqX][newSqY]);
        }
        else{
            this.movePiece(this.board[oldSqX][oldSqY], this.board[newSqX][newSqY]);
            this.board[newSqX][newSqY].piece.type = newSqType;
        }
        this.turn = turn;
        this.calculateAllPossibleMoves();
    }

    gameOver(winner){
        this.stopped = true;
        window.alert("Holy shit " + winner + " actually won. You, not-" + winner
            + ", fucking suck. Eat shit. Bitch.")
    }

    showSq(square, offsetX, offsetY){
        square.updateCoords(offsetX, offsetY, this.size, this.ssq);

        square.drawSquare(this.ssq, this.selected);

        if (this.selected != null){
            if(this.selected.possibleMovesInclude(square)){
                square.drawMoveMarkers(this.ssq);
            }
        }
        if (square.getPiece() != null){
            square.drawPiece(this.imgs, this.pieceWidth, this.pieceHeight)
        }
        if(square.isHeldInJail()){
            square.drawCaptureCountText(this.ssq);
        }
    }

    show(){
        background(51);
        for (var piece in this.jail["white"]){
    		this.showSq(this.jail["white"][piece], 2*this.ssq,this.ssq);
    	}
        for (let i=0; i < this.size ; i++){
    		for (let j=0; j < this.size ; j++){
    			this.showSq(this.board[i][j],3*this.ssq,3*this.ssq);
    		}
    	}
    	for (var piece in this.jail["black"]){
    		this.showSq(this.jail["black"][piece], 6*this.ssq,12*this.ssq);

    	}
    }

    clickedBoard(square, side){
        if(this.selected == null && square.getPiece() != null
            && this.turn == square.getPiece().getColor() && this.turn == side){
    	    this.selected = square;
    	}
    	else if (this.selected != null){
    	    if (square == this.selected){
    		    this.selected = null;
    	    }
    	    else if (square != this.selected && square.piece != null
                && square.piece.color == this.turn){
    			this.selected = square;
    	    }
    	    else if (this.selected.moves.includes(square)){
                if(this.selected.held == "jail"){
                    this.dropPiece(this.selected, square);
                }
    	        else{
                    this.movePiece(this.selected, square);
                    this.checkPromotion(this.selected, square);
                }
                this.changeTurn();
                sendGame(this.turn, this.selected, square);
                this.selected = null;
                this.calculateAllPossibleMoves();
                this.checkMate();
    	    }
        }
    }

    clickedJail(square){
    	if(this.selected == null && square.piece != null &&
            square.piece.color == this.turn && square.count > 0){
    			this.selected = square;
    	}
    	else if (this.selected != null){
    		if (square == this.selected){
    			this.selected = null;
    		}
    		else if (square != this.selected && square.piece.color == this.turn
    			&& square.count > 0){
    				this.selected = square;
    		}
    	}
    }

    movePiece(currentSq,newSq){
        if (newSq.piece != null){
            this.addToJail(currentSq.getPiece().getColor(), newSq.getPiece().getType());
        }
        newSq.setPiece(currentSq.piece);
        currentSq.setPiece(null);
    }

    dropPiece(jailSq, newSq){
        newSq.setPiece(jailSq.piece);
        jailSq.count--;
    }

    addToJail(jailColor, type){
        if (type == "king"){
            this.winner = jailColor;
        }
        else if (type == "promoted pawn"){
            this.jail[jailColor]["pawn"].count++;
        }
        else if (type == "promoted lance"){
            this.jail[jailColor]["lance"].count++;
        }
        else if (type == "promoted knight"){
            this.jail[jailColor]["knight"].count++;
        }
        else if (type == "promoted silver"){
            this.jail[jailColor]["silver"].count++;
        }
        else if (type == "dragon"){
            this.jail[jailColor]["rook"].count++;
        }
        else if (type == "horse"){
            this.jail[jailColor]["bishop"].count++;
        }
        else{
            this.jail[jailColor][type].count++;
        }
    }

    calculateMoves(x,y){
        //reset possible moves
        this.board[x][y].moves = [];

        //useful variable to not repeat if white/black
        if (this.board[x][y].piece.color == "white"){ var c = 1; }
        else if (this.board[x][y].piece.color == "black"){ var c = -1; }

        // pawn
        if (this.board[x][y].piece.type == "pawn"){
            if (this.isValidMove(x,y+c,this.board[x][y].piece.color)){
                    this.board[x][y].moves.push(this.board[x][y+c]);
            }
        }

        // king
        if (this.board[x][y].piece.type == "king"){
            for (let i=-1; i < 2 ; i++){
                for (let j=-1; j < 2; j++){
                    if (this.isValidMove(x+i,y+j,this.board[x][y].piece.color)
                        && !(i==0 && j==0)){
                        this.board[x][y].moves.push(this.board[x+i][y+j]);
                    }
                }
            }
        }

        // gold
        else if (this.board[x][y].piece.type == "gold" ||
                 this.board[x][y].piece.type == "promoted pawn" ||
                 this.board[x][y].piece.type == "promoted lance" ||
                 this.board[x][y].piece.type == "promoted knight" ||
                 this.board[x][y].piece.type == "promoted silver" ){
            for (let i=-1; i < 2 ; i++){
                for (let j=-1; j < 2; j++){
                    if(!(i==0 && j==0) && !(i==-1 && j==-c) && !(i==1 && j==-c)){
                        if (this.isValidMove(x+i,y+j,this.board[x][y].piece.color)){
                            this.board[x][y].moves.push(this.board[x+i][y+j]);
                        }
                    }
                }
            }
        }

        // silver
        else if (this.board[x][y].piece.type == "silver"){
            for (let i=-1; i < 2 ; i++){
                for (let j=-1; j < 2; j++){
                    if(!(i==0 && j==0) && !(i==-1 && j==0) && !(i==1 && j==0)
                    && !(i==0 && j==-c)){
                        if (this.isValidMove(x+i,y+j,this.board[x][y].piece.color)){
                            this.board[x][y].moves.push(this.board[x+i][y+j]);
                        }
                    }
                }
            }
        }

        // knight
        else if (this.board[x][y].piece.type == "knight"){
            if(this.isValidMove(x+1,y+2*c,this.board[x][y].piece.color)){
                this.board[x][y].moves.push(this.board[x+1][y+2*c]);
            }
            if(this.isValidMove(x-1,y+2*c,this.board[x][y].piece.color)){
                this.board[x][y].moves.push(this.board[x-1][y+2*c]);
            }
        }

        // lance, rook, dragon
        else if (this.board[x][y].piece.type == "rook" ||
            this.board[x][y].piece.type == "lance" || this.board[x][y].piece.type == "dragon"  ){
            for (let j=1; this.isValidMove(x,y+j*c,this.board[x][y].piece.color); j++){
                this.board[x][y].moves.push(this.board[x][y+j*c]);
                if(this.board[x][y+j*c].piece != null){
                    break;
                }
            }
            if(this.board[x][y].piece.type == "rook" ||
               this.board[x][y].piece.type == "dragon" ){
                for (let j=1; this.isValidMove(x,y-j*c,this.board[x][y].piece.color); j++){
                    this.board[x][y].moves.push(this.board[x][y-j*c]);
                    if(this.board[x][y-j*c].piece != null){
                        break;
                    }
                }
                for (let i=1; this.isValidMove(x-i,y,this.board[x][y].piece.color); i++){
                    this.board[x][y].moves.push(this.board[x-i][y]);
                    if(this.board[x-i][y].piece != null){
                        break;
                    }
                }
                for (let i=1; this.isValidMove(x+i,y,this.board[x][y].piece.color); i++){
                    this.board[x][y].moves.push(this.board[x+i][y]);
                    if(this.board[x+i][y].piece != null){
                        break;
                    }
                }

                if(this.board[x][y].piece.type == "dragon"){
                    for (let i=-1; i < 2 ; i++){
                        for (let j=-1; j < 2; j++){
                            if (this.isValidMove(x+i,y+j,this.board[x][y].piece.color)
                                && !(i==0 && j==0)){
                                //duplicate corners in the array, to lazy to write
                                this.board[x][y].moves.push(this.board[x+i][y+j]);
                            }
                        }
                    }
                }
            }
        }

        // bishop, horse
        else if (this.board[x][y].piece.type == "bishop" ||
                 this.board[x][y].piece.type == "horse"){
            for (let i=1; this.isValidMove(x+i,y+i,this.board[x][y].piece.color); i++){
                this.board[x][y].moves.push(this.board[x+i][y+i]);
                if(this.board[x+i][y+i].piece != null){
                    break;
                }
            }
            for (let i=1; this.isValidMove(x-i,y-i,this.board[x][y].piece.color); i++){
                this.board[x][y].moves.push(this.board[x-i][y-i]);
                if(this.board[x-i][y-i].piece != null){
                    break;
                }
            }
            for (let i=1; this.isValidMove(x-i,y+i,this.board[x][y].piece.color); i++){
                this.board[x][y].moves.push(this.board[x-i][y+i]);
                if(this.board[x-i][y+i].piece != null){
                    break;
                }
            }
            for (let i=1; this.isValidMove(x+i,y-i,this.board[x][y].piece.color); i++){
                this.board[x][y].moves.push(this.board[x+i][y-i]);
                if(this.board[x+i][y-i].piece != null){
                    break;
                }
            }

            if(this.board[x][y].piece.type == "horse"){
                for (let i=-1; i < 2 ; i++){
                    for (let j=-1; j < 2; j++){
                        if (this.isValidMove(x+i,y+j,this.board[x][y].piece.color)
                            && !(i==0 && j==0)){
                            //duplicate corners in the array, to lazy to write
                            this.board[x][y].moves.push(this.board[x+i][y+j]);
                        }
                    }
                }
            }
        }
    }

    calculateJailMoves(jailsq){
        jailsq.moves = [];

        for (let i=0; i < this.size ; i++){
    		for (let j=0; j < this.size ; j++){
    			if(this.isValidDrop(i,j,jailsq.type,jailsq.color)){
                    jailsq.moves.push(this.board[i][j]);
                }
    		}
    	}
    }

    calculateAllPossibleMoves(){
        for (let i=0; i < this.size ; i++){
    		for (let j=0; j < this.size ; j++){
    			if (this.board[i][j].piece != null){
    				this.calculateMoves(i,j);
    			}
    		}
    	}
        for (var piece in this.jail["black"]){
    		this.calculateJailMoves(this.jail["black"][piece]);

    	}
    	for (var piece in this.jail["white"]){
    		this.calculateJailMoves(this.jail["white"][piece]);
    	}
    }

    changeTurn(){
        if (this.turn == "black"){
            this.turn = "white";
        }
        else if (this.turn == "white"){
            this.turn = "black";
        }
    }

    isStopped(){
        return this.stopped;
    }

    isSquareClicked(mx,my,square){
        if (mx>square.sx-this.ssq/2 && mx<square.sx+this.ssq/2 &&
            my>square.sy-this.ssq/2 && my<square.sy+this.ssq/2 ){
                return true;
            }
    }

    isValidMove(x,y,color){
        if(x>=0 && y>=0 && x<=this.size-1 && y<=this.size-1){
            if (this.board[x][y] != null){ //valid move
                if(this.board[x][y].piece != null){
                    if(this.board[x][y].piece.color != color){ //can't take your own piece
                    return true;
                    }
                }
                else{return true;}
            }
        }
        return false;
    }

    isValidDrop(x,y,type,color){
        if(this.board[x][y].piece == null){
            if(type == "pawn" || type == "lance"){
                if((color == "white" && y == 8) ||
                    (color == "black" && y == 0)){
                    return false;
                }
                if(type == "pawn"){
                    for (let z=0; z < this.size ; z++){
                        if(this.board[x][z].piece != null){
                            if(this.board[x][z].piece.type == "pawn" &&
                            this.board[x][z].piece.color == color){
                                return false;
                            }
                        }
                    }
                }
            }
            else if(type == "knight"){
                if((color == "white" && y > 6) ||
                    (color == "black" && y < 2)){
                    return false;
                }
            }
            return true;
        }
        else {return false;}
    }

    isValidPromotion(oldY,newY,type,color){
        if((type != "king" && type != "gold"
        && type != "promoted pawn" && type != "promoted lance" &&
         type != "promoted knight" && type != "promoted silver" &&
         type != "dragon" && type != "horse")
         && ((color == "white" && (oldY>=6 || newY>=6)) ||
         (color == "black" && (oldY<=2 || newY<=2)))){
            return true;
        }
        else{return false;}
    }

    isForcedPromotion(y,type,color){
        if ( ((type == "pawn" || type == "lance") && ((color == "white" &&
         y === 8) || (color === "black" && y===0))) ||
         (type === "knight" && ((color === "white" && y >= 7) ||
         (color === "black" && y <= 1))) ){
             return true;
         }
    }

    promotePiece(square){
        if (square.piece.type == "pawn"){
            square.piece.type = "promoted pawn";
        }
        else if (square.piece.type == "lance"){
            square.piece.type = "promoted lance";
        }
        else if (square.piece.type == "knight"){
            square.piece.type = "promoted knight";
        }
        else if (square.piece.type == "silver"){
            square.piece.type = "promoted silver";
        }
        else if (square.piece.type == "rook"){
            square.piece.type = "dragon";
        }
        else if (square.piece.type == "bishop"){
            square.piece.type = "horse";
        }
    }

    askPromotion(square){
        console.log("Some " + square.piece.type + " can probably promote, idk");
        if (window.confirm("PROMOTEEELEEEEEEELEE?")){
            this.promotePiece(square);
        }
        else{console.log('no promote :(')}
    }

    checkPromotion(oldSq, newSq){
        let oldY = oldSq.y;
        let newY = newSq.y;
        let type = newSq.getPiece().getType();
        let color = newSq.getPiece().getColor();

        if(this.isValidPromotion(oldY, newY, type, color) && color == this.turn){
            if (this.isForcedPromotion(newY, type, color)){
                this.promotePiece(newSq);
            }
            else{
                this.askPromotion(newSq);
            }
        }
    }

    checkMate(){
        if (this.winner != null){
            sendGameOver(this.winner);
            this.gameOver(this.winner);
        }
    }
}
