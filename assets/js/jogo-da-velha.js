document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const startGameButton = document.getElementById('startGame');
    const pauseGameButton = document.getElementById('pauseGame');
    const resetGameButton = document.getElementById('resetGame');
    const winsElement = document.getElementById('wins');
    const lossesElement = document.getElementById('losses');
    const drawsElement = document.getElementById('draws');
    const difficultySelect = document.getElementById('difficulty');
    const playerSymbolSelect = document.getElementById('playerSymbol');

    let board = Array(9).fill(null);
    let playerSymbol = 'X';
    let computerSymbol = 'O';
    let currentPlayer = 'player'; // 'player' or 'computer'
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let gameActive = false;
    let gamePaused = false;

    function loadGameStats() {
        const storedWins = localStorage.getItem('ticTacToeWins');
        const storedLosses = localStorage.getItem('ticTacToeLosses');
        const storedDraws = localStorage.getItem('ticTacToeDraws');
        if (storedWins) wins = parseInt(storedWins);
        if (storedLosses) losses = parseInt(storedLosses);
        if (storedDraws) draws = parseInt(storedDraws);
        winsElement.textContent = wins;
        lossesElement.textContent = losses;
        drawsElement.textContent = draws;
    }

    function saveGameStats() {
        localStorage.setItem('ticTacToeWins', wins);
        localStorage.setItem('ticTacToeLosses', losses);
        localStorage.setItem('ticTacToeDraws', draws);
        winsElement.textContent = wins;
        lossesElement.textContent = losses;
        drawsElement.textContent = draws;
    }

    function resetGameStats() {
        wins = 0;
        losses = 0;
        draws = 0;
        saveGameStats();
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        board = Array(9).fill(null);
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => handlePlayerMove(i));
            gameBoard.appendChild(cell);
        }
    }

    function handlePlayerMove(index) {
        if (!gameActive || gamePaused || board[index] || currentPlayer !== 'player') return;
        board[index] = playerSymbol;
        updateBoard();
        if (checkWinner(playerSymbol)) {
            wins++;
            saveGameStats();
            alert('Você venceu!');
            endGame();
        } else if (board.every(cell => cell)) {
            draws++;
            saveGameStats();
            alert('Empate!');
            endGame();
        } else {
            currentPlayer = 'computer';
            handleComputerMove();
        }
    }

    function handleComputerMove() {
        if (gamePaused) return;
        const difficulty = difficultySelect.value;
        let move;
        if (difficulty === 'easy') {
            move = getRandomMove();
        } else if (difficulty === 'medium') {
            move = getMediumMove();
        } else {
            move = getBestMove();
        }
        board[move] = computerSymbol;
        updateBoard();
        if (checkWinner(computerSymbol)) {
            losses++;
            saveGameStats();
            alert('Computador venceu!');
            endGame();
        } else if (board.every(cell => cell)) {
            draws++;
            saveGameStats();
            alert('Empate!');
            endGame();
        } else {
            currentPlayer = 'player';
        }
    }

    function getRandomMove() {
        const emptyCells = board.map((cell, index) => (cell ? null : index)).filter(index => index !== null);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function getMediumMove() {
        return Math.random() < 0.5 ? getRandomMove() : getBestMove();
    }

    function getBestMove() {
        let bestMove;
        let bestValue = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = computerSymbol;
                let moveValue = minimax(board, 0, false);
                board[i] = null;
                if (moveValue > bestValue) {
                    bestMove = i;
                    bestValue = moveValue;
                }
            }
        }
        return bestMove;
    }

    function minimax(newBoard, depth, isMaximizing) {
        let scores = { [playerSymbol]: -1, [computerSymbol]: 1, tie: 0 };
        let winner = checkWinner(computerSymbol) ? computerSymbol : checkWinner(playerSymbol) ? playerSymbol : null;
        if (winner || newBoard.every(cell => cell)) {
            return scores[winner] || scores.tie;
        }
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!newBoard[i]) {
                    newBoard[i] = computerSymbol;
                    let score = minimax(newBoard, depth + 1, false);
                    newBoard[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!newBoard[i]) {
                    newBoard[i] = playerSymbol;
                    let score = minimax(newBoard, depth + 1, true);
                    newBoard[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function updateBoard() {
        for (let i = 0; i < 9; i++) {
            gameBoard.children[i].textContent = board[i];
        }
    }

    function checkWinner(symbol) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern => pattern.every(index => board[index] === symbol));
    }

    function endGame() {
        gameActive = false;
        gamePaused = false;
        createBoard();
    }

    startGameButton.addEventListener('click', () => {
        playerSymbol = playerSymbolSelect.value;
        computerSymbol = playerSymbol === 'X' ? 'O' : 'X';
        gameActive = true;
        gamePaused = false;
        createBoard();
    });

    pauseGameButton.addEventListener('click', () => {
        gamePaused = !gamePaused;
        pauseGameButton.textContent = gamePaused ? 'Retomar Jogo' : 'Pausar Jogo';
        if (!gamePaused && currentPlayer === 'computer') {
            handleComputerMove();
        }
    });

    resetGameButton.addEventListener('click', () => {
        resetGameStats();
        createBoard();
    });

    loadGameStats();
    createBoard();
});
