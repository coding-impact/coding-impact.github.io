# 敵人動作攻擊判定

[此階段完成品 DEMO](https://coding-impact.github.io/game_tutorial/21.%20敵人的動作攻擊判定/)

那麼剩下來的，就是讓敵人的攻擊對玩家產生傷害，我這邊採用的方式，會是為每種招式，都設定一個攻擊碰撞箱，如果在特定時間內，碰到特定區域，就會受傷：

先將碰撞箱的設定加入 `config.js`，順便加入開關顯示碰撞箱的設定。

```js
export const config = {
  showHitBox: true,
  runToError: 40,

  enemyHitBoxMap: {
    attack1: [
      150, 150, 150, -40, 1, 5, 1
    ],  // boxW, boxH, boxOffsetX, boxOffsetY, end remain frame, start remain
        // frame, damage
    attack2: [180, 270, 150, -60, 0, 4, 2],
  }
}
```

修改 `Sprite`，以開關顯示碰撞箱：

```js
import {config} from '../config.js';

export class Sprite extends Entity {
  // ...前面省略
  render(ctx, camera) {
    if (this.visiable) {
      this.animaMap[this.stat].render(
          ctx, camera, this.pos.x, this.pos.y, this.height, this.direction);
    }
    if (config.showHitBox) {
      this.renderHitBox(ctx, camera);
    }
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
  // ...後面省略
}
```

修改 `EvilWizard`，以顯示攻擊範圍：

```js

export class EvilWizard extends Sprite {
  // ...前面省略
  render(ctx, camera) {
    super.render(ctx, camera);
    if (config.showHitBox &&
        Object.keys(config.enemyHitBoxMap).includes(this.stat) &&
        this.remaining_animation_frame >= config.enemyHitBoxMap[this.stat][4] /
                this.animaMap[this.stat].speed &&
        this.remaining_animation_frame <= config.enemyHitBoxMap[this.stat][5] /
                this.animaMap[this.stat].speed) {
      ctx.beginPath();
      ctx.fillStyle = '#FF000030';
      ctx.fillRect(
          (this.pos.x - camera.pos.x) -
              config.enemyHitBoxMap[this.stat][0] / 2 + this.boxOffsetX +
              (config.enemyHitBoxMap[this.stat][2]) * this.direction,
          (this.pos.y - camera.pos.y) -
              config.enemyHitBoxMap[this.stat][1] / 2 + this.boxOffsetY +
              config.enemyHitBoxMap[this.stat][3],
          config.enemyHitBoxMap[this.stat][0],
          config.enemyHitBoxMap[this.stat][1]);
      ctx.closePath();
    }
  }
  // ...後面省略
}
```

可以測試看看，將 `config.showHitBox` 設置為 `false` 會不會隱藏碰撞箱，並且檢查在開啟時，有沒有顯示攻擊範圍。

![enemy attack hitbox](/pictures/attack_hitbox.png)

接下來，就是要在攻擊時，讓碰到區域的玩家扣血。

繼續修改 `EvilWizard`：

```js

export class EvilWizard extends Sprite {
  // ...前面省略
  update() {
    if (!this.start) {
      return;
    }
    if (this.remaining_animation_frame > 0) {
      this.remaining_animation_frame--;

      if (Object.keys(config.enemyHitBoxMap).includes(this.stat) &&
          this.remaining_animation_frame >=
              config.enemyHitBoxMap[this.stat][4] /
                  this.animaMap[this.stat].speed &&
          this.remaining_animation_frame <=
              config.enemyHitBoxMap[this.stat][5] /
                  this.animaMap[this.stat].speed) {
        const hitBoxX = (this.pos.x) - config.enemyHitBoxMap[this.stat][0] / 2 +
            this.boxOffsetX +
            (config.enemyHitBoxMap[this.stat][2]) * this.direction;
        const hitBoxY = (this.pos.y) - config.enemyHitBoxMap[this.stat][1] / 2 +
            this.boxOffsetY + config.enemyHitBoxMap[this.stat][3];
        const hitBoxW = config.enemyHitBoxMap[this.stat][0];
        const hitBoxH = config.enemyHitBoxMap[this.stat][1];
        if (this.target.pos) {
          if (new Vector(
                  this.target.pos.x - this.target.boxW / 2 +
                      this.target.boxOffsetX,
                  this.target.pos.y - this.target.boxH / 2 +
                      this.target.boxOffsetY)
                  .isIn(hitBoxX, hitBoxY, hitBoxW, hitBoxH) ||
              new Vector(
                  this.target.pos.x - this.target.boxW / 2 +
                      this.target.boxOffsetX,
                  this.target.pos.y + this.target.boxH / 2 +
                      this.target.boxOffsetY)
                  .isIn(hitBoxX, hitBoxY, hitBoxW, hitBoxH) ||
              new Vector(
                  this.target.pos.x + this.target.boxW / 2 +
                      this.target.boxOffsetX,
                  this.target.pos.y - this.target.boxH / 2 +
                      this.target.boxOffsetY)
                  .isIn(hitBoxX, hitBoxY, hitBoxW, hitBoxH) ||
              new Vector(
                  this.target.pos.x + this.target.boxW / 2 +
                      this.target.boxOffsetX,
                  this.target.pos.y + this.target.boxH / 2 +
                      this.target.boxOffsetY)
                  .isIn(hitBoxX, hitBoxY, hitBoxW, hitBoxH)) {
            this.target.health -= config.enemyHitBoxMap[this.stat][6];
          }
        }
      }
    } else if (this.remaining_animation_frame <= 0) {
      // 動作執行完畢，可以判斷接下來要執行什麼動作
      // ...省略
    }
  }
}
```

添加完了之後，玩家就會受傷了

![player damaged](/pictures/player_damaged.png)
