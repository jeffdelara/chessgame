class Piece
{
    constructor(row, col, team)
    {
        this.row = row;
        this.col = col; 
        this.team = team.toUpperCase();
        this.move_set = [];
        this.end_row = false;
    }

    clearMoveSet()
    {
        this.move_set = [];
    }

    getMoveSet()
    {
        return this.move_set;
    }
}


// PAWN 
class Pawn extends Piece
{
    constructor(row, col, team)
    {
        super(row, col, team);
        this.face = team.toUpperCase() === 'BLACK' ? '♟︎' : '♙';
        this.direction = this.team === 'BLACK' ? 1 : -1;
        this.move_set = [];
        this.step = 1;
        this.starting_row = this.team === 'BLACK' ? 1 : 6;
        this.end_row = this.team === 'BLACK' ? 7 : 0;
    }

    

    isBlockedForward(game_pieces, steps = 1)
    {
        const potential_row = this.row + (steps * this.direction);
        const potential_col = this.col;

        for (let i = 0; i < game_pieces.length; i++) {
            const piece = game_pieces[i];
            
            if(piece.row === potential_row && piece.col === potential_col)
            {
                return true;
            }
        }

        return false;
    }

    isBlockedLeftForwardByEnemy(game_pieces)
    {
        const potential_row = this.row + (1 * this.direction);
        const potential_col = this.col + (1 * this.direction);

        for (let i = 0; i < game_pieces.length; i++) {
            const piece = game_pieces[i];
            
            if(piece.row === potential_row && piece.col === potential_col && piece.team !== this.team)
            {
                return true;
            }
        }

        return false;
    }

    isBlockedRightForwardByEnemy(game_pieces)
    {
        const potential_row = this.row + (1 * this.direction);
        const potential_col = this.col + (-1 * this.direction);

        for (let i = 0; i < game_pieces.length; i++) {
            const piece = game_pieces[i];
            
            if(piece.row === potential_row && piece.col === potential_col && piece.team !== this.team)
            {
                return true;
            }
        }

        return false;
    }

    createMoveSet(game_pieces)
    {
        this.clearMoveSet();
        
        if(!this.isBlockedForward(game_pieces))
        {
            if(this.starting_row === this.row && !this.isBlockedForward(game_pieces, 2))
            {
                this.move_set.push([this.row + (2 * this.direction), this.col]);    
            }
            this.move_set.push([this.row + (1 * this.direction), this.col]);
        }

        if(this.isBlockedLeftForwardByEnemy(game_pieces))
        {
            this.move_set.push([this.row + (1 * this.direction), this.col + (1 * this.direction)]);
        }

        if(this.isBlockedRightForwardByEnemy(game_pieces))
        {
            this.move_set.push([this.row + (1 * this.direction), this.col + (-1 * this.direction)]);
        }

        
    }
}

// ROOK
class Rook extends Piece 
{
    constructor(row, col, team)
    {
        super(row, col, team);
        this.face = team.toUpperCase() === 'BLACK' ? '♜' : '♖';
        this.move_set = [];
        this.step = 1;
    }
    
    isBlockedForward(game_pieces, step)
    {

    }

    createMoveSet(game_pieces)
    {
        this.clearMoveSet();
    }
}