class Game 
{
    constructor()
    {
        this.turn = 0; 
        this.STATE = {
            PLAYER_TURN: 0, 
            PLAYER_MOVING: 1,
            PLAYER_ENDTURN: 2,
            PLAYER_PROMOTION: 3,
            QUIT: 99
        }

        this.players = [];
        this.current_state = this.STATE.PLAYER_TURN;
        this.current_player = null;
        this.board = new Board();

        this.clicked_row = null;
        this.click_col = null;
    }

    startTurn()
    {
        let player = this.players[this.turn % 2];
        this.incrementTurn();
        return player;
    }

    endTurn()
    {
        let player = this.players[this.turn % 2];
        this.incrementTurn();
        this.current_state = this.STATE.PLAYER_TURN;
        this.current_player = player;
    }

    refreshTurn()
    {
        this.current_state = this.STATE.PLAYER_TURN;
    }

    incrementTurn()
    {
        this.turn++;
    }

    createPlayers()
    {
        this.players.push(new Player('white'));
        this.players.push(new Player('black'));
    }

    createPawns()
    {
        let white = this.players[0];
        let black = this.players[1];

        for(let i = 0; i < 8; i++)
        {
            white.pieces.push(new Pawn(6, i, 'white'));
            black.pieces.push(new Pawn(1, i, 'black'));
        }
    }

    createPiecesForPlayers()
    {
        // this.createPawns();
        let white = this.players[0];
        let black = this.players[1];
        // white.pieces.push(new Pawn(2, 4, 'white'));
        white.pieces.push(new Rook(0, 0, 'white'));
        black.pieces.push(new Rook(7, 0, 'black'));
        // white.pieces.push(new Pawn(5, 4, 'white'));
        // black.pieces.push(new Pawn(6, 3, 'black'));
        // black.pieces.push(new Pawn(3, 4, 'black'));
    }

    getAllGamePiecesOnBoard()
    {
        return [this.players[0].pieces, this.players[1].pieces].flat(1);
    }

    isCurrentPlayerAndHasPieceOnHand()
    {
        return this.current_player && this.current_player.on_hand !== null;
    }

    updateBoard()
    {
        this.board.refreshBoard();
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            
            for(let j = 0; j < player.pieces.length; j++)
            {
                const piece = player.pieces[j];
                piece.createMoveSet(this.getAllGamePiecesOnBoard());
                this.board.insert(piece);
            }
        }
        
    }

    renderBoard()
    {
        const container = document.querySelector('.container');
        container.innerHTML = "";
        container.appendChild(this.board.renderHTML());

        if(this.isCurrentPlayerAndHasPieceOnHand()) this.showMoveset();
    }

    setUpClickEvent()
    {
        const container = document.querySelector('.container');
        container.addEventListener('click', function(event){
            this.clickEventHandler(event);
        }.bind(this), false);
    }

    start()
    {
        this.createPlayers();
        this.createPiecesForPlayers();

        this.updateBoard();
        this.renderBoard();

        this.setUpClickEvent();
        this.current_player = this.startTurn();
        console.log("Player turn: ", this.current_player.team);
    }

    getEnemy()
    {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if(player.team !== this.current_player.team) return player;
        }

        return false;
    }

    captureEnemyPiece(row, col)
    {
        let enemy = this.getEnemy();
        for(let i = 0; i < enemy.pieces.length; i++)
        {
            let enemy_piece = enemy.pieces[i];
            if(enemy_piece.row === row && enemy_piece.col === col) 
            {
                let captured_piece = enemy_piece;
                enemy.pieces.splice(i, 1);
                // console.log("Captured", captured_piece);
                this.current_player.capture(captured_piece);
            }
        }
    }

    getAllCaptures()
    {
        return [this.players[0].captures, this.players[1].captures].flat(1);
    }

    getOpposingTeam(team)
    {
        return team === 'BLACK' ? 'WHITE' : 'BLACK';
    }

    refreshCapturesBoard()
    {
        document.querySelector('#white').innerHTML = "";
        document.querySelector('#black').innerHTML = "";
    }

    showMoveset()
    {
        const move_set = this.current_player.on_hand.getMoveSet();
        for(let i = 0; i < move_set.length; i++)
        {
            const move = move_set[i];
            
            const id = `#r${move[0]}c${move[1]}`;
            document.querySelector(id).classList.add('move');
        }
    }

    promotePawn(row, col)
    {
        console.log("Code for promoting pawn");
        // show choices for promotion
        // change state to this.STATE.PLAYER_PROMOTION
    }

    displayCaptures()
    {
        this.refreshCapturesBoard();
        const all_captures = this.getAllCaptures();
        for (let i = 0; i < all_captures.length; i++) {
            const piece = all_captures[i];
            const div = document.querySelector(`#${this.getOpposingTeam(piece.team).toLowerCase()}`);
            const span = document.createElement('span');
            span.innerHTML = piece.face; 
            div.appendChild(span);
        }
    }

    playerTurn()
    {
        const row = this.clicked_row;
        const col = this.click_col;
        const player = this.current_player;

        const pick = player.picks(row, col);

        if(!pick) return false;
        
        console.log("Valid move. Pick a tile to drop your piece.", pick);
        player.keepOnHand(pick);
        this.current_state = this.STATE.PLAYER_MOVING;

    }

    playerMoving()
    {
        console.log("Is that the tile you want,", this.current_player.team);
        const row = this.clicked_row;
        const col = this.click_col;
        const player = this.current_player;

        const result = player.move({row, col}, this.board);
        
        switch (result.message) {
            case 'success':
                this.endTurn();
                break;

            case 'cancel':
                console.log("Move cancelled.");
                this.refreshTurn();
                break;

            case 'promote':
                this.promotePawn(row, col);
                break;

            case 'fail':
                break;

            case 'attack':
                this.captureEnemyPiece(row, col);
                this.endTurn();
                break;
        
            default:
                break;
        }
    }

    clickEventHandler(event)
    {
        this.clicked_row    = parseInt(event.target.dataset.row);
        this.click_col      = parseInt(event.target.dataset.col);

        switch (this.current_state) {
            case this.STATE.PLAYER_TURN:
                this.playerTurn();
                break;
            case this.STATE.PLAYER_MOVING:
                this.playerMoving();
                break;

            case this.STATE.PLAYER_ENDTURN:
                this.endTurn();
                break;

            case this.STATE.PLAYER_PROMOTION:
                // awaiting choice queen, rook, bishop, knight
                break;
        
            default:
                break;
        }

        // update and render
        console.log("Player turn:", this.current_player.team);
        this.updateBoard();
        this.displayCaptures();
        this.renderBoard();
        
    }
}

let game = new Game();
game.start();