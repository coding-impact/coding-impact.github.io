import {Vector} from '../utils.js';

import {Anima} from './anima.js';
import {Entity, Sprite} from './entity.js';

export class Bullet extends Entity {
  constructor(x, y, power, accerate) {
    super(x, y);
    this.type = 'Bullet';
    this.power = power;
    this.accerate = accerate;
    this.speed = this.accerate.normal().multiply(this.power);
  }
  update() {
    this.speed = this.speed.add(this.accerate);
    super.update();
  }
}

const smallFireBallAnima =
    new Anima('assets/bullet/small_fire_ball.png', 4, 0.15);

export class SmallFireBall extends Bullet {
  constructor(...args) {
    super(...args);
    this.animation = smallFireBallAnima;
  }
  render(ctx, camera) {
    this.animation.render(
        ctx, camera, this.pos.x, this.pos.y, 32, 1,
        Math.atan2(this.speed.y, this.speed.x) - Math.PI / 2);
  }
}

export class Player extends Sprite {
  update() {
    super.update();
    this.energy += 0.1;
    this.energy = Math.min(this.maxEnergy, this.energy);
    this.health += 0.01;
    this.health = Math.min(this.maxHealth, this.health);
  }
  render(ctx, camera) {
    super.render(ctx, camera);
    if (this.health < this.maxHealth) {
      this.renderHealthBar(ctx, camera);
    }
    if (this.energy < this.maxEnergy) {
      this.renderEnergyBar(ctx, camera);
    }
  }
  renderHealthBar(ctx, camera) {
    ctx.beginPath();
    const boxHeight = 4;
    const marginY = 1;
    const maxBoxWidth = this.boxW * 1.7;
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(
        this.pos.x - camera.pos.x - maxBoxWidth / 2,
        this.pos.y - camera.pos.y + marginY + this.height / 2,
        Math.max(maxBoxWidth * (this.health / this.maxHealth), 0), boxHeight);
    ctx.strokeStyle = '#121212';
    ctx.rect(
        this.pos.x - camera.pos.x - maxBoxWidth / 2,
        this.pos.y - camera.pos.y + marginY + this.height / 2, maxBoxWidth,
        boxHeight);
    ctx.stroke();
    ctx.closePath();
  }
  renderEnergyBar(ctx, camera) {
    ctx.beginPath();
    const boxHeight = 4;
    const marginY = 1;
    const maxBoxWidth = this.boxW * 1.7;
    ctx.fillStyle = '#5252FF';
    ctx.fillRect(
        this.pos.x - camera.pos.x - maxBoxWidth / 2,
        this.pos.y - camera.pos.y + 2 * marginY + this.height / 2 + boxHeight,
        Math.max(maxBoxWidth * (this.energy / this.maxEnergy), 0), boxHeight);
    ctx.strokeStyle = '#121212';
    ctx.rect(
        this.pos.x - camera.pos.x - maxBoxWidth / 2,
        this.pos.y - camera.pos.y + 2 * marginY + this.height / 2 + boxHeight,
        maxBoxWidth, boxHeight)
    ctx.stroke();
    ctx.closePath();
  }
  shoot(camera, cursor, entityManager) {
    if (this.energy > 0) {
      this.energy -= 10;
      const power = 5;
      const acc = this.pos.add(cursor.pos.add(camera.pos).multiply(-1))
                      .normal()
                      .multiply(-0.1);
      const bullet = new SmallFireBall(this.pos.x, this.pos.y, power, acc);
      entityManager.add(bullet);
    }
  }
  control(pressedMap) {
    const walkSpeed = 4;
    var direction = new Vector(0, 0);
    this.stat = this.stat.replace('walk', 'idle');
    for (const key in pressedMap) {
      if (Object.hasOwnProperty.call(pressedMap, key)) {
        if (pressedMap[key]) {
          switch (key) {
            case 'KeyW':
              direction.y += -1;
              this.stat = 'walk_up';
              break;
            case 'KeyA':
              direction.x += -1;
              this.stat = 'walk_left';
              break;
            case 'KeyS':
              direction.y += 1;
              this.stat = 'walk_down';
              break;
            case 'KeyD':
              direction.x += 1;
              this.stat = 'walk_right';
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
