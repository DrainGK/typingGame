//creating classes

/*
the class game isn't too long?
I mean over a hundrend lines isn't too big?
It probably mean that you too many unrelated thing OR
I can manage it better with other classes and calling them insinde the game management

for me a class it's a living thing doing some actions and working all together as an OOP society

yes I am taking notes here, otherwise I will forget for a future report lol
*/
class Game {
  //game features
  constructor() {

    this.wizard = new Wizard();
    this.demon = new Demon();

    //initializing UI

    this.soundManager = new SoundManager();
    this.uiManager = new GameUI();

    //initializing game variables
    this.text = document.getElementById("game-text");
    this.time = document.getElementById("time");
    this.uiScore = document.getElementById("score");
    this.uiShield = document.getElementById("shield");
    this.charArray = [];

    this.lastKeyPressed = "";
    this.currentScore;
    this.score = 0;
    this.shield = 3;
    this.isGameOver = true;
    this.startTime = 0;
    this.currentTimeDisplay;
    this.timerIntervalId = null;
  }

  start() {
    // wizard.style.opacity = 1;

    if (!backgroundMusic) {
      backgroundMusic = new sound(sounds[0], true);
    }
    backgroundMusic.play();
    this.isGameOver = false;
    this.startTime = Date.now();
    this.updateTimeDisplay();

    if (this.timerIntervalId !== null) {
      clearInterval(timerIntervalId);
    }

    this.timerIntervalId = setInterval(this.updateTimeDisplay, 1000);

    this.charArray.length = 0;
    this.score = 0;
    this.shield = 3;

    this.uiShield.innerText = `Shield: ${shield}`;

    updateCanvas();
  }

  gameOver() {
    if (this.timerIntervalId !== null) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
    wizard.style.opacity = 0;
    if (backgroundMusic) {
      backgroundMusic.stop();
    }
    gameSound = new sound(sounds[1]);
    gameSound.play();
    this.charArray.length = 0;
    this.isGameOver = true;
    cancelAnimationFrame(animationFrameId);

    this.currentScore = this.score;
    this.score = 0;
    this.shield = 0;
    this.speed = diff.value;
    text.innerText = "You died !!!";
    gameUI.updateScoreDisplay();
    updateShieldDisplay();
    updateHighScore(currentScore);
    displayHighScore();

    menu.style.display = "flex";
  }

  formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  // Optimized updateTimeDisplay to use the common formatTime function
  updateTimeDisplay() {
    const elapsedTime = Date.now() - startTime; // Assuming startTime is defined elsewhere
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const currentTimeDisplay = formatTime(totalSeconds); // Use the common formatTime function

    if (time) {
      // Assuming 'time' is a DOM element defined elsewhere
      time.innerText = currentTimeDisplay;
    }
  }

  // Converts a "MM:SS" string to total seconds
  timeToSeconds(timeStr) {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return minutes * 60 + seconds;
  }
}

//game ui class done

class GameUI {
  constructor() {
    this.text = document.getElementById("game-text");
    this.time = document.getElementById("time");
    this.uiScore = document.getElementById("score");
    this.uiShield = document.getElementById("shield");
    this.menu = document.getElementById("menu");
    this.start = document.getElementById("start");
  }

  displayHighScore(highScore) {
    document.getElementById(
      "best-score"
    ).textContent = `High Score: ${highScore}`;
  }

  textShield(shield) {
    if (shield === 0) {
      this.text.innerText = "Shield is broken";
    } else {
      this.text.innerText = "Shield is breaking";
    }
  }

  cancelText() {
    this.text.innerText = "Cancelled successfully";
  }

  updateScoreDisplay(score) {
    this.uiScore.innerText = `Cancelled Spell: ${score}`;
  }

  updateShieldDisplay(shield) {
    this.uiShield.innerText = `Shield: ${shield}`;
  }
}

//highscore class done
class HighScoreManager {
  saveHighScore(newScore) {
    localStorage.setItem("highScore", newScore.toString());
  }

  saveHighTime(newHighTime) {
    localStorage.setItem("highTime", newHighTime);
  }

  loadHighScore() {
    const highScore = parseInt(localStorage.getItem("highScore") || "0", 10);
    return highScore;
  }

  loadHighTime() {
    const highTime = localStorage.getItem("highTime" || "00:00");
    return highTime;
  }

  updateHighScore(currentScore) {
    const highScore = loadHighScore();

    if (currentScore > highScore) {
      saveHighScore(currentScore);
      console.log("New high score saved: ", currentScore);
    }
  }

  displayHighScore() {
    const highScore = this.loadHighScore();
    // Update the UI with the high score
    console.log(`High Score: ${highScore}`); // Or update a DOM element
  }
}

