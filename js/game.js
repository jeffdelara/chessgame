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
        this.checkedTile = null;
        this.clicked_row = null;
        this.click_col = null;

        this.message = "WHITE";
        this.pawn_promotion = {row: null, col: null}
    }

    startTurn()
    {
        let player = this.players[this.turn % 2];
        this.incrementTurn();
        return player;
    }

    endTurn()
    {
        // previous player
        this.current_player.stopTime();

        let player = this.players[this.turn % 2];
        this.incrementTurn();
        this.current_state = this.STATE.PLAYER_TURN;
        this.current_player = player;
        this.current_player.startTime();
    }

    refreshTurn()
    {
        this.current_state = this.STATE.PLAYER_TURN;
    }

    incrementTurn()
    {
        this.turn++;
    }

    decrementTurn()
    {
        this.turn--;
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

    createRooks()
    {
        let white = this.players[0];
        let black = this.players[1];

        white.pieces.push(new Rook(7, 0, 'white'));
        white.pieces.push(new Rook(7, 7, 'white'));
        black.pieces.push(new Rook(0, 0, 'black'));
        black.pieces.push(new Rook(0, 7, 'black'));
    }

    createKnights()
    {
        let white = this.players[0];
        let black = this.players[1];

        white.pieces.push(new Knight(7, 1, 'white'));
        white.pieces.push(new Knight(7, 6, 'white'));
        black.pieces.push(new Knight(0, 1, 'black'));
        black.pieces.push(new Knight(0, 6, 'black'));
    }

    createBishops()
    {
        let white = this.players[0];
        let black = this.players[1];

        white.pieces.push(new Bishop(7, 2, 'white'));
        white.pieces.push(new Bishop(7, 5, 'white'));
        black.pieces.push(new Bishop(0, 2, 'black'));
        black.pieces.push(new Bishop(0, 5, 'black'));
    }

    createQueens()
    {
        let white = this.players[0];
        let black = this.players[1];

        white.pieces.push(new Queen(7, 3, 'white'));
        black.pieces.push(new Queen(0, 3, 'black'));
    }

    createKings()
    {
        let white = this.players[0];
        let black = this.players[1];

        white.pieces.push(new King(7, 4, 'white'));
        black.pieces.push(new King(0, 4, 'black'));
    }

    createPiecesForPlayers()
    {
        this.createPawns();
        this.createRooks();
        this.createKnights();
        this.createBishops();
        this.createQueens();
        this.createKings();

        // This part for testing purposes
        // let white = this.players[0];
        // let black = this.players[1];

        // white.pieces.push(new Pawn(4, 4, 'white'));
        // white.pieces.push(new King(7, 4, 'white'));
        // white.pieces.push(new Pawn(4, 7, 'white'));
        // white.pieces.push(new Pawn(3, 0, 'white'));
        // white.pieces.push(new Pawn(5, 5, 'white'));
        // white.pieces.push(new Pawn(3, 6, 'white'));
        // white.pieces.push(new Pawn(4, 3, 'white'));
        // white.pieces.push(new Knight(6, 2, 'white'));

        // black.pieces.push(new King(0, 4, 'black'));
        // black.pieces.push(new Pawn(0, 0, 'black'));
        // black.pieces.push(new Pawn(2, 1, 'black'));
        // black.pieces.push(new Rook(0, 7, 'black'));
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

    highlightCheckedTile()
    {
        const [row, col] = this.getCheckedTile();
        document.querySelector(`#r${row}c${col}`).classList.add('check');
    }

    createKingDangerTiles()
    {
        // Tiles that are not allowed for a king to enter
        // might get checked.
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            
            for(let j = 0; j < player.pieces.length; j++)
            {
                const piece = player.pieces[j];

                if(piece.name === "KING") 
                {
                    piece.createDangerTiles(this.getAllGamePiecesOnBoard());
                    piece.createCastlingMoves(this.getAllGamePiecesOnBoard());
                }
            }
        }

        // Once danger tiles are created, compare to moveset
        // and delete if any match.
        for(let i = 0; i < this.players.length; i++)
        {
            let player = this.players[i];

            for(let j = 0; j < player.pieces.length; j++)
            {
                const piece = player.pieces[j];
                
                if(piece.name === 'KING') piece.deleteDangerTiles();
            }
        }
    }

    checkForEnPassant()
    {
        const all_pieces = this.getAllGamePiecesOnBoard();

        for(let piece of all_pieces)
        {
            if(piece.name === 'PAWN')
            {
                const pawn = piece;

                if(pawn.en_passant_state === pawn.en_passant_states.ENEMY_CHANCE)
                {
                    pawn.setEnPassantState(pawn.en_passant_states.DONE);
                }

                if(pawn.en_passant_state === pawn.en_passant_states.STEP)
                {
                    pawn.setEnPassantState(pawn.en_passant_states.ENEMY_CHANCE);
                }
            }
        }
    }

    monitorSpecialPieces()
    {
        this.createKingDangerTiles();
        this.checkForEnPassant();
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

        this.monitorSpecialPieces();
    }

    renderBoard()
    {
        const container = document.querySelector('.container');
        container.innerHTML = "";
        container.appendChild(this.board.renderHTML());

        if(this.isCurrentPlayerAndHasPieceOnHand()) this.showMoveset();
        if(this.isKingChecked()) this.highlightCheckedTile();

    }

    promotionHandler(event)
    {
        const id = event.target.dataset.id;
        const player = this.current_player;
        const to = this.pawn_promotion;
        
        console.log(id);

        switch (id) {
            case 'queen':
                // remove pawn
                player.removePiece(to.row, to.col);
                player.pieces.push(new Queen(to.row, to.col, player.team));
                break;

            case 'rook':
                player.removePiece(to.row, to.col);
                player.pieces.push(new Rook(to.row, to.col, player.team));
                break;
            
            case 'bishop':
                player.removePiece(to.row, to.col);
                player.pieces.push(new Bishop(to.row, to.col, player.team));
                break;

            case 'knight':
                player.removePiece(to.row, to.col);
                player.pieces.push(new Knight(to.row, to.col, player.team));
                break;
        
            default:
                break;
        }

        this.hidePawnModal();
        this.endTurn();

        // update and render
        this.message = this.current_player.team;
        this.displayHUD();
        this.updateBoard();
        this.checkIfChecked();
        this.displayCaptures();
        this.renderBoard();
    }

    setUpClickEvent()
    {
        const container = document.querySelector('.container');
        container.addEventListener('click', function(event){
            this.clickEventHandler(event);
        }.bind(this), false);

        const promotion_modal = document.querySelector('.promo-choices');
        promotion_modal.addEventListener('click', function(event){
            this.promotionHandler(event);
        }.bind(this), false);
    }

    setHUDMessage(message)
    {
        this.message = message;
        this.displayHUD();
    }

    endGame(winner)
    {
        this.players[0].stopTime();
        this.players[1].stopTime();

        console.log("GAME OVER");
        this.current_state = this.STATE.QUIT;
        this.setHUDMessage(`${winner.team} wins!`);
    }

    showMessageModal(title, message)
    {
        const _title = document.createElement('h2');
        _title.innerHTML = title;
        const _message = document.createElement('p');
        _message.innerHTML = message; 

        const modal = document.querySelector("#message-modal");
        console.log(modal);
        modal.appendChild(_title);
        modal.appendChild(_message);
        modal.setAttribute('class', 'show');
    }

    hideMessageModal()
    {
        document.querySelector("#message-modal").setAttribute('class', 'hide');
    }

    showPawnModal() 
    {
        const faces = {
            WHITE: ['♕', '♖', '♗', '♘'], 
            BLACK: ['♛', '♜', '♝', '♞'], 
            names: ['queen', 'rook', 'bishop', 'knight']
        };

        const team = this.current_player.team; 

        const choices = document.querySelector('.promo-choices');
        choices.innerHTML = "";

        for(let i = 0; i < faces.names.length; i++)
        {
            const div = document.createElement('div');
            div.setAttribute('id', `promo-${faces.names[i]}`);
            div.setAttribute('data-id', faces.names[i]);
            div.setAttribute('class', 'promo-choice');
            div.innerHTML = faces[team][i];
            choices.appendChild(div);
        }

        document.querySelector("#promo-modal").setAttribute('class', 'show');
    }
    hidePawnModal() 
    {
        document.querySelector("#promo-modal").setAttribute('class', 'hide');
    }

    start()
    {
        this.createPlayers();
        this.createPiecesForPlayers();

        
        this.updateBoard();
        this.renderBoard();

        this.setUpClickEvent();
        this.current_player = this.startTurn();
        this.current_player.startTime();
        this.displayHUD();
    }

    getEnemy()
    {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if(player.team !== this.current_player.team) return player;
        }
        return false;
    }

    unsetCheckedTile()
    {
        this.checkedTile = null;
    }

    setCheckedTile(row, col)
    {
        this.checkedTile = [row, col];
    }

    getCheckedTile()
    {
        return this.checkedTile;
    }

    isKingChecked()
    {
        return this.checkedTile !== null;
    }

    isCheckMate(player)
    {
        const king = player.getKing();
        let no_moves = false;
        let can_kill_checker = false;
        let can_block_checker = false;

        if(king.hasNoMoves()) 
        {
            console.log("King has no moves left.");
            no_moves = true;

            if(player.canKillChecker())
            {
                console.log("But the checker can be killed.");
                can_kill_checker = true;
            }
            
            if(player.canBlockChecker())
            {
                console.log("You can block the checker.");
                can_block_checker = true;
            }
        }

        else 
        {
            console.log("You can still move.");
        }

        return no_moves && !can_kill_checker && !can_block_checker;
    }

    showCheckHUD(message)
    {
        const check = document.querySelector("#check");
        check.innerHTML = "";
        check.innerHTML = message; 
        check.style.display = "block";
    }

    hideCheckHUD()
    {
        const check = document.querySelector("#check");
        check.innerHTML = "";
        check.style.display = "none";
    }

    checkIfChecked()
    {
        const enemy = this.players[(this.turn+1) % 2];
        const previous_player = this.players[(this.turn) % 2];

        const enemy_check = enemy.isCheckedBy(previous_player);
        const player_check = previous_player.isCheckedBy(enemy);

        const players = [enemy, previous_player];
        const checks = [enemy_check, player_check];

        for(let i = 0; i < players.length; i++)
        {
            let player = players[i];
            let check = checks[i];

            const king = player.getKing();

            if(!king) 
            {
                this.showCheckHUD("King is captured!");
                this.endGame(previous_player);
                break;
            }

            if(check)
            {

                console.log("CHECK!");
                this.showCheckHUD("CHECK!");
                if(this.isCheckMate(player)) 
                {
                    console.log("CHECKMATE!", previous_player);
                    this.showCheckHUD("CHECKMATE!");
                    this.endGame(previous_player);
                }
                this.setCheckedTile(king.row, king.col);
            }
        }

        if(!enemy_check && !player_check)
        {
            this.hideCheckHUD();
            this.unsetCheckedTile();
        }

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
        const on_hand = this.current_player.on_hand;
        const move_set = on_hand.getMoveSet();
        for(let i = 0; i < move_set.length; i++)
        {
            const move = move_set[i];
            
            const id = `#r${move[0]}c${move[1]}`;
            const div = document.querySelector(id);
            
            if(!this.board.isTeamFace(div.textContent, this.current_player.team))
            {
                div.classList.contains('black') ? div.classList.add('move-black') : div.classList.add('move');
            }
            
        }
        document.querySelector(`#r${on_hand.row}c${on_hand.col}`).classList.add('origin');
    }

    promotePawn(row, col)
    {
        
        console.log("Code for promoting pawn");
        this.pawn_promotion = {row: row, col: col};
        // show choices for promotion
        this.showPawnModal();
        this.current_state = this.STATE.PLAYER_PROMOTION; 
    }

    displayHUD()
    {
        const message = document.querySelector("#message");
        message.classList.add('hud');
        message.innerHTML = this.message;
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
        
        // console.log("Valid move. Pick a tile to drop your piece.", pick);
        player.keepOnHand(pick);
        this.current_state = this.STATE.PLAYER_MOVING;

    }

    playerMoving()
    {
        // console.log("Is that the tile you want,", this.current_player.team);
        const row = this.clicked_row;
        const col = this.click_col;
        const player = this.current_player;

        const result = player.move({row, col}, this.board);

        switch (result.message) {
            case 'success':
                this.endTurn();
                break;

            case 'en-passant':
                console.log(result.message);
                const enemy = result.enemy;
                this.captureEnemyPiece(enemy.row, enemy.col);
                this.endTurn();
                break;

            case 'castling':
                console.log("castling");
                this.showCheckHUD("King is captured!");
                this.endTurn();
                break;

            case 'cancel':
                console.log("Move cancelled.");
                this.refreshTurn();
                break;
            
            case 'new-pick':
                console.log("New Pick.");
                this.refreshTurn();
                this.playerTurn();
                break;

            case 'promote-move':
                console.log('Promote');
                this.promotePawn(row, col);
                break;

            case 'promote-attack':
                console.log('Promote with attack');
                this.captureEnemyPiece(row, col);
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
                console.log("Showing choices.");
                break;

            case this.STATE.QUIT:
                console.log("GAME ENDED.");
                break;
        
            default:
                break;
        }

        // update and render
        this.message = this.current_player.team;
        this.displayHUD();
        this.updateBoard();
        this.checkIfChecked();
        this.displayCaptures();
        this.renderBoard();
    }
}

let game = new Game();
game.start();