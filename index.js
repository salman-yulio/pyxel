let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

// Load gambar aset
let headUp = new Image();
headUp.src = "assets/head_up.png";

let headDown = new Image();
headDown.src = "assets/head_down.png";

let headLeft = new Image();
headLeft.src = "assets/head_left.png";

let headRight = new Image();
headRight.src = "assets/head_right.png";

let bodyVertical = new Image();
bodyVertical.src = "assets/body_vertical.png";

let bodyHorizontal = new Image();
bodyHorizontal.src = "assets/body_horizontal.png";

let bodyTopLeft = new Image();
bodyTopLeft.src = "assets/body_topleft.png";

let bodyTopRight = new Image();
bodyTopRight.src = "assets/body_topright.png";

let bodyBottomLeft = new Image();
bodyBottomLeft.src = "assets/body_bottomleft.png";

let bodyBottomRight = new Image();
bodyBottomRight.src = "assets/body_bottomright.png";

let appleImage = new Image();
appleImage.src = "assets/rat.png";

let backgroundImage = new Image();
backgroundImage.src = "assets/background.png";

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 5;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;
let appleX = 5;
let appleY = 5;
let inputsXVelocity = 0;
let inputsYVelocity = 0;
let xVelocity = 0;
let yVelocity = 0;
let score = 0;
let gulpSound = new Audio("gulp.mp3");
let currentHeadImage = headRight;

function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) return;

  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();

  if (score > 5) speed = 9;
  if (score > 10) speed = 11;

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  if (yVelocity === 0 && xVelocity === 0) return false;

  if (headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) {
    drawGameOverScreen();
    return true;
  }

  for (let part of snakeParts) {
    if (part.x === headX && part.y === headY) {
      drawGameOverScreen();
      return true;
    }
  }
  return false;
}

function drawGameOverScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "50px Verdana";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);

  ctx.font = "20px Verdana";
  ctx.fillText("Press F5 to Restart", canvas.width / 2, canvas.height / 2 + 40);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score " + score, canvas.width - 50, 10);
}

function clearScreen() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.drawImage(
    currentHeadImage,
    headX * tileCount,
    headY * tileCount,
    tileSize,
    tileSize
  );

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    let prevPart = snakeParts[i - 1] || { x: headX, y: headY };
    let nextPart = snakeParts[i + 1] || {
      x: headX + xVelocity,
      y: headY + yVelocity,
    };

    let img = bodyHorizontal;
    if (prevPart.x === part.x && nextPart.x === part.x) img = bodyVertical;
    if (prevPart.y === part.y && nextPart.y === part.y) img = bodyHorizontal;
    if (
      (prevPart.x > part.x && nextPart.y > part.y) ||
      (prevPart.y > part.y && nextPart.x > part.x)
    )
      img = bodyTopLeft;
    if (
      (prevPart.x < part.x && nextPart.y > part.y) ||
      (prevPart.y > part.y && nextPart.x < part.x)
    )
      img = bodyTopRight;
    if (
      (prevPart.x > part.x && nextPart.y < part.y) ||
      (prevPart.y < part.y && nextPart.x > part.x)
    )
      img = bodyBottomLeft;
    if (
      (prevPart.x < part.x && nextPart.y < part.y) ||
      (prevPart.y < part.y && nextPart.x < part.x)
    )
      img = bodyBottomRight;

    ctx.drawImage(
      img,
      part.x * tileCount,
      part.y * tileCount,
      tileSize,
      tileSize
    );
  }
}

function changeSnakePosition() {
  snakeParts.push(new SnakePart(headX, headY));
  while (snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  headX += xVelocity;
  headY += yVelocity;
}

function drawApple() {
  ctx.drawImage(
    appleImage,
    appleX * tileCount,
    appleY * tileCount,
    tileSize,
    tileSize
  );
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  if (event.keyCode == 38 || event.keyCode == 87) {
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
    currentHeadImage = headUp;
  }
  if (event.keyCode == 40 || event.keyCode == 83) {
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
    currentHeadImage = headDown;
  }
  if (event.keyCode == 37 || event.keyCode == 65) {
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
    currentHeadImage = headLeft;
  }
  if (event.keyCode == 39 || event.keyCode == 68) {
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
    currentHeadImage = headRight;
  }
}

drawGame();
