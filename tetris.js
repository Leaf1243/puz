const canvas = document.getElementById('tetris');  
const context = canvas.getContext('2d');  
context.scale(30, 30);  

let board = Array.from({ length: 20 }, () => Array(10).fill(0));  
let currentPiece = createPiece();  
let dropInterval = 1000;  
let lastTime = 0;  
let dropStart = Date.now();  

function draw() {  
    context.clearRect(0, 0, canvas.width, canvas.height);  
    drawBoard();  
    drawPiece(currentPiece);  
}  

function drawBoard() {  
    board.forEach((row, y) => {  
        row.forEach((value, x) => {  
            if (value) {  
                context.fillStyle = 'blue';  
                context.fillRect(x, y);  
            }  
        });  
    });  
}  

function drawPiece(piece) {  
    piece.shape.forEach((row, y) => {  
        row.forEach((value, x) => {  
            if (value) {  
                context.fillStyle = piece.color;  
                context.fillRect(piece.x + x, piece.y + y);  
            }  
        });  
    });  
}  

function createPiece() {  
    const pieces = [  
        { shape: [[1, 1], [1, 1]], color: 'red' }, // O  
        { shape: [[0, 1, 0], [1, 1, 1]], color: 'green' }, // T  
        { shape: [[1, 0, 0], [1, 1, 1]], color: 'blue' }, // L  
        { shape: [[0, 0, 1], [1, 1, 1]], color: 'orange' }, // J  
        { shape: [[1, 1, 0], [0, 1, 1]], color: 'purple' }, // S  
        { shape: [[0, 1, 1], [1, 1, 0]], color: 'cyan' }, // Z  
        { shape: [[1], [1], [1], [1]], color: 'yellow' } // I  
    ];  
    return pieces[Math.floor(Math.random() * pieces.length)];  
}  

function update() {  
    const now = Date.now();  
    if (now - dropStart > dropInterval) {  
        currentPiece.y++;  
        dropStart = now;  
        if (collision()) {  
            currentPiece.y--;  
            merge();  
            clearRows();  
            currentPiece = createPiece();  
        }  
    }  
    draw();  
    requestAnimationFrame(update);  
}  

function collision() {  
    return currentPiece.shape.some((row, y) => {  
        return row.some((value, x) => {  
            if (value) {  
                const newX = currentPiece.x + x;  
                const newY = currentPiece.y + y;  
                return (  
                    newX < 0 || newX >= board[0].length || newY >= board.length || (newY >= 0 && board[newY][newX])  
                );  
            }  
            return false;  
        });  
    });  
}  

function merge() {  
    currentPiece.shape.forEach((row, y) => {  
        row.forEach((value, x) => {  
            if (value) {  
                board[currentPiece.y + y][currentPiece.x + x] = 1;  
            }  
        });  
    });  
}  

function clearRows() {  
    board = board.filter(row => row.some(value => !value));  
    while (board.length < 20) {  
        board.unshift(Array(10).fill(0));  
    }  
}  

document.addEventListener('keydown', (e) => {  
    if (e.key === 'ArrowLeft') {  
        currentPiece.x--;  
        if (collision()) currentPiece.x++;  
    }  
    if (e.key === 'ArrowRight') {  
        currentPiece.x++;  
        if (collision()) currentPiece.x--;  
    }  
    if (e.key === 'ArrowDown') {  
        currentPiece.y++;  
        if (collision()) {  
            currentPiece.y--;  
            merge();  
            clearRows();  
            currentPiece = createPiece();  
        }  
    }  
    if (e.key === 'ArrowUp') {  
        // Rotate  
        const temp = currentPiece.shape;  
        currentPiece.shape = temp[0].map((val, index) => temp.map(row => row[index]).reverse());  
        if (collision()) currentPiece.shape = temp; // Undo rotation if collision  
    }  
});  

update();  
