class Square {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.sx;
        this.sy;
        this.piece = null;
        this.moves = [];
        this.held = "board";
    }

    updateCoords(offsetX, offsetY, numberofSquares, squareSize){
        //update graphical coordonates
        this.sx = offsetX + map(this.x, 0,
            numberofSquares-1, squareSize/2, squareSize*(numberofSquares-0.5));
        this.sy = offsetY + map(this.y, 0,
            numberofSquares-1, squareSize/2, squareSize*(numberofSquares-0.5));
    }

    drawSquare(squareSize, selected){
        if (this == selected){fill(205,82,45);}
        else{fill(160,82,45);}
        stroke(0);
        rectMode(CENTER);
        rect(this.sx, this.sy, squareSize, squareSize);
    }

    drawMoveMarkers(squareSize){
        stroke(0);
        fill(255,0,0);
        if (this.piece != null){
            triangle(this.sx-(squareSize/2),
                this.sy-(squareSize/2),
                this.sx-(squareSize/3),
                this.sy-(squareSize/2),
                this.sx-(squareSize/2),
                this.sy-(squareSize/3));

            triangle(this.sx-(squareSize/2),
                this.sy+(squareSize/2),
                this.sx-(squareSize/3),
                this.sy+(squareSize/2),
                this.sx-(squareSize/2),
                this.sy+(squareSize/3));

            triangle(this.sx+(squareSize/2),
                this.sy+(squareSize/2),
                this.sx+(squareSize/3),
                this.sy+(squareSize/2),
                this.sx+(squareSize/2),
                this.sy+(squareSize/3));

            triangle(this.sx+(squareSize/2),
                this.sy-(squareSize/2),
                this.sx+(squareSize/3),
                this.sy-(squareSize/2),
                this.sx+(squareSize/2),
                this.sy-(squareSize/3));
        }
        else{
            ellipse(this.sx, this.sy, 10, 10);
        }
    }

    drawPiece(imageArray, pieceWidth, pieceHeight){
        if (this.piece.getColor() == "white"){
            push();
            translate(this.sx,this.sy);
            rotate(PI);
            imageMode(CENTER);
            image(imageArray[this.piece.getColor()][this.piece.getType()],
                0, 0, pieceWidth, pieceHeight); //at 0,0 because translate
            pop();
        }
        else {
            imageMode(CENTER);
            image(imageArray[this.piece.getColor()][this.piece.getType()],
                this.sx, this.sy, pieceWidth, pieceHeight);
        }
    }

    getPiece(){
        return this.piece;
    }

    setPiece(piece){
        this.piece = piece;
    }

    isHeldInJail(){
        if(this.held == "jail"){
            return true;
        }
        else{return false;}
    }

    possibleMovesInclude(square){
        if (this.moves.includes(square)){
            return true;
        }
        else{return false;}
    }

    resetMoves(){
        this.moves = [];
    }

    addMove(square){
        this.moves.push(square);
    }
}
