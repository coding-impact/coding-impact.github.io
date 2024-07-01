
# 勝負判定

[此階段完成品 DEMO](https://coding-impact.github.io/game_tutorial/22.%20勝負判定/)

那麼剩下來的，就是播放敵人的死亡動畫，首先，我們先確認我們有敵人的死亡動畫在 animaMap 裡面。

```js
const enemy =
    new EvilWizard(player, 32000, 31800, 512, 24, 96, 0, 32, 100, 100, {
      idle: new Anima('assets/evil_wizard/Idle.png', 8, general_speed),
      run: new Anima('assets/evil_wizard/Run.png', 8, general_speed),
      jump: new Anima('assets/evil_wizard/Jump.png', 2, general_speed),
      attack1:
          new Anima('assets/evil_wizard/Attack1.png', 8, general_speed * 1.5),
      attack2:
          new Anima('assets/evil_wizard/Attack2.png', 8, general_speed * 1.5),
      damaged: new Anima('assets/evil_wizard/Damaged.png', 3, general_speed),
      death: new Anima('assets/evil_wizard/Death.png', 7, general_speed),
    });
```

由於我們希望，敵人在播放玩死亡動畫後，再結束遊戲。所以我們需要添加一個 death，來確認他到底死透了沒。並讓敵人自己處理，因為沒血了，所以播放死亡動畫，播放玩了，再把自己設定為死透了的狀態。遊戲再檢測敵人有沒有死透，如果死透了，就結束遊戲。

所以把 `EvilWizard` 改成以下這樣：

```js
export class EvilWizard extends Sprite {
  constructor(target, ...args) {
    super(...args);
    this.target = target;
    this.moveSpeed = 0;
    this.start = false;  // 邪惡大法師是否可以開始活動

    this.remaining_animation_frame =
        0;  // 目前正在進行的，不可中斷的動畫，的剩餘幀數
    this.anger = 0;

    this.oldHealth = this.health;
    this.death = false;

    this.dest = undefined;
  }
  // ...中間省略
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

      if (this.stat == 'death') {
        this.death = true;
      } else if (this.health < this.oldHealth) {
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
        if (this.dest.add(this.pos.multiply(-1)).length() < config.runToError) {
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
        if (this.dest.add(this.pos.multiply(-1)).length() < config.runToError) {
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

    if (this.stat != 'death' && this.health <= 0) {
      this.play_animation_once('death');
    }

    this.oldHealth = this.health;
  }
}
```

並修改 `index.js`：

```js
function gameLoop() {
  if (player.health <= 0) {
    const text = textManager.addText('你輸了', 'red');
    text.progress = 1;
    textManager.render(ctx);
    return;
  }
  if (enemy.health <= 0 && camera.target != enemy) {
    camera.target = enemy;
  }
  if (enemy.death) {
    const text = textManager.addText('你贏了', 'white');
    text.progress = 1;
    textManager.render(ctx);
    return;
  }

  requestAnimationFrame(gameLoop);

  now = Date.now();
  delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
    update();
    render();
  }
}
```

至此，整個遊戲就完成了！
