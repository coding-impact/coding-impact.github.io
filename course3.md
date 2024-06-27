# 7/4

> 重點：
> 製作遊戲核心函式

- 角色控制
- 地圖繪製
- 鏡頭跟隨
- 角色動畫
- 發射子彈

## 畫面渲染與角色控制

上次我們已經在邏輯層面上稍微寫了一點東西，因此現在可以來實作他們了。

## 畫布縮放

不過，這個畫布如果不會自動縮放的話，那可就太礙事了。

將 `index.html` 中的 `canvas` 加上自動縮放的 `inline css`。

```html
<canvas
  id="gameCanvas"
  style="background-color: #ffffff; width: 100%;aspect-ratio: 16 / 9;"
></canvas>
```

並在 `index.js`加入以下內容：

```js
const canvas = document.getElementById("gameCanvas");

// handle window resize
function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = (canvas.width / 16) * 9;
}
resize();
window.onresize = resize;
```

這時候你將會發現這個畫布成功的自動隨螢幕大小縮放了，並且在寬度已經足夠時，不會再繼續延伸。
這時候你可能會有一個疑問，為什麼我們已經用 `CSS` 設定讓畫布自動縮放了，卻還要在 `js` 裡面重新設定 `canvas.width` 和 `canvas.height` 呢？
這是因為這兩個其實是指畫布長寬方向的像素數量，如果不隨著實際尺寸修改這兩個數值的話，畫布上的內容就會產生形變，在之後可以自己試試看移除上面的韓式，看看會不會造成形變。

## 角色移動

### 角色顯示

解決完畫布不會自動縮放的小問題，那麼接下來就要來開始製作一個可以動的矩形了。
由於之後可能會有更多種 `Entity`，我們不直接修改 `Entity` 來達成這個行為，我們宣告一個 `Player` 類別，繼承 `Entity`，完整的檔案內容如下：

```js
import { Vector } from "./utils.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = (canvas.width / 16) * 9;
}
resize();
window.onresize = resize;

class Entity {
  constructor(x, y) {
    this.pos = new Vector(x, y);
  }
  update() {
    // 每次更新要執行的函式
  }
  render() {
    // 每次繪製要執行的函式
  }
}

class Player extends Entity {
  render(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "#5252FF";
    ctx.fillRect(this.pos.x, this.pos.y, 20, 40);
    ctx.closePath();
  }
}

let entityList = [];

let player = new Player(0, 0);
entityList.push(player);

function update() {
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].update();
  }
}
function render() {
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].render(ctx);
  }
}

function gameLoop() {
  update();
  render();
}

setInterval(gameLoop, 1000 / 60);
```

這時候，如果眼尖的同學可能會發現，`Entity` 其實是被我們當作抽象類來用，而裡面的 `Entity.update` 和 `Entity.render` 應該要寫成抽象函式才對，不過我覺得這有可能太抽象了，所以在這個營隊期間，我們用到物件導向的部分其實就只有繼承，而不會介紹其他更深入的內容。

儲存 `index.js` 後，應該可以在畫面上看到一個藍色的矩形。

![screen shot 1](/pictures/screenshot1.png)

需要特別注意的是，在 `render()` 函式，有把 `ctx` 當作參數輸入進去。而這個 `ctx` 是在檔案的最一開始定義的。

> 關於 ctx：
> `ctx` 是 `context` 的縮寫，也就是指前後文，在這裡指的是 `canvas` `2d` 繪製的環境。
> `canvas` 指的是 `HTML` 元素，而 `ctx` 就是 `js` 層面上的，操控畫布的入口。

### 角色操控

那麼接下來就是要讓鍵盤可以控制這個長方形移動，為了提升使用者的操作體驗，我最終使用了以下的操控方式。

```js
const pressedMap = {};
const controlKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "Space"];

document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && !pressedMap["Space"]) {
    // handle player shoot
  }
  if (controlKeys.includes(event.code)) {
    event.preventDefault();
    pressedMap[event.code] = 1;
  }
});

document.addEventListener("keyup", function (event) {
  if (controlKeys.includes(event.code)) {
    pressedMap[event.code] = 0;
  }
});

function update() {
  player.control(pressedMap);
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].update();
  }
}
```

比起單純的，根據按下的新按鍵來決定方向，這邊採取的作法是直接把目前的按鍵狀態包裝成一個 `Map`，再在更新時讓玩家根據這個狀態去修改自己的方向。

```js
class Player extends Entity {
  // ... 前面省略
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
  // ... 後面省略
}
```

這邊在做的事情非常簡單，就只是單純的根據輸入按鍵的狀態，計算出正確的方向。在經過標準化之後，再縮放到合適的長度。

但是設定了速度，實際上，我們卻沒有寫根據速度來更新角色位置的邏輯，所以現在來寫。由於這算是所有實體的共同邏輯，所以寫在 `Entity.update`。

```js
class Entity {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.speed = new Vector(0, 0);
  }
  update() {
    this.pos = this.pos.add(this.speed);
  }
  // ... 後面省略
}
```

