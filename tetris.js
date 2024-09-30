const canvas = document.getElementById('tetris');  
const context = canvas.getContext('2d');  
context.scale(30, 30);  

const board = Array.from({ length: 20 }, () => Array(10).fill(0));  
let currentPiece = createPiece();  
let dropInterval = 1000;  
let lastTime = 0;  

// 描画関数  
function draw() {  
    context.clearRect(0, 0, canvas.width, canvas.height);  
    drawBoard();  
    drawPiece(currentPiece);  
}  

// ボードを描画  
function drawBoard() {  
    board.forEach((row, y) => {  
        row.forEach((value, x) => {  
            if (value) {  
                context.fillStyle = 'blue';  
                context.fillRect(x, y, 1, 1);  
            }  
        });  
    });  
}  

// 現在のピースを描画  
function drawPiece(piece) {  
    piece.shape.forEach((row, y) => {  
        row.forEach((value, x) => {  
            if (value) {  
                context.fillStyle = piece.color;  
                context.fillRect(piece.x + x, piece.y + y, 1, 1);  
            }  
        });  
    });  
}  

// ピースの作成  
function createPiece() {  
    const pieces = [  
        { shape: [[1, 1], [1, 1]], color: 'red' }, // O  
        { shape: [[0, 1, 0], [1, 1, 1]], color: 'green' }, // T  
        { shape: [[1, 0, 0], [1, 1, 1]], color: 'blue' }, // L  
        { shape: [[0, 0, 1], [1, 1, 1]], color: 'orange' }, // J  
        { shape: [[1, 1, 0], [0, 1, 1]], color: 'purple' }, // S  
        { shape: [[0, 1, 1], [1, 1, 0]], color: 'cyan' }, // Z  
        { shape: [[1, 1, 1, 1]], color: 'yellow' } // I  
    ];  
    const piece = pieces[Math.floor(Math.random() * pieces.length)];  
    piece.x = 3; // ピースの初期位置  
    piece.y = 0; // ピースの初期位置  
    return piece;  
}  

// 更新関数  
function update() {  
    const now = Date.now();  
    if (now - lastTime > dropInterval) {  
        currentPiece.y++;  
        if (collision()) {  
            currentPiece.y--;  
            merge();  
            clearRows();  
            currentPiece = createPiece();  
            if (collision()) {  
                alert('ゲームオーバー');  
                resetGame();  
            }  
        }  
        lastTime = now;  
    }  
    draw();  
    requestAnimationFrame(update);  
}  

// 衝突判定  
function collision() {  
    return currentPiece.shape.some((row, y) => {  
        return row.some((value, x) => {  
            if (value) {  
                const newX = currentPiece.x + x;  
                const newY = currentPiece.y + y;  
                return (  
                    newX < 0 || newX >= 10 || newY >= 20 || (newY >= 0 && board[newY][newX])  
                );  
            }  
            return false;  
        });  
    });  
}  

// マージ関数  
function merge() {  
    currentPiece.shape.forEach((row, y) => {  
        row.forEach((value, x) => {  
            if (value) {  
                board[currentPiece.y + y][currentPiece.x + x] = 1;  
            }  
        });  
    });  
}  

// 行のクリア  
function clearRows() {  
    board = board.filter(row => row.some(value => !value));  
    while (board.length < 20) {  
        board.unshift(Array(10).fill(0));  
    }  
}  

// 再起動  
function resetGame() {  
    board.forEach((row, y) => row.fill(0));  
    currentPiece = createPiece();  
}  

// キーイベント  
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
        const temp = currentPiece.shape;  
        currentPiece.shape = temp[0].map((_, index) => temp.map(row => row[index]).reverse());  
        if (collision()) currentPiece.shape = temp; // ローテーションを取り消す  
    }  
});  

// 初回の更新呼び出し  
update();  
