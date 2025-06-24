const heart = document.getElementById("heart");
const gameArea = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");
const gameOverEl = document.getElementById("gameOver");
const playBtn = document.getElementById("playBtn");
const countdown = document.getElementById("countdown");

let bombs = [];
let score = 0;
let gameRunning = false;
let gameStarted = false;

// マウス＆タッチでハートを動かす
function enableHeartControl() {
  document.addEventListener("mousemove", (e) => {
    moveHeart(e.clientX, e.clientY);
  });

  document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    moveHeart(touch.clientX, touch.clientY);
    e.preventDefault(); // スクロール防止
  }, { passive: false }); // ← 必須
}

function moveHeart(x, y) {
  heart.style.left = x - heart.offsetWidth / 2 + "px";
  heart.style.top = y - heart.offsetHeight / 2 + "px";
}

playBtn.addEventListener("click", () => {
  playBtn.classList.add("hidden");
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
  bombs = [];
  gameRunning = true;
  gameStarted = true;
  gameOverEl.classList.add("hidden");

  heart.style.display = "block";
  enableHeartControl();

  gameLoop();
  setInterval(() => {
    if (gameRunning) createBomb();
  }, 500);
}

function createBomb() {
  const bomb = document.createElement("div");
  bomb.classList.add("bomb");
  bomb.textContent = "💣";

  const x = Math.random() * (window.innerWidth - 60);
  bomb.style.left = `${x}px`;
  bomb.style.top = "-60px";

  bomb.dataset.vy = (Math.random() * 1.5 + 2).toString(); // 2.0〜3.5
  bomb.dataset.vx = (Math.random() * 1 - 0.5).toString(); // -0.5〜0.5

  gameArea.appendChild(bomb);
  bombs.push(bomb);
}

function updateBombs() {
  const heartRect = heart.getBoundingClientRect();
  const heartCenterX = heartRect.left + heartRect.width / 2;
  const heartCenterY = heartRect.top + heartRect.height / 2;

  for (let i = bombs.length - 1; i >= 0; i--) {
    const bomb = bombs[i];
    let top = parseFloat(bomb.style.top);
    let left = parseFloat(bomb.style.left);
    let vy = parseFloat(bomb.dataset.vy);
    let vx = parseFloat(bomb.dataset.vx);

    vy += 0.2;
    bomb.dataset.vy = vy;
    bomb.style.top = top + vy + "px";
    bomb.style.left = left + vx + "px";

    const bombRect = bomb.getBoundingClientRect();
    const bombCenterX = bombRect.left + bombRect.width / 2;
    const bombCenterY = bombRect.top + bombRect.height / 2;

    const dx = heartCenterX - bombCenterX;
    const dy = heartCenterY - bombCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 40) {
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
}

function gameOver() {
  gameRunning = false;
  gameOverEl.classList.remove("hidden");
}

function gameLoop() {
  if (!gameRunning) return;
  updateBombs();
  updateScore();
  requestAnimationFrame(gameLoop);
}