//Sound class done
class SoundManager {
  constructor() {
    this.sounds = [
      "assets/game_music.mp3",
      "assets/spell.mp3",
      "assets/shield_hit.mp3",
      "assets/shield_break.mp3",
      "assets/cancel.mp3",
    ];
    this.gameSound = null; // It's not clear what this is for, initializing for clarity
    this.sound = document.createElement("audio");
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  }

  loadSound(index, loop = false) {
    if (index >= 0 && index < this.sounds.length) {
      this.sound.src = this.sounds[index];
      this.sound.loop = loop;
    } else {
      console.error("Sound index out of bounds");
    }
  }

  play() {
    this.sound
      .play()
      .catch((error) => console.error("Error playing sound:", error));
  }

  pause() {
    this.sound.pause();
  }

  stop() {
    this.sound.pause();
    this.sound.currentTime = 0;
  }
}

class Wizard {
  //gerer les characteristiques du joueur
  constructor() {
    this.wizard = document.getElementById("wizard");
    this.charArray = [];
    this.gameSound = new SoundManager();
    this.gameUI = new GameUI()
  }

  cancelSpell() {
    if (text.toLowerCase() === currentDemonText.toLocaleLowerCase()) {
      this.gameSound.loadSound(4);
      this.gameSound.play();
      this.gameUI.cancelText();
      this.charArray.length = 0;
      currentDemonText = getRandomDemonWord();
      demonTextX = canvas.width;
      demonTextY = 0.1 + Math.random() * 0.8;
      updateCanvas();
      score++;
      updateScoreDisplay(); // Update the score display
    }
  }

  input() {}
}

class Demon {
  //gerer les characteristiques du demon
  constructor() {
    this.speed = 4;
    this.demonWord = [
      "fire",
      "magic",
      "silence",
      "tornado",
      "doom",
      "storm",
      "deflagration",
      "destruction",
      "malediction",
      "rock",
      "tsunami",
    ];
    this.currentDemonText = getRandomDemonWord();
    this.demonTextX = canvas.width * 2; // horizontal axis for demon spell initialized
    this.demonTextY = 0.1 + Math.random() * 0.8;
  }

  spell() {}

  getRandomDemonWord() {
    const randomIndex = Math.floor(Math.random() * demonWord.length);
    return demonWord[randomIndex];
  }
}

/*
Je dois declarer les variables, je ne sais pas si je dois les declarer
dans une classe ou dans hors classes.
Je vais faire des iterations
*/

// for screen resolution
function adjustCanvasForHighDPI(canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);

  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
}

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");
  adjustCanvasForHighDPI(canvas);
});
const diff = document.getElementById("diff");

//global variables
let lastKeyPressed = "";
let currentScore;
let score = 0;
let shield = 3;
let isGameOver = true;
let startTime = 0;
let currentTimeDisplay;
let timerIntervalId = null;
let backgroundMusic;
let speed = 4;

const wizard = document.getElementById("wizard");
const menu = document.getElementById("menu");
const start = document.getElementById("start");
const text = document.getElementById("game-text");
const time = document.getElementById("time");
const uiScore = document.getElementById("score");
const uiShield = document.getElementById("shield");
const charArray = [];
const demonWord = [
  "fire",
  "magic",
  "silence",
  "tornado",
  "doom",
  "storm",
  "deflagration",
  "destruction",
  "malediction",
  "rock",
  "tsunami",
];
let currentDemonText = getRandomDemonWord();
let demonTextX = canvas.width * 2; // horizontal axis for demon spell initialized
let demonTextY = 0.1 + Math.random() * 0.8;
let animationFrameId = null; // requestAnimationFrame

const sounds = [
  "assets/game_music.mp3",
  "assets/spell.mp3",
  "assets/shield_hit.mp3",
  "assets/shield_break.mp3",
  "assets/cancel.mp3",
];
let gameSound;

console.log(diff.value);

document.addEventListener("keydown", function (e) {
  if (e.key === "Backspace") {
    e.preventDefault();
    charArray.pop(); //here we are taking of the last object of the array
  } else if (e.key.length === 1) {
    lastKeyPressed = e.key;
    charArray.push(lastKeyPressed); //we're adding a new object inside the arrey
  }
});

start.addEventListener("click", function () {
  menu.style.display = "none";
  startGame();
});

diff.addEventListener("change", function () {
  speed = this.value;
  console.log(speed);
});

function startGame() {
  wizard.style.opacity = 1;

  if (!backgroundMusic) {
    backgroundMusic = new sound(sounds[0], true);
  }
  backgroundMusic.play();
  isGameOver = false;
  startTime = Date.now();
  updateTimeDisplay();

  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
  }

  timerIntervalId = setInterval(updateTimeDisplay, 1000);

  charArray.length = 0;
  score = 0;
  shield = 3;

  uiShield.innerText = `Shield: ${shield}`;

  updateCanvas();
}

