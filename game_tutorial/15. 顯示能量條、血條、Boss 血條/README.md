
# 顯示血量與魔力條與 BossBar

[此階段完成品 DEMO](https://coding-impact.github.io/game_tutorial/15.%20顯示能量條、血條、Boss%20血條/)

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

# 製作 Boss 血條

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
