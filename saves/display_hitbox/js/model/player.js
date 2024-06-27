import { Vector } from "../utils.js";
import { Sprite } from "./entity.js";

export class Player extends Sprite {
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
