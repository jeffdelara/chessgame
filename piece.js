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

    isOutOfBounds(row, col)
    {
        return (row < 0 || row > 7 || col < 0 || col > 7);
    }

    isCurrentLocation(row, col)
    {
        return this.row === row && this.col === col;
    }

    isEnemy(piece)
    {
        return piece.team !== this.team;
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
        this.max_step = 8;
    }
    
    isBlockedForward(game_pieces, coor)
    {
        for(let i = 0; i < game_pieces.length; i++)
        {
            const piece = game_pieces[i];

            if(this.isCurrentLocation(coor.row, coor.col)) return false;
            if(piece.row === coor.row && piece.col === coor.col)
            {
                if(this.isEnemy(piece))
                {
                    return {isBlocked : true, type: 'enemy'}
                }
                else
                {
                    return { isBlocked: true, type: 'ally' };
                }   
            }
        }

        return false;
    }

    createMoveSetWithDirection(direction, game_pieces)
    {
        direction = direction.toUpperCase();
        let potential_row = this.row; 
        let potential_col = this.col;
        
        for(let i = 0; i < this.max_step; i++)
        {
            if(direction === 'RIGHT')
            {
                potential_col = this.col + i;
            }

            if(direction === 'LEFT')
            {
                potential_col = this.col - i;
            }

            if(direction === 'UP')
            {
                potential_row = this.row - i;
            }

            if(direction === 'DOWN')
            {
                potential_row = this.row + i;
            }

            if(this.isOutOfBounds(potential_row, potential_col)) break;
            const isBlocked = this.isBlockedForward(game_pieces, {row: potential_row, col: potential_col});

            if(isBlocked && isBlocked.isBlocked)
            {
                if(isBlocked.type === 'enemy')
                {
                    this.move_set.push([potential_row, potential_col]);
                    break;
                }
                if(isBlocked.type === 'ally')
                {
                    break;
                }
            }
            this.move_set.push([potential_row, potential_col]);
        }
    }

    createMoveSet(game_pieces)
    {
        this.clearMoveSet();
        this.createMoveSetWithDirection('up', game_pieces);
        this.createMoveSetWithDirection('down', game_pieces);
        this.createMoveSetWithDirection('left', game_pieces);
        this.createMoveSetWithDirection('right', game_pieces);
        
    }
}