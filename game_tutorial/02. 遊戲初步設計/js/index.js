import {Vector} from './utils.js';

class Entity {
  constructor(x, y) {
    this.pos = new Vector(x, y);
  }
  update() {
    // 每次更新要執行的函式
  }
  render() {
    // 每次繪製要執行的函式
  }
};
const canvas = document.getElementById('gameCanvas');

document.addEventListener('keydown', function(event) {
    console.log(`key down" ${event.code}`);
});

document.addEventListener('keyup', function(event) {
    console.log(`key up" ${event.code}`);
  
});

canvas.addEventListener('mouseleave', () => {
    console.log(`mouse leave`);
});

canvas.addEventListener('mouseenter', () => {
    console.log(`mouse enter`);
});

canvas.addEventListener('mousemove', function(event) {
    console.log(`mouse move: ${event.clientX} ${event.clientY}`);
});


let entityList = [];
function update(){
    for (let i = 0; i < entityList.length; i++) {
        entityList[i].update();
    }
}
function render(){
    for (let i = 0; i < entityList.length; i++) {
        entityList[i].render();
    }
}

function gameLoop() {
    update();
    render();
}