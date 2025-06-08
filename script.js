document.addEventListener('DOMContentLoaded', () => {
 const board = document.getElementById('board');
 const cells = document.querySelectorAll('.cell');
 const statusDisplay = document.getElementById('status');
 const resetButton = document.getElementById('reset');
 const humanModeButton = document.getElementById('human-mode');
 const computerModeButton = document.getElementById('computer-mode');
 
 let gameState = ['', '', '', '', '', '', '', '', ''];
 let currentPlayer = 'X';
 let gameActive = false;
 let vsComputer = false;
 
 const winningConditions = [
     [0, 1, 2], // top row
     [3, 4, 5], // middle row
     [6, 7, 8], // bottom row
     [0, 3, 6], // left column
     [1, 4, 7], // middle column
     [2, 5, 8], // right column
     [0, 4, 8], // diagonal top-left to bottom-right
     [2, 4, 6]  // diagonal top-right to bottom-left
 ];
 
 // Initialize the game
 function initializeGame() {
     cells.forEach(cell => {
         cell.classList.remove('x', 'o', 'winning-cell');
         cell.textContent = '';
     });
     gameState = ['', '', '', '', '', '', '', '', ''];
     currentPlayer = 'X';
     gameActive = true;
     updateStatus();
 }
 
 // Update game status display
 function updateStatus() {
     if (!gameActive) return;
     
     if (vsComputer && currentPlayer === 'O') {
         statusDisplay.textContent = "Computer's turn";
     } else {
         statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
     }
 }
 
 // Handle cell click
 function handleCellClick(e) {
     const clickedCell = e.target;
     const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
     
     // If cell already used or game not active, ignore click
     if (gameState[clickedCellIndex] !== '' || !gameActive) return;
     
     // Make the move
     makeMove(clickedCell, clickedCellIndex, currentPlayer);
     
     // Check for win or draw
     checkResult();
 }
 
 // Make a move on the board
 function makeMove(cell, index, player) {
     gameState[index] = player;
     cell.textContent = player;
     cell.classList.add(player.toLowerCase());
 }
 
 // Check if the game has been won or is a draw
 function checkResult() {
     let roundWon = false;
     
     // Check all winning conditions
     for (let i = 0; i < winningConditions.length; i++) {
         const [a, b, c] = winningConditions[i];
         
         if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
             continue;
         }
         
         if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
             roundWon = true;
             
             // Highlight winning cells
             cells[a].classList.add('winning-cell');
             cells[b].classList.add('winning-cell');
             cells[c].classList.add('winning-cell');
             break;
         }
     }
     
     // If won, end game
     if (roundWon) {
         const winner = currentPlayer === 'X' ? (vsComputer ? 'You' : 'Player X') : (vsComputer ? 'Computer' : 'Player O');
         statusDisplay.textContent = `${winner} wins!`;
         gameActive = false;
         return;
     }
     
     // If no winner and board is full, it's a draw
     if (!gameState.includes('')) {
         statusDisplay.textContent = "Game ended in a draw!";
         gameActive = false;
         return;
     }
     
     // Switch players
     currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
     updateStatus();
     
     // If playing against computer and it's computer's turn
     if (vsComputer && gameActive && currentPlayer === 'O') {
         setTimeout(() => computerMove(), 500);
     }
 }
 
 // Computer makes a move
 function computerMove() {
     if (!gameActive) return;
     
     // Simple AI: first try to win, then block, then random move
     let move = findWinningMove('O') || findWinningMove('X') || findRandomMove();
     
     if (move !== null) {
         makeMove(cells[move], move, 'O');
         checkResult();
     }
 }
 
 // Find a winning move for the specified player
 function findWinningMove(player) {
     for (let i = 0; i < winningConditions.length; i++) {
         const [a, b, c] = winningConditions[i];
         
         // Check if two in a row and third is empty
         if (gameState[a] === player && gameState[b] === player && gameState[c] === '') {
             return c;
         }
         if (gameState[a] === player && gameState[c] === player && gameState[b] === '') {
             return b;
         }
         if (gameState[b] === player && gameState[c] === player && gameState[a] === '') {
             return a;
         }
     }
     return null;
 }
 
 // Find a random available move
 function findRandomMove() {
     const availableMoves = [];
     for (let i = 0; i < gameState.length; i++) {
         if (gameState[i] === '') {
             availableMoves.push(i);
         }
     }
     
     if (availableMoves.length > 0) {
         return availableMoves[Math.floor(Math.random() * availableMoves.length)];
     }
     return null;
 }
 
 // Reset the game
 function resetGame() {
     initializeGame();
 }
 
 // Set up human vs human game
 function setHumanMode() {
     vsComputer = false;
     statusDisplay.textContent = "Human vs Human - Player X's turn";
     initializeGame();
 }
 
 // Set up human vs computer game
 function setComputerMode() {
     vsComputer = true;
     statusDisplay.textContent = "Human vs Computer - Your turn (X)";
     initializeGame();
 }
 
 // Event listeners
 cells.forEach(cell => cell.addEventListener('click', handleCellClick));
 resetButton.addEventListener('click', resetGame);
 humanModeButton.addEventListener('click', setHumanMode);
 computerModeButton.addEventListener('click', setComputerMode);
});