/* colors constants */
const colors = {
  bg: "#f8f8f8",
  snake: "#33aa33",
  apple: "#CA0000",
};

/* game controls */
const controls = {
    UP: [38, 87],
    DOWN: [40, 83],
    LEFT: [37, 65],
    RIGHT: [39, 68]
};

/* action const */
const action = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

/* move constants */
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };

/* size (col, row) */
const cols = 10;
const rows = 10;

/* init context */
var cnv = document.getElementById("canvas");
var ctx = cnv.getContext("2d");
cnv.height = cnv.width = 600;

/* random function */
const rnd = function(min, max) {
    return Math.floor(Math.random() * max) + min;
};

const validMove = function(move) {
  if(state.snake.length == 1) return 1;
  return (state.snake[1].x == (state.snake[0].x + move.x) &&
    state.snake[1].y == (state.snake[0].y + move.y)) == false;
};

/* snake */
var state = {
  snake: [],
  move: LEFT,
  speed: 550,
  score: 0,
  apple: { x: null, y: null }
};
state.snake.push({x: rnd(0, cols), y: rnd(0, rows)});

const sizeMatrix= cols * rows;
function createApple() {
  if(state.snake.length >= sizeMatrix) return 0;
  state.apple = { x: rnd(0, cols), y: rnd(0, rows) };
  state.snake.forEach(pos => {
    if(pos.x == state.apple.x && pos.y == state.apple.y) return createApple();
  });
  return 0;
}
createApple();

/* end game */
function isEndGame() {
  for(var i = 1; i < state.snake.length; i++)
    if(state.snake[i].x == state.snake[0].x && state.snake[i].y == state.snake[0].y) return 1;
  return 0;
}

/* validate key press */
const validKey = function(keyCode) {
    return controls.UP.indexOf(keyCode) > -1 ? action.UP :
      controls.DOWN.indexOf(keyCode) > -1 ? action.DOWN :
      controls.LEFT.indexOf(keyCode) > -1 ? action.LEFT :
      controls.RIGHT.indexOf(keyCode) > -1 ? action.RIGHT : -1;
};

/* key press controller*/
document.onkeydown = function(e) {
  console.log(e.keyCode);
  switch (validKey(e.keyCode)) {
    case action.UP: if(validMove(UP)) state.move = UP; break;
    case action.DOWN: if(validMove(DOWN)) state.move = DOWN; break;
    case action.LEFT: if(validMove(LEFT)) state.move = LEFT; break;
    case action.RIGHT: if(validMove(RIGHT)) state.move = RIGHT; break;
  }
};

const eatApple = function() {
  if(state.snake[0].x == state.apple.x &&
    state.snake[0].y == state.apple.y) {
      createApple();
      state.score++;
      state.speed = (state.speed > 60) ? (state.speed - 10) : (state.speed);
      document.getElementById("score").innerHTML = state.score;
      return 1;
    }
  return 0;
};

/* snake move function */
const move = function() {
  var nextX = state.snake[0].x + state.move.x;
  var nextY = state.snake[0].y + state.move.y;
  if(nextX >= cols) nextX = 0;
  else if(nextX < 0) nextX = cols-1;
  if(nextY >= rows) nextY = 0;
  else if(nextY < 0) nextY = rows-1;
  state.snake.unshift({x: nextX, y: nextY});
  if(isEndGame() === 1) return endGameAction();
  if(eatApple() !== 1) state.snake.pop();
};

/* end game action */
const endGameAction = function() {
  alert('Game Over! Refresh page to restart the game.');
}

/* get position */
const x = c => Math.round(c * cnv.width / cols)
const y = r => Math.round(r * cnv.height / rows)

/* draw game field */
const draw = function() {
  /* clear game field*/
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  /* draw snake */
  ctx.fillStyle = colors.snake;
  ctx.strokeStyle = colors.bg;
  state.snake.map(pos => {
    ctx.fillRect(x(pos.x), y(pos.y), x(1), y(1));
    ctx.strokeRect(x(pos.x), y(pos.y), x(1), y(1));
  });

  /* draw apple */
  ctx.fillStyle = colors.apple;
  ctx.strokeStyle = colors.bg;
  ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1));
  ctx.strokeRect(x(state.apple.x), y(state.apple.y), x(1), y(1));
};
draw();

/* init game loop */
var gameLoop = function() {
  if(isEndGame() === 1) return 1;
  move();
  draw();
  setTimeout(gameLoop, state.speed);
};
setTimeout(gameLoop, state.speed);
