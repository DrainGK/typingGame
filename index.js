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
const charArray = [];
const demonWord = ["fire", "magic", "silence"];

document.addEventListener("keydown", function zob(e) {
  if (e.keyCode === 8) {
    charArray.pop();
  } else if (e.keyCode !== 32) {
    lastKeyPressed = e.key;
    charArray.push(lastKeyPressed);
  }
  updateCanvas();
});

function updateCanvas() {
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px sans-serif";
    const text = charArray.join("");
    const demonText = demonWord[0];
    cancelSpell(text, demonText);
    ctx.fillText(text, 10, 50);
    ctx.fillText(demonText, 1000, 500);
  }
}

function cancelSpell(text, demonText) {
  if (text == demonText) {
    score++;
  }
}
