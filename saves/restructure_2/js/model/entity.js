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
    this.type = 'Sprite';
    this.stat = 'idle';
    this.animaMap = animaMap;
    this.height = height
  }

  render(ctx, camera) {
    this.animaMap[this.stat].render(
        ctx, camera, this.pos.x, this.pos.y, this.height);
  }
}

