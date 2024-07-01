
# 整理檔案結構

想必大家到現在，肯定會覺得：「天哪！`index.js` 也太亂了吧！這樣我們要怎麼繼續快樂的寫下去？」

我們現在就來解決這個問題！先在 `js` 資料夾內，建立另外一個資料夾，叫做 `model`，並在裡面添加兩個檔案，分別叫做 `camera.js` 和 `entity.js`。如下：

```plain
index.html
js/
  index.js
  utils.js
  model/
    camera.js
    entity.js
```

這裡採用的分類方式，是先以 `js`，分類所有的程式碼，再以 `index.js` 為整個程式的啟動點，把類別丟進 `model` 裡面。

把 `Camera` 丟進 `camera.js`，把 `Player` 和 `Entity` 丟進 `entity.js`，詳細步驟如下。

把 `index.js` 當中關於 `Camera` 的部分刪除，並在 `camera.js` 添加以下內容

```js
import { Vector } from "../utils.js";

export class Camera {
  constructor(traceTarget, canvas) {
    this.target = traceTarget;
    this.canvas = canvas;
    this.pos = new Vector(0, 0);
    this.center = this.target.pos;
  }
  update() {
    this.center = this.target.pos
      .add(this.center.multiply(19))
      .multiply(1 / 20);
    this.pos = {
      x: this.center.x - this.canvas.width / 2,
      y: this.center.y - this.canvas.height / 2,
    };
  }
}
```

記得要在 `class` 前面加上 `export`，這樣才能讓 `index.js` 載入檔案後讀取到這個物件。

在 `index.js` 中移除 `Entity` 和 `Player` 的定義，並移到 `entity.js`

```js
import { Vector } from "../utils.js";

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
}

export class Player extends Entity {
  render(ctx, camera) {
    let width = 20;
    let height = 40;
    ctx.beginPath();
    ctx.fillStyle = "#5252FF";
    ctx.fillRect(
      this.pos.x - camera.pos.x - width / 2,
      this.pos.y - camera.pos.y - height / 2,
      width,
      height
    );
    ctx.closePath();
  }

  control(pressedMap) {
    const walkSpeed = 4;
    var direction = new Vector(0, 0);

    for (const key in pressedMap) {
      if (Object.hasOwnProperty.call(pressedMap, key)) {
        if (pressedMap[key]) {
          switch (key) {
            case "KeyW":
              direction.y += -1;
              break;
            case "KeyA":
              direction.x += -1;
              break;
            case "KeyS":
              direction.y += 1;
              break;
            case "KeyD":
              direction.x += 1;
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

一樣記得要加上 `export`，最後再在 `index.js` 裡面，引入這兩個檔案。

```js
// 這裡是檔案的最前面
import { Camera } from "./model/camera.js";
import { Player } from "./model/entity.js";
```
