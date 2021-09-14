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