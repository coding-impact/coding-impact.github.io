
# 開場小動畫

沒錯，看到可以開關的 BossBar，是不是讓人很想要做一點 opening animation？

所以我們來做開場動畫吧！

首先，我們得先寫一個，可以等待特定時間再繼續執行的函式。由於我們不希望在等待的時候阻塞進程，所以這個等待的函式會是 async 的。

在 `utils.js` 裡面添加以下內容：

```js
export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
```

並且我們要讓 Sprite 是可以被隱藏，或是顯示的。

```js
export class Entity {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.speed = new Vector(0, 0);
    this.visiable = true;
  }
  update() {
    this.pos = this.pos.add(this.speed);
  }
  hide() {
    this.visiable = false;
  }
  show() {
    this.visiable = true;
  }
}
```

並且修改 Sprite 的顯示部分

```js
export class Sprite extends Entity {
  constructor(
    x,
    y,
    height,
    boxW,
    boxH,
    boxOffsetX,
    boxOffsetY,
    maxHealth,
    maxEnergy,
    animaMap
  ) {
    super(x, y);

    this.stat = "idle";
    this.animaMap = animaMap;
    this.height = height;
    this.boxW = boxW;
    this.boxH = boxH;
    this.boxOffsetX = boxOffsetX;
    this.boxOffsetY = boxOffsetY;

    this.maxHealth = maxHealth;
    this.maxEnergy = maxEnergy;
    this.health = this.maxHealth;
    this.energy = this.maxEnergy;
    this.visiable = true;
  }
  hide() {
    this.visiable = false;
  }
  show() {
    this.visiable = true;
  }
  render(ctx, camera) {
    if (this.visiable) {
      this.animaMap[this.stat].render(
        ctx,
        camera,
        this.pos.x,
        this.pos.y,
        this.height
      );
    }
    this.renderHitBox(ctx, camera);
  }
  // ...後面省略
}
```

然後在 `index.js`，移除原本的 `bossBar.show()`，並添加以下內容：

```js
import { sleep } from "./utils.js";
// ...中間省略
const enemy = new EvilWizard(32000, 31800, 512, 24, 96, 0, 32, 100, 100, {
  idle: new Anima("assets/evil_wizard/Idle.png", 8, general_speed),
});
enemy.hide();
// ...中間省略

// bossBar.show()   移除這行！
async function main() {
  await sleep(2000);
  enemy.pos = player.pos.copy();
  enemy.pos.y -= 400;

  camera.target = enemy;
  await sleep(1000);
  enemy.show();
  await sleep(1000);
  bossBar.show();
  await sleep(500);
  camera.target = player;
}
main().then();
```

現在可以回到網頁上看看了，應該可以看到史詩級的動畫場景、完美的運鏡。

這時候，不添加一些說明文字，天地良心都看不下去。

回到 `UI.js`，添加 `Text` 和 `TextManager`：

```js
import { Vector } from "../utils.js";

export class Text {
  constructor(text, x, y, textAlign, color = "#eeeeee") {
    this.text = text;
    this.textAlign = textAlign;
    this.color = color;
    this.height = 32;
    this.font = `${this.height}px pixel font`;
    this.pos = new Vector(x, y);
    this.progress = 0.1;
    this.speed = 0.03;
  }
  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;
    const textArray = this.text.split("");
    const showArray = textArray.slice(
      0,
      Math.round(textArray.length * this.progress)
    );
    for (
      let i = 0;
      i < Math.min(10, textArray.length - showArray.length);
      i++
    ) {
      showArray.push(String.fromCharCode(Math.floor(Math.random() * 93 + 33)));
    }
    ctx.fillText(showArray.join(""), this.pos.x, this.pos.y + this.height);

    this.progress += this.speed;
    this.progress = Math.min(this.progress, 1);
  }
}
export class TextManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.padding = 16;
    this.textList = [];
    this.newTextY = (this.canvas.height - 48 * 4) / 2;
  }
  addText(text, color) {
    const textObject = new Text(
      text,
      this.canvas.width / 2,
      this.newTextY,
      "center",
      color
    );
    this.textList.push(textObject);
    this.newTextY += textObject.height;
    this.newTextY += this.padding;
    return textObject;
  }
  render(ctx) {
    this.textList.forEach((text) => {
      text.render(ctx);
    });
  }
}
```

這裡不多做解釋，總之就是我在寫的時候，一時鬼迷心竅，加了一點酷炫的亂碼特效。總之有一個 `progress` 參數，負責判斷目前的文字顯示進度如何，之後就是顯示他，並且把剩餘的部分文字，用亂碼替代，最後再根據設定的速度，增加 `progress`。

重新修改 `index.js`，添加史詩級字幕：

```js
import { BossBar, TextManager, UIManager } from "./model/UI.js";

const textManager = new TextManager(canvas);

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render(ctx, canvas, camera);
  entityManager.render(ctx, camera);
  uiManager.render(ctx, canvas);
  textManager.render(ctx);
  cursor.render(ctx);
}

async function main() {
  await sleep(2000);
  textManager.addText("第一關：青青草原");
  textManager.addText("Stage 1: Grass Land");
  await sleep(2000);
  textManager.addText("莫名其妙的紫色大法師");
  textManager.addText("The Mysterious Purple Mage");
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
  await sleep(500);
  camera.target = player;
}
```

總之，加上完美的各種文字，配合究極美麗的亂碼特效，輔以完美的運鏡，一個完美的入場動畫就做好了。

如果我有更多時間，你們就會看到紫色大法師用更華麗一點的方式入場，但很可惜我沒有。

![epic intro](/pictures/epic_intro2.png)
![epic intro](/pictures/epic_intro.png)

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/opening_animation)
