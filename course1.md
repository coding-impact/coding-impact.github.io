# 7/3 上午

> 重點：  
> 製作個人網站

- HTML 基礎觀念、架構v
- 標題、段落、列表v
- 插入圖片與連結v
- 背景(應該歸在css)
- CSS 常見語法
- 在 GitHub 上部署網站
- 使用 JS 操控元素

## 簡介

一般前端網頁由HTML、CSS、JavaScript三種程式語言組成：HTML負責打底，CSS美化排版，JS則可以做出互動性。
<br><br>
本次營隊將會帶大家一一認識它們，並在營隊課程結束時製作出一款簡單的射擊遊戲。

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

<hr>

## HTML 基本架構

*註：模板已在上一點提供，可直接更改內容進行測試。*

### 一、概述

   - html的寫法，就是用標籤<>包起特定的型態，並以開始標籤<>到結束標籤</>代表一個區域。
     
     > 例如 `<button>測試按鈕</button>` 就會產生一個寫著「測試按鈕」文字的按鈕。
   
   - html本身就能簡單的規劃版面，程式碼的上下關係會直接對應到網頁上。

### 二、基本架構程式說明

   - `<!DOCTYPE html>`：告訴瀏覽器你用的語法是html。
   
   - `<html>`：html程式最外圈。
     
   - `<head>`：負責放所有的metadata（用來描述這份html文件的資料，類似背景設定），讓瀏覽器正確呈現你想要的網頁效果。
     
     - `<meta charset="UTF-8">`：這份文件的編譯方式，常見與預設都是UTF-8。
     
     - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`：可視範圍，一般設定寬度符合裝置、縮放比例1。
     
     - `<title>`：網頁最上方的標題（比網址還上面的區域）。
     
     - `<link rel="stylesheet" href="style.css">`：匯入你對html文件的css設計。
     
     > 還有很多資訊可以放在head，有興趣可以看看[這個網站](https://ithelp.ithome.com.tw/articles/10237545)。
   
   - `<body>`：網頁的內容，與head不同的是，在這裡加入的東西都能在網頁上看見，例如文字、按鈕等等。
     
     - `<script src="script.js"></script>` ：匯入這份html的js程式（讓網頁可以互動）。

## HTML 常見語法

*註1：這邊介紹的是寫在body區域的程式*

*註2：後面的篇章還會繼續介紹配合css、js的html程式。*

### 一、標題、段落
   
   - **標題文字**：寫法為 `<h1>我是標題</h1>` ，根據數字順序，h1是最大的主標題，遞減到h6最小。
   
   - **段落文字**：寫法為 `<p>我是內文</p>` ，用來寫標題以外的內文文字。
     
   - **換行**：寫法為 `<br>` ，會在該位置換一行。
     > html的標籤本身就會換一行，所以視情況加就好！

   - **水平線**：寫法為 `<hr>`，會在該位置產生一條水平線。
     
   - 範例程式：

     ```html
     <h1>台灣同人誌販售會</h1>
     <h2>最新活動場次</h2>
     <p>
         CWT-67 台北場
         <br>
         活動日期 2024年8月10/11日
     </p>
     ```
   - 效果：

     >  <h1>台灣同人誌販售會</h1>
     >  <h2>最新活動場次</h2>
     >  <p>
     >      CWT-67 台北場
     >      <br>
     >      活動日期 2024年8月10/11日
     >  </p>

### 二、插入圖片、連結

   - **插入圖片**：寫法為 `<img src="圖片網址">` ，圖片點擊右鍵「在新分頁中開啟圖片」，接著在圖片的分頁右鍵「複製圖片網址」，將內容貼到這段程式即可
     
   - **插入連結**：寫法為 `<a href="連結網址" target="_blank">超連結</a>` ，包裹住的內容就是畫面上出現超連結的地方（可以是文字或圖片）
   
   - **嵌入**：有些網站的分享選項會有「嵌入」可以選（例如youtube），複製到的那段文字直接貼在html程式，就可以將它顯示在網頁上了。
   
   - 範例程式：

     ```html
     <img src="https://www.comicworld.com.tw/ULimages/ActPics/148/EventLogo.png">
     <a href="https://www.comicworld.com.tw/" target="_blank">CWT官網</a>
     ```
   
   - 效果：
     
     > <img src="https://www.comicworld.com.tw/ULimages/ActPics/148/EventLogo.png">
     > <a href="https://www.comicworld.com.tw/" target="_blank">CWT官網</a>

### 三、列表、表格

   - **列表**：分為有序列表與無序列表

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

     | 有序列表（用編號分別項目）| 無序列表（用點分別項目）|
     |-------------------------|-----------------------|
     |<ol><li>第一項</li><li>第二項</li><li>...</li></ol> | <ul><li>第一項</li><li>第二項</li><li>...</li></ul> |

   - **表格**：寫法是 `<table> </table>` 包裹整個區塊， `<tr> </tr>` 代表一列，`<th> </th>` 代表一個標題， `<td> </td>` 代表一個元素。
     
     ```html 
     <table>
         <tr>
             <th>活動場次</th>
             <th>時間</th>
         </tr>
         <tr>
             <td>CWT-T32 台中場</td>
             <td>2024年8月17/18日</td>
         </tr>
         <tr>
             <td>CWT-K45 高雄場</td>
             <td>2024年8月24/25日</td>
         </tr>
     </table>
      ```

     > <table>
     >     <tr>
     >         <th>活動場次</th>
     >         <th>時間</th>
     >     </tr>
     >     <tr>
     >         <td>CWT-T32 台中場</td>
     >         <td>2024年8月17/18日</td>
     >     </tr>
     >     <tr>
     >         <td>CWT-K45 高雄場</td>
     >         <td>2024年8月24/25日</td>
     >     </tr>
     > </table>

<hr>

## CSS 基本觀念

寫好html後，會發現內容只有黑底白字，非常單調，因此我們需要使用css進一步設計。

### 一、概述

- css的寫法是 `選擇元素 { 設定 };`。

  > 例如想將h1文字改為紅色，就在css這麼寫：
  > ```css
  > h1 {
  >     color:red;
  > }
  > ```


### 二、選擇器 —— class與id

如果只想改變一篇文章的其中一段文字，該怎麼用css指定它呢？

這種時候，我們可以在html的元素裡加入class或id，以在css精確地選中項目。

- **類別 class**：

    不同性質的東西可以有同個class。
    
    **⮕ 一個class可以被多次使用**
    
  > 例如希望一段文字 `<p> </p>` 擁有名為blue的class，就在html這麼寫：
  > ```html
  > <p class="blue"> 藍色文字 </p>
  > ```
  >
  > 接著我們希望class blue的元素變成藍色，就在css這麼寫：
  > ```css
  > .blue {
  >     color: blue;
  > }
  > ```
  >
  > **注意！** class的呼叫方式是在名稱前加**一個句點（.）**。
  > 
  > 寫好css，這段文字就會從黑色變為藍色。並且，在其他文字加入class="blue"也會使之變為藍色。

- **id**：

    名稱的概念，指這份程式內的特定元素。

    **⮕ 一個id只能被使用一次**

  > 例如希望一段文字 `<p> </p>` 擁有名為blue的id，就在html這麼寫：
  > ```html
  > <p id="blue"> 藍色文字 </p>
  > ```
  >
  > 接著我們希望id blue的元素變成藍色，就在css這麼寫：
  > ```css
  > #blue {
  >     color: blue;
  > }
  > ```
  >
  > **注意！** id的呼叫方式是在名稱前加**一個井字號（#）**。
  > 
  > 寫好css，這段文字就會從黑色變為藍色。但是，其他元素就不能使用id="blue"了。

### 三、區塊 —— div與span

想選擇一塊區域，而非像class或id這種個別元素的話，該怎麼做呢？

這種時候，我們可以使用div或span，以在css選中特定的區域。

- **大區塊 div**：

    一個區塊的概念，可以改變它的css樣式。
    
    **⮕ div標籤後會換行**
    
  > 例如希望一段文字 `<p> </p>` 擁有名為blue的class，就在html這麼寫：
  > ```html
  > <p class="blue"> 藍色文字 </p>
  > ```
  >
  > 接著我們希望class blue的元素變成藍色，就在css這麼寫：
  > ```css
  > .blue {
  >     color: blue;
  > }
  > ```
  >
  > **注意！** class的呼叫方式是在名稱前加**一個句點（.）**。
  > 
  > 寫好css，這段文字就會從黑色變為藍色。並且，在其他文字加入class="blue"也會使之變為藍色。

- **小區塊 span**：

    相比div可以涵蓋更小的區域。

    **⮕ span標籤後不會換行**

  > 例如希望一段文字 `<p> </p>` 擁有名為blue的id，就在html這麼寫：
  > ```html
  > <p id="blue"> 藍色文字 </p>
  > ```
  >
  > 接著我們希望id blue的元素變成藍色，就在css這麼寫：
  > ```css
  > #blue {
  >     color: blue;
  > }
  > ```
  >
  > **注意！** id的呼叫方式是在名稱前加**一個井字號（#）**。
  > 
  > 寫好css，這段文字就會從黑色變為藍色。但是，其他元素就不能使用id="blue"了。

## CSS 常見語法

### 一、
