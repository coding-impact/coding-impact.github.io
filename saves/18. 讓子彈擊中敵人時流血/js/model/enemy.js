import {Anima} from './anima.js';
import {Particle, Sprite} from './entity.js';

class BloodParticle extends Particle {
  constructor(x, y) {
    super(x, y);
    this.anima = new Anima('assets/particle/blood.png', 22, 1);
    this.height = 100
  }
}
export class EvilWizard extends Sprite {
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
}