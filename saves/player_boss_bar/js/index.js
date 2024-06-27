import {Anima} from './model/anima.js';
import {Camera} from './model/camera.js'
import {Cursor} from './model/cursor.js';
import {EvilWizard} from './model/enemy.js';
import {EntityManager} from './model/entity.js'
import {Map, Tileset} from './model/map.js';
import {Player} from './model/player.js';
import {BossBar, UIManager} from './model/UI.js';

const cursor = new Cursor();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.width / 16 * 9;
}
resize();
window.onresize = resize;


const general_speed = 0.15;
const player = new Player(32000, 32000, 64, 24, 60, 0, 0, 100, 100, {
  idle_down: new Anima('assets/player/idle_down.png', 1, general_speed),
  idle_up: new Anima('assets/player/idle_up.png', 1, general_speed),
  idle_left: new Anima('assets/player/idle_left.png', 1, general_speed),
  idle_right: new Anima('assets/player/idle_right.png', 1, general_speed),
  walk_down: new Anima('assets/player/walk_down.png', 2, general_speed),
  walk_up: new Anima('assets/player/walk_up.png', 2, general_speed),
  walk_left: new Anima('assets/player/walk_left.png', 2, general_speed),
  walk_right: new Anima('assets/player/walk_right.png', 2, general_speed),
});
player.stat = 'idle_down';

const enemy = new EvilWizard(32000, 31800, 512, 24, 96, 0, 32, 100, 100, {
  idle: new Anima('assets/evil_wizard/Idle.png', 8, general_speed),
});

const uiManager = new UIManager();
const bossBar = new BossBar(enemy);
uiManager.addUI(bossBar);
bossBar.show();

const entityManager = new EntityManager();
entityManager.add(player);
entityManager.add(enemy);

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

let stop = false;

document.addEventListener('keydown', function(event) {
  if (event.code === 'KeyC') {
    stop = true;
  }
  if (event.code === 'Space' && !pressedMap['Space']) {
    player.shoot(camera, cursor, entityManager);
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

canvas.addEventListener('mouseleave', () => {
  cursor.hide();
});

canvas.addEventListener('mouseenter', () => {
  cursor.show();
});

cursor.show();
canvas.addEventListener('mousemove', function(event) {
  cursor.moveTo(
      event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
});

function update() {
  player.control(pressedMap);
  camera.update();
  entityManager.update();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render(ctx, canvas, camera);
  entityManager.render(ctx, camera);
  uiManager.render(ctx, canvas);
  cursor.render(ctx);
};

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