// Common function to format time from total seconds to "MM:SS" format
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// Optimized updateTimeDisplay to use the common formatTime function
function updateTimeDisplay() {
  const elapsedTime = Date.now() - startTime; // Assuming startTime is defined elsewhere
  const totalSeconds = Math.floor(elapsedTime / 1000);
  const currentTimeDisplay = formatTime(totalSeconds); // Use the common formatTime function

  if (time) {
    // Assuming 'time' is a DOM element defined elsewhere
    time.innerText = currentTimeDisplay;
  }
}

// Converts a "MM:SS" string to total seconds
function timeToSeconds(timeStr) {
  const [minutes, seconds] = timeStr.split(":").map(Number);
  return minutes * 60 + seconds;
}

function updateCanvas() {
  if (isGameOver) {
    return;
  }
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Base font size and max width calculation
  const baseFontSize = Math.min(canvas.height / 20, 48);
  ctx.font = `${baseFontSize}px sans-serif`;

  // Drawing text logic
  const text = charArray.join("");
  ctx.fillStyle = "white";
  ctx.fillText(text, 10, 50);

  //drawing shield logic
  let shieldX = canvas.width * 0.2;
  let shieldY = canvas.height * 2;

  if (shield > 0) {
    ctx.beginPath();
    ctx.moveTo(shieldX, 0);
    ctx.lineTo(shieldX, shieldY);
    ctx.strokeStyle = "white";
    ctx.lineWidth = shield * 2;
    ctx.stroke();
  }

  if (shield == 0) {
    gameSound = new sound(sounds[3]);
    gameSound.play();
    gameSound.stop();
  }

  // Demon text movement logic
  demonTextX -= speed;
  if (demonTextX <= 0) {
    demonTextX = canvas.width;
    gameOver();
  } else if (demonTextX < shieldX && shield > 0) {
    shield--;
    speed++;
    gameSound = new sound(sounds[2]);
    gameSound.play();
    updateShieldDisplay();
    textShield();
    demonTextX = canvas.width;
    demonTextY = 0.1 + Math.random() * 0.8;
    charArray.length = 0;
    currentDemonText = getRandomDemonWord();
  }
  ctx.fillText(currentDemonText, demonTextX, canvas.height * demonTextY);

  cancelSpell(text);

  // Cancel the previous animation frame before starting a new one
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  animationFrameId = requestAnimationFrame(updateCanvas);
}

function cancelSpell(text) {
  if (text.toLowerCase() === currentDemonText.toLocaleLowerCase()) {
    gameSound = new sound(sounds[4]);
    gameSound.play();
    cancelText();
    charArray.length = 0;
    currentDemonText = getRandomDemonWord();
    demonTextX = canvas.width;
    demonTextY = 0.1 + Math.random() * 0.8;
    updateCanvas();
    score++;
    updateScoreDisplay(); // Update the score display
  }
}

function textShield() {
  if (shield === 0) {
    text.innerText = "Shield is broken";
  } else {
    text.innerText = "Shield is breaking";
  }
}

function cancelText() {
  text.innerText = "cancelled succesfully";
}

function getRandomDemonWord() {
  const randomIndex = Math.floor(Math.random() * demonWord.length);
  return demonWord[randomIndex];
}

function updateScoreDisplay() {
  uiScore.innerText = `Cancelled Spell: ${score}`; //displaying the score visually incrementing it
}

function updateShieldDisplay() {
  uiShield.innerText = `Shield: ${shield}`; //displaying the score visually incrementing it
}

function sound(src, loop = false) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.loop = loop;

  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
    this.sound.currentTime = 0;
  };
}

function saveHighScore(newScore) {
  localStorage.setItem("highScore", newScore.toString());
}

function saveHighTime(newHighTime) {
  localStorage.setItem("highTime", newHighTime);
}

function loadHighScore() {
  const highScore = parseInt(localStorage.getItem("highScore") || "0", 10);
  return highScore;
}

function loadHighTime() {
  const highTime = localStorage.getItem("highTime" || "00:00");
  return highTime;
}

function updateHighScore(currentScore) {
  const highScore = loadHighScore();

  if (currentScore > highScore) {
    saveHighScore(currentScore);
    console.log("New high score saved: ", currentScore);
  }
}

function displayHighScore() {
  const highScore = loadHighScore();
  // const highTime = loadHighTime();

  document.getElementById(
    "best-score"
  ).textContent = `High Score: ${highScore}`;
  // document.getElementById("best-time").textContent = `High Time: ${highTime}`;
}

function gameOver() {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
  wizard.style.opacity = 0;
  if (backgroundMusic) {
    backgroundMusic.stop();
  }
  gameSound = new sound(sounds[1]);
  gameSound.play();
  charArray.length = 0;
  isGameOver = true;
  cancelAnimationFrame(animationFrameId);

  currentScore = score;
  score = 0;
  shield = 0;
  speed = diff.value;
  text.innerText = "You died !!!";
  updateScoreDisplay();
  updateShieldDisplay();
  updateHighScore(currentScore);
  displayHighScore();

  menu.style.display = "flex";
}
