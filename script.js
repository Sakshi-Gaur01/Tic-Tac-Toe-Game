const board = document.getElementById('game-board');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const newGameButton = document.getElementById('new-game-button');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const roundsLeft = document.getElementById('rounds');
const modeSelect = document.getElementById('mode');
const startGameButton = document.getElementById('start-game');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let scores = { X: 0, O: 0 };
let rounds = 3;
let gameMode = '';

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

startGameButton.addEventListener('click', () => {
  gameMode = modeSelect.value;
  if (!gameMode) {
    alert('Please select a game mode!');
    return;
  }

  document.querySelector('.mode-selection').style.display = 'none';
  board.style.display = 'grid';
  statusText.style.display = 'block';
  resetButton.style.display = 'block';

  initGame();
});

function initGame() {
  board.innerHTML = '';
  gameState = ['', '', '', '', '', '', '', '', ''];
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  updateScoreboard();

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(event) {
  const index = event.target.dataset.index;
  if (gameState[index] || checkWinner()) return;

  makeMove(index, currentPlayer);

  if (checkWinner()) {
    scores[currentPlayer]++;
    updateScoreboard();
    rounds--;
    if (rounds === 0) {
      declareWinner();
    } else {
      statusText.textContent = `Player ${currentPlayer} Wins! Next round starting...`;
      prepareNextRound();
    }
    return;
  } else if (gameState.every(cell => cell)) {
    rounds--;
    updateScoreboard();
    if (rounds === 0) {
      declareWinner();
    } else {
      statusText.textContent = `It's a Draw! Next round starting...`;
      prepareNextRound();
    }
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  if (gameMode === 'single' && currentPlayer === 'O') {
    setTimeout(() => {
      botMove();
    }, 500);
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  const cell = board.children[index];
  cell.textContent = player;
  cell.classList.add('taken');
}

function botMove() {
  const available = gameState.map((val, idx) => val === '' ? idx : null).filter(v => v !== null);
  if (available.length === 0) return;

  const botChoice = available[Math.floor(Math.random() * available.length)];
  makeMove(botChoice, 'O');

  if (checkWinner()) {
    scores['O']++;
    updateScoreboard();
    rounds--;
    if (rounds === 0) {
      declareWinner();
    } else {
      statusText.textContent = `Computer Wins! Next round starting...`;
      prepareNextRound();
    }
    return;
  } else if (gameState.every(cell => cell)) {
    rounds--;
    updateScoreboard();
    if (rounds === 0) {
      declareWinner();
    } else {
      statusText.textContent = `It's a Draw! Next round starting...`;
      prepareNextRound();
    }
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = `Player X's Turn`;
}

function checkWinner() {
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      highlightWinningCells([a, b, c]);
      return true;
    }
  }
  return false;
}

function highlightWinningCells(indices) {
  indices.forEach(index => {
    board.children[index].style.background = 'lightgreen';
  });
}

function updateScoreboard() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  roundsLeft.textContent = rounds;
}

function declareWinner() {
  const winner = scores.X > scores.O ? 'Player X' : scores.O > scores.X ? 'Player O' : 'No one';
  statusText.innerHTML = `<span class="boom-message">${winner} Wins the Game! BOOM!</span>`;
  resetButton.style.display = 'none';
  newGameButton.style.display = 'block';
}

function prepareNextRound() {
  setTimeout(() => {
    currentPlayer = 'X';
    initGame();
  }, 1500);
}

resetButton.addEventListener('click', () => {
  if (rounds > 0) {
    currentPlayer = 'X';
    initGame();
  }
});

newGameButton.addEventListener('click', () => {
  scores = { X: 0, O: 0 };
  rounds = 3;
  currentPlayer = 'X';
  updateScoreboard();
  newGameButton.style.display = 'none';
  resetButton.style.display = 'block';
  initGame();
});
