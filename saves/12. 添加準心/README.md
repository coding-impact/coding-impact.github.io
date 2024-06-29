
## 子彈發射、位移

我們現在有幾乎完美的畫面了，該繼續發展遊戲性。

所以我們先來讓我們的角色可以射子彈吧！

### 準心

大家應該還記得，我們一開始有一些事件，是關於滑鼠移入，和移出畫布的對吧？

沒錯，一切都是為了準心而準備的。

我們知道準心，他必須在游標進入畫布時顯示，離開時隱藏，並隨時移動到游標真正的位置。

我們直接在 `model/` 底下建立一個檔案吧，就叫做 `cursor.js`，並填入以下內容

```js
import { Vector } from "../utils.js";

export class Cursor {
  constructor() {
    this.pos = new Vector(0, 0);
    this.cursorShow = false;
  }
  moveTo(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }
  show() {
    this.cursorShow = true;
  }
  hide() {
    this.cursorShow = false;
  }
  render(ctx) {
    if (this.cursorShow === true) {
      ctx.beginPath();
      ctx.fillStyle = "#121212";
      ctx.arc(this.pos.x, this.pos.y, 2, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.closePath();
    }
  }
}
```

接著，按照慣例，修改 `index.js` 中的描述。

我們先從宣告開始：

```js
import { Cursor } from "./model/cursor.js";
const cursor = new Cursor();
```

再來就是渲染：

```js
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render(ctx, canvas, camera);
  entityManager.render(ctx, camera);
  cursor.render(ctx);
}
```

最後就是在游標進出畫布時進行顯示與隱藏，並且隨著滑鼠移動改變位置：

```js
canvas.addEventListener("mouseleave", () => {
  cursor.hide();
});

canvas.addEventListener("mouseenter", () => {
  cursor.show();
});

cursor.show();
canvas.addEventListener("mousemove", function (event) {
  cursor.moveTo(
    event.clientX - canvas.offsetLeft,
    event.clientY - canvas.offsetTop
  );
});
```

之所以要添加一個顯示游標，是為了防止一開始游標就在畫布內，導致游標無法顯示。

最後記得要添加隱藏游標的 CSS，請添加在 `index.html` 裡面。

```css
canvas {
  cursor: none;
  image-rendering: pixelated;
  image-rendering: optimizeSpeed;
}
```

這邊還額外加了一些增進效能的設定，可能可以有一些幫助。

這樣應該就會顯示一個可愛的小黑點在你的游標位置了，這將會是我們的準心。

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/cursor)
