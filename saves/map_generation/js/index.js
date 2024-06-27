import {Camera} from './model/camera.js'
import {Player} from './model/entity.js'
import {Map} from './model/map.js'

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.width / 16 * 9;
}
resize();
window.onresize = resize;


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


const camera = new Camera(player, canvas)

function update() {
  player.control(pressedMap);
  camera.update();
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].update();
  }
}

const map = new Map()

function render() {
  map.render()
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
