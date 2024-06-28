import {Anima} from './anima.js';
import {Particle, Sprite} from './entity.js';
import {randomDirection, Vector} from '../utils.js';
import {config} from '../config.js';


class BloodParticle extends Particle {
  constructor(x, y) {
    super(x, y);
    this.anima = new Anima('assets/particle/blood.png', 22, 1);
    this.height = 100
  }
}
export class EvilWizard extends Sprite {
  constructor(target, ...args) {
    super(...args);
    this.target = target;
    this.remaining_animation_frame = 0; // 目前正在進行的，不可中斷的動畫，的剩餘幀數（這裡的幀數指的是
    // EntityManager.render 的幀數）
    this.anger = 0;

    this.oldHealth = this.health;

    this.dest = undefined;
  }
  reface(useDest = false) {
    let facePos = undefined;
    if (useDest) {
      facePos = this.dest;
    } else {
      facePos = this.target.pos;
    }
    if (facePos.x > this.pos.x) {
      this.direction = 1;
    } else {
      this.direction = -1;
    }
  }
  runTo(x, y) {
    this.dest = new Vector(x, y);
    this.reface(true);
    this.moveSpeed = 10;
    this.stat = "run";
  }
  jumpTo(x, y) {
    this.dest = new Vector(x, y);
    this.reface(true);
    this.moveSpeed = 30;
    this.stat = 'jump';
  }
  checkCollision(entityManager) {
    if (!this.visiable) {
      return;
    }
    entityManager.entityList.forEach(entity => {
      // is Bullet
      if (entity.type === 'Bullet') {
        // have collision
        if (((this.pos.x - this.boxW / 2 + this.boxOffsetX) < entity.pos.x) &&
            (entity.pos.x < (this.pos.x + this.boxW / 2 + this.boxOffsetX)) &&
            ((this.pos.y - this.boxH / 2 + this.boxOffsetY) < entity.pos.y) &&
            (entity.pos.y < (this.pos.y + this.boxH / 2 + this.boxOffsetY))) {
          entity.power /= 2;
          entityManager.add(new BloodParticle(entity.pos.x, entity.pos.y));
          this.damage(entity.power);
        }
      }
    });
  }
  play_animation_once(stat) {
    this.stat = stat;
    this.animaMap[this.stat].step = 0;
    this.remaining_animation_frame = (this.animaMap[this.stat].length - 0.5) /
        this.animaMap[this.stat].speed;
  }
  update() {
    if (!this.start) {
      return;
    }
    if (this.remaining_animation_frame > 0) {
      this.remaining_animation_frame--;
      // 這邊是攻擊傷害檢測
    } else if (this.remaining_animation_frame <= 0) {
      // 動作執行完畢，可以判斷接下來要執行什麼動作
      if (this.health < this.oldHealth) {
        this.play_animation_once('damaged');
        this.anger += Math.random();

      } else if (this.anger >= 1.5) {
        this.anger -= 0.5;
        this.runTo(
            this.target.pos.x + randomDirection() * 150,
            this.target.pos.y + 50 + 20 * randomDirection());

      } else if (this.stat == 'run') {
        this.pos = this.pos.add(this.dest.add(this.pos.multiply(-1))
                                    .normal()
                                    .multiply(this.moveSpeed));
        if (this.dest.add(this.pos.multiply(-1)).length() <
            config.runToError) {
          this.anger -= 0.5;
          if (this.target.pos.add(this.pos.multiply(-1)).length() > 150) {
            this.jumpTo(
                this.target.pos.x + randomDirection() * 80,
                this.target.pos.y + 40 + 20 * randomDirection());
          } else {
            this.reface();
            this.play_animation_once('attack1');
          }
        }
      } else if (this.stat == 'jump') {
        this.pos = this.pos.add(this.dest.add(this.pos.multiply(-1))
                                    .normal()
                                    .multiply(this.moveSpeed));
        if (this.dest.add(this.pos.multiply(-1)).length() <
            config.runToError) {
          this.anger -= 0.5;
          this.reface();
          this.play_animation_once('attack2');
        }
      } else {
        this.reface()

            this.stat = 'idle';
        this.anger += 0.01 * Math.random();
      }
    }
    
    this.oldHealth = this.health;
  }
}