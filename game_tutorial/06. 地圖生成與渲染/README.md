
# 地圖生成與渲染

這時候，我們能夠繪製漂亮的角色了，甚至還有充滿動感的相機追蹤，但地圖卻是一片空白，非常可惜，所以現在就來解決這個問題。

不過首先，我們得先下載我們的素材庫，到這裡下載這次遊戲會用的全部素材：[assets.zip](https://github.com/coding-impact/coding-impact.github.io/blob/main/resources/assets.zip)

解壓縮後，放到 `js` 資料夾的旁邊，然後在 `js` 資料夾底下再建立一個檔案，叫做 `map.js`，如下圖：

```plain
index.html
assets/
  map/
    grass.png
  ...很多素材
js/
  map.js
  ...
```

這時，我們先仔細觀察，`assets/map/grass.png`，看看這個我挑選的素材怎麼樣。

![assets/map/grass.png](/pictures/grass.png)

乍看之下，好像會覺得，這是一個 16 \* 16 的素材圖片，但是經過仔細研究之後，就會發現，其實他是 8 \* 8。

左上方 16 格是普通草地，右上方 16 是花，剩下的 32 格裡面，有 30 格是道路（包含不同破損情況、轉角、邊緣等）。

所以如果我們今天要渲染背景的話，其實是可以做一個正常道路的，但很明顯，我沒做，因為會花太多時間，真的是太遺憾了，我連生成的演算法都找好了。

但總之，我們的地圖顯示方式會是這樣的，總共會有 1000 \* 1000 個方塊在地圖上，每一個方塊都只會紀錄一個材質 `ID`，代表他們的材質。當我們要渲染地圖時，再透過目前的位置，計算出要顯示的範圍，再從範圍內，找出要顯示的材質 `ID`，並顯示到正確的位置上。

而如何從材質 `ID`，也就是下面的 `blockId` 找到對應材質也很簡單，就是從左上角開始是 0，這樣一排一排遞增，也就是說最高到 61。

講解完我們要如何渲染地圖，現在是時候開始寫囉！我們會有兩個物件來處理地圖生成的部分，一個是 `Tileset`，另外一個是 `Map`，前者處理的是地圖材質，後者處理的是地圖生成和渲染。

但我們先不寫 `Tileset` 和 `Map`，我們先修改原本 `index.js` 中的渲染函式，以方便我們了解，我們將會怎麼樣使用這些物件，這樣我們後續才會有一個更明顯的想像，知道這些物件要怎麼寫。

我們先假裝我們已經在 `js/model/map.js` 中，寫好 `Map` 物件了。

```js
import { Map, Tileset } from "./model/map.js";
const tileset = new Tileset("assets/map/grass.png");
const map = new Map(tileset);
map.init(); // 生成一開始的隨機地圖
// ...中間省略
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render();
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].render(ctx, camera);
  }
}
```

現在我們已經知道，我們將會怎麼使用 `Map` 和 `Tileset`，所以我們就開始來寫吧！

先建立一個檔案 `js/model/map.js`，並填入以下內容：

```js
export class Tileset {
  constructor(src) {}
  getRandomBlockId() {} // 根據設定，產生隨機 blockId
  render(x, y, blockId) {} // 在指定位置，繪製指定材質
}

export class Map {
  constructor(tileset) {}
  getBlockId(x, y) {} // 取得特定位置的 blockId
  init() {} // 生成隨機地圖
  render() {} // 繪製可見範圍的地圖
}
```

基本上思路是這樣的：

- 先從地圖生成開始：

  1. 我們首先確定，一定要有 `Map.init()`，他的作用會是隨機生成整張地圖
  2. 那麼由於，我們已經確定我們整個地圖會是直接亂數生成，不過根據我的經驗，直接亂數生成會很醜，所以我們會是有權重的亂數生成，差不多比例是：草地 10，花 7，磚塊 3，而這個權重會是 Tileset 的一部分，所以生成隨機 blockId 的函式：`Tileset.getRandomBlockId()` 就交給 Tileset。

- 再來要考慮渲染：

  1. 確定一定會有 `Map.render()` 來渲染可見範圍的地圖。
  2. 這時候就需要 `Tileset.render()` 來在指定位置渲染指定的 `blockId`。

## 地圖渲染

那我們先從 `render` 開始吧，畢竟地圖生成一開始可以先隨便生。

先寫一下隨便生地圖的部分：

```js
export class Tileset {
  constructor(src) {}
  getRandomBlockId() {
    return 1;
  }
  render(x, y, blockId) {}
}

export class Map {
  constructor(size, tileset) {
    this.size = size; // 這裡會放地圖的大小，也就是一個邊會有幾個方塊
    this.tileset = tileset;
    this.map = Array();
  }
  getBlockId(x, y) {}
  init() {
    for (let i = 0; i < this.size * this.size; i++) {
      this.map.push(this.tileset.getRandomBlockId());
    }
  }
  render() {}
}
```

這邊用的是統一生 `blockId` `1` 的方塊，不用 `0` 是因為 `0` 是純色。

接下來，就是要透過目前的相機位置算出要顯示哪些方塊，不過在這之前，我們可以先複習一下，如何在 canvas 裡面繪製圖片：

[mdn web docs](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage)

```js
drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```

![canvas draw image explain](/pictures/canvas_drawimage.jpg)

可以看到，我們需要先透過 `blockId` 找到 `sx` 和 `sy`，再根據相機位置，和方塊在地圖中的位置，找出 `dx` 和 `dy`。

```js
export class Map {
  constructor(size, tileset) {
    this.size = size;
    this.tileset = tileset;
    this.blockSize = 64; // 這裡放的是一個 block 要顯示的大小
    this.map = Array();
  }
  getBlockId(x, y) {
    return this.map[x + y * this.size];
  }
  // 省略
  render(ctx, canvas, camera) {
    const cols = Math.round(canvas.width / this.blockSize) + 3;
    const rows = Math.round(canvas.height / this.blockSize) + 4;
    const xOffset = Math.max(Math.floor(camera.pos.x / this.blockSize) - 1, 0);
    const yOffset = Math.max(Math.floor(camera.pos.y / this.blockSize) - 1, 0);
    for (let i = xOffset; i < cols + xOffset; i++) {
      for (let j = yOffset; j < rows + yOffset; j++) {
        const blockId = this.getBlockId(i, j);
        this.tileset.render(
          ctx,
          i * this.blockSize - camera.pos.x,
          j * this.blockSize - camera.pos.y,
          this.blockSize,
          blockId
        );
      }
    }
  }
}
```

這部分的邏輯非常簡單粗暴，就是先根據我們一個方塊要多大，和畫布的尺寸，算出長寬方面各需要顯示幾個方塊，再算出要從哪裡開始顯示。最後就是透過方塊的原始位置，算出要顯示的位置，並且呼叫 `tileset.render` 去渲染他們。

接下來，就是處理，讓 `tileset` 在特定位置繪製特定材質：

```js
export class Tileset {
  constructor(src, length, rawBlockSize) {
    this.rawBlockSize = rawBlockSize;
    this.length = length;

    this.image = new Image();
    this.image.src = src;
  }
  getRandomBlockId() {
    return 1;
  }
  render(ctx, x, y, blockSize, blockId) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      this.image,
      (blockId % this.length) * this.rawBlockSize,
      Math.floor(blockId / this.length) * this.rawBlockSize,
      this.rawBlockSize,
      this.rawBlockSize,
      x,
      y,
      blockSize,
      blockSize
    );
  }
}
```

至此，地圖渲染就快完成了，我們再來修改一下我們建立這些物件時輸入的參數。

```js
const tileset = new Tileset("assets/map/grass.png", 8, 32);
const map = new Map(1000, tileset);
map.init();
```

渲染的部分記得也要改

```js
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render(ctx, canvas, camera);
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].render(ctx, camera);
  }
}
```

![whiteline on background](/pictures/whiteline.png)

但這時我們可以發現一個問題，背景是白色的，而且會有白白的線，那這個問題其實可以透過偏移一個像素來解決，但我不喜歡這樣，因為原本的像素就是剛剛好。所以下面會透過改背景顏色來解決這個問題。

```html
<canvas
  id="gameCanvas"
  style="background-color: #72751b;width: 100%;aspect-ratio: 16 / 9;"
></canvas>
```

![normal map](/pictures/normal_map.png)

這樣就解決了一個問題，而會看到背景的第二個問題，可以這樣解決：

```js
let player = new Player(32000, 32000);
```

這樣玩家的初始位置就會在整個地圖的正中間，而這個地圖大小也是非常足夠的，你們可以試著走走看。正常遊玩是絕對走不出去的。

### 地圖生成

解決了地圖渲染的部分，接下來就可以對生成部分大做文章。

如同上面講的，我們要讓地圖有權重的亂數生成，差不多比例是：草地 10，花 7，磚塊 3。所以 rule 就會是
而這個權重會是 `Tileset` 的一部分，所以

```js
const rule = {
  plain: 0.5,
  flower: 0.35,
  brick: 0.15,
};
```

不過，我們還會需要把方塊材質根據類別進行分類，所以還得進行以下部分

```js
var plainList = [];
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    plainList.push(i + j * 8);
  }
}

var flowerList = [];
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    flowerList.push(i + 4 + j * 8);
  }
}

var brickList = [];
for (let i = 32; i < 62; i++) {
  brickList.push(i);
}

const blockMap = {
  plain: plainList,
  flower: flowerList,
  brick: brickList,
};
```

再修改一下建立物件的部分：

```js
const tileset = new Tileset("assets/map/grass.png", 8, 32, blockMap, rule);
```

再根據這個修改一下隨機生成的部分：

```js
export class Tileset {
  constructor(src, length, rawBlockSize, blockMap, rule) {
    this.rawBlockSize = rawBlockSize;
    this.rule = rule;
    this.length = length;
    this.blockMap = blockMap;

    this.image = new Image();
    this.image.src = src;
  }

  getRandomBlockId() {
    const blockType = randomWeightChoose(this.rule);
    const length = this.blockMap[blockType].length;
    return this.blockMap[blockType][Math.floor(length * Math.random())];
  }
  // ...後面省略
}
```

這時候，你會發現，我們沒有 `randomWeightChoose` 這個 `function`，所以我們就寫一個在 `utils.js` 裡面吧！

```js
export function randomWeightChoose(weightMap) {
  const totalWeight = Object.values(weightMap).reduce(
    (sum, weight) => sum + weight,
    0
  );
  const randomValue = Math.random() * totalWeight;

  let currentWeight = 0;
  for (const [key, weight] of Object.entries(weightMap)) {
    currentWeight += weight;
    if (randomValue <= currentWeight) {
      return key;
    }
  }

  // This should not happen, but just in case
  return null;
}
```

最後記得在 `map.js` 裡面引入這個函式：

```js
import { randomWeightChoose } from "../utils.js";
```

至此，我們就有無比美麗的背景啦！

![beautiful map](/pictures/beautiful_map.png)
