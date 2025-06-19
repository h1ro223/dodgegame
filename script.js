const ufo = document.getElementById("ufo");
const gameArea = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");
const gameOverEl = document.getElementById("gameOver");
const playBtn = document.getElementById("playBtn");
const countdown = document.getElementById("countdown");

let bombs = [];
let score = 0;
let gameRunning = false;
let gameStarted = false;

document.addEventListener("mousemove", (e) => {
  ufo.style.left = e.clientX - ufo.offsetWidth / 2 + "px";
  ufo.style.top = e.clientY - ufo.offsetHeight / 2 + "px";
});

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
  gameLoop();
  setInterval(() => {
    if (gameRunning) createBomb();
  }, 500);
}

function createBomb() {
  const bomb = document.createElement("div");
  bomb.classList.add("bomb");
  bomb.textContent = "💣";
  bomb.style.left = Math.random() * (window.innerWidth - 40) + "px";
  bomb.style.top = "-40px";
  bomb.dataset.vy = "2"; // 初速
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

    // 重力加速
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
