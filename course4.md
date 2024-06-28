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
import { BossBar, UIManager } from "./model/UI.js";
// ...中間省略
const uiManager = new UIManager();
const bossBar = new BossBar(enemy);
uiManager.addUI(bossBar);
bossBar.show();
// ...中間省略
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render(ctx, canvas, camera);
  entityManager.render(ctx, camera);
  uiManager.render(ctx, canvas);
  cursor.render(ctx);
}
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

## 增強子彈

美麗的動畫時間結束了，是時候回來處理之前遺留下來的一些問題。

### 處理子彈效能問題

馬上趕到戰場的是，子彈不會自然消失的問題。

之所以現在才處理，是因為當我發現我漏寫的時候，目前進行的主題都不能中途插入子彈處理問題了，會打亂一點節奏，我又不想重寫前面全部的範例 code，所以只好現在回來處理。

總之，回去修改 `EntityManager`：

```js
export class EntityManager {
  // ...中間省略
  render(ctx, canvas, camera) {
    this.entityList.sort(
      (a, b) =>
        a.pos.y +
        a.boxH / 2 +
        a.boxOffsetY -
        (b.pos.y + b.boxH / 2 + b.boxOffsetY)
    );
    this.entityList = this.entityList.filter(
      (entity) =>
        !(
          entity.type === "Bullet" &&
          Math.abs(entity.pos.x - camera.pos.x) > canvas.width * 3 &&
          Math.abs(entity.pos.x - camera.pos.x) > canvas.height * 3
        )
    );
    this.entityList.forEach((entity) => {
      entity.render(ctx, camera);
    });
  }
}
```

並且修改 Bullet 類別：

```js
export class Bullet extends Entity {
  constructor(x, y, power, accerate) {
    super(x, y);
    this.type = "Bullet";
    this.power = power;
    this.accerate = accerate;
    this.speed = this.accerate.normal().multiply(this.power);
  }
  update() {
    this.speed = this.speed.add(this.accerate);
    super.update();
  }
}
```

並記得修改在 `index.js` 的 `entityManager.render`：

```js
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render(ctx, canvas, camera);
  entityManager.render(ctx, canvas, camera);
  uiManager.render(ctx, canvas);
  textManager.render(ctx);
  cursor.render(ctx);
}
```

回到網頁測試時，可以在 render 裡面添加一個，顯示實體數量的協助測試有沒有成功：

```js
export class EntityManager {
  // ...中間省略
  render(ctx, canvas, camera) {
    console.log(this.entityList.length);
    // ...後面省略
  }
}
```

如圖

![bullet disappear log](/pictures/bullet_disappear_log.png)

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/bullet_disappear)

### 讓子彈碰到敵人時扣血

解決完子彈的問題，接下來就是繼續增加子彈的功能，為了達成流血特效，並且對擊中的實體造成傷害，判斷是否有碰撞是非常重要的功能，所以我們就來做他吧！

如果用直觀的方法去寫的話，會把檢測碰撞的任務交給子彈，因為子彈有可能可以擊中各式各樣的物體。

但在我們這個範例裡面，我們只有 `EvilWizard` 會受到子彈的傷害，所以就用最高效率的做法吧，我們讓 `EvilWizard` 自己檢查有沒有子彈撞到自己：

```js
export class EvilWizard extends Sprite {
  checkCollision(entityManager) {
    if (!this.visiable) {
      return;
    }
    entityManager.entityList.forEach((entity) => {
      // is Bullet
      if (entity.type === "Bullet") {
        // have collision
        if (
          this.pos.x - this.boxW / 2 + this.boxOffsetX < entity.pos.x &&
          entity.pos.x < this.pos.x + this.boxW / 2 + this.boxOffsetX &&
          this.pos.y - this.boxH / 2 + this.boxOffsetY < entity.pos.y &&
          entity.pos.y < this.pos.y + this.boxH / 2 + this.boxOffsetY
        ) {
          entity.power /= 2;
          this.damage(entity.power);
        }
      }
    });
  }
}
```

並且在 `Sprite` 添加傷害函式：

```js
export class Sprite extends Entity {
  // ...前面省略
  damage(amount) {
    this.health -= amount;
  }
}
```

1. 當自己隱形時，無法被擊中
2. 對於每個實體
   1. 檢查他是不是子彈
   2. 檢查有沒有碰到
   3. 讓自己受傷

最後記得在 `EntityManager.update` 添加檢查碰撞：

```js
export class EntityManager {
  // ...前面省略
  update() {
    this.entityList.forEach((entity) => {
      if (typeof entity.update === "function") {
        entity.update();
      }
    });
    this.entityList.forEach((entity) => {
      if (typeof entity.checkCollision === "function") {
        entity.checkCollision(this);
      }
    });
  }
  // ...後面省略
}
```

