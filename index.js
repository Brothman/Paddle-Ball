const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext('2d');

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

let ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let score = 0;
let lives = 3;

const bricks = [];
for (let col = 0; col < brickColumnCount; col++) {
  bricks[col] = [];
  for (let row = 0; row < brickRowCount; row++) {
    bricks[col][row] = {
      x: 0,
      y: 0,
      status: 1,
    };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let col = 0; col < brickColumnCount; col++) {
    for (let row = 0; row < brickRowCount; row++) {
      if (bricks[col][row].status === 1) {
        let brickX = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[col][row].x = brickX;
        bricks[col][row].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //handle bouncing off walls
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  }
  else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth){
      dy = -dy;
    }

    //GAME OVER, ball hit the bottom of the screen
    else if (y + dy > canvas.height - ballRadius) {
      lives--;
      if (lives === 0) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

function collisionDetection() {
  for (let col = 0; col < brickColumnCount; col++) {
    for (let row = 0; row < brickRowCount; row++) {
      let brick = bricks[col][row];
      //only turn around if the brick is still live on the screen
      if (brick.status === 1) {
        if (x + ballRadius > brick.x && x - ballRadius < brick.x + brickWidth && y + ballRadius > brick.y && y - ballRadius < brick.y + brickHeight) {
          dy = -dy;
          brick.status = 0;
          score++;
        }
        //You've won!
        if (score === brickRowCount * brickColumnCount) {
          alert("You win! Congratulations!");
          document.location.reload();
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  }
  else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  }
  else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - (paddleWidth / 2);
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
// document.addEventListener('mousemove', mouseMoveHandler, false);

draw();
// draw();
// setInterval(draw, 10);






// context.beginPath();
// //The first two values specify the coordinates of the top left corner of the rectangle on the canvas.
// //The second two coordinates specify the width and height of the rectangle, respectively.
// context.rect(20, 40, 50, 50);
// context.fillStyle = "red";
// context.fill();
// context.closePath();
//
// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI*2, false);
// ctx.fillStyle="green";
// ctx.fill();
// ctx.closePath();
//
// context.beginPath();
// context.rect(160, 10, 100, 40);
// context.strokeStyle = "rgba(0, 0, 255, 0.5)";
// context.stroke();
// context.closePath();