這時候，我們的角色終於可以動了，但你會發現，我們忘記清空畫面，所以現在來清空畫面。

```js
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].render(ctx);
  }
}
```

### 更好的更新畫面的方法

`requestAnimationFrame` 能告告知瀏覽器我們想要更新畫面，並且也讓瀏覽器能在更新畫面時主動調用此函式，可以防止過度繪製，或是其他效能或顯示問題。

```js
var fps = 60;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;

function gameLoop() {
  requestAnimationFrame(gameLoop);

  now = Date.now();
  delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
    update();
    render();
  }
}
requestAnimationFrame(gameLoop);
```

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/movable_rect/)

## 追蹤視角

現在我們的角色可以動了，那麼是時候來加入攝影機，讓攝影機跟隨角色來移動。

```js
class Camera {
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

const camera = new Camera(player, canvas);
```

其核心概念，就是利用目前攝影機的位置，和要追蹤的目標的位置，來計算出下一個攝影機的位置，達到平滑追蹤的效果。

而攝影機會動之後，我們就可以修改我們渲染角色的方式，必須要渲染在攝影機的相對位置。

```js
class Player extends Entity {
  // ... 前面省略
  render(ctx, camera) {
    ctx.beginPath();
    ctx.fillStyle = "#5252FF";
    ctx.fillRect(this.pos.x - camera.pos.x, this.pos.y - camera.pos.y, 20, 40);
    ctx.closePath();
  }
  // ... 後面省略
}

function update() {
  player.control(pressedMap);
  camera.update();
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].update();
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].render(ctx, camera);
  }
}
```

這時候，你會發現，我們的角色沒有在畫面正中間，這是因為我們繪製代替角色的長方形時，其實是從左上開始，往左下畫的，所以這部分得做一點小修改。

```js
class Player extends Entity {
  // ... 前面省略
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
  // ... 後面省略
}
```

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/trackable_camera/)

## 整理檔案結構

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

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/restructure/)

## 地圖生成與渲染

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

![assets/map/grass.png](./pictures/grass.png)

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

### 地圖渲染

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

![canvas draw image explain](./pictures/canvas_drawimage.jpg)

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

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/cebb6465dd6c4afcf75dcadb1a8cca03f8d20740/saves/map_generation)

## 角色動畫

現在我們有美麗的地圖了，接下來就是讓我們的角色變美麗。不過我們並不會只讓玩家變美麗，而是要製作一個全新的類別來處理所有材質相關的問題。

我們將會設計一個類別，叫做 `Anima`，其專注於呈現一個循環的動畫。例如玩家往右走的動畫，很顯然，玩家會有非常多個動畫，而這個特性是每個角色都會有的，所以我們會設計一個類別，叫做 `Sprite`，處理任何人型物體，其會有一個 `stat` 屬性，負責控制目前要播放什麼動畫。

我們先改寫目前的類別吧

```js
export class Sprite extends Entity {
  constructor(x, y, animaMap) {
    super(x, y);
    this.type = 'Sprite';
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
    this.type = "Sprite";
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

### 完整角色控制動畫、敵人動畫

那麼，接下來就是完善整套動畫系統

先將 index.js 中，關於 Player 的部分改成這樣：

```js
const general_speed = 0.15;
const player = new Player(32000, 32000, 64, {
  idle_down: new Anima("assets/player/idle_down.png", 1, general_speed),
  idle_up: new Anima("assets/player/idle_up.png", 1, general_speed),
  idle_left: new Anima("assets/player/idle_left.png", 1, general_speed),
  idle_right: new Anima("assets/player/idle_right.png", 1, general_speed),
  walk_down: new Anima("assets/player/walk_down.png", 2, general_speed),
  walk_up: new Anima("assets/player/walk_up.png", 2, general_speed),
  walk_left: new Anima("assets/player/walk_left.png", 2, general_speed),
  walk_right: new Anima("assets/player/walk_right.png", 2, general_speed),
});
player.stat = "idle_down";
```

接下來，就是在玩家轉向的部分，添加改變動畫狀態的邏輯。

```js
export class Player extends Sprite {
  // ...前面省略
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

這時候你應該會看到你的角色非常流暢的動畫。

![character animation](/pictures/character_animation.png)

現在是時候添加另外一個角色進去了，沒錯，就是我們的「莫名其妙的紫色大法師」

```js
export class EvilWizard extends Sprite {}
```

先不用添加什麼邏輯在裡面，我們之後再做，將他也加入 entityList。

```js
import { EvilWizard } from "./model/entity.js";

const enemy = new EvilWizard(player, 32000, 31800, 512, {
  idle: new Anima("assets/evil_wizard/Idle.png", 8, general_speed),
});
entityList.push(enemy);
```

![enemy and player](/pictures/enemy_and_player.png)

看起來非常棒！但...

![render order glitch](/pictures/render_order_glitch.png)

玩家明明在敵人的前面，卻被敵人遮住了。

所以這個就是接下來我們要解決的問題！

## 實體管理函式

- EntityManager

## 子彈發射、位移

- Player.shoot
- 子彈不會轉