這時候可以回到網頁看看

![boss damaged](/pictures/boss_damaged.png)

敵人受傷了！

### 讓敵人受傷時流血

但只有血條的跳動，顯然回饋感不夠強，所以這時候，就必須加入流血的特效。

回到 `entity.js`，我們來設計一個粒子的類別吧！

```js
export class Particle {
  constructor(x, y, anima, repeat = false) {
    this.pos = new Vector(x, y);
    this.anima = anima;
    this.height = undefined;
    this.repeat = repeat;
    this.end = false;
  }
  render(ctx, camera) {
    this.anima.render(ctx, camera, this.pos.x, this.pos.y, this.height);
    if (!this.repeat && this.anima.step === 0) {
      this.end = true;
    }
  }
}
```

看起來真是棒呆啦！與之前製作的許多類別一樣，這個一樣會被當成抽象類來使用

現在讓我們回到 `enemy.js`，添加流血特效：

```js
import { Anima } from "./anima.js";
import { Particle, Sprite } from "./entity.js";

class BloodParticle extends Particle {
  constructor(x, y) {
    super(x, y);
    this.anima = new Anima("assets/particle/blood.png", 22, 1);
    this.height = 100;
  }
}
```

```js
export class EvilWizard extends Sprite {
  // ...前面省略
  checkCollision(entityManager) {
    if (!this.visiable) {
      return;
    }
    entityManager.entityList.forEach((entity) => {
      // is Bullet
      if (entity.type === "Bullet") {
        // have collision
        if (
          this.pos.x - this.boxW / 2 + this.boxOffsetX < entity.pos.x &&
          entity.pos.x < this.pos.x + this.boxW / 2 + this.boxOffsetX &&
          this.pos.y - this.boxH / 2 + this.boxOffsetY < entity.pos.y &&
          entity.pos.y < this.pos.y + this.boxH / 2 + this.boxOffsetY
        ) {
          entity.power /= 2;
          entityManager.add(new BloodParticle(entity.pos.x, entity.pos.y));
          this.damage(entity.power);
        }
      }
    });
  }
  // ...後面省略
}
```

並且最後，記得在 `EntityManager` 移除播放完畢的粒子效果。

```js
export class EntityManager {
  // ...前面省略
  render(ctx, canvas, camera) {
    this.entityList.sort(
      (a, b) =>
        a.pos.y +
        a.boxH / 2 +
        a.boxOffsetY -
        (b.pos.y + b.boxH / 2 + b.boxOffsetY)
    );
    this.entityList = this.entityList.filter(
      (entity) =>
        !(
          entity.type === "Bullet" &&
          Math.abs(entity.pos.x - camera.pos.x) > canvas.width * 3 &&
          Math.abs(entity.pos.x - camera.pos.x) > canvas.height * 3
        )
    );

    this.entityList = this.entityList.filter((entity) => {
      if (entity.hasOwnProperty("end")) {
        if (entity.end) {
          // 用於已結束的 particle
          return false;
        }
      }
      return true;
    });

    this.entityList.forEach((entity) => {
      entity.render(ctx, camera);
    });
  }
}
```

一切都做完後，可以回到網頁上測試看看，應該能看見有流血特效

![enemy bleed](/pictures/enemy_bleed.png)

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/bullet_collision)

## 敵人 AI

現在，玩家部分已經非常完美了，是時候來寫敵人的行為模式：

先思考一下我們有哪些素材，我們有兩種攻擊：

![attack 1](/pictures/Attack1.png)
![attack 2](/pictures/Attack2.png)

一種跑，和一種跳:

![run](/pictures/Run.png)
![jump](/pictures/Jump.png)

根據我們有的這些素材，我設計了以下的攻擊模式：

1. 首先，他會先「跑」向玩家
2. 跑到目標後
   1. 如果玩家在一定範圍內，就使用 Attack1
   2. 如果不在的話，就「跳」向玩家，使用 Attack2

對行為模式，有一點基礎的想像後，接下來就是慢慢實現它。

### 敵人動畫

我們先把整體框架做出一個雛形：

```js
export class EvilWizard extends Sprite {
  constructor(target, ...args) {
    super(...args);
    this.target = target;
  }
  checkCollision(entityManager) { ... } // ...省略
  play_animation_once(stat){}
  update(){

  }
}
```

我們的攻擊動畫，一樣會採用 `stat` 的方式播放，而當中的 `player_animation_once` 就可以放讓動畫只執行一遍的邏輯：

