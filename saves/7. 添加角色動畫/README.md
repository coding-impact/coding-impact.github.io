

## 角色動畫

現在我們有美麗的地圖了，接下來就是讓我們的角色變美麗。不過我們並不會只讓玩家變美麗，而是要製作一個全新的類別來處理所有材質相關的問題。

我們將會設計一個類別，叫做 `Anima`，其專注於呈現一個循環的動畫。例如玩家往右走的動畫，很顯然，玩家會有非常多個動畫，而這個特性是每個角色都會有的，所以我們會設計一個類別，叫做 `Sprite`，處理任何人型物體，其會有一個 `stat` 屬性，負責控制目前要播放什麼動畫。

我們先改寫目前的類別吧

```js
export class Sprite extends Entity {
  constructor(x, y, animaMap) {
    super(x, y);

    this.stat = 'idle';
    this.animaMap = animaMap;
  }

  render(ctx, camera) {
    this.animaMap[this.stat].render();
  }
}

export class Player extends Sprite {
  // 後面省略
```

而 animaMap 會是這個格式

```js
{
  idle: Anima,
  run: Anima,
  ...
}
```

我們現在已經知道，Anima 會儲存一個動畫，並且需要提供一個介面，在特定位置循環播放他，所以我們現在就來寫他吧！

首先我們確定我們會需要有圖片，也就需要 src。

先在 `model/` 底下建立另外一個檔案：`anima.js`，並填入

```js
export class Anima {
  constructor(src) {
    this.image = new Image();
    this.image.src = src;
  }
}
```

我們再來看看，我們的動畫素材是什麼格式。

![evil wizard run](/pictures/Run.png)

可以看出來，總共有 8 個影格，並且都是橫著排列，所以影格數量也要加入參數裡面。

```js
export class Anima {
  constructor(src, length) {
    this.image = new Image();
    this.image.src = src;
    this.length = length;
  }
}
```

我們現在知道每一個影格的資訊了，但是要播放成動畫，我們還得知道播放的速度，所以也把速度添加進去。

```js
export class Anima {
  constructor(src, length, speed) {
    this.image = new Image();
    this.image.src = src;
    this.speed = speed;
    this.length = length;
  }
}
```

現在我們應該具備了所有需要的資料，是時候來寫渲染動畫的部分：

```js
export class Anima {
  constructor(src, length, speed) {
    this.step = 0;
    this.image = new Image();
    this.image.src = src;
    this.speed = speed;
    this.length = length;
  }
  render(ctx, camera, rawX, rawY, height) {
    const sWidth = this.image.width / this.length;
    const scale = height / this.image.height;
    const sx = Math.floor(this.step) * sWidth;

    const displayWidth = sWidth * scale;
    const displayHeight = height;

    const x = rawX - camera.pos.x;
    const y = rawY - camera.pos.y;
    ctx.save();

    ctx.translate(
      x - displayWidth / 2 + displayWidth * 0.5,
      y - displayHeight / 2 + displayHeight * 0.5
    );
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      this.image,
      sx,
      0,
      sWidth,
      this.image.height,
      displayWidth * -0.5,
      displayHeight * -0.5,
      displayWidth,
      displayHeight
    );
    ctx.restore();

    this.step += this.speed;
    this.step %= this.length;
  }
}
```

希望大家還記得，之前渲染地圖時看的那張圖。

![canvas draw image ](/pictures/canvas_drawimage.jpg)

我們首先用 `step` 紀錄目前播放的進度，需要注意的是，`step` 每次渲染只會增加 `speed`。要經過 `Math.floor(this.step)` 才會知道目前要播放的是哪一格。

知道目前要播放哪一格後，就可以知道 `sx`，而 sy 永遠是 0。

高度可以直接從圖片讀取，寬度就要透過影格數和原始圖片寬度計算得出。

接下來就是在指定位置，指定大小繪製，而中間的 `translate` 之後會有妙用，現在就先透過移動畫布的方式來改變繪製位置。

最後就是根據 `speed` 更新 `step`。

接下來就是測試，為了演示方便，我們先讓主角的待機動畫用 boss 的。

先修改 `entity.js`，添加之前沒加的高度資訊，並且移除 `Player` 的渲染函式。

```js
export class Sprite extends Entity {
  constructor(x, y, height, animaMap) {
    super(x, y);

    this.stat = "idle";
    this.animaMap = animaMap;
    this.height = height;
  }

  render(ctx, camera) {
    this.animaMap[this.stat].render(
      ctx,
      camera,
      this.pos.x,
      this.pos.y,
      this.height
    );
  }
}

export class Player extends Sprite {
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

再修改 `index.js`，讓玩家的待機動畫使用 boss 的。

```js
let player = new Player(32000, 32000, 512, {
  idle: new Anima("assets/evil_wizard/Idle.png", 8, 0.15),
});
```

打開網頁測試看看：

![beautiful animation](/pictures/beautiful_animation.png)

非常美麗的動畫！

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/add_animation)
