# 添加 EntityManager

有了乾淨的結構後，我們終於可以回到我們的重點，也就是寫一個 `EntityManager`。

我們首先知道我們有以下幾種狀況會用 `EntityManager`：

1. 要更新全部實體的時候
2. 要渲染全部實體的時候

要做到以上兩點，就必須要提供一個加入實體到 `EntityManager` 的函式，而做到了這些後，我們甚至能做更多，像是未來可以移除超出視線範圍的子彈，或是移除已經播放完畢的粒子效果。

所以我們先假設我們已經寫好了這個 `EntityManager`，然後改寫 `index.js`

```js
const entityManager = new EntityManager();
entityManager.add(player);
entityManager.add(enemy);

// ...中間省略

function update() {
  player.control(pressedMap);
  camera.update();
  entityManager.update();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render(ctx, canvas, camera);
  entityManager.render(ctx, camera);
}
```

知道了我們將會如何使用它，接下來就是實作他的細節。

在 `entity.js` 裡面建立一個類別，叫做 `EntityManager`：

```js
export class EntityManager {}
```

先來製作，把實體添加到列表裡面的功能

```js
export class EntityManager {
  constructor() {
    this.entityList = [];
  }
  add(entity) {
    this.entityList.push(entity);
  }
}
```

接下來就是更新全部的實體

```js
export class EntityManager {
  // ...前面省略
  update() {
    this.entityList.forEach((entity) => {
      if (typeof entity.update === "function") {
        entity.update();
      }
    });
  }
}
```

接下來就是渲染他們

```js
export class EntityManager {
  // ...前面省略
  render(ctx, camera) {
    this.entityList.forEach((entity) => {
      entity.render(ctx, camera);
    });
  }
}
```

記得要在 index.js 裡面引入他

```js
import { EntityManager } from "./model/entity.js";
```

這時候，來看一下，我們的角色有沒有正常顯示，應該要一切正常喔！

接下來，我們終於可以來解決之前提到的，前面的物件被後面蓋到的問題，那要解決這個問題也很簡單，我們先渲染後面的物件，再渲染前面的物件就好了。

最簡單粗暴的方法，就是每次渲染前都排序一遍。當然，我知道這樣理論上效能消耗巨大，但實際上並不是這樣的。每次需要重新排序時，整個列表距離完美排序只會有很少的差別。就結論而言，可以在很少的操作次數下排序完成，並且根據我的實測，其實感覺不出來，所以我們就直接 `sort` 吧！

修改 `EntityManager.render`：

```js
export class EntityManager {
  // ...前面省略
  render(ctx, camera) {
    this.entityList.sort((a, b) => a.pos.y - b.pos.y);
    this.entityList.forEach((entity) => {
      entity.render(ctx, camera);
    });
  }
}
```

那麼這時，你們會發現這幾乎沒有任何屁用，這是因為我們的圖片座標基準沒有置中，所以是時候要顯示精確的碰撞框了！

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/entity_manager)
