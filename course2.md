# 7/3 下午

> 重點：  
> 製作遊戲基本架構

- 認識 Canvas
- 繪製圖案、多邊形、影像

## 製作遊戲要用的 HTML、CSS

既然我們已經學會了那麼多技能，那麼是時候來製作遊戲了對吧！  
以下是我們這次預計製作的內容：[https://coding-impact.github.io/EvilWizard/](https://coding-impact.github.io/EvilWizard/)  
Repository：[https://coding-impact.github.io/EvilWizard/](https://coding-impact.github.io/EvilWizard/)  

如果覺得很難的話，不用太擔心，這篇教學將會手把手帶你完成。如果覺得太簡單的話，也歡迎自己添加任何更酷炫的內容。

- 打開隨便一個空資料夾，用 vscode 打開它。
- 建立一個檔案，叫做index.html，輸入以下內容

```html
<!DOCTYPE html>
<html>
<head>
    <title>Epic Game</title>
    <style>
        body,
        html {
            background-color: #121212;
            color: #eeeeee;
            font-family: "Helvetica", "Arial","LiHei Pro","黑體-繁","微軟正黑體", sans-serif;  /* 我個人常用的字型組合 */
        }
        h2 {
            margin-top: 0;
        }
      
        .app {
            display: flex;
            justify-content: center;
        }
        .container {
            max-width: 900px;
            margin: 8px;
            padding: 16px;
            width: 900px;
            border: 4px solid #202020;
        }
    </style>
</head>
<body>
    <div class="app">
        <div class="container">
            <h2>epic cool game</h1>
            <p>not very cool, but stil very cool</p>
        </div>
    </div>
</body>
</html>
```

當中，需要特別注意的是

```css
.container {
    max-width: 900px;
    margin: 8px;
    padding: 16px;
    width: 900px;
    border: 4px solid #202020;
}
```

`.container`中的`max-width`在寬度超過`900px`時將寬度設置為`900px`，`width`在寬度少於`900px`時盡可能拉寬元素。

關於字型，Helvetica 和 Arial 的差別可以看下圖。

![hel vs arial](./pictures/Helvarial.png)

## 鍵盤與滑鼠控制

- 在 `index.html` 的旁邊建立一個檔案：`index.js`，這將會是我們操控 `canvas` 元素的程式碼擺放的位置，不過他目前的用處將會是讓我們展示如何監聽鍵盤與滑鼠事件。

在 `index.html` 中添加引入 `index.js` 的部分，如下：

```html
<!-- 前後省略 -->
<head>
    <script type="module" src="js/index.js"></script>  <!-- 添加這行 -->
    <title>Epic Game</title>
<!-- 前後省略 -->
```

在 `div` 元素裡面放入 `canvas` 元素，如下：

```html
<!-- 前後省略 -->
<div class="container">
    <h2>epic cool game</h1>
    <p>not very cool, but stil very cool</p>
    <canvas id="gameCanvas" style="background-color: #ffffff;"></canvas>
</div>
<!-- 前後省略 -->
```

記得要設定 `id`，這樣之後在程式碼中才能夠找到他，而設定背景顏色，則是為了方便知道畫布元素的大小。
如果你不想要設定畫布顏色來知道畫布範圍的話，也可以打開偵錯工具的元件分頁，找到這個元素的位置，或通常按右鍵，選檢查，就能看到他的範圍。

在 `index.js` 裡面填入以下內容：

```js

const canvas = document.getElementById('gameCanvas');

document.addEventListener('keydown', function(event) {
    console.log(`key down" ${event.code}`);
});

document.addEventListener('keyup', function(event) {
    console.log(`key up" ${event.code}`);
  
});

canvas.addEventListener('mouseleave', () => {
    console.log(`mouse leave`);
});

canvas.addEventListener('mouseenter', () => {
    console.log(`mouse enter`);
});

canvas.addEventListener('mousemove', function(event) {
    console.log(`mouse move: ${event.clientX} ${event.clientY}`);
});

```

完成後，回到網頁，打開網頁主控台。測試滑鼠進出 `canvas`、滑鼠移動、鍵盤按鍵按下與鬆開有沒有出現對應紀錄。  

如果都沒有問題，那就代表非常好，我們理論上，是可以做出這個遊戲的，至少需要的技術（讀取玩家輸入、渲染畫面）我們現在都有了，所以剩下的就是單純的程式了。

如果你做的都沒問題，應該要看起來像這樣：[DEMO](https://coding-impact.github.io/saves/complete_html/)[原始碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/complete_html/)  

## 製作課程目標需要知道的 JS 觀念

如果從資料產生的方式來分析的話（簡稱資料流），我們預計做的遊戲的結構會是這樣的：  

![basic data flowchart](./pictures/basic_data_flow.png)  

當中，玩家的滑鼠會移動角色的準心，按鍵操控角色方向，與發射。  
更新資料包含了計算鏡頭移動、所有實體被看到的正確的型態、敵人行動等。  
畫出新的畫面（簡稱渲染）包含了畫背景、畫所有實體、畫血條、畫文字等。  

我們會採用物件導向，和 [Entity Component System](https://en.wikipedia.org/wiki/Entity_component_system) 的方式來寫，整個遊戲引擎都包含在內。

為什麼要使用物件導向？未完待補

為什麼要使用 Entity Component System？未完待補

而啟動遊戲開發可以分成三步：

1. 先在邏輯層面寫出遊戲雛形
2. 接到畫面上
3. 持續完善

## 在邏輯層面寫出遊戲雛形

想要在落籍層面上寫出遊戲雛形，那麼我們得清楚我們想要寫的是什麼。  

我們會希望整個遊戲的架構是這樣的

```js
function gameLoop() {
    update();
    render();
}
```

而當中 `update` 和 `render` 實際上都會是圍繞著一堆描述遊戲目前狀態的數據。為了方便起見，我們目前就先只思考遊戲中主要會出現的東西，也就是實體。我這邊把所有遊戲中會出現的物件，並且要渲染到畫面上，以遊戲世界座標為定位的東西稱為「實體」，實體只會描述實體們共通的基礎行為，如果需要更複雜的行為，例如之後會出現「粒子」，就可以繼承這個實體類別，定義一個粒子類別。  

所以我們就先來設計這個實體（Entity）吧！  

```js
import {Vector} from 'utils.js';

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
```

這時候你會發現，上面提到了一個新東西，叫做 Vector，這是一個類別，可以處理各種向量操作，請下載下來後，確定他的名字是 utils.js，並放到 index.js 旁邊。  

[下載 utils.js](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/only_vector/utils.js)  

目前裡面只會包含 Vector 相關的程式碼，在未來，這邊還會新增更多程式。  

> utils 的意思：  
> utils 是 utilities 的縮寫，意思是「實用工具們」

那，有實體了，我們要如何在 update() 函數裡面更新 Entity 的狀態呢？  
未來我們會寫另外一個物件來做這件事情，但目前我們可以先用列表代替。
當我們想要新增實體時，就把實體加進去這個列表就好了。

```js
let entityList = [];
function update(){
    for (let i = 0; i < entityList.length; i++) {
        entityList[i].update();
    }
}
function render(){
    for (let i = 0; i < entityList.length; i++) {
        entityList[i].render();
    }
}

function gameLoop() {
    update();
    render();
}
```
Ｆ