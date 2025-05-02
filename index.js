const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const playerX = document.querySelector(".player-x");
const playerO = document.querySelector(".player-o");
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

// Track player moves with indices and timestamps
let playerXMoves = [];
let playerOMoves = [];

// Track if the rule display has been shown
let ruleDisplayed = false;

initializeGame();

function initializeGame() {
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  statusText.textContent = `${currentPlayer}'s turn`;
  updateActivePlayerUI();

  // Hide rules initially
  const rulesContainer = document.getElementById("rulesContainer");
  rulesContainer.style.display = "none";

  running = true;
}

function cellClicked() {
  const cellIndex = parseInt(this.getAttribute("cellIndex"));

  if (options[cellIndex] != "" || !running) {
    return;
  }

  // Add animation class
  this.classList.add("cell-animation");

  // First, update the cell with the current player's mark
  updateCell(this, cellIndex);

  // Check if this move resulted in a win
  if (checkWinner()) {
    // Game is over, no need to manage move limits
    return;
  }

  // If the game is still running, now handle the move limit
  // Get moves array for current player
  const playerMoves = currentPlayer === "X" ? playerXMoves : playerOMoves;

  // Add the new move
  playerMoves.push({ index: cellIndex, timestamp: Date.now() });

  // Check if player now has more than 2 moves
  if (playerMoves.length > 2) {
    // Remove oldest move
    const oldestMove = playerMoves.shift();
    const oldestIndex = oldestMove.index;

    // Clear the oldest cell with a fade-out effect
    fadeOutCell(oldestIndex);

    // Show rules only the first time a mark disappears
    if (!ruleDisplayed) {
      showRules();
      ruleDisplayed = true;
    }
  }

  // Change to the other player
  changePlayer();
}

function fadeOutCell(index) {
  const cell = cells[index];
  cell.style.transition = "opacity 0.5s ease";
  cell.style.opacity = "0";

  setTimeout(() => {
    options[index] = "";
    cell.textContent = "";
    cell.style.opacity = "1";
  }, 500);
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;

  // Apply color based on player
  if (currentPlayer === "X") {
    cell.style.color = "var(--x-color)";
  } else {
    cell.style.color = "var(--o-color)";
  }
}

function updateActivePlayerUI() {
  if (currentPlayer === "X") {
    playerX.classList.add("active");
    playerO.classList.remove("active");
  } else {
    playerO.classList.add("active");
    playerX.classList.remove("active");
  }
}

function changePlayer() {
  currentPlayer = currentPlayer == "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
  updateActivePlayerUI();
}

function checkWinner() {
  let roundWon = false;

  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA == "" || cellB == "" || cellC == "") {
      continue;
    }
    if (cellA == cellB && cellB == cellC) {
      roundWon = true;

      // Highlight winning cells
      condition.forEach((index) => {
        cells[index].style.backgroundColor =
          currentPlayer === "X"
            ? "rgba(255, 84, 84, 0.25)"
            : "rgba(84, 199, 255, 0.25)";
        cells[index].style.border = `2px solid ${
          currentPlayer === "X" ? "var(--x-color)" : "var(--o-color)"
        }`;
        cells[index].style.boxShadow = `0 0 20px ${
          currentPlayer === "X"
            ? "rgba(255, 84, 84, 0.5)"
            : "rgba(84, 199, 255, 0.5)"
        }`;
      });

      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins!`;
    statusText.style.color =
      currentPlayer === "X" ? "var(--x-color)" : "var(--o-color)";
    running = false;
    return true;
  } else if (!options.includes("")) {
    statusText.textContent = `It's a draw!`;
    statusText.style.color = "#666";
    running = false;
    return true;
  }

  return false;
}

// Function to show the rules
function showRules() {
  const rulesContainer = document.getElementById("rulesContainer");
  rulesContainer.style.display = "block";
  rulesContainer.style.opacity = "0";

  // Animate the rules appearance
  setTimeout(() => {
    rulesContainer.style.transition = "opacity 0.5s ease";
    rulesContainer.style.opacity = "1";
  }, 100);

  // Position the rules in a more prominent place
  const gameContainer = document.getElementById("gameContainer");
  gameContainer.insertBefore(
    rulesContainer,
    document.getElementById("cellContainer")
  );
}

function restartGame() {
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  playerXMoves = [];
  playerOMoves = [];
  statusText.textContent = `${currentPlayer}'s turn`;
  statusText.style.color = "var(--primary-color)";

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.style.backgroundColor = "";
    cell.style.color = "";
    cell.style.border = "2px solid transparent";
    cell.style.opacity = "1";
    cell.style.boxShadow = "";
  });

  // Don't hide rules after they've been shown once
  updateActivePlayerUI();
  running = true;

  // Add restart animation
  document.getElementById("gameContainer").classList.add("restart-animation");
  setTimeout(() => {
    document
      .getElementById("gameContainer")
      .classList.remove("restart-animation");
  }, 500);
}
