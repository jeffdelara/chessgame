class Player 
{
    constructor(team)
    {
        this.team = team.toUpperCase();
        this.pieces = [];
        this.on_hand = null;
        this.captures = [];
        this.isChecked = false;
    }

    check()
    {
        this.isChecked = true;
    }

    removeCheck()
    {
        this.isChecked = false;
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

    getKing()
    {
        for(let i = 0; i < this.pieces.length; i++)
        {
            let piece = this.pieces[i];
            if(piece.name === 'KING') return piece;
        }

        console.log("There is no king for ", this.team, "YOU WIN!");
        return false;
    }

    isCheckedBy(player)
    {
        let king = this.getKing();
        if(!king) return false;

        const player_pieces = player.pieces;
    
        for(let i = 0; i < player_pieces.length; i++)
        {
            const player_piece = player_pieces[i];
            for(let j = 0; j < player_piece.move_set.length; j++)
            {
                const move = player_piece.move_set[j];
                if(king.row === move[0] && king.col === move[1]) 
                {
                    this.check();
                    return true;
                }
            }
        }

        this.removeCheck();
        return false;
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

            if(board.isPawnAtEnd(this.on_hand, to) && this.on_hand.end_row)
            {
                console.log("Pawn is at end. Promote the pawn.");
                board.move(this.on_hand, to);
                this.dropHand();
                return {message: "promote"};
            }

            // if(this.on_hand.name === "KING" && this.on_hand.isDangerTile(to.row, to.col))
            // {
            //     console.log("Danger tile", );
            //     return { message: "cancel" };
            // }

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