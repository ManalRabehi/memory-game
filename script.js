// Get DOM elements
const moves = document.getElementById("movesCount");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;
let firstCardValue, secondCardValue;

// Items array (make sure the total number of unique items is even)
const items = [
  { name: "music", image: "images/music.jpg" },
  { name: "bin", image: "images/bin.jpg" },
  { name: "book", image: "images/book.jpg" },
  { name: "cake", image: "images/cake.jpg" },
  { name: "camera", image: "images/camera.jpg" },
  { name: "candy", image: "images/candy.jpg" },
  { name: "cd", image: "images/cd.jpg" },
  { name: "computer", image: "images/computer.jpg" },
  { name: "heart", image: "images/heart.jpg" },
  { name: "letter", image: "images/letter.jpg" },
  { name: "phone", image: "images/phone.jpg" },
  { name: "strawberry-milk", image: "images/strawberry-milk.jpg" },
];

// Initial time
let seconds = 0,
  minutes = 0;
// Initial moves and win count
let movesCount = 0,
  winCount = 0;

// Timer
const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span> ${minutesValue}:${secondsValue}`;
};

// Moves counter
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
};

// Pick random objects from items array
const generateRandom = (size = 4) => {
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size) / 2;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

// Generate the game grid
const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);

  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
          <img src="${cardValues[i].image}" class="image" />
        </div>
      </div>
    `;
  }

  // Grid layout
  gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

  // Select all cards
  cards = document.querySelectorAll(".card-container");

  // Add click event to each card
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched") && !card.classList.contains("flipped")) {
        card.classList.add("flipped");

        if (!firstCard) {
          // First card
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          // Second card
          movesCounter();
          secondCard = card;
          secondCardValue = card.getAttribute("data-card-value");

          if (firstCardValue === secondCardValue) {
            // Matched
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            winCount += 1;

            // Check if all pairs matched
            if (winCount === Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won!</h2><h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            // Not matched — flip back
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

// Stop the game
const stopGame = () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
};

// Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

stopButton.addEventListener("click", stopGame);

// Initialize values and start
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  matrixGenerator(cardValues);
};