```js
export class EvilWizard extends Sprite {
  constructor(target, ...args) {
    super(...args);
    this.target = target;
    this.remaining_animation_frame = 0; // 目前正在進行的，不可中斷的動畫，的剩餘幀數（這裡的幀數指的是 EntityManager.render 的幀數）
    this.oldHealth = this.health;
  }
  // ...中間省略
  play_animation_once(stat) {
    this.stat = stat;
    this.animaMap[this.stat].step = 0;
    this.remaining_animation_frame =
      (this.animaMap[this.stat].length - 0.5) / this.animaMap[this.stat].speed;
  }
  update() {
    if (this.remaining_animation_frame > 0) {
      this.remaining_animation_frame--;
      // 動畫執行中，在這邊放攻擊傷害判定
    } else if (this.remaining_animation_frame <= 0) {
      // 動作執行完畢，可以判斷接下來要執行什麼動作

      if (this.health < this.oldHealth) {
        this.play_animation_once("attack1");
      } else {
        this.stat = "idle";
      }
    }
    // this.speed = this.target.pos.add(this.pos.multiply(-1)).normal();
    this.oldHealth = this.health;
  }
}
```

我們先寫一個，受傷之後，嘗試攻擊的測試模式，除此之外還額外把 `target` 加入了參數。

記得把目標加入參數，和新的動畫也加入 `animaMap`：

```js
const enemy = new EvilWizard(
  player,
  32000,
  31800,
  512,
  24,
  96,
  0,
  32,
  100,
  100,
  {
    idle: new Anima("assets/evil_wizard/Idle.png", 8, general_speed),
    attack1: new Anima("assets/evil_wizard/Attack1.png", 8, general_speed),
  }
);
```

這時候測試一下，應該可以看見敵人對你的攻擊作出反擊：

![enemy counter attack](/pictures/enemy_counter_attack.png)

那麼接下來，就是要讓敵人跑到指定位置，並且我們增加一個新機制，怒氣值，只有當怒氣值累積到一定程度時，才會進行攻擊，並順便添加受傷動畫：

```js
import { Vector } from "../utils.js";

export class EvilWizard extends Sprite {
  constructor(target, ...args) {
    super(...args);
    this.target = target;
    this.remaining_animation_frame = 0; // 目前正在進行的，不可中斷的動畫，的剩餘幀數（這裡的幀數指的是
    // EntityManager.render 的幀數）
    this.anger = 0;

    this.oldHealth = this.health;

    this.dest = undefined;
  }
  runTo(x, y) {
    this.dest = new Vector(x, y);
    this.moveSpeed = 10;
    this.stat = "run";
  }
  // ...中間省略
  update() {
    if (this.remaining_animation_frame > 0) {
      this.remaining_animation_frame--;
      // 動畫執行中，在這邊放攻擊傷害判定
    } else if (this.remaining_animation_frame <= 0) {
      // 動作執行完畢，可以判斷接下來要執行什麼動作

      if (this.health < this.oldHealth) {
        this.play_animation_once("damaged");
        this.anger += Math.random();
      } else if (this.anger >= 1.5) {
        this.anger -= 1.5;
        this.runTo(this.target.pos.x, this.target.pos.y);
      } else if (this.stat == "run") {
        this.pos = this.pos.add(
          this.dest.add(this.pos.multiply(-1)).normal().multiply(this.moveSpeed)
        );
        if (this.dest.add(this.pos.multiply(-1)).length() < 20) {
          this.stat = "idle";
        }
      } else {
        this.stat = "idle";
        this.anger += 0.01 * Math.random();
      }
    }
    // this.speed = this.target.pos.add(this.pos.multiply(-1)).normal();
    this.oldHealth = this.health;
  }
}
```

並記得把跑步和受傷加入 `animaMap`

```js
const enemy = new EvilWizard(
  player,
  32000,
  31800,
  512,
  24,
  96,
  0,
  32,
  100,
  100,
  {
    idle: new Anima("assets/evil_wizard/Idle.png", 8, general_speed),
    run: new Anima("assets/evil_wizard/Run.png", 8, general_speed),
    attack1: new Anima("assets/evil_wizard/Attack1.png", 8, general_speed),
    damaged: new Anima("assets/evil_wizard/Damaged.png", 3, general_speed),
  }
);
```

這時候敵人會跑了！但是...

![enemy run backward](/pictures/enemy_run_backward.png)

他卻是向後跑的！不過不用擔心，我們只需要替 `Sprite` 添加一個 `direction` 參數，並在 `Anima.render` 裡面，根據 `direction` 決定要不要水平翻轉就行了。

修改 `Sprite`

