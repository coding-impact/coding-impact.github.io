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
  constructor(
      x, y, height, boxW, boxH, boxOffsetX, boxOffsetY, maxHealth, maxEnergy,
      animaMap) {
    super(x, y);

    this.stat = 'idle';
    this.animaMap = animaMap;
    this.height = height;
    this.boxW = boxW;
    this.boxH = boxH;
    this.boxOffsetX = boxOffsetX;
    this.boxOffsetY = boxOffsetY;

    this.maxHealth = maxHealth;
    this.maxEnergy = maxEnergy;
    this.health = this.maxHealth;
    this.energy = this.maxEnergy;
    this.visiable = true;
  }
  hide() {
    this.visiable = false;
  }
  show() {
    this.visiable = true;
  }
  render(ctx, camera) {
    if (this.visiable) {
      this.animaMap[this.stat].render(
          ctx, camera, this.pos.x, this.pos.y, this.height);
    }
    this.renderHitBox(ctx, camera);
  }
  renderHitBox(ctx, camera) {
    ctx.beginPath();
    ctx.fillStyle = '#00FF0030';
    ctx.fillRect(
        this.pos.x - camera.pos.x - this.boxW / 2 + this.boxOffsetX,
        this.pos.y - camera.pos.y - this.boxH / 2 + this.boxOffsetY, this.boxW,
        this.boxH);
    ctx.closePath();
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
      if (typeof entity.update === 'function') {
        entity.update();
      }
    });
  }
  render(ctx, camera) {
    this.entityList.sort(
        (a, b) => (a.pos.y + a.boxH / 2 + a.boxOffsetY) -
            (b.pos.y + b.boxH / 2 + b.boxOffsetY));
    this.entityList.forEach((entity) => {
      entity.render(ctx, camera);
    });
  }
}
