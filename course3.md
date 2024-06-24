# 7/4

> 重點：  
> 製作遊戲核心函式

## 畫面渲染與角色控制

上次我們已經在邏輯層面上稍微寫了一點東西，因此現在可以來實作他們了。

## 畫布縮放

不過，這個畫布如果不會自動縮放的話，那可就太礙事了。  

將 `index.html` 中的 `canvas` 加上自動縮放的 `inline css`。

```html
<canvas id="gameCanvas" style="background-color: #ffffff; width: 100%;aspect-ratio: 16 / 9;"></canvas>
```

並在 `index.js`加入以下內容：

```js
const canvas = document.getElementById('gameCanvas');

// handle window resize
function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.width / 16 * 9;
}
resize();
window.onresize = resize;
```

這時候你將會發現這個畫布成功的自動隨螢幕大小縮放了，並且在寬度已經足夠時，不會再繼續延伸。  
這時候你可能會有一個疑問，為什麼我們已經用 CSS 設定讓畫布自動縮放了，卻還要在 js 裡面重新設定 `canvas.width` 和 `canvas.height` 呢？  
這是因為這兩個其實是指畫布長寬方向的像素數量，如果不隨著實際尺寸修改這兩個數值的話，畫布上的內容就會產生形變，在之後可以自己試試看移除上面的韓式，看看會不會造成形變。

## 角色移動

解決完畫布不會自動縮放的小問題，那麼接下來就要來開始製作一個可以動的矩形了。  
由於之後可能會有更多種 Entity，我們不直接修改 Entity 來達成這個行為，我們宣告一個 Player 類別，繼承 Entity，完整的檔案內容如下：

```js
import {randomDirection, randomWeightChoose, Vector} from 'utils.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.width / 16 * 9;
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
};

class Player extends Entity {
  render(ctx) {
    ctx.beginPath();
    ctx.fillStyle = '#5252FF';
    ctx.fillRect(this.pos.x, this.pos.y, 20, 40);
    ctx.closePath();
  }
}

let entityList = [];

let player = new Player(0, 0);
entityList.push(player);

function update(){
    for (let i = 0; i < entityList.length; i++) {
        entityList[i].update();
    }
}
function render(){
    for (let i = 0; i < entityList.length; i++) {
        entityList[i].render(ctx);
    }
}

function gameLoop() {
    update();
    render();
}

```

這時候，如果眼尖的同學可能會發現，`Entity` 其實是被我們當作抽象類來用，而裡面的 `update` 和 `render` 應該要寫成抽象函式才對，不過我覺得這有可能太抽象了，所以在這個營隊期間，我們用到物件導向的部分其實就只有繼承，而不會介紹其他更深入的內容。

儲存 index.js 後，應該可以在畫面上看到一個藍色的矩形。

需要特別注意的是，在 render() 函式，有把 ctx 當作參數輸入進去。而這個 ctx 是在檔案的最一開始定義的。

> 關於 ctx：  
> ctx 是 context 的縮寫，也就是指前後文，在這裡指的是 canvas 2d 繪製的環境。  
> canvas 指的是 HTML 元素，而 ctx 就是 js 層面上的，操控畫布的入口。

```js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function update() {
  
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
};


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
    draw();
  }
}
requestAnimationFrame(gameLoop);

```

- Entity
  - Sprite
    - Playaer
    - EvilWizard
  - Bullet
    - SmallFireBall
- EntityManager
- TextManager
- Camera
- Vector
- Map

- Anima
- Cursor
- Particle

```js

```

### 追蹤視角

### 地圖生成

### 角色動畫

### 實體管理函式

### 子彈發射、位移
