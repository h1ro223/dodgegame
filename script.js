const ufo = document.getElementById("ufo");
const gameArea = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");
const gameOverEl = document.getElementById("gameOver");
const playBtn = document.getElementById("playBtn");
const countdown = document.getElementById("countdown");
const retryBtn = document.getElementById("retryBtn");

let bombs = [];
let score = 0;
let gameRunning = false;
let gameStarted = false;
let bombIntervalId = null;

// スムーズ追従用変数
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let ufoX = targetX;
let ufoY = targetY;

function moveUFO(x, y) {
  targetX = x;
  targetY = y;
}

document.addEventListener("mousemove", (e) => {
  moveUFO(e.clientX, e.clientY);
});

document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  if (touch) moveUFO(touch.clientX, touch.clientY);
});

// 長押しコピーを完全無効化
document.addEventListener("contextmenu", (e) => e.preventDefault());

playBtn.addEventListener("click", () => {
  playBtn.classList.add("hidden");
  startCountdown();
});

retryBtn.addEventListener("click", () => {
  gameOverEl.classList.add("hidden");
  startCountdown();
});

function startCountdown() {
  let count = 3;
  countdown.textContent = count;
  countdown.classList.remove("hidden");

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdown.textContent = count;
    } else if (count === 0) {
      countdown.textContent = "GO!";
    } else {
      clearInterval(interval);
      countdown.classList.add("hidden");
      startGame();
    }
  }, 1000);
}

function startGame() {
  score = 0;
  bombs.forEach(b => b.remove());
  bombs = [];
  gameRunning = true;
  gameStarted = true;
  updateBombSpawnRate();
  gameLoop();
}

function updateBombSpawnRate() {
  if (bombIntervalId) clearInterval(bombIntervalId);

  let interval = 300;
  if (score >= 300) interval = 150;
  else if (score >= 200) interval = 200;
  else if (score >= 100) interval = 250;

  bombIntervalId = setInterval(() => {
    if (gameRunning) createBomb();
  }, interval);
}

function createBomb() {
  const bomb = document.createElement("div");
  bomb.classList.add("bomb");
  bomb.textContent = "💣";
  bomb.style.left = Math.random() * (window.innerWidth - 40) + "px";
  bomb.style.top = "-40px";
  bomb.dataset.vy = "2";
  gameArea.appendChild(bomb);
  bombs.push(bomb);
}

function updateBombs() {
  const ufoRect = ufo.getBoundingClientRect();
  const ufoCenterX = ufoRect.left + ufoRect.width / 2;
  const ufoCenterY = ufoRect.top + ufoRect.height / 2;

  for (let i = bombs.length - 1; i >= 0; i--) {
    const bomb = bombs[i];
    let top = parseFloat(bomb.style.top);
    let vy = parseFloat(bomb.dataset.vy);

    vy += 0.2;
    bomb.dataset.vy = vy;
    bomb.style.top = top + vy + "px";

    const bombRect = bomb.getBoundingClientRect();
    const bombCenterX = bombRect.left + bombRect.width / 2;
    const bombCenterY = bombRect.top + bombRect.height / 2;

    const dx = ufoCenterX - bombCenterX;
    const dy = ufoCenterY - bombCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 30) {
      gameOver();
    }

    if (top > window.innerHeight) {
      bomb.remove();
      bombs.splice(i, 1);
    }
  }
}

function updateScore() {
  score++;
  scoreEl.textContent = `Score: ${score}`;
  if (score % 100 === 0) {
    updateBombSpawnRate();
  }
}

function gameOver() {
  gameRunning = false;
  gameOverEl.classList.remove("hidden");
  if (bombIntervalId) clearInterval(bombIntervalId);
}

function gameLoop() {
  if (!gameRunning) return;

  // よりスムーズに追従（速さ上げる）
  ufoX += (targetX - ufoX) * 0.2;
  ufoY += (targetY - ufoY) * 0.2;
  ufo.style.left = ufoX - ufo.offsetWidth / 2 + "px";
  ufo.style.top = ufoY - ufo.offsetHeight / 2 + "px";

  updateBombs();
  updateScore();
  requestAnimationFrame(gameLoop);
} 