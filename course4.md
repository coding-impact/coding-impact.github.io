# 7/5

> 重點：  
> 完成遊戲與自由發揮

## 血量與魔力條

我們的角色有能量與血條後，接下來就該來顯示他們：

我們直接在 `Player` 的渲染部分，加一個顯示能量條和血條的部分就行了，畢竟其他實體應該不太需要。

```js
export class Player extends Sprite {
  // ...前面省略
  render(ctx, camera) {
    super.render(ctx, camera);
    if (this.health < this.maxHealth) {
      this.renderHealthBar(ctx, camera);
    }
    if (this.energy < this.maxEnergy) {
      this.renderEnergyBar(ctx, camera);
    }
  }
  renderHealthBar(ctx, camera) {
    ctx.beginPath();
    const boxHeight = 4;
    const marginY = 1;
    const maxBoxWidth = this.boxW * 1.7;
    ctx.fillStyle = "#FF5252";
    ctx.fillRect(
      this.pos.x - camera.pos.x - maxBoxWidth / 2,
      this.pos.y - camera.pos.y + marginY + this.height / 2,
      Math.max(maxBoxWidth * (this.health / this.maxHealth), 0),
      boxHeight
    );
    ctx.strokeStyle = "#121212";
    ctx.rect(
      this.pos.x - camera.pos.x - maxBoxWidth / 2,
      this.pos.y - camera.pos.y + marginY + this.height / 2,
      maxBoxWidth,
      boxHeight
    );
    ctx.stroke();
    ctx.closePath();
  }
  renderEnergyBar(ctx, camera) {
    ctx.beginPath();
    const boxHeight = 4;
    const marginY = 1;
    const maxBoxWidth = this.boxW * 1.7;
    ctx.fillStyle = "#5252FF";
    ctx.fillRect(
      this.pos.x - camera.pos.x - maxBoxWidth / 2,
      this.pos.y - camera.pos.y + 2 * marginY + this.height / 2 + boxHeight,
      Math.max(maxBoxWidth * (this.energy / this.maxEnergy), 0),
      boxHeight
    );
    ctx.strokeStyle = "#121212";
    ctx.rect(
      this.pos.x - camera.pos.x - maxBoxWidth / 2,
      this.pos.y - camera.pos.y + 2 * marginY + this.height / 2 + boxHeight,
      maxBoxWidth,
      boxHeight
    );
    ctx.stroke();
    ctx.closePath();
  }
  // ...後面省略
}
```

就加一點能量條而已，沒什麼好說的。

而加了玩家的能量條，當然也要加 Boss 的血量條吧！

由於我希望 Boss 的血量條盡可能像是一個 Boss，但我沒找到合適的素材，所以這部分依然會是用長方形畫的。

## 製作 UI 系統

其實說是 UI 系統並不準確，因為基本上，我們的 UI 只有 `Bossbar`，也沒有交互性，不過這部分可以靠未來滿足，所以目前我們就先叫他 UI 系統吧！

先設計一個 UI 類別和一個 `UIManager`，一樣，這是 UI 類別會是一個抽象類，這代表不會有實體直接是這個類別的實例，需要有其他類別繼承這個類別，再來實做更多細節。

建立一個檔案，在 `model/` 底下，就叫他 `UI.js`，並輸入以下內容：

```js
class UI {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
export class UIManager {
  constructor() {
    this.UIList = [];
  }
  addUI(ui) {
    this.UIList.push(ui);
  }
  render(ctx, canvas) {
    this.UIList.forEach((uiElement) => {
      uiElement.render(ctx, canvas);
    });
  }
}
```

這樣，一個超迷你的 UI 系統就做好了！

接下來，就是寫一個 Bossbar 來呈現特定 Sprite 的血量。

```js
export class BossBar extends UI {
  constructor(target) {
    super(0, 0);
    this.target = target;
    this.title = "Evil Wizard";
    this.visable = false;
    this.font = "bold 24px pixel font";
    this.color = "white";
    this.padding = 4;
    this.barLength = 300;
    this.barHeight = 4;
  }
  show() {
    this.visable = true;
  }
  hide() {
    this.visable = false;
  }
  render(ctx, canvas) {
    // render boss name
    if (!this.visable) {
      return;
    }
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.textAlign = "center";
    ctx.fillText(this.title, canvas.width / 2, 32);

    // render health bar
    ctx.fillStyle = "#FF5252";
    ctx.fillRect(
      (canvas.width - this.barLength) / 2,
      40 + this.padding,
      Math.max(
        this.barLength * (this.target.health / this.target.maxHealth),
        0
      ),
      this.barHeight
    );
    ctx.strokeStyle = "#121212";
    ctx.rect(
      (canvas.width - this.barLength) / 2,
      40 + this.padding,
      this.barLength,
      this.barHeight
    );
    ctx.stroke();
  }
}
```

然後在 index.html 裡面載入這個 pixel 字體。

