const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const boardSize = 4;
let board = [];
let score = 0;

// Variables for touch detection
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const touchThreshold = 20; // Minimum pixel distance for a swipe to be detected
let touchMoved = false; // Flag to indicate if the touch has moved significantly

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
            // Add a class based on the tile value for styling
            if (board[r][c] !== 0) {
                tile.classList.add('tile-' + board[r][c]); // e.g., tile-2, tile-4
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
                // Add more conditions for higher tile values if needed
            }
            gameBoard.appendChild(tile);
        }
    }
}

function updateScore() {
    scoreDisplay.textContent = score;
}

// --- Movement Logic (assuming these are your core movement functions) ---
// You will need to implement the actual logic for shifting and merging tiles
// within these functions. For example, using helper functions like `slide` and `combine`.

function slideTiles(row) {
    // 1. Remove zeros
    let arr = row.filter(num => num !== 0);
    // 2. Add zeros to the end
    while (arr.length < boardSize) {
        arr.push(0);
    }
    return arr;
}

function combineTiles(row) {
    for (let i = 0; i < boardSize - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i]; // Update score on merge
            row[i + 1] = 0;
        }
    }
    return row;
}

function moveLeft() {
    let boardChanged = false;
    for (let r = 0; r < boardSize; r++) {
        let originalRow = [...board[r]]; // Copy original row
        let row = slideTiles(originalRow);
        row = combineTiles(row);
        row = slideTiles(row);
        if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
            boardChanged = true;
            board[r] = row;
        }
    }
    if (boardChanged) {
        addNewTile();
        drawBoard();
        updateScore();
    }
}

function moveRight() {
    let boardChanged = false;
    for (let r = 0; r < boardSize; r++) {
        let originalRow = [...board[r]]; // Copy original row
        let row = originalRow.reverse(); // Reverse for right slide
        row = slideTiles(row);
        row = combineTiles(row);
        row = slideTiles(row);
        row = row.reverse(); // Reverse back
        if (JSON.stringify(originalRow.reverse()) !== JSON.stringify(row)) { // Compare reversed original
            boardChanged = true;
            board[r] = row;
        }
    }
    if (boardChanged) {
        addNewTile();
        drawBoard();
        updateScore();
    }
}

function moveUp() {
    let boardChanged = false;
    for (let c = 0; c < boardSize; c++) {
        let col = [];
        for (let r = 0; r < boardSize; r++) {
            col.push(board[r][c]);
        }
        let originalCol = [...col]; // Copy original column
        col = slideTiles(col);
        col = combineTiles(col);
        col = slideTiles(col);
        if (JSON.stringify(originalCol) !== JSON.stringify(col)) {
            boardChanged = true;
            for (let r = 0; r < boardSize; r++) {
                board[r][c] = col[r];
            }
        }
    }
    if (boardChanged) {
        addNewTile();
        drawBoard();
        updateScore();
    }
}

function moveDown() {
    let boardChanged = false;
    for (let c = 0; c < boardSize; c++) {
        let col = [];
        for (let r = 0; r < boardSize; r++) {
            col.push(board[r][c]);
        }
        let originalCol = [...col]; // Copy original column
        col.reverse(); // Reverse for down slide
        col = slideTiles(col);
        col = combineTiles(col);
        col = slideTiles(col);
        col.reverse(); // Reverse back
        if (JSON.stringify(originalCol.reverse()) !== JSON.stringify(col)) { // Compare reversed original
            boardChanged = true;
            for (let r = 0; r < boardSize; r++) {
                board[r][c] = col[r];
            }
        }
    }
    if (boardChanged) {
        addNewTile();
        drawBoard();
        updateScore();
    }
}

// --- Event Handlers ---

function handleKeyPress(event) {
    if (event.key.startsWith('Arrow')) {
        event.preventDefault(); // Prevent page scrolling
        switch (event.key) {
            case "ArrowUp":
                moveUp();
                break;
            case "ArrowDown":
                moveDown();
                break;
            case "ArrowLeft":
                moveLeft();
                break;
            case "ArrowRight":
                moveRight();
                break;
        }
    }
}

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchMoved = false; // Reset the flag
    // event.preventDefault(); // Prevent default scrolling/zooming immediately
}

function handleTouchMove(event) {
    // Only set touchMoved if the finger has actually moved
    if (Math.abs(event.touches[0].clientX - touchStartX) > touchThreshold ||
        Math.abs(event.touches[0].clientY - touchStartY) > touchThreshold) {
        touchMoved = true;
    }
    event.preventDefault(); // Prevent scrolling on touch move
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].changedTouches[0].clientY; // This is a common error. See explanation below
    touchMoved = event.changedTouches[0].changedTouches[0].clientY; // This is a common error. See explanation below

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Only process if a significant swipe occurred
    if (touchMoved && (Math.abs(diffX) > touchThreshold || Math.abs(diffY) > touchThreshold)) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0) {
                moveRight();
            } else {
                moveLeft();
            }
        } else {
            // Vertical swipe
            if (diffY > 0) {
                moveDown();
            } else {
                moveUp();
            }
        }
    }
    // event.preventDefault(); // Might not be needed here if handled in touchmove
}

// --- Initialize Game and Add Event Listeners ---
initializeBoard();

document.addEventListener('keydown', handleKeyPress);
gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
gameBoard.addEventListener('touchmove', handleTouchMove, { passive: false });
gameBoard.addEventListener('touchend', handleTouchEnd); // No passive: false needed for touchend
