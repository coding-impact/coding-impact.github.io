
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

![hel vs arial](/pictures/Helvarial.png)

## 鍵盤與滑鼠控制

- 在 `index.html` 的旁邊建立一個資料夾：`js`，再在裡面建立一個檔案：`index.js`，這將會是我們操控 `canvas` 元素的程式碼擺放的位置，不過他目前的用處將會是讓我們展示如何監聽鍵盤與滑鼠事件。

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

如果你做的都沒問題，應該要看起來像這樣：

![html for game](/pictures/html_for_game.png)

[DEMO](https://coding-impact.github.io/saves/complete_html/)  
[目前原始碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/complete_html/)  
