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
    this.animaMap[this.stat].render(
        ctx, camera, this.pos.x, this.pos.y, this.height);
  }
}

export class EntityManager {
  constructor() {
    this.entityList = [];
  }
  add(entity) {
    this.entityList.push(entity);
  }
  update() {
    this.entityList.forEach((entity) => {
      if (typeof entity.update === "function") {
        entity.update();
      }
    });
  }
  render(ctx, camera) {
    this.entityList.sort((a, b) => a.pos.y - b.pos.y);
    this.entityList.forEach((entity) => {
      entity.render(ctx, camera);
    });
  }
}
