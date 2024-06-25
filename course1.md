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

4. 點擊畫面右下角Go Live按鈕

5. 彈出網頁視窗則成功

接下來將會帶大家認識html、css、js的基本語法，可以在程式中自由發揮，設計你的網站。

## HTML 基本架構、常見語法

*註：模板已在上一點提供，可直接更改內容進行測試。*

### 一、基本架構

**1. 概述**：
   - html的寫法，就是用標籤<>包起特定的型態，並以開始標籤<>到結束標籤</>代表一個區域。
     
     > 例如 `<button>測試按鈕</button>` 就會產生一個寫著「測試按鈕」文字的按鈕。
   
   - html本身就能簡單的規劃版面，程式碼的上下關係會直接對應到網頁上。

**2. 基本架構程式說明**：
   - `<!DOCTYPE html>`：告訴瀏覽器你用的語法是html
   
   - `<html>`：html程式最外圈
     
   - `<head>`：負責放所有的metadata（用來描述這份html文件的資料，類似背景設定），讓瀏覽器正確呈現你想要的網頁效果
     
     - `<meta charset="UTF-8">`：這份文件的編譯方式，常見與預設都是UTF-8
     
     - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`：可視範圍，一般設定寬度符合裝置、縮放比例1
     
     - `<title>`：網頁最上方的標題（比網址還上面的區域）
     
     - `<link rel="stylesheet" href="style.css">`：匯入你對html文件的css設計
     
     > 還有很多資訊可以放在head，有興趣可以看看[這個網站](https://ithelp.ithome.com.tw/articles/10237545)。
   
   - `<body>`：網頁的內容，與head不同的是，在這裡加入的東西都能在網頁上看見，例如文字、按鈕等等
     
     - `<script src="script.js"></script>` ：匯入這份html的js程式（讓網頁可以互動）

### 二、常見語法
*註：這邊介紹的是寫在body區域的程式。*

   - **標題文字**：寫法為 `<h1>我是標題</h1>` ，根據數字順序，h1是最大的主標題，遞減到h6最小
     > 一個頁面最好只用一個h1。
    
   - **段落文字**：寫法為 `<p>我是內文</p>` ，用來寫標題以外的內文文字。
     
   - **換行**：寫法為 `<br>` ，會在該位置換一行

   - **水平線**：寫法為 `<hr>`，會在該位置產生一條水平線
    
   - **插入圖片**：寫法為 `<img src="填入圖片網址">`
     
   - **列表**：分為有序列表與無序列表
     | 有序列表（用編號分別項目）| 無序列表（用點分別項目）|
     |-------------------------|-----------------------|
     |<ol><li>第一項</li><li>第二項</li><li>...</li></ol> | <ul><li>第一項</li><li>第二項</li><li>...</li></ul> |

     在html的寫法差不多<br>
     - 有序列表：用 `<ol></ol>`（ordered list）包住 `<li>項目</li>`（list item）
       
         ```html
         <ol>
             <li>第一項</li>
             <li>第二項</li>
             <li>...</li>
         </ol>
         ```
     - 無序列表：用 `<ul></ul>`（unordered list）包住 `<li>項目</li>`（list item）
       
         ```html
         <ul>
             <li>第一項</li>
             <li>第二項</li>
             <li>...</li>
         </ul>
         ```
   - **表格**：
