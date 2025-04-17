const gameboardFunction = (function () {
  let playerOne = {
    positions: [],
    score: 0,
    turn: true,
  };
  let playerTwo = {
    positions: [],
    score: 0,
    turn: false,
  };

  let turn = 0;

  const getPlayerOne = function () {
    return playerOne;
  };

  const getPlayerTwo = function () {
    return playerTwo;
  };

  const resetGame = function () {
    playerOne.positions = [];
    playerTwo.positions = [];
    playerOne.turn = true;
    playerTwo.turn = false;
    turn = 0;
  };

  const runPlayerTurn = (position) => {
    if (
      playerOne.positions.includes(Number(position)) ||
      playerTwo.positions.includes(Number(position))
    ) {
      return console.log("A célula já foi escolhida");
    } else if (playerOne.turn) {
      playerOne.positions.push(Number(position));
      turn += 1;
      if (checkWinner(playerOne)) {
        return 1;
      }
      playerOne.turn = false;
      playerTwo.turn = true;
    } else if (playerTwo.turn) {
      playerTwo.positions.push(Number(position));
      turn += 1;
      if (checkWinner(playerTwo)) {
        return 2;
      }
      playerTwo.turn = false;
      playerOne.turn = true;
    }

    if (turn >= 9) {
      playerOne.turn = true;
      playerTwo.turn = false;
      playerOne.positions = [];
      playerTwo.positions = [];
      turn = 0;
      return 3;
    }
    return 0;
  };

  const checkWinner = (player) => {
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const win = winningPatterns.some((pattern) =>
      pattern.every((element) => player.positions.includes(element))
    );

    if (win) {
      player.score += 1;
    }

    return win;
  };

  return {
    runPlayerTurn,
    getPlayerOne,
    getPlayerTwo,
    resetGame,
  };
})();

const updateBoard = (e) => {
  const player1 = gameboardFunction.getPlayerOne();
  const player2 = gameboardFunction.getPlayerTwo();
  const number = Number(e.target.dataset.index);
  const xIcon = ` <svg
            xmlns="http://www.w3.org/2000/svg"
            class="xIcon"
            viewBox="0 0 512 512"
          >
            <path
              class="x"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M368 368L144 144M368 144L144 368"
            />
          </svg>`;

  const oIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="oIcon" viewBox="0 0 512 512"><circle class="o" cx="256" cy="256" r="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`;
  const xFragment = document.createRange().createContextualFragment(xIcon);
  const oFragment = document.createRange().createContextualFragment(oIcon);
  const playerTurn = document.querySelector(".player-turn");
  playerTurn.textContent = player1.turn ? "Player 2 turn" : "Player 1 turn";
  if (!e.target.hasChildNodes()) {
    if (player1.turn && !player2.positions.includes(number)) {
      e.target.appendChild(xFragment);
    } else if (player2.turn && !player1.positions.includes(number)) {
      e.target.appendChild(oFragment);
    }
  }

  const result = gameboardFunction.runPlayerTurn(number);

  setTimeout(() => {
    const messageContainer = document.querySelector(".message-container");
    const messageText = document.querySelector(".message");
    const playerOneScore = document.querySelector(".player-one");
    const playerTwoScore = document.querySelector(".player-two");
    if (result) {
      messageText.innerText = result == 3 ? "Draw" : `Player ${result} wins!`;
      if (result == 1) {
        playerOneScore.innerText = `Player 1 score: ${player1.score}`;
      } else if (result == 2) {
        playerTwoScore.innerText = `Player 2 score: ${player2.score}`;
      }
      messageContainer.classList.remove("hidden");
      messageContainer.classList.add("message-container-animation");
      messageText.classList.add("message-animation");
      gameboardCells.forEach((cell) => (cell.textContent = ""));
    }

    messageText.onanimationend = () => {
      messageContainer.classList.remove("message-container-animation");
      messageText.classList.remove("message-animation");
      messageContainer.classList.add("hidden");
      playerTurn.textContent = "Player 1 turn";
      gameboardFunction.resetGame();
    };
  }, 750);
};

const gameboardCells = document.querySelectorAll(".cell");

gameboardCells.forEach((cell) => {
  cell.addEventListener("click", (e) => {
    updateBoard(e);
  });
});
