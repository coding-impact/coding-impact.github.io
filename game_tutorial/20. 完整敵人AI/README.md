
# 完整敵人AI

[此階段完成品 DEMO](https://coding-impact.github.io/game_tutorial/20.%20完整敵人AI/)

不過現在還有一點小問題，那就是敵人會在開場動畫完成前，就開始跑來跑去，所以可以添加一個 start 來讓敵人知道什麼時候才開始動作：

```js
export class EvilWizard extends Sprite {
  constructor(target, ...args) {
    // ...前面省略
    this.start = false;
  }
  // ...中間省略 
  update(){
    if (!this.start) {
      return;
    }
    // ...後面省略
  }
}
```

並且記得在開場動畫裡面，讓敵人開始行動：

```js
async function main() {
  await sleep(2000);
  textManager.addText('第一關：青青草原');
  textManager.addText('Stage 1: Grass Land');
  await sleep(2000);
  textManager.addText('莫名其妙的紫色大法師');
  textManager.addText('The Mysterious Purple Mage');
  await sleep(1000);
  enemy.pos = player.pos.copy();
  enemy.pos.y -= 400;

  camera.target = enemy;
  await sleep(1000);
  textManager.textList = [];
  await sleep(2000);
  enemy.show();
  await sleep(1000);
  bossBar.show();
  enemy.start = true;
  await sleep(500);
  camera.target = player;
}
```

之前有一個跑步的最小誤差，像這種類似的設定，我打算整理起來放到一個檔案裡面，像這樣。在 `js/` 底下建立一個檔案，叫做 `config.js`，裡面輸入以下內容：

```js
export const config = {
  runToError: 40,
}
```

記得修改用到它的地方：

```js
if (this.dest.add(this.pos.multiply(-1)).length() < config.runToError) {
  this.stat = "idle";
}
```

而接下來，還會用到一個決定隨機攻擊方向的函式，所以把以下內容加入 `utils.js`

```js
export function randomDirection() {
  if (Math.random() > 0.5) {
    return 1;
  } else {
    return -1;
  }
}
```

那麼，接下來，就是把整套敵人邏輯寫完，包含兩種突進方式，和兩種攻擊。
這部分我打算快速帶過，大家可以自己想自己喜歡的攻擊模式。

並且修改 `enemy.js`

```js
import {randomDirection, Vector} from '../utils.js';
import {config} from '../config.js';

export class EvilWizard extends Sprite {
  // ...前面省略
  jumpTo(x, y) {
    this.dest = new Vector(x, y);
    this.reface(true);
    this.moveSpeed = 30;
    this.stat = 'jump';
  }
  // ...中間省略
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
```

並記得添加動畫：

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
    });
```

![enemy attack](/pictures/enemy_attack.png)

如果一切都照著做，應該能見敵人跑過來朝你攻擊。