```css
@font-face {
  font-family: pixel font;
  /*設定一個 font，叫做 pixel，並設定字型檔案位址*/
  src: url("assets/DotGothic16-Regular.ttf");
}
```

沒錯，Bang，直接給你一個寫的最完整的 `Bossbar`。

> Bang 的意思是，整坨 code 很突然的就突然冒了出來，結合了晴天霹靂、目瞪口呆的感覺，還有迸發開來的狀聲詞。

包含了標題，字體樣式，寬度等全部都設定好了。

接下來就是在 `index.js` 加上載入 `UIManager` 的部分：

```js
import {BossBar, UIManager} from './model/UI.js';
// ...中間省略
const uiManager = new UIManager();
const bossBar = new BossBar(enemy);
uiManager.addUI(bossBar);
bossBar.show();
// ...中間省略
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render(ctx, canvas, camera)
  entityManager.render(ctx, camera);
  uiManager.render(ctx, canvas)
  cursor.render(ctx)
};
// ...後面省略
```

這時候查看網頁，就能看見美麗的 BossBar 了。

![bossbar](/pictures/beautiful_bossbar.png)

[目前原始碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/player_boss_bar)

## 開場小動畫

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
      x, y, height, boxW, boxH, boxOffsetX, boxOffsetY, maxHealth, maxEnergy,
      animaMap) {
    super(x, y);

    this.stat = 'idle';
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
          ctx, camera, this.pos.x, this.pos.y, this.height);
    }
    this.renderHitBox(ctx, camera);
  }
  // ...後面省略
}
```

然後在 `index.js`，移除原本的 `bossBar.show()`，並添加以下內容：

```js
import {sleep} from './utils.js';
// ...中間省略
const enemy = new EvilWizard(32000, 31800, 512, 24, 96, 0, 32, 100, 100, {
  idle: new Anima('assets/evil_wizard/Idle.png', 8, general_speed),
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
main().then()
```

現在可以回到網頁上看看了，應該可以看到史詩級的動畫場景、完美的運鏡。

這時候，不添加一些說明文字，天地良心都看不下去。

回到 `UI.js`，添加 `Text` 和 `TextManager`：

```js
import {Vector} from '../utils.js';

export class Text {
  constructor(text, x, y, textAlign, color = '#eeeeee') {
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
    const textArray = this.text.split('');
    const showArray =
        textArray.slice(0, Math.round(textArray.length * this.progress));
    for (let i = 0; i < Math.min(10, textArray.length - showArray.length);
         i++) {
      showArray.push(String.fromCharCode(Math.floor(Math.random() * 93 + 33)));
    }
    ctx.fillText(showArray.join(''), this.pos.x, this.pos.y + this.height);

    this.progress += this.speed;
    this.progress = Math.min(this.progress, 1);
  }
};
export class TextManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.padding = 16;
    this.textList = [];
    this.newTextY = (this.canvas.height - 48*4)/2;
  }
  addText(text, color) {
    const textObject =
        new Text(text, this.canvas.width / 2, this.newTextY, 'center', color);
    this.textList.push(textObject);
    this.newTextY += textObject.height;
    this.newTextY += this.padding;
    return textObject;
  }
  render(ctx) {
    this.textList.forEach(text => {
      text.render(ctx);
    });
  }
};
```

這裡不多做解釋，總之就是我在寫的時候，一時鬼迷心竅，加了一點酷炫的亂碼特效。總之有一個 `progress` 參數，負責判斷目前的文字顯示進度如何，之後就是顯示他，並且把剩餘的部分文字，用亂碼替代，最後再根據設定的速度，增加 `progress`。

重新修改 `index.js`，添加史詩級字幕：

```js
import {BossBar, TextManager, UIManager} from './model/UI.js';

const textManager = new TextManager(canvas);

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render(ctx, canvas, camera)
  entityManager.render(ctx, camera);
  uiManager.render(ctx, canvas)
  textManager.render(ctx);
  cursor.render(ctx)
};

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
  await sleep(500);
  camera.target = player;
}
```

總之，加上完美的各種文字，配合究極美麗的亂碼特效，輔以完美的運鏡，一個完美的入場動畫就做好了。

如果我有更多時間，你們就會看到紫色大法師用更華麗一點的方式入場，但很可惜我沒有。

![epic intro](/pictures/epic_intro2.png)
![epic intro](/pictures/epic_intro.png)

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/opening_animation)

## 增強子彈

美麗的動畫時間結束了，是時候回來處理之前遺留下來的一些問題

### 處理子彈效能問題

### 讓子彈碰到敵人時流血

之所以現在才處理，是因為當我發現我漏寫的時候，目前進行的主題都不能中途插入子彈處理問題了，會打亂一點節奏，我又不想重寫前面全部的範例 code，所以只好現在回來處理。

## 敵人 AI

- 敵人 AI
- 敵人動作碰撞箱

- 自由發揮

- Entity
  - Sprite
    - Playaer
    - EvilWizard
  - Bullet
    - SmallFireBall
- EntityManager
- TextManager

- Particle
