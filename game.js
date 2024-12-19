class Game {
    constructor(boardSize = 4) {
        this.boardSize = boardSize;
        this.board = [];
        this.score = 0;
        this.gameBoard = document.getElementById('game-board');
        this.scoreDisplay = document.getElementById('score');
        this.newGameButton = document.getElementById('new-game');

        this.initializeBoard();
        this.setupEventListeners();
        this.renderBoard();
    }

    initializeBoard() {
        // emoty board
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        
        // add tiles
        this.addRandomTile();
        this.addRandomTile();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp': this.move('up'); break;
                case 'ArrowDown': this.move('down'); break;
                case 'ArrowLeft': this.move('left'); break;
                case 'ArrowRight': this.move('right'); break;
            }
        });

        // new game butt
        this.newGameButton.addEventListener('click', () => this.resetGame());
    }

    addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                if (this.board[r][c] === 0) {
                    emptyCells.push({r, c});
                }
            }
        }

        if (emptyCells.length > 0) {
            const {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        let moved = false;
        const rotatedBoard = this.rotateBoard(direction);
        
        for (let r = 0; r < this.boardSize; r++) {
            const row = rotatedBoard[r].filter(val => val !== 0);
            
            
            for (let c = 0; c < row.length - 1; c++) {
                if (row[c] === row[c + 1]) {
                    row[c] *= 2;
                    this.score += row[c];
                    row.splice(c + 1, 1);
                    moved = true;
                }
            }

            
            while (row.length < this.boardSize) {
                row.push(0);
            }

            rotatedBoard[r] = row;
            if (JSON.stringify(rotatedBoard[r]) !== JSON.stringify(this.board[r])) {
                moved = true;
            }
        }

        // rotate back the board
        this.board = this.unrotateBoard(rotatedBoard, direction);

        if (moved) {
            this.addRandomTile();
            this.renderBoard();
            this.updateScore();
            this.checkGameStatus();
        }
    }

    rotateBoard(direction) {
        let board = JSON.parse(JSON.stringify(this.board));
        switch(direction) {
            case 'up':
                board = this.transpose(board);
                break;
            case 'right':
                board = board.map(row => row.reverse());
                break;
            case 'down':
                board = this.transpose(board.reverse());
                break;
            case 'left':
                break;
        }
        return board;
    }

    unrotateBoard(board, direction) {
        switch(direction) {
            case 'up':
                board = this.transpose(board);
                break;
            case 'right':
                board = board.map(row => row.reverse());
                break;
            case 'down':
                board = this.transpose(board.reverse());
                break;
            case 'left':
                break;
        }
        return board;
    }

    transpose(matrix) {
        return matrix[0].map((col, i) => matrix.map(row => row[i]));
    }

    renderBoard() {
        // Clear exist board
        this.gameBoard.innerHTML = '';

        // Create tiles
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                const tileValue = this.board[r][c];
                const tileElement = document.createElement('div');
                tileElement.classList.add('tile');
                
                if (tileValue !== 0) {
                    tileElement.textContent = tileValue;
                    tileElement.classList.add(`tile-${tileValue}`);
                }
                
                this.gameBoard.appendChild(tileElement);
            }
        }
    }

    updateScore() {
        this.scoreDisplay.textContent = this.score;
    }

    checkGameStatus() {
        // condition win
        if (this.board.some(row => row.includes(2048))) {
            alert('Congratulations! You won!');
            this.resetGame();
            return;
        }

        // condition lose
        const hasEmptyCell = this.board.some(row => row.includes(0));
        const canMerge = this.checkMergePossibility();

        if (!hasEmptyCell && !canMerge) {
            alert('Game Over! No more moves possible.');
            this.resetGame();
        }
    }

    checkMergePossibility() {
        // check any tiles can be merged
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                const current = this.board[r][c];
                
                // right
                if (c < this.boardSize - 1 && current === this.board[r][c + 1]) return true;
                
                // down
                if (r < this.boardSize - 1 && current === this.board[r + 1][c]) return true;
            }
        }
        return false;
    }

    resetGame() {
        this.board = [];
        this.score = 0;
        this.initializeBoard();
        this.renderBoard();
        this.updateScore();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
