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
  ctx.fillStyle = "white";
  ctx.font = "48px sans-serif";
  const text = charArray.join("");
  cancelSpell(text);
  ctx.fillText(text, 10, 50);
  ctx.fillText(currentDemonText, canvas.width * 0.5, canvas.height * 0.4);
}

function cancelSpell(text) {
  if (text.toLowerCase() === currentDemonText.toLocaleLowerCase()) {
    score++;
    charArray.length = 0;
    currentDemonText = getRandomDemonWord();
    updateCanvas();
  }
}

function getRandomDemonWord() {
  const randomIndex = Math.floor(Math.random() * demonWord.length);
  return demonWord[randomIndex];
}
