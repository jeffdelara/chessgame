class Piece
{
    constructor(row, col, team)
    {
        this.row = row;
        this.col = col; 
        this.team = team.toUpperCase();
        this.move_set = [];
        this.end_row = false;
        this.name = this.team;
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

    isMoveSetExist(row, col)
    {
        for(let move in this.move_set)
        {
            const [move_row, move_col] = move; 
            if(move_row === row && move_col === col) return true;
        }

        return false;
    }

    isEnemy(piece)
    {
        return piece.team !== this.team;
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
                    return {isBlocked : true, type: 'enemy', piece: piece}
                }
                else
                {
                    return { isBlocked: true, type: 'ally', piece: piece };
                }   
            }
        }
        return false;
    }
}