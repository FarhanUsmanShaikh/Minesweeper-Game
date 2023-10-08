document.addEventListener('DOMContentLoaded', function() {
    const boardElement = document.getElementById('board');
    const timerElement = document.getElementById('timer');
    const difficultySelect = document.getElementById('difficulty-select');
    const newGameButton = document.getElementById('new-game-btn');
    let size;
    let numMines;
    let board = [];
    let revealed = [];
    let timer;
    let time = 0;

    // Initialize the game
    function initializeGame() {
        size = getSizeByDifficulty(difficultySelect.value);
        numMines = getNumMinesByDifficulty(difficultySelect.value);
        resetTimer();
        createBoard();
    }

    // Get the board size based on the difficulty level
    function getSizeByDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy':
                return { rows: 8, cols: 10 };
            case 'medium':
                return { rows: 10, cols: 12 };
            case 'hard':
                return { rows: 12, cols: 16 };
            default:
                return { rows: 10, cols: 12 };
        }
    }

    // Get the number of mines based on the difficulty level
    function getNumMinesByDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy':
                return 10;
            case 'medium':
                return 15;
            case 'hard':
                return 20;
            default:
                return 15;
        }
    }

    // Create the game board
    function createBoard() {
        clearBoard();
        for (let i = 0; i < size.rows; i++) {
            let row = [];
            for (let j = 0; j < size.cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', cellClickHandler);
                cell.addEventListener('contextmenu', cellRightClickHandler);
                boardElement.appendChild(cell);
                row.push(cell);
            }
            board.push(row);
        }
        placeMines();
    }

    // Clear the game board
    function clearBoard() {
        while (boardElement.firstChild) {
            boardElement.firstChild.remove();
        }
        board = [];
        revealed = [];
    }

    // Start the timer
    function startTimer() {
        timer = setInterval(function() {
            time++;
            timerElement.textContent = 'Timer: ' + time;
        }, 1000);
    }

    // Reset the timer
    function resetTimer() {
        clearInterval(timer);
        time = 0;
        timerElement.textContent = 'Timer: 0';
    }

    // Place mines randomly on the board
    function placeMines() {
        let count = 0;
        while (count < numMines) {
            const row = Math.floor(Math.random() * size.rows);
            const col = Math.floor(Math.random() * size.cols);
            if (!board[row][col].dataset.isMine) {
                board[row][col].dataset.isMine = true;
                count++;
            }
        }
    }

    // Handle left-click on a cell
    function cellClickHandler(event) {
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (!timer) {
            startTimer();
        }

        if (cell.dataset.isMine) {
            revealMines();
            clearInterval(timer);
            alert('Game Over!');
        } else {
            revealCell(row, col);
            if (revealed.length === (size.rows * size.cols) - numMines) {
                clearInterval(timer);
                alert('Congratulations! You won!');
            }
        }
    }

    // Handle right-click on a cell
    function cellRightClickHandler(event) {
        event.preventDefault();
        const cell = event.target;
        cell.classList.toggle('flag');
    }

    // Reveal the clicked cell
    function revealCell(row, col) {
        if (row < 0 || row >= size.rows || col < 0 || col >= size.cols ||
            revealed.includes(board[row][col]) || board[row][col].dataset.isMine) {
            return;
        }

        const mineCount = getMineCount(row, col);
        board[row][col].innerText = mineCount;
        board[row][col].classList.add('revealed');
        revealed.push(board[row][col]);

        if (mineCount === 0) {
            revealCell(row - 1, col - 1);
            revealCell(row - 1, col);
            revealCell(row - 1, col + 1);
            revealCell(row, col - 1);
            revealCell(row, col + 1);
            revealCell(row + 1, col - 1);
            revealCell(row + 1, col);
            revealCell(row + 1, col + 1);
        }
    }

    // Get the number of mines in the neighboring cells
    function getMineCount(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (row + i >= 0 && row + i < size.rows &&
                    col + j >= 0 && col + j < size.cols &&
                    board[row + i][col + j].dataset.isMine) {
                    count++;
                }
            }
        }
        return count;
    }

    // Reveal all the mines
    function revealMines() {
        for (let row = 0; row < size.rows; row++) {
            for (let col = 0; col < size.cols; col++) {
                if (board[row][col].dataset.isMine) {
                    board[row][col].innerText = 'X';
                    board[row][col].classList.add('mine');
                }
            }
        }
    }

    // Function to start a new game
    function startNewGame() {
        resetTimer();
        createBoard();
    }

    // Add event listener for the "New Game" button
    newGameButton.addEventListener('click', startNewGame);

    // Initialize the game
    initializeGame();
});
