
# 實體管理函式

但是在解決這個問題之前，我們得再次整理我們的檔案結構。

在 `model/` 下面建立兩個檔案，分別叫做 `player.js` 和 `enemy.js`：

```plain
index.html
assets/
  ...
js/
  index.js
  utils.js
  model/
    anima.js
    camera.js
    entity.js
    map.js
    enemy.js
    player.js
```

player.js 的內容如下：

```js
import { Vector } from "../utils.js";
import { Sprite } from "./entity.js";

export class Player extends Sprite {
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

enemy.js 的內容如下：

```js
import { Sprite } from "./entity.js";

export class EvilWizard extends Sprite {}
```

記得要在 index.js 變更引入他們的位置：

```js
import { Anima } from "./model/anima.js";
import { Camera } from "./model/camera.js";
import { EvilWizard } from "./model/enemy.js";
import { Map, Tileset } from "./model/map.js";
import { Player } from "./model/player.js";
```
