class Bishop extends Piece 
{
    constructor(row, col, team)
    {
        super(row, col, team);
        this.face = team.toUpperCase() === 'BLACK' ? '♝' : '♗';
        this.move_set = [];
        this.max_step = 8;
    }

    createMoveSetWithDirection(direction, game_pieces)
    {
        direction = direction.toUpperCase();
        let potential_row = this.row; 
        let potential_col = this.col;
        
        for(let i = 0; i < this.max_step; i++)
        {
            if(direction === 'TOPLEFT')
            {
                potential_col = this.col - i;
                potential_row = this.row - i;
            }

            if(direction === 'TOPRIGHT')
            {
                potential_col = this.col + i;
                potential_row = this.row - i;
            }

            if(direction === 'BOTTOMLEFT')
            {
                potential_col = this.col - i;
                potential_row = this.row + i;
            }

            if(direction === 'BOTTOMRIGHT')
            {
                potential_col = this.col + i;
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
        this.createMoveSetWithDirection('topleft', game_pieces);
        this.createMoveSetWithDirection('topright', game_pieces);
        this.createMoveSetWithDirection('bottomleft', game_pieces);
        this.createMoveSetWithDirection('bottomright', game_pieces);
        
    }
}
