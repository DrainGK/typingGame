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
  updateCanvas();
});

//global variables
let lastKeyPressed = "";
let score = 0;
let shield = 3;
let isGameOver = false;
let text = document.getElementById("game-text");
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

document.addEventListener("keydown", function zob(e) {
  if (e.key === "Backspace") {
    e.preventDefault();
    charArray.pop(); //here we are taking of the last object of the array
  } else if (e.key.length === 1) {
    lastKeyPressed = e.key;
    charArray.push(lastKeyPressed); //we're adding a new object inside the arrey
  }
});

function updateCanvas() {
  if (isGameOver) {
    return;
  }
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Base font size and max width calculation
  const baseFontSize = 48;
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

  // Demon text movement logic
  demonTextX -= 7;
  let measuredWidth = ctx.measureText(currentDemonText).width;
  if (demonTextX <= 0) {
    demonTextX = canvas.width;
    gameOver();
  } else if (demonTextX < shieldX && shield > 0) {
    shield--;
    updateShieldDisplay();
    demonTextX = canvas.width;
    demonTextY = 0.1 + Math.random() * 0.8;
    charArray.length = 0;
    currentDemonText = getRandomDemonWord();
  }
  console.log(demonTextY);
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
    charArray.length = 0;
    currentDemonText = getRandomDemonWord();
    demonTextX = canvas.width;
    demonTextY = 0.1 + Math.random() * 0.8;

    updateCanvas();
    score++;
    updateScoreDisplay(); // Update the score display
  }
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

function playerAccuracy() {
  //checking letter by letter[i] inputText & demontext if is equal; using for loop
  //drawing each letter individually
  //ctx.fillText(text[i], 10 + i * (baseFontSize * 0.6), 50); // Adjust position as needed
}

function gameOver() {
  isGameOver = true;
  cancelAnimationFrame(animationFrameId);

  score = 0;
  shield = 0;
  charArray.length = 0;
  text.innerText = "You died !!!";
  updateScoreDisplay();
  updateShieldDisplay();
}
