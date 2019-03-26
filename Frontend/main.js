const canvasWidth = 500;
const canvasHeight = 400;

class Pallet {
  constructor(x){
    this.x = x;
    this.y = 0;
    this.width = 10;
    this.height = 40;
  }

  update(y) {
    this.y = y;
  }

  draw(context) {
    context.fillStyle = "red";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Ball {
  constructor() {
    this.x = 200;
    this.y = 215;
    this.xDirection = 1;
    this.yDirection = 1;
    this.width = 20;
    this.height = 20;
  }

  isColliding(p) {
    if (this.x + this.width < p.x)
        return false;
    if (this.y + this.height < p.y)
        return false;
    if (this.x > p.x + p.width)
        return false;
    if (this.y > p.y + p.height)
        return false;

    return true;
  }

  update() {
    this.x -= this.xDirection;
    this.y -= this.yDirection;

    if (this.x <= 0 || this.x >= canvasWidth - this.width) {
      this.xDirection *= -1;
    }
    if (this.y <= 0 || this.y >= canvasHeight - this.height) {
      this.yDirection *= -1;
    }

    if (this.isColliding(game.stickOne) || this.isColliding(game.stickTwo)){
      this.xDirection *= -1;
    }
  }
  
  draw(context) {
    context.fillStyle = "white";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Game {
  constructor() {
    let canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    document.body.appendChild(canvas);
    this.context = canvas.getContext('2d');

    this.stickOne = new Pallet(10);
    this.stickTwo = new Pallet(canvasWidth - 20);
    this.ball = new Ball();

    this.playerOneScrore = 0;
    this.playerTwoScrore = 0;
    
    this.connectSocket();
  }

  connectSocket() {
    let socket = io();
    socket.on("coords", (data) => {
      console.log(data);
      if (data.value !== "") {
        var coors = data.value.split(',');
        coors[0] = parseInt(coors[0]);
        coors[1] = parseInt(coors[1]);

        if (coors[0] < 0 || coors[1] < 0 || coors[0] > 400 || coors[1] > 400) {
          return;
        }

        game.stickOne.update(coors[0]);
        game.stickTwo.update(coors[1]);
      }
    });
  }

  mainLoop() {
    game.context.fillStyle = "black";
    game.context.fillRect(0, 0, canvasWidth, canvasHeight);
    game.context.save();

    game.ball.update();

    game.stickOne.draw(game.context);
    game.stickTwo.draw(game.context);
    game.ball.draw(game.context);

    game.context.fillStyle = "white";
    game.context.font = "20pt arial";
    game.context.fillText(game.playerOneScrore, 40, 30);
    game.context.fillText(game.playerTwoScrore, canvasWidth - 60, 30);

    game.context.restore();

    window.requestAnimFrame(game.mainLoop);
  }

  init() {
      window.requestAnimFrame = (function(){
          return window.requestAnimationFrame    ||
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(callback, element){
                  window.setTimeout(callback, Configuration.fps);
              };
      })();

      window.requestAnimFrame(this.mainLoop);
  }
}

let game = new Game();
game.init();