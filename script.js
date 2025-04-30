// 棋盘大小和地雷数量
const BOARD_SIZE = 10;
const MINE_COUNT = 15;

// 初始化游戏状态
let board = [];
let mines = [];
let revealedCells = 0;

// 获取游戏元素
const gameBoard = document.querySelector('.game-board');
const resetBtn = document.querySelector('.reset-btn');
const mineCount = document.querySelector('.mine-count');

// 初始化游戏
function initGame() {
  // 重置游戏状态
  board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
  mines = [];
  revealedCells = 0;
  gameBoard.innerHTML = '';
  
  // 设置棋盘样式
  gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 30px)`;
  
  // 生成地雷
  generateMines();
  
  // 计算相邻地雷数量
  calculateAdjacentMines();
  
  // 创建棋盘
  createBoard();
  
  // 更新地雷计数
  mineCount.textContent = `💣${MINE_COUNT}`;
}

// 随机生成地雷
function generateMines() {
  while (mines.length < MINE_COUNT) {
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);
    if (!mines.some(mine => mine[0] === x && mine[1] === y)) {
      mines.push([x, y]);
      board[x][y] = -1;
    }
  }
}

// 计算每个单元格相邻的地雷数量
function calculateAdjacentMines() {
  for (const [x, y] of mines) {
    for (let i = Math.max(0, x - 1); i <= Math.min(BOARD_SIZE - 1, x + 1); i++) {
      for (let j = Math.max(0, y - 1); j <= Math.min(BOARD_SIZE - 1, y + 1); j++) {
        if (board[i][j] !== -1) {
          board[i][j]++;
        }
      }
    }
  }
}

// 创建棋盘UI
function createBoard() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = i;
      cell.dataset.y = j;
      cell.addEventListener('click', handleCellClick);
      gameBoard.appendChild(cell);
    }
  }
}

// 处理单元格点击事件
function handleCellClick(e) {
  const cell = e.target;
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);
  
  if (board[x][y] === -1) {
    // 点击到地雷
    gameOver();
    return;
  }
  
  // 显示单元格内容
  revealCell(cell, x, y);
  
  // 检查是否胜利
  if (revealedCells === BOARD_SIZE * BOARD_SIZE - MINE_COUNT) {
    gameWin();
  }
}

// 显示单元格内容
function revealCell(cell, x, y) {
  if (cell.classList.contains('revealed')) return;
  
  cell.classList.add('revealed');
  revealedCells++;
  
  if (board[x][y] > 0) {
    cell.textContent = board[x][y];
  }
  
  // 如果单元格为空，自动展开相邻单元格
  if (board[x][y] === 0) {
    for (let i = Math.max(0, x - 1); i <= Math.min(BOARD_SIZE - 1, x + 1); i++) {
      for (let j = Math.max(0, y - 1); j <= Math.min(BOARD_SIZE - 1, y + 1); j++) {
        const adjacentCell = document.querySelector(`.cell[data-x='${i}'][data-y='${j}']`);
        revealCell(adjacentCell, i, j);
      }
    }
  }
}

// 游戏结束
function gameOver() {
  alert('游戏结束！');
  resetBtn.textContent = '😵';
  revealAllMines();
}

// 游戏胜利
function gameWin() {
  alert('恭喜你，胜利了！');
  resetBtn.textContent = '😎';
}

// 显示所有地雷
function revealAllMines() {
  for (const [x, y] of mines) {
    const cell = document.querySelector(`.cell[data-x='${x}'][data-y='${y}']`);
    cell.textContent = '💣';
    cell.classList.add('revealed');
  }
}

// 重置按钮点击事件
resetBtn.addEventListener('click', () => {
  resetBtn.textContent = '😊';
  initGame();
});

// 初始化游戏
initGame();
