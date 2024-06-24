# 7/3 上午

> 重點：  
> 製作個人網站

- HTML 基礎觀念、架構
- 標題、段落、列表
- 背景、插入圖片與連結
- CSS 常見語法
- 在 GitHub 上部署網站
- 使用 JS 操控元素

## 初始環境設定

### 一、安裝Visual Studio Code（VSC）與延伸模組

1. 在[vsc官網](https://code.visualstudio.com/)點擊下載
2. 開啟vsc，左側工具欄>延伸模組（Extensions）>搜尋Live Share套件，安裝

### 二、測試初始程式碼

1. 建立新資料夾，在vsc開啟（檔案>開啟資料夾）
2. 分別新增"index.html"、"style.css"、"script.js"（名稱可以隨便取，後面要帶正確的格式）
3. index.html放入以下程式：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
    <link rel="stylesheet" href="style.css"><!-- 寫進對應的css檔名 -->
</head>
<body>
    <h1>Hello World!</h1>
    <script src="script.js"></script><!-- 寫進對應的js檔名 -->
</body>
</html>
```

1. 點擊畫面右下角Go Live按鈕
2. 彈出網頁視窗則成功

接下來將會帶大家認識html、css、js的基本語法，可以在程式中自由發揮，設計你的網站。

## HTML 基本架構、常見語法

### 基本架構

*註：模板已在上一點提供，可直接更改內容進行測試。*

1. 概述：html的寫法，就是用<>包起特定的型態，並以<> </>代表一個區域。

2. 基本架構程式說明：
   - `<!DOCTYPE html>`：告訴瀏覽器你用的語法是html
   
   - `<html>`：html程式最外圈
     
   - `<head>`：負責放所有的metadata（用來描述這份html文件的資料），讓瀏覽器正確呈現你想要的網頁效果
     
     - `<meta charset="UTF-8">`：這份文件的編譯方式，常見與預設都是UTF-8
     
     - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`：可視範圍，一般設定寬度符合裝置、縮放比例1
     
     - `<title>`：網頁最上方的文字（比網址還上面的區域）
     
     - `<link rel="stylesheet" href="style.css">`：匯入你對html文件的css設計
     
     - 還有很多資訊可以放在head，有興趣可以看看[這個網站](https://ithelp.ithome.com.tw/articles/10237545)
   
   - `<body>`：網頁的內容，在這裡加入的東西都能在網頁上看見，例如文字、按鈕等等

3. 常見語法
