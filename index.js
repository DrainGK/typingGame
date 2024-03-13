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

//end of screen resolution

//global variables
let lastKeyPressed = "";
let score = 0;
const uiScore = document.getElementById("score");
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
let demonTextX = canvas.width * 4;
let animationFrameId = null;

document.addEventListener("keydown", function zob(e) {
  if (e.key === "Backspace") {
    e.preventDefault();
    charArray.pop();
  } else if (e.key.length === 1) {
    lastKeyPressed = e.key;
    charArray.push(lastKeyPressed);
  }
  uiScore.innerText = `Cancelled Spell: ${score}`;
  updateCanvas();
});

function updateCanvas() {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Base font size and max width calculation remains the same
  const baseFontSize = 48;
  ctx.font = `${baseFontSize}px sans-serif`;

  // Drawing text logic remains the same...
  const text = charArray.join("");
  ctx.fillStyle = "white";
  ctx.fillText(text, 10, 50);

  // Demon text movement logic remains the same...
  demonTextX -= 4;
  let measuredWidth = ctx.measureText(currentDemonText).width;
  if (demonTextX + measuredWidth < 0) {
    demonTextX = canvas.width;
    gameOver();
  }
  ctx.fillText(currentDemonText, demonTextX, canvas.height * 0.4);

  cancelSpell(text);

  // Cancel the previous animation frame before starting a new one
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  animationFrameId = requestAnimationFrame(updateCanvas);
}

function cancelSpell(text) {
  if (text.toLowerCase() === currentDemonText.toLocaleLowerCase()) {
    score++;
    charArray.length = 0;
    currentDemonText = getRandomDemonWord();
    demonTextX = canvas.width;
    updateCanvas();
  }
}

function getRandomDemonWord() {
  const randomIndex = Math.floor(Math.random() * demonWord.length);
  return demonWord[randomIndex];
}

function gameOver() {
  score = 0;
}
