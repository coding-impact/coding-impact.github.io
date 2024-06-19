# 7/3 下午
> 重點：  
> 製作遊戲基本架構
- 認識 Canvas
- 繪製圖案、多邊形、影像

# 製作遊戲要用的 HTML、CSS
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

在 `index.html` 裡面引入 `js` 的程式碼，已經有包含在上面的範例裡面了。  
在 `index.js` 裡面填入以下內容：




# 製作課程目標需要知道的 JS 觀念
> 正式開始製作遊戲，講解架構

