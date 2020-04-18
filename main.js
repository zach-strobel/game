
class GameObject {

  getSides() {
    let left = this.position.x;
    let right = this.position.x + this.width;
    let top = this.position.y;
    let bottom = this.position.y + this.height;
    return {left: left, right: right, top: top, bottom: bottom}
  }

  collided(object2) {
    let object1Sides = this.getSides();
    let object2Sides = object2.getSides();
    return (object1Sides.left < object2Sides.right && 
           object1Sides.right > object2Sides.left && 
           object1Sides.top < object2Sides.bottom &&
           object1Sides.bottom > object2Sides.top);
  }

  // Called every frame
  update() {
    
  }

  // Called every frame
  render() {
    let ctx = Game.getContext();
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

}


class Floor extends GameObject {
  constructor(game) {
    super();
    this.game = game;
    this.position = {x:0, y:300};
    this.width = 2000;
    this.height = 3;
    this.color = 'black';
  }
}


class Fence extends GameObject {
  constructor(game) {
    super();
    this.game = game;
    this.position = {x:800, y:280};
    this.width = 20;
    this.height = 20;
    this.color = 'black';
    this.speed = 1.6
  }

  // Called every frame
  update() {
    
    this.position.x -= this.speed

    // If fence went off the screen
    if (this.position.x <0 ) {
      this.position.x = 1000
      this.speed += .25
      this.game.score += 1
    }

    if (this.speed > 8) {
      this.speed = 8
    }
  }
}


class Player extends GameObject {
  constructor(game) {
    super();
    this.game = game;
    this.position = {x:100, y:250};
    this.width = 50;
    this.height = 50;
    this.color = 'red';
    this.touchingFloor = true
  }

  jump() {
    if (this.touchingFloor == true) {
      this.position.y -= 50 
      this.touchingFloor = false
    }
  }

  // Called every frame
  update() {
    // if we are in the air
    if (this.position.y < 250) {
      this.position.y += .5 // apply gravity
    } else { // if we hit the ground
      this.touchingFloor = true
    }

    // Game over
    if (this.collided(this.game.fence)) {
      alert("GAME OVER. SCORE: " + this.game.score)
      this.game.running = false;
    }
  }
}



class Game {
  constructor() { 
    this.floor = new Floor(this);
    this.fence = new Fence(this);
    this.player = new Player(this);
    this.color = 'gray';
    this.width = canvas.width;
    this.height = canvas.height;
    this.running = true;
    this.score = 0;
  }

  static getCanvas() {
    return document.getElementById("canvas");
  }

  static getContext() {
    return Game.getCanvas().getContext("2d");
  }

  updateObjects() {
    this.player.update();
    this.fence.update();
    this.floor.update();
  }

  renderObjects() {
    this.player.render();
    this.fence.render();
    this.floor.render();
  }

  renderBackground() {
    let ctx = Game.getContext();
    ctx.beginPath();
    ctx.rect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  // Called every animation frame
  update() {
    if (this.running) {
      this.updateObjects();
      window.requestAnimationFrame(this.update.bind(this));
    }
  }

  render() {
    this.renderBackground();
    this.renderObjects();
    window.requestAnimationFrame(this.render.bind(this));
  }

  start() {
    window.requestAnimationFrame(this.update.bind(this));
    window.requestAnimationFrame(this.render.bind(this));
  }

  initControls() {
    document.onkeydown = (e) => {
      if (e.key == " ") {
        this.player.jump();
      }
    }
  }

  init() {
    this.initControls();
    this.start();
  }
}


window.onload = () => {
  console.log('Window loaded..');
  let game = new Game();
  game.init();
}



