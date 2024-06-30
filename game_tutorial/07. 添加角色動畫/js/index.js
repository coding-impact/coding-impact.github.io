import {Anima} from './model/anima.js';
import {Camera} from './model/camera.js'
import {Player} from './model/entity.js'
import {Map, Tileset} from './model/map.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.width / 16 * 9;
}
resize();
window.onresize = resize;


let entityList = [];

let player = new Player(32000, 32000, 512, {
  'idle': new Anima('assets/evil_wizard/Idle.png', 8, 0.15),
});

entityList.push(player);
const camera = new Camera(player, canvas)

const rule = {
  plain: 0.5,
  flower: 0.35,
  brick: 0.15,
};

var plainList = [];
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    plainList.push(i + j * 8);
  }
}

var flowerList = [];
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    flowerList.push(i + 4 + j * 8);
  }
}

var brickList = [];
for (let i = 32; i < 62; i++) {
  brickList.push(i);
}

const blockMap = {
  plain: plainList,
  flower: flowerList,
  brick: brickList,
};

const tileset = new Tileset('assets/map/grass.png', 8, 32, blockMap, rule);
const map = new Map(1000, tileset);
map.init();

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
  camera.update();
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].update();
  }
}


function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render(ctx, canvas, camera);
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].render(ctx, camera);
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
