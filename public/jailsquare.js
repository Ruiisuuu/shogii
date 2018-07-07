class JailSquare extends Square{
    constructor(x,y,type,color){
        super(x,y);
        this.type = type;
        this.color = color;
        this.count = 0;
        this.piece = new Piece(type,color);
        this.held = "jail";
    }

    drawCaptureCountText(squareSize){
        if(this.piece.getColor() == "white"){
            push();
            translate(this.sx,this.sy-squareSize);
            rotate(PI);
            text(this.count, 0, 0);
            pop();
        }
        else{text(this.count, this.sx, this.sy + squareSize);}
    }
}
