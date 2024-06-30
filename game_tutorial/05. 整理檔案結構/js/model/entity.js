import {Vector} from '../utils.js';

export class Entity {
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

export class Player extends Entity {
  render(ctx, camera) {
    let width = 20;
    let height = 40;
    ctx.beginPath();
    ctx.fillStyle = '#5252FF';
    ctx.fillRect(
        this.pos.x - camera.pos.x - width / 2,
        this.pos.y - camera.pos.y - height / 2, width, height);
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
