class King extends Piece 
{
    constructor(row, col, team)
    {
        super(row, col, team);
        this.face = team.toUpperCase() === 'BLACK' ? '♚' : '♔';
        this.move_set = [];
        this.max_step = 1;
        this.name = 'KING';
        this.danger_tiles = [];
    }

    deleteMoveSet(row, col)
    {
        for(let i = 0; i < this.move_set.length; i++)
        {
            const [move_row, move_col] = this.move_set[i];
            if(move_row === row && move_col === col) 
            {
                this.move_set.splice(i, 1);
            }
        }
    }

    deleteDangerTiles()
    {
        for(let i = 0; i < this.danger_tiles.length; i++)
        {
            const danger = this.danger_tiles[i];
            this.deleteMoveSet(danger[0], danger[1]);
        }
    }

    hasNoMoves()
    {
        if(this.move_set.length > 0) return false;
        return true;
    }

    isMoveSetCollideWithEnemy(row, col)
    {
        for(let i = 0; i < this.move_set.length; i++)
        {
            const king_moves = this.move_set[i];
            if(king_moves[0] === row && king_moves[1] === col) 
            {
                return true;
            }
        }

        return false;
    }

    createDangerTiles(game_pieces)
    {
        this.danger_tiles = [];
        for(let i = 0; i < game_pieces.length; i++)
        {
            const piece = game_pieces[i];
            if(piece.team !== this.team)
            {
                for(let j = 0; j < piece.move_set.length; j++)
                {
                    const [enemy_row, enemy_col] = piece.move_set[j];

                    if(this.isMoveSetCollideWithEnemy(enemy_row, enemy_col))
                    {
                        this.danger_tiles.push([enemy_row, enemy_col]);
                    }
                }
            }
        }
    }

    createMoveSetWithDirection(direction, game_pieces)
    {
        const i = this.max_step;

        direction = direction.toUpperCase();
        let potential_row = this.row; 
        let potential_col = this.col;
        
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

        if(direction === 'UP')
        {
            potential_row = this.row - i;
        }

        if(direction === 'DOWN')
        {
            potential_row = this.row + i;
        }

        if(direction === 'LEFT')
        {
            potential_col = this.col - i;
        }

        if(direction === 'RIGHT')
        {
            potential_col = this.col + i;
        }

        if(this.isOutOfBounds(potential_row, potential_col)) return false;
        const isBlocked = this.isBlockedForward(game_pieces, {row: potential_row, col: potential_col});

        if(isBlocked && isBlocked.isBlocked)
        {
            if(isBlocked.type === 'enemy')
            {
                this.move_set.push([potential_row, potential_col]);
                return false;
            }
            if(isBlocked.type === 'ally')
            {
                return false;
            }
        }
        this.move_set.push([potential_row, potential_col]);
    }

    createMoveSet(game_pieces)
    {
        this.clearMoveSet();
        this.createMoveSetWithDirection('up', game_pieces);
        this.createMoveSetWithDirection('down', game_pieces);
        this.createMoveSetWithDirection('left', game_pieces);
        this.createMoveSetWithDirection('right', game_pieces); 
        this.createMoveSetWithDirection('topleft', game_pieces);
        this.createMoveSetWithDirection('topright', game_pieces);
        this.createMoveSetWithDirection('bottomleft', game_pieces);
        this.createMoveSetWithDirection('bottomright', game_pieces);  
    }
}