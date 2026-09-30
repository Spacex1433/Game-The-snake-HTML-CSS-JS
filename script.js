
const canvas = document.getElementById(‘game’); const ctx = canvas.getContext(‘2d’);
const box = 20;
// начальная змейка let snake = [ { x: 5 * box, y: 5 * box } ];
// начальная еда let food = { x: Math.floor(Math.random() * (canvas.width / box)) * box, y: Math.floor(Math.random() * (canvas.height / box)) * box, color: randomColor() };
let crumbs = [];
let dx = box; let dy = 0;
let score = 0; let game = setInterval(draw, 100);
// выбирает случайный неоновый цвет для еды function randomColor() { const colors = [ “#ff073a”, “#00ffea”, “#ffcc00”, “#ff00ff”, “#00ff00” ];
return colors[Math.floor(Math.random() * colors.length)]; }
// ========================= // НАПРАВЛЕНИЕ ЗМЕЙКИ // =========================
function changeDirection(direction) {
if (direction === “up” && dy === 0) { dx = 0; dy = -box; }
else if (direction === “down” && dy === 0) { dx = 0; dy = box; }
else if (direction === “left” && dx === 0) { dx = -box; dy = 0; }
else if (direction === “right” && dx === 0) { dx = box; dy = 0; } }
// ========================= // ЗМЕЙКА // =========================
function drawSnake() {
for (let part of snake) {
ctx.fillStyle = "#00ffea";
ctx.shadowColor = "#00ffea";
ctx.shadowBlur = 10;

ctx.fillRect(
  part.x,
  part.y,
  box,
  box
);
} }
// ========================= // ЕДА // =========================
function drawFood() {
ctx.fillStyle = food.color; ctx.shadowColor = food.color; ctx.shadowBlur = 20;
ctx.fillRect( food.x, food.y, box, box ); }
// ========================= // КРОШКИ // =========================
function drawCrumbs() {
for (let crumb of crumbs) {
ctx.beginPath();

ctx.arc(
  crumb.x,
  crumb.y,
  2,
  0,
  Math.PI * 2
);

ctx.fillStyle = crumb.color;
ctx.fill();
} }
function updateCrumbs() {
crumbs.forEach(c => {
c.x += c.dx;
c.y += c.dy;
c.alpha -= 0.05;
});
crumbs = crumbs.filter( c => c.alpha > 0 ); }
// ========================= // ОСНОВНОЙ ЦИКЛ // =========================
function draw() {
ctx.clearRect( 0, 0, canvas.width, canvas.height );
drawSnake(); drawFood(); drawCrumbs(); updateCrumbs();
const head = { x: snake[0].x + dx, y: snake[0].y + dy };
// ========================= // ЕДА // =========================
if ( head.x === food.x && head.y === food.y ) {
snake.unshift(head);

score++;

document.getElementById('score').innerText =
  `Очки: ${score}`;

const eatenColor = food.color;

createCrumbs(
  head.x,
  head.y,
  eatenColor
);

food = {
  x: Math.floor(
    Math.random() *
    (canvas.width / box)
  ) * box,

  y: Math.floor(
    Math.random() *
    (canvas.height / box)
  ) * box,

  color: randomColor()
};
} else {
snake.pop();
snake.unshift(head);
}
// ========================= // СТОЛКНОВЕНИЕ С СОБОЙ // =========================
for ( let i = 1; i < snake.length; i++ ) {
if (
  head.x === snake[i].x &&
  head.y === snake[i].y
) {

  return gameOver();
}
}
// ========================= // ГРАНИЦЫ // =========================
if ( head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ) {
gameOver();
} }
// ========================= // КРОШКИ // =========================
function createCrumbs(x, y, color) {
for (let i = 0; i < 10; i++) {
let angle =
  Math.random() *
  2 *
  Math.PI;

let speed =
  Math.random() * 3 + 1;

crumbs.push({

  x,
  y,

  dx:
    Math.cos(angle) *
    speed,

  dy:
    Math.sin(angle) *
    speed,

  color,

  alpha: 1
});
} }
// ========================= // КОНЕЦ ИГРЫ // =========================
function gameOver() {
clearInterval(game);
ctx.fillStyle = “#fff”;
ctx.font = “48px Arial”;
ctx.textAlign = “center”;
ctx.fillText( “Игра окончена”, canvas.width / 2, canvas.height / 2 ); }
// ========================= // КЛАВИАТУРА // =========================
document.addEventListener( ‘keydown’, e => {
if (e.code === 'KeyW') {
  changeDirection("up");
}

else if (e.code === 'KeyS') {
  changeDirection("down");
}

else if (e.code === 'KeyA') {
  changeDirection("left");
}

else if (e.code === 'KeyD') {
  changeDirection("right");
}

// Дополнительно поддерживаем стрелки
else if (e.code === 'ArrowUp') {
  changeDirection("up");
}

else if (e.code === 'ArrowDown') {
  changeDirection("down");
}

else if (e.code === 'ArrowLeft') {
  changeDirection("left");
}

else if (e.code === 'ArrowRight') {
  changeDirection("right");
}
} );
// ========================= // МОБИЛЬНЫЕ КНОПКИ // =========================
const controlButtons = document.querySelectorAll(’.control’);
controlButtons.forEach(button => {
button.addEventListener( ‘pointerdown’, event => {
  event.preventDefault();

  const direction =
    button.dataset.direction;

  changeDirection(direction);
}
);
});
// ========================= // ПЕРЕЗАПУСК // =========================
document .getElementById(‘restartBtn’) .addEventListener( ‘click’, () => { location.reload(); } );































