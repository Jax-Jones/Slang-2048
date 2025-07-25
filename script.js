const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
const boardSize = 4;
let board = [];
let score = 0;

// Initialize the board
function initializeBoard() {
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    score = 0;
    addNewTile();
    addNewTile(); 
    drawBoard();
    updateScore();
}

// Add a new tile (2, 4 or 8) to a random empty spot
function addNewTile() {
    let emptyTiles = [];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0) {
                emptyTiles.push({ r, c });
            }
        }
    }
    if (emptyTiles.length > 0) {
        let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        let randomNumber = Math.random();
        let value;

        if (randomNumber < 0.89) {
            value = 2;
        } else if (randomNumber < 0.99) {
            value = 4;
        } else {
            value = 8;
        }

        board[r][c] = value;
    }
}

// Update the HTML board display
function drawBoard() {
    gameBoard.innerHTML = '';
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (board[r][c] !== 0) {
                if (board[r][c] == 2) {
                    tile.textContent = "Skibidi";
                }
                if (board[r][c] == 4) {
                    tile.textContent = "Sigma";
                }
                if (board[r][c] == 8) {
                    tile.textContent = "Rizz";
                }
                if (board[r][c] == 16) {
                    tile.textContent = "Ohio";
                }
                if (board[r][c] == 32) {
                    tile.textContent = "Mew";
                }
                if (board[r][c] == 64) {
                    tile.textContent = "Alpha";
                }
                if (board[r][c] == 128) {
                    tile.textContent = "Gyatt";
                }
                if (board[r][c] == 256) {
                    tile.textContent = "Uwu";
                }
                if (board[r][c] == 512) {
                    tile.textContent = "Sus";
                }
                if (board[r][c] == 1024) {
                    tile.textContent = "Cap";
                }
                if (board[r][c] == 2048) {
                    tile.textContent = "Goat";
                }
                if (board[r][c] == 4096) {
                    tile.textContent = "Slick";
                }
                tile.classList.add(`tile-${board[r][c]}`); // For CSS styling
            }
            gameBoard.appendChild(tile);
        }
    }
}

// Update the score display
function updateScore() {
    scoreDisplay.textContent = score;
    if (score >= highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore.toString());
        highScoreElement.textContent = `High Score: ${highScore}`
    }
    highScoreElement.textContent = `High Score: ${highScore}`
}

// Helper function to filter out zeros from a row/column
function filterZeros(row) {
    return row.filter(val => val !== 0);
}

// Helper function to add zeros back to a row/column after sliding
function addZeros(arr) {
    let missing = boardSize - arr.length;
    let zeros = Array(missing).fill(0);
    return arr.concat(zeros);
}

// Slide and combine tiles in a row (e.g., for left move)
function slideAndCombineRow(row) {
    let filteredRow = filterZeros(row); // Remove zeros
    let merged = false;

    // Combine identical tiles
    for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
            filteredRow[i] *= 2;
            score += filteredRow[i];
            filteredRow.splice(i + 1, 1); // Remove the merged tile
            merged = true;
        }
    }
    return { row: addZeros(filteredRow), merged: merged };
}

// Handle key presses
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    let moved = false;
    let newBoard = board.map(row => [...row]); // Create a copy of the board

    switch (e.key) {
        case 'ArrowUp':
            for (let c = 0; c < boardSize; c++) {
                let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
                let { row: newColumn, merged: colMerged } = slideAndCombineRow(column);
                if (colMerged || newColumn.some((val, i) => val !== column[i])) moved = true;
                for (let r = 0; r < boardSize; r++) {
                    newBoard[r][c] = newColumn[r];
                }
            }
            break;
        case 'ArrowDown':
            for (let c = 0; c < boardSize; c++) {
                let column = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse();
                let { row: newColumn, merged: colMerged } = slideAndCombineRow(column);
                if (colMerged || newColumn.some((val, i) => val !== column[i])) moved = true;
                newColumn.reverse(); // Reverse back for correct placement
                for (let r = 0; r < boardSize; r++) {
                    newBoard[r][c] = newColumn[r];
                }
            }
            break;
        case 'ArrowLeft':
            for (let r = 0; r < boardSize; r++) {
                let { row: newRow, merged: rowMerged } = slideAndCombineRow(board[r]);
                if (rowMerged || newRow.some((val, i) => val !== board[r][i])) moved = true;
                newBoard[r] = newRow;
            }
            break;
        case 'ArrowRight':
            for (let r = 0; r < boardSize; r++) {
                let row = [...board[r]].reverse(); // Reverse the row for rightward movement
                let { row: newRow, merged: rowMerged } = slideAndCombineRow(row);
                if (rowMerged || newRow.some((val, i) => val !== row[i])) moved = true;
                newBoard[r] = newRow.reverse(); // Reverse back for correct placement
            }
            break;
    }

    if (moved) {
        board = newBoard; // Update the actual board only if a move occurred
        addNewTile();
        drawBoard();
        updateScore();
        checkGameOver();
    }
});

// Game over and win conditions
let gameOver = false;
function checkGameOver() {
    // Check for win
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 2048) {
                // Handle win condition (e.g., display a message)
                console.log('You Win!');
                //gameOver = true;
                return;
            }
        }
    }

    // Check for lose (no empty cells and no possible merges)
    let hasEmpty = board.some(row => row.includes(0));
    if (!hasEmpty) {
        let canMerge = false;
        // Check horizontal merges
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize - 1; c++) {
                if (board[r][c] !== 0 && board[r][c] === board[r][c + 1]) {
                    canMerge = true;
                    break;
                }
            }
            if (canMerge) break;
        }
        if (!canMerge) {
            // Check vertical merges
            for (let c = 0; c < boardSize; c++) {
                for (let r = 0; r < boardSize - 1; r++) {
                    if (board[r][c] !== 0 && board[r][c] === board[r + 1][c]) {
                        canMerge = true;
                        break;
                    }
                }
                if (canMerge) break;
            }
        }

        if (!canMerge) {
            console.log('Game Over!');
            gameOver = true;
            highScoreElement.textContent = `GAME OVER`
            setTimeout(function() {
                window.location = "2048.html"
            }, 5000);
            // Display game over screen/message
        }
    }
}

// Start the game when the page loads
window.onload = initializeBoard;
