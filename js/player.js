class Player 
{
    constructor(team)
    {
        this.team = team.toUpperCase();
        this.pieces = [];
        this.on_hand = null;
        this.captures = [];
        this.isChecked = false;
        this.checked_by = null;
        this.time_remaining = 60 * 30;
    }

    startTime() {
        this.showTime("#timer");
        this.timer = setInterval(function(){
            this.countdown();
        }.bind(this), 1000);
    }

    stopTime()
    {
        clearInterval(this.timer);
        console.log("time stopped");
    }

    resetTime()
    {
        this.time_remaining = 60 * 30;
    }

    showTime(display_id)
    {
        let minutes = null;
        let seconds = null; 

        minutes = parseInt(this.time_remaining / 60, 10);
        seconds = parseInt(this.time_remaining % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        const display = document.querySelector(display_id);
        display.textContent = minutes + ":" + seconds;
    }

    countdown()
    {
        this.showTime("#timer");

        if (--this.time_remaining < 0) {
            this.time_remaining = this.resetTime;
        }
    }

    check(enemy_piece)
    {
        this.isChecked = true;
        this.checked_by = enemy_piece;
        this.getKing().isChecked = true;
    }

    setTime(time_in_seconds)
    {
        this.time = time_in_seconds;
    }

    getTime()
    {
        return this.time;
    }

    canKillChecker()
    {
        for(let piece of this.pieces)
        {
            for(let move of piece.move_set)
            {
                const row = move[0];
                const col = move[1];
                if(this.checked_by.row === row && this.checked_by.col === col) return true;
            }
        }

        return false;
    }

    isOutOfBounds(row, col)
    {
        return (row < 0 || row > 7 || col < 0 || col > 7);
    }

    searchInDirection(direction)
    {
        const king = this.getKing();
        let moves = [];
        let coor = [];

        for(let i = 0; i < 8; i++)
        {
            switch (direction.toUpperCase()) {
                case 'BOTTOMRIGHT':
                    coor = [king.row + i, king.col + i];
                    break;
    
                case 'TOPRIGHT':
                    coor = [king.row - i, king.col + i];
                    break;
    
                case 'TOPLEFT':
                    coor = [king.row - i, king.col - i];
                    break;
    
                case 'BOTTOMLEFT':
                    coor = [king.row + i, king.col - i];
                    break;
    
                case 'RIGHT':
                    coor = [king.row, king.col + i];
                    break;
    
                case 'LEFT':
                    coor = [king.row, king.col - i];
                    break;
    
                case 'TOP':
                    coor = [king.row - i, king.col];
                    break;
    
                case 'BOTTOM':
                    coor = [king.row + i, king.col];
                    break;
            
                default:
                    break;
            }
            if(this.isOutOfBounds(coor[0], coor[1])) break;
            moves.push(coor);
            if(coor[0] === this.checked_by.row && coor[1] === this.checked_by.col) 
            {
                return { direction: direction.toUpperCase(), moves: moves }
            }
        }

        return {direction: direction.toUpperCase(), moves: moves}
        
    }

    searchCheckOrigin()
    {
        const directions = ['top', 'right', 'bottom', 'left', 'topleft', 'topright', 'bottomleft', 'bottomright'];
        
        for(let direction of directions)
        {
            const vector = this.searchInDirection(direction);
            
            for(let move of vector.moves)
            {
                if(this.checked_by.row === move[0] && this.checked_by.col === move[1]) return vector;
            }
        }
        
        return false; // can not find
    }

    canBlockChecker()
    {
        const checker = this.searchCheckOrigin();
        console.log(checker);
        if(checker)
        {
            for(let check_move of checker.moves) 
            {
                for(let my_piece of this.pieces) 
                {
                    for(let my_piece_moveset of my_piece.move_set)
                    {
                        if(my_piece_moveset[0] === check_move[0] && my_piece_moveset[1] === check_move[1])
                        {
                            console.log(my_piece.face, my_piece_moveset[0], my_piece_moveset[1], check_move[0], check_move[1]);
                            return true;
                        }
                    }
                }
            }
        }

        console.log("Checker can't be blocked");
        return false;
    }

    removeCheck()
    {
        this.isChecked = false;
        this.getKing().isChecked = false;
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

    getOnHand()
    {
        return this.on_hand;
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

        console.log("There is no king for ", this.team);
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
                    this.check(player_piece);
                    return true;
                }
            }
        }

        this.removeCheck();
        return false;
    }

    isOtherPiece(row, col)
    {
        const all_other_pieces = this.pieces;
        
        for(let other_piece of all_other_pieces)
        {
            if(other_piece.row === row && other_piece.col === col)
            {
                return true;
            }
        }

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

        if(this.isOtherPiece(to.row, to.col) || !this.isMoveInMoveSet(to.row, to.col, this.on_hand))
        {
            this.cancelMove();
            return { message: "new-pick" };
        }

        // do i own the piece and is it a valid move?
        if(this.doPlayerOwnPiece(this.on_hand) && 
           this.isMoveInMoveSet(to.row, to.col, this.on_hand))
        {
            const my_piece = this.searchPieceByCoordinates(to.row, to.col);
            if(my_piece)
            {
                console.log("Tile occupied by ally.");
                return {message: "fail"}
            }

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

            if(this.on_hand.name === 'KING' || this.on_hand.name === 'ROOK') this.on_hand.hasMoved();

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