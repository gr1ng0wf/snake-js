/* colors constants */
const colors = {
	bg: "#000",
	snake: {
	  fill: "#00c832",
	  stroke: "#00000050",
	  shadow: "#00DD50",
	},
	apple: {
	  fill: "#ff3200",
	  stroke: "#00000050",
	  shadow: "#d50000",
  },   
};

const shadowBlur = 10;

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

/* init context */
var cnv = document.getElementById("canvas");
var ctx = cnv.getContext("2d");

cnv.height = document.body.clientHeight;
cnv.width = document.body.clientWidth; 



window.addEventListener("resize", () => {
  cnv.height = document.body.clientHeight;
  cnv.width = document.body.clientWidth; 
  /* update stataments */
  cols = Math.floor(cnv.width / 40);
  rows = Math.floor(cnv.height / 40);
});



/* size (col, row) */
let cols = Math.floor(cnv.width / 40);
let rows = Math.floor(cnv.height / 40);

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
  speed: 320,
  score: 0,
  apple: [],
};
state.snake.push({x: rnd(0, cols), y: rnd(0, rows)});

const sizeMatrix= cols * rows;
function createApple() {
  if(state.snake.length >= sizeMatrix) return 0;
  state.apple.push({x: rnd(0, cols), y: rnd(0, rows)});
  state.snake.forEach(pos => {
    const fetchRes = (state.apple).filter((apple) => { return (pos.x == apple.x && pos.y == apple.y); });
    if(fetchRes.length) return createApple();
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
  switch (validKey(e.keyCode)) {
    case action.UP: if(validMove(UP)) state.move = UP; break;
    case action.DOWN: if(validMove(DOWN)) state.move = DOWN; break;
    case action.LEFT: if(validMove(LEFT)) state.move = LEFT; break;
    case action.RIGHT: if(validMove(RIGHT)) state.move = RIGHT; break;
  }
};

const eatApple = function() {
  const fetchRes = (state.apple).filter((apple) => { return (state.snake[0].x == apple.x && state.snake[0].y == apple.y); });
  if(fetchRes.length) {

    for(let index in fetchRes) {
      state.apple.splice(index, 1)
    };
  
    createApple();
    state.score++;
    if(state.speed > 70) {
      state.speed -= 15;
    }
    document.getElementById("score").innerHTML = state.score;
    return 1;
  } else {
    return 0;
  }
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

const drawWithShadow = (colors, elements) => {
  ctx.lineWidth = 1;
	ctx.fillStyle = colors.fill;
  ctx.strokeStyle = colors.stroke;
  ctx.shadowColor = colors.shadow;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  elements.map(pos => {
    ctx.fillRect(x(pos.x), y(pos.y), x(1), y(1));
    ctx.strokeRect(x(pos.x), y(pos.y), x(1), y(1));
  });
};

/* draw game field */
const draw = function() {
  /* clear game field*/
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  /* draw snake */
  drawWithShadow(colors.snake, state.snake);

  /* draw apple */
  drawWithShadow(colors.apple, state.apple);
};

/* init game loop */
var gameLoop = function() {
  if(isEndGame() === 1) return 1;
  move();
  draw();
  setTimeout(gameLoop, state.speed);
};
setTimeout(gameLoop, state.speed);
