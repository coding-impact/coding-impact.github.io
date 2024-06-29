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

export class Sprite extends Entity {
  constructor(x, y, height, animaMap) {
    super(x, y);
    
    this.stat = 'idle';
    this.animaMap = animaMap;
    this.height = height
  }

  render(ctx, camera) {
    this.animaMap[this.stat].render(ctx, camera, this.pos.x, this.pos.y, this.height);
  }
}

export class Player extends Sprite {
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
