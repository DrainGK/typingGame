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
const start = document.getElementById("start")
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

const sounds = ["assets/game_music.mp3", "assets/spell.mp3", "assets/shield_hit.mp3", "assets/shield_break.mp3", "assets/cancel.mp3"];
let gameSound;

console.log(diff.value);

document.addEventListener("keydown", function(e) {
  if (e.key === "Backspace") {
    e.preventDefault();
    charArray.pop(); //here we are taking of the last object of the array
  } else if (e.key.length === 1) {
    lastKeyPressed = e.key;
    charArray.push(lastKeyPressed); //we're adding a new object inside the arrey
  }
});

start.addEventListener("click", function(){
  menu.style.display = "none";
  startGame();
})

diff.addEventListener('change', function(){
  speed = this.value;
  console.log(speed);
})

function startGame(){
  wizard.style.opacity = 1;

  if(!backgroundMusic){
    backgroundMusic = new sound(sounds[0], true);
  }
  backgroundMusic.play();
  isGameOver = false;
  startTime = Date.now();
  updateTimeDisplay();

  if(timerIntervalId !== null){
    clearInterval(timerIntervalId);
  }

  timerIntervalId = setInterval(updateTimeDisplay, 1000);

  charArray.length = 0;
  score = 0;
  shield = 3;

  uiShield.innerText = `Shield: ${shield}`;

  updateCanvas();
}

function updateTimeDisplay(){
  const elapsedTime = Date.now() - startTime;
  const totalSeconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(totalSeconds/60).toString().padStart(2,'0');
  const seconds = (totalSeconds % 60).toString().padStart(2,'0');
  currentTimeDisplay = `${minutes}:${seconds}`;

  if (time){
    time.innerText = currentTimeDisplay;
  }
}

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

  if(shield == 0 ){
    gameSound = new sound(sounds[3]);
    gameSound.play();
    gameSound.stop();
  
  }

  // Demon text movement logic
  demonTextX -= speed;
  let measuredWidth = ctx.measureText(currentDemonText).width;
  if (demonTextX <= 0) {
    demonTextX = canvas.width;
    gameOver();
  } else if (demonTextX < shieldX && shield > 0) {
    shield--;
    speed ++;
    gameSound = new sound(sounds[2]);
    gameSound.play();
    updateShieldDisplay();
    textShield();
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

function sound(src, loop = false){
  this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.loop = loop;
    
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
        this.sound.currentTime = 0;
    }    
}



function gameOver() {
  if(timerIntervalId !== null){
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
  
  score = 0;
  shield = 0;
  speed=diff.value;
  text.innerText = "You died !!!";
  updateScoreDisplay();
  updateShieldDisplay();
  
  menu.style.display = "flex";

}
