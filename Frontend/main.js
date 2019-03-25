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
  }

  isColliding(p) {
    if (this.x + 20 < p.x)
        return false;
    if (this.y + 20 < p.y)
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

    if (this.x <= 0 || this.x >= 380) {
      this.xDirection *= -1;
    }
    if (this.y <= 0 || this.y >= 380) {
      this.yDirection *= -1;
    }

    if (this.isColliding(game.stickOne) || this.isColliding(game.stickTwo)){
      this.xDirection *= -1;
    }
  }
  
  draw(context) {
    context.fillStyle = "black";
    context.fillRect(this.x, this.y, 20, 20);
  }
}

class Game {
  constructor() {
    let canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.body.appendChild(canvas);
    this.context = canvas.getContext('2d');

    this.stickOne = new Pallet(10);
    this.stickTwo = new Pallet(380);

    this.ball = new Ball();
    
    this.connectSocket();
  }

  connectSocket() {
    let socket = io();
    socket.on("coords", (data) => {
      console.log(data);
      if (data.value !== "") {
        var coors = data.value.split(',');
        game.stickOne.update(coors[0]);
        game.stickTwo.update(coors[1]);
      }
    });
  }

  mainLoop() {
    game.context.fillStyle = "cyan";
    game.context.fillRect(0, 0, 400, 400);
    game.context.save();

    game.ball.update();

    game.stickOne.draw(game.context);
    game.stickTwo.draw(game.context);
    game.ball.draw(game.context);

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