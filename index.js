window.onload = function () {
  const numberButtons = document.querySelectorAll(".number");
  const scoreElement = document.getElementById("score");
  const timerElement = document.getElementById("timer");
  const targetNumberElement = document.getElementById("target-number");
  const gameContainer = document.getElementById("game-container");
  const resultsContainer = document.getElementById("results-container");
  const finalScoreElement = document.querySelectorAll(".final-score");
  const intro = document.getElementById("intro");
  const nextBtn = document.getElementById("next-btn");
  const startOverlay = document.getElementById("start-overlay");
  const countdownOverlay = document.getElementById("countdown");
  const countdownElement = document.getElementById("countdown-el");
  const clickCountElement = document.getElementById("total-score");
  const restartBtn = document.getElementById("restart-btn");

  let score = 0;
  let timer = 60;
  let gameStarted = false;
  let intervalId;
  let round = 1;
  let countdown;
  let clickCount = 0;

  function startCountdown() {
    startOverlay.addEventListener("click", () => {
      startOverlay.style.display = "none";
      countdownOverlay.style.display = "flex";
      countdown = 3;

      countdownInterval = setInterval(setCountdown, 1000);
    });
  }

  function setCountdown() {
    countdownElement.textContent = countdown;
    countdown--;
    if (countdown < 0) {
      clearInterval(countdownInterval);
      countdownOverlay.style.display = "none";
      startGame();
    }
  }

  nextBtn.addEventListener("click", () => {
    intro.style.display = "none";
    gameContainer.style.display = "block";

    startCountdown();
  });

  function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    score = 0;
    timer = 10;
    scoreElement.textContent = `${score}`;
    timerElement.textContent = `00:${timer}`;

    intervalId = setInterval(updateTimer, 1000);
    generateNumbers();
  }

  function updateTimer() {
    timer--;
    timerElement.textContent = `00:${timer}`;
    if (timer === 0) {
      endGame();
    }
  }

  function generateNumbers() {
    const numbersContainer = document.querySelector(".numbers-container");
    numbersContainer.innerHTML = ""; // Очищаем контейнер перед генерацией новых чисел

    const numbers = [];
    const numCount = round <= 3 ? 6 : 12; // Определяем количество чисел в зависимости от раунда
    if (numCount == 12) {
      numbersContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
    } else {
      numbersContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    }

    const partClasses = [
      "first-part",
      "second-part",
      "third-part",
      "fourth-part",
    ];
    const animations = [
      "fade-animation",
      "bounce-animation",
      "no-animation",
      "spin-animation",
    ];

    for (let i = 0; i < numCount; i++) {
      const number = getRandomNumber(1, 900);
      numbers.push(number);

      const button = document.createElement("button");
      button.classList.add("number-wrapper");

      const buttonSpan = document.createElement("span");
      buttonSpan.classList.add("number");
      buttonSpan.textContent = number;

      if (round > 3) {
        animations.sort(() => Math.random() - 0.5);

        if (animations[0] == "spin-animation") {
          buttonSpan.classList.add("spin-animation");
        } else {
          button.classList.add(animations[0]);
        }
      }

      if (round > 5) {
        button.style.animationDuration = "2s";
      }
      if (round > 7) {
        button.style.animationDuration = "1s";
      }

      partClasses.sort(() => Math.random() - 0.5);

      button.classList.add(partClasses[0]);
      button.appendChild(buttonSpan);
      numbersContainer.appendChild(button);

      if (numCount == 12) {
        button.style.padding = "15px 20px";
        button.style.fontSize = "35px";
      }
    }

    const numberButtons = document.querySelectorAll(".number-wrapper"); // Получаем новый список кнопок чисел

    // Прикрепляем событие клика к каждой кнопке с числом
    numberButtons.forEach((button) => {
      // button.style.animationDelay = "0.1s";
      button.addEventListener("click", () => {
        clickCount++;
        selectNumber(button.textContent, numbers, button);
      });
    });

    const targetNumber = Math.max(...numbers); // Определяем самое большое число
    targetNumberElement.textContent = `${targetNumber}`;

    round++; // Увеличиваем номер раунда
  }

  function selectNumber(selectedNumber, numbers, button) {
    if (!gameStarted) return;
    const maxNumber = Math.max(...numbers.map((number) => parseInt(number)));

    if (selectedNumber === maxNumber.toString()) {
      score++;
      scoreElement.textContent = `${score}`;
      showCheckMark(button);
    } else {
      showCrossMark(button);
    }

    // generateNumbers();
    setTimeout(() => {
      generateNumbers();
    }, 1000);
  }

  function showCheckMark(button) {
    const checkMark = document.createElement("span");
    checkMark.classList.add("check-mark");
    checkMark.textContent = "✔";
    button.appendChild(checkMark);
    button.classList.add("show-mark");

    setTimeout(() => {
      button.classList.remove("show-mark");
      checkMark.remove();
    }, 1000);
  }

  function showCrossMark(button) {
    const crossMark = document.createElement("span");
    crossMark.classList.add("cross-mark");
    crossMark.textContent = "✖";
    button.appendChild(crossMark);
    button.classList.add("show-mark");

    setTimeout(() => {
      button.classList.remove("show-mark");
      crossMark.remove();
    }, 1000);
  }

  function endGame() {
    clearInterval(intervalId);
    gameStarted = false;
    gameContainer.style.display = "none";
    resultsContainer.style.display = "block";
    finalScoreElement.forEach((el) => {
      el.textContent = score;
    });
    clickCountElement.textContent = clickCount;
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function restartGame() {
    if (gameStarted) return;
    gameStarted = true;
    round = 1;
    numCount = 6;
    score = 0;
    timer = 60;
    scoreElement.textContent = `${score}`;
    timerElement.textContent = `00:${timer}`;

    intervalId = setInterval(updateTimer, 1000);
    generateNumbers();
  }

  restartBtn.addEventListener("click", () => {
    resultsContainer.style.display = "none";
    gameContainer.style.display = "block";
    restartGame();
  });
};
