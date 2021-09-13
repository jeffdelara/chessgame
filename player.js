class Player 
{
    constructor(team)
    {
        this.team = team.toUpperCase();
        this.pieces = [];
        this.on_hand = null;
        this.captures = [];
    }

    searchPiece(piece)
    {
        for (let i = 0; i < this.pieces.length; i++) {
            const playing_piece = this.pieces[i];
            if(piece.row === playing_piece.row && piece.col === playing_piece.col)
            {
                return playing_piece;
            }
        }
        return false;
    }

    capture(piece)
    {  
        this.captures.push(piece);
    }

    isMoveInMoveSet(row, col, piece)
    {
        for (let i = 0; i < piece.move_set.length; i++) {
            const move = piece.move_set[i];
            if(move[0] === row && move[1] === col) return true;
        }
        console.log("This move is not in moveset.");
        return false;
    }

    searchPieceByCoordinates(row, col)
    {
        for (let i = 0; i < this.pieces.length; i++) {
            const playing_piece = this.pieces[i];
            if(row === playing_piece.row && col === playing_piece.col)
            {
                return playing_piece;
            }
        }
        return false;
    }

    picks(row, col)
    {
        return this.searchPieceByCoordinates(row, col);
    }

    keepOnHand(piece)
    {
        this.on_hand = piece;
    }

    dropHand()
    {
        this.on_hand = null;
    }

    isSamePlace(row, col)
    {
        return this.on_hand.row === row && this.on_hand.col === col
    }

    cancelMove()
    {
        this.dropHand();
    }

    // piece object 
    // board object
    // to object ({row: "", col: ""})
    move(to, board)
    {
        if(this.isSamePlace(to.row, to.col)) 
        {
            console.log("This is same");
            this.cancelMove();
            return { message: "cancel" };
        }

        // do i own the piece and is it a valid move?
        if(this.doPlayerOwnPiece(this.on_hand) && 
           this.isMoveInMoveSet(to.row, to.col, this.on_hand))
        {
            if(board.isAnAttack(this.on_hand, to))
            {
                console.log("This is an attack!!!");
                board.move(this.on_hand, to);
                this.dropHand();
                return { message: "attack" };
            }

            if(board.isPawnAtEnd(this.on_hand, to))
            {
                console.log("Pawn is at end. Promote the pawn.");
                board.move(this.on_hand, to);
                this.dropHand();
                return {message: "promote"};
            }

            board.move(this.on_hand, to);
            this.dropHand();
            return { message: "success" };
        }

        return { message: "fail" };
    }

    doPlayerOwnPiece(piece)
    {
        const isSameTeam = piece.team === this.team;
        const isStillAlive = this.searchPiece(piece);
        return isSameTeam && isStillAlive;
    }
}