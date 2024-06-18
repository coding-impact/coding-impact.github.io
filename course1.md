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

#### 一、安裝Visual Studio Code（VSC）與延伸模組
1. 在[vsc官網](https://code.visualstudio.com/)點擊下載
2. 開啟vsc，左側工具欄>延伸模組（Extensions）>搜尋Live Share套件，安裝

#### 二、測試初始程式碼
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
