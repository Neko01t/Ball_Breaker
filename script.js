const canvas = document.getElementById("screen");
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let x = 1;
let key = {}
let paddle = {
  x: 10,
  y: 40,
  width: 80,
  height: 10,
  speed: 6,
  dx: 0,
}
let block= {
  x:canvas.width/2,
  y:canvas.height/2,
  height: 20,
  width: 20,
  colided:false,
}
let ball = {
  x: 50,
  y: 50,
  radius: 10,
  speed: 4,
  dx: 1,
  dy: -1,
}
function drawBall(x,y) {
  ctx.beginPath();
  ctx.arc(x, y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();
}
function updateball() {
  ball.x += ball.dx*ball.speed;
  ball.y += ball.dy*ball.speed;
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width){
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
    ball.dy = -ball.dy;
  }
  if (ball.x) {

  }

}
function drawPaddle(x,y,w,h) {
  ctx.fillStyle = "blue";
  ctx.fillRect(x, y, w, h);
}
function updatePaddle() {
 if(key['ArrowLeft'] || key['a'] || key['A']){
    if (paddle.x>5) {
      paddle.dx = -paddle.speed
    }

  }
  else if(key['ArrowRight'] || key['d'] || key['D']){
    if (paddle.x+paddle.width<canvas.width) {
      paddle.dx = +paddle.speed;
    }
  }
  paddle.x += paddle.dx;
  if (paddle.x < 0) paddle.x = 5;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width - 5;
  }

}
function drawBlock(x,y) {
  ctx.fillStyle = "red";
  ctx.fillRect(x, y, block.width, block.height);
}

function ballHitsBlock(ball, block) {
  // Find the closest point on block to the ball
  let closestX = Math.max(block.x, Math.min(ball.x, block.x + block.width));
  let closestY = Math.max(block.y, Math.min(ball.y, block.y + block.height));

  // Difference between ball center and closest point
  let dx = ball.x - closestX;
  let dy = ball.y - closestY;

  // Return both collision result and dx/dy
  return {
    collided: (dx * dx + dy * dy) <= (ball.radius * ball.radius),
    dx, dy
  };
}
function paddleCollision() {
  let ballTop = ball.y - ball.radius;
  let ballBottom = ball.y + ball.radius;
  let ballLeft = ball.x - ball.radius;
  let ballRight = ball.x + ball.radius;

  if (
    ballBottom >= paddle.y &&                  // ball reached paddle top
    ballTop <= paddle.y + paddle.height &&     // not way below
    ballRight >= paddle.x &&                   // not left
    ballLeft <= paddle.x + paddle.width        // not right
  ) {
    // Bounce vertically
    ball.dy = -ball.dy;

    // Reposition so it doesn’t stick inside paddle
    ball.y = paddle.y - ball.radius;

    // (Optional) Change angle depending on where it hits
    let hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    ball.dx = hitPoint * 2; // tweak 5 for speed/angle control
  }
}

function checkCollision() {
//  let ballTop = ball.y - ball.radius;
//  let ballBottom = ball.y + ball.radius;
//  let ballLeft = ball.x - ball.radius
//  let ballRight = ball.x + ball.radius
//  if (ballTop <= paddle.y && ballBottom >= paddle.y &&
//      ball.x >= paddle.x && ball.x <= paddle.x + paddle.width){
//    ball.dy = -ball.dy
//  }
//  if (
//    ballBottom >= paddle.y &&                  // ball has reached paddle top
//    ballTop <= paddle.y + paddle.height &&     // ball isn’t way below
//    ballRight >= paddle.x &&                   // ball not left of paddle
//    ballLeft <= paddle.x + paddle.width        // ball not right of paddle
//  ) {
//    ball.dy = -ball.dy;
//    ball.y = paddle.y - ball.radius;
//  }

//  if (
//    ball.x > block.x && ball.x < block.x + block.width &&
//    ball.y + ball.radius > block.y &&
//    ball.y - ball.radius < block.y + block.height
//  ) {
//    ball.dy = -ball.dy;
//   block.colided = true;
//  }
  paddleCollision()
  if (!block.colided) {
    blockCollision();
  }
}
function blockCollision() {
  let result = ballHitsBlock(ball, block);
  if (result.collided) {
    if (Math.abs(result.dx) > Math.abs(result.dy)) {
      // Hit more from the side → bounce horizontally
      ball.dx = -ball.dx;
    } else {
      // Hit more from top/bottom → bounce vertically
      ball.dy = -ball.dy;
    }
    block.colided = true;
}

}
window.addEventListener("keydown",(e)=>{
  key[e.key] = true;
})
window.addEventListener("keyup", (e)=>{
  key[e.key] = false;
})
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  updatePaddle();
  checkCollision();
  updateball();
}

function loop() {
  clearCanvas();
  update();
  if (!block.colided) {
    drawBlock(block.x,block.y);
  }
  drawBall(ball.x,ball.y)
  drawPaddle(paddle.x, paddle.y, paddle.width, paddle.height)
  requestAnimationFrame(loop);
}
console.log("Loop is running");
loop();
