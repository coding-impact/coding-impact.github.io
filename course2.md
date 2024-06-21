# 7/3 下午
> 重點：  
> 製作遊戲基本架構
- 認識 Canvas
- 繪製圖案、多邊形、影像

# 製作遊戲要用的 HTML、CSS

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
![](./pictures/Helvarial.png)

# 鍵盤與滑鼠控制

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
    <canvas id="gameCanvas"></canvas>
</div>
<!-- 前後省略 -->
```

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

完成後，回到網頁，打開網頁主控台。測試滑鼠進出、移動、鍵盤按鍵按下與鬆開有沒有出現對應紀錄。

如果都沒有問題，那就代表非常好，我們理論上，是可以做出這個遊戲的，至少需要的技術（讀取玩家輸入、渲染畫面）我們現在都有了，所以剩下的就是單純的程式了。

# 製作課程目標需要知道的 JS 觀念
> 正式開始製作遊戲，講解架構

如果從資料產生的方式來分析的話（簡稱資料流），我們預計做的遊戲的結構會是這樣的：  
![](./pictures/basic_data_flow.png)  
當中，玩家的滑鼠會移動角色的準心，按鍵操控角色方向，與發射。  
更新資料包含了計算鏡頭移動、所有實體被看到的正確的型態、敵人行動等。   
畫出新的畫面（簡稱渲染）包含了畫背景、畫所有實體、畫血條、畫文字等。  

雖然感覺好像很複雜，不過大部分東西其實想到再加上去就好了，不用太有壓力。  

