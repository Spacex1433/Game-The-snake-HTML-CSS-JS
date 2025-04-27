const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const box = 20; // размер клетки

// начальная змейка
let snake = [
  { x: 5 * box, y: 5 * box }
];

// начальная еда с случайным цветом
let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box,
  color: randomColor()
};

let crumbs = [];       // массив для крошек
let dx = box, dy = 0;  // направление движения
let score = 0;
let game = setInterval(draw, 100);

// выбирает случайный неоновый цвет для еды
function randomColor() {
  const colors = ["#ff073a", "#00ffea", "#ffcc00", "#ff00ff", "#00ff00"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// рисует змейку
function drawSnake() {
  for (let part of snake) {
    ctx.fillStyle = "#00ffea";
    ctx.shadowColor = "#00ffea";
    ctx.shadowBlur = 10;
    ctx.fillRect(part.x, part.y, box, box);
  }
}

// рисует еду
function drawFood() {
  ctx.fillStyle = food.color;
  ctx.shadowColor = food.color;
  ctx.shadowBlur = 20;
  ctx.fillRect(food.x, food.y, box, box);
}

// рисует все крошки
function drawCrumbs() {
  for (let crumb of crumbs) {
    ctx.beginPath();
    ctx.arc(crumb.x, crumb.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = crumb.color;
    ctx.fill();
  }
}

// обновляет позиции крошек и убирает исчезнувшие
function updateCrumbs() {
  crumbs.forEach(c => {
    c.x += c.dx;
    c.y += c.dy;
    c.alpha -= 0.05;
  });
  crumbs = crumbs.filter(c => c.alpha > 0);
}

// основной цикл отрисовки
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSnake();
  drawFood();
  drawCrumbs();
  updateCrumbs();

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // съела ли змейка еду?
  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    score++;
    document.getElementById('score').innerText = `Очки: ${score}`;

    // запомнить цвет съеденной еды
    const eatenColor = food.color;
    // создать крошки этого же цвета
    createCrumbs(head.x, head.y, eatenColor);

    // затем сгенерировать новую еду
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
      color: randomColor()
    };
  } else {
    snake.pop();
    snake.unshift(head);
  }

  // проверка столкновения с собой
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return gameOver();
    }
  }

  // проверка выхода за границы
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) {
    gameOver();
  }
}

// создаёт крошки в точке (x,y) заданного цвета
function createCrumbs(x, y, color) {
  for (let i = 0; i < 10; i++) {
    let angle = Math.random() * 2 * Math.PI;
    let speed = Math.random() * 3 + 1;
    crumbs.push({
      x, y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      color,
      alpha: 1
    });
  }
}

// завершение игры
function gameOver() {
  clearInterval(game);
  ctx.fillStyle = "#fff";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Игра окончена", canvas.width / 2, canvas.height / 2);
}

// управление через WASD
document.addEventListener('keydown', e => {
  if (e.code === 'KeyW' && dy === 0) { dx = 0; dy = -box; }
  else if (e.code === 'KeyS' && dy === 0) { dx = 0; dy = box; }
  else if (e.code === 'KeyA' && dx === 0) { dx = -box; dy = 0; }
  else if (e.code === 'KeyD' && dx === 0) { dx = box; dy = 0; }
});

// кнопка перезапуска
document.getElementById('restartBtn').addEventListener('click', () => {
  location.reload();
});
































