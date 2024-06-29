import {Vector} from './utils.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.width / 16 * 9;
}
resize();
window.onresize = resize;

class Entity {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.speed = new Vector(0, 0);
  }
  update() {
    this.pos = this.pos.add(this.speed);
  }
  render() {
    // 每次繪製要執行的函式
  }
};

class Player extends Entity {
  render(ctx) {
    ctx.beginPath();
    ctx.fillStyle = '#5252FF';
    ctx.fillRect(this.pos.x, this.pos.y, 20, 40);
    ctx.closePath();
  }

  control(pressedMap) {
    const walkSpeed = 4;
    var direction = new Vector(0, 0);

    for (const key in pressedMap) {
      if (Object.hasOwnProperty.call(pressedMap, key)) {
        if (pressedMap[key]) {
          switch (key) {
            case 'KeyW':
              direction.y += -1;
              break;
            case 'KeyA':
              direction.x += -1;
              break;
            case 'KeyS':
              direction.y += 1;
              break;
            case 'KeyD':
              direction.x += 1;
              break;

            default:
              break;
          }
        }
      }
    }
    this.speed = direction.normal().multiply(walkSpeed);
  }
}

let entityList = [];

let player = new Player(0, 0);
entityList.push(player);

const pressedMap = {};
const controlKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'];

document.addEventListener('keydown', function(event) {
  if (event.code === 'Space' && !pressedMap['Space']) {
    // handle player shoot
  }
  if (controlKeys.includes(event.code)) {
    event.preventDefault()
    pressedMap[event.code] = 1;
  }
});

document.addEventListener('keyup', function(event) {
  if (controlKeys.includes(event.code)) {
    pressedMap[event.code] = 0;
  }
})


function update() {
  player.control(pressedMap);
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].update();
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].render(ctx);
  }
}

var fps = 60;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;

function gameLoop() {
  requestAnimationFrame(gameLoop);

  now = Date.now();
  delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
    update();
    render();
  }
}
requestAnimationFrame(gameLoop);