```js
export class Sprite extends Entity {
  constructor(
      x, y, height, boxW, boxH, boxOffsetX, boxOffsetY, maxHealth, maxEnergy,
      animaMap) {
    super(x, y);

    this.stat = 'idle';
    this.animaMap = animaMap;
    this.direction = 1;
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
  // ...中間省略
  render(ctx, camera) {
    if (this.visiable) {
      this.animaMap[this.stat].render(
          ctx, camera, this.pos.x, this.pos.y, this.height, this.direction);
    }
    this.renderHitBox(ctx, camera);
  }
  // ...後面省略
}
```

修改 `Anima`

```js
export class Anima {
  constructor(src, length, speed) {
    this.step = 0;
    this.image = new Image();
    this.image.src = src;
    this.speed = speed;
    this.length = length;
  }
  render(ctx, camera, rawX, rawY, height, direction, rotate = 0) {
    const sWidth = (this.image.width / this.length);
    const scale = height / this.image.height
    const sx = Math.floor(this.step) * sWidth;

    const displayWidth = sWidth * scale;
    const displayHeight = height;

    const x = rawX - camera.pos.x;
    const y = rawY - camera.pos.y;

    ctx.save();
    ctx.scale(direction, 1);
    ctx.translate(
        (x - displayWidth / 2) * direction + displayWidth * direction * 0.5,
        y - displayHeight / 2 + displayHeight * 0.5)
    ctx.rotate(rotate);
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
        this.image, sx, 0, sWidth, this.image.height,
        displayWidth * direction * (-0.5), displayHeight * (-0.5),
        displayWidth * direction, displayHeight);

    ctx.restore();
    this.step += this.speed;
    this.step %= this.length;
  }
};
```

修改 `Bullet` 和 `Particle`：

```js
export class SmallFireBall extends Bullet {
  constructor(...args) {
    super(...args);
    this.animation = smallFireBallAnima;
  }
  render(ctx, camera) {
    this.animation.render(
        ctx, camera, this.pos.x, this.pos.y, 32, 1,
        Math.atan2(this.speed.y, this.speed.x) - Math.PI / 2);
  }
}
```

```js
export class Particle {
  constructor(x, y, anima, repeat = false) {
    this.pos = new Vector(x, y);
    this.anima = anima;
    this.height = undefined;
    this.repeat = repeat;
    this.end = false;
  }
  render(ctx, camera) {
    this.anima.render(ctx, camera, this.pos.x, this.pos.y, this.height, 1);
    if (!this.repeat && this.anima.step === 0) {
      this.end = true;
    }
  }
}
```

這時候，再幫 `EvilWizard` 添加轉向的功能：

```js
export class EvilWizard extends Sprite {
  // ...前面省略
  reface(useDest = false) {
    let facePos = undefined;
    if (useDest) {
      facePos = this.dest;
    } else {
      facePos = this.target.pos;
    }
    if (facePos.x > this.pos.x) {
      this.direction = 1;
    } else {
      this.direction = -1;
    }
  }
  runTo(x, y) {
    this.dest = new Vector(x, y);
    this.reface(true);   // <-- 添加這裡
    this.moveSpeed = 10;
    this.stat = "run";
  }
  // ...中間省略
  update() {
    if (this.remaining_animation_frame > 0) {
      this.remaining_animation_frame--;
      // 動畫執行中，在這邊放攻擊傷害判定
    } else if (this.remaining_animation_frame <= 0) {
      // 動作執行完畢，可以判斷接下來要執行什麼動作

      if (this.health < this.oldHealth) {
        this.play_animation_once("damaged");
        this.anger += Math.random();
      } else if (this.anger >= 1.5) {
        this.anger -= 1.5;
        this.runTo(this.target.pos.x, this.target.pos.y);
      } else if (this.stat == "run") {
        this.pos = this.pos.add(
          this.dest.add(this.pos.multiply(-1)).normal().multiply(this.moveSpeed)
        );
        if (this.dest.add(this.pos.multiply(-1)).length() < 20) {
          this.stat = "idle";
        }
      } else {
        this.reface();   // <-- 添加這裡
        this.stat = "idle";
        this.anger += 0.01 * Math.random();
      }
    }
    // this.speed = this.target.pos.add(this.pos.multiply(-1)).normal();
    this.oldHealth = this.health;
  }
}
```

現在他能夠轉向了！

![enemy reface](/pictures/enemy_reface.png)

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/enemy_move_and_reface)

### 完整敵人邏輯

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

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/enemy_full_controll)

### 敵人動作碰撞箱

## 勝負判定

- 自由發揮

- Entity

  - Sprite
    - Playaer
    - EvilWizard

- Particle
