

### 完整角色控制動畫、敵人動畫

那麼，接下來就是完善整套動畫系統

先將 index.js 中，關於 Player 的部分改成這樣：

```js
const general_speed = 0.15;
const player = new Player(32000, 32000, 64, {
  idle_down: new Anima("assets/player/idle_down.png", 1, general_speed),
  idle_up: new Anima("assets/player/idle_up.png", 1, general_speed),
  idle_left: new Anima("assets/player/idle_left.png", 1, general_speed),
  idle_right: new Anima("assets/player/idle_right.png", 1, general_speed),
  walk_down: new Anima("assets/player/walk_down.png", 2, general_speed),
  walk_up: new Anima("assets/player/walk_up.png", 2, general_speed),
  walk_left: new Anima("assets/player/walk_left.png", 2, general_speed),
  walk_right: new Anima("assets/player/walk_right.png", 2, general_speed),
});
player.stat = "idle_down";
```

接下來，就是在玩家轉向的部分，添加改變動畫狀態的邏輯。

```js
export class Player extends Sprite {
  // ...前面省略
  control(pressedMap) {
    const walkSpeed = 4;
    var direction = new Vector(0, 0);
    this.stat = this.stat.replace("walk", "idle");
    for (const key in pressedMap) {
      if (Object.hasOwnProperty.call(pressedMap, key)) {
        if (pressedMap[key]) {
          switch (key) {
            case "KeyW":
              direction.y += -1;
              this.stat = "walk_up";
              break;
            case "KeyA":
              direction.x += -1;
              this.stat = "walk_left";
              break;
            case "KeyS":
              direction.y += 1;
              this.stat = "walk_down";
              break;
            case "KeyD":
              direction.x += 1;
              this.stat = "walk_right";
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
```

這時候你應該會看到你的角色非常流暢的動畫。

![character animation](/pictures/character_animation.png)

現在是時候添加另外一個角色進去了，沒錯，就是我們的「莫名其妙的紫色大法師」

```js
export class EvilWizard extends Sprite {}
```

先不用添加什麼邏輯在裡面，我們之後再做，將他也加入 entityList。

```js
import { EvilWizard } from "./model/entity.js";

const enemy = new EvilWizard(player, 32000, 31800, 512, {
  idle: new Anima("assets/evil_wizard/Idle.png", 8, general_speed),
});
entityList.push(enemy);
```

![enemy and player](/pictures/enemy_and_player.png)

看起來非常棒！但...

![render order glitch](/pictures/render_order_glitch.png)

玩家明明在敵人的前面，卻被敵人遮住了。

所以這個就是接下來我們要解決的問題！
