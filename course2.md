# 7/3 下午

## 目錄
- [7/3 下午](#73-下午)
  - [目錄](#目錄)
  - [認識Canvas](#認識canvas)
    - [Canvas 基本架構](#canvas-基本架構)
  - [使用Canvas繪製方形](#使用canvas繪製方形)
  - [使用Canvas繪製路徑](#使用canvas繪製路徑)
  - [使用Canvas繪製弧形](#使用canvas繪製弧形)
  - [改變繪圖顏色](#改變繪圖顏色)
  - [使用Canvas繪製影像](#使用canvas繪製影像)

## 認識Canvas

上午我們已經學了html、css與js的基本知識，現在讓我們進一步學習canvas吧。

簡單來說，canvas就是畫布，我們可以使用各種函式在上面繪製想要的圖案。

### Canvas 基本架構

首先，我們在html檔案中建立一個canvas標籤： `<canvas id="canvas" width="150" height="150"></canvas>`

```html
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <title>Canvas Test</title>
    <link rel="stylesheet" href="style.css"> <!-- 放你要用的css檔 -->
  </head>
  <body>
    <canvas id="canvas" width="150" height="150"></canvas> <!-- 添加這行 -->
    <script src="script.js"></script> <!-- 放你要用的js檔 -->
  </body>
</html>
```

這段標籤會建立一個150px*150px的畫布，你也可以自己修改大小。

我們可以在css給canvas加上邊框，以更好觀察到它的範圍。當然，早上學習的css程式基本上對canvas也都管用。

```css
canvas {
    border: 1px solid black;
}
```

接著進入你的js檔，貼上這段函式：

```js
function draw() {
    const canvas = document.getElementById("canvas");  // 取得畫布
    if (canvas.getContext) {                           // 確認網站有支援canvas（最好做這一步）
      const ctx = canvas.getContext("2d");             // 規格為2D平面，這行設定的變數名稱將用來呼叫畫布。（設定一次就好）
    }
  }
  draw();
```

這樣一個可以畫畫的畫布就建立完成了，接下來我們會使用函式進行作畫。

## 使用Canvas繪製方形

開始前我們必須先了解canvas的座標計算方法，如圖：

<img src="https://developer.mozilla.org/zh-TW/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes/canvas_default_grid.png">

可以看見左上角為原點(0, 0)，分別向右方、下方計算x、y座標與寬、高。

方形是唯一可以直接使用canvas內建函式的圖形，我們就從方形開始認識吧！

繪製方形有三種函式：

- `fillRect(x, y, width, height)` ：畫出一個填滿的方形。
- `strokeRect(x, y, width, height)` ：畫出這個方形的邊框。
- `clearRect(x, y, width, height)` ：清除這個方形範圍內的內容，變為全透明。

將剛才設定的畫布作為前綴寫進draw函式：

```js
const ctx = canvas.getContext("2d");  // 剛剛這行設定的變數名稱，會是下兩行的前綴（此處用ctx，可自行更改）

ctx.fillRect(10, 10, 50, 50);
```

使用這段程式，我們可以看到畫面上出現一個方形。

## 使用Canvas繪製路徑

跟畫畫一樣，canvas有移動筆、下筆的功能，不同的是canvas需要依靠路徑（筆跡）才知道該畫在哪裡。

- `beginPath()`：產生新路徑，下筆前必須呼叫此函式紀錄筆跡。

- `moveTo(X, Y)`：將筆移動到座標(X, Y)，此移動不算筆跡。

- `lineTo(X, Y)`：畫一條直線到座標(X, Y)，此移動會被算進筆跡。

- `closePath()`：可以自動閉合路徑，不一定需要。

- `stroke()`：畫出圖形的邊框（剛剛的筆跡），不會自動閉合。

- `fill()`：填滿路徑內容，會自動閉合路徑並填滿。

例如我們使用這段程式：

```js
const ctx = canvas.getContext("2d");  // 變數名稱ctx可更改

ctx.beginPath();
ctx.moveTo(75, 50);
ctx.lineTo(100, 75);
ctx.lineTo(100, 25);
ctx.fill();
```

就能得到一個填滿的三角形。

但這是因為我們使用了`fill()`，若改為`stroke()`，就會發現筆跡其實是沒有閉合的。

## 使用Canvas繪製弧形

- `arc(圓心X, 圓心Y, 半徑, 開始弧度, 結束弧度, 是否逆時針)`

  弧度radians並不是角度degrees。參考換算公式：`radians = (Math.PI/180) * degrees`

```js
const ctx = canvas.getContext("2d");  // 變數名稱ctx可更改

ctx.beginPath();
ctx.arc(75, 75, 50, 0, Math.PI/2, false);
ctx.stroke();
```

這段程式可以畫出圓心在(75, 75)，右下角的1/4圓弧。

*補充*

貝茲曲線，繪畫規則如圖：

<img src="https://developer.mozilla.org/zh-TW/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes/canvas_curves.png">

- `quadraticCurveTo(參考點1X, 參考點1Y, X, Y)`：從目前位置，根據參考點1，畫一條貝茲曲線到(X, Y)。

- `bezierCurveTo(參考點1X, 參考點1Y, 參考點2X, 參考點2Y, X, Y)`：從目前位置，根據參考點1、2，畫一條貝茲曲線到(X, Y)。

```js
var ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(75, 40);
ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
ctx.fill();
```
這段程式可以畫一顆愛心。

## 改變繪圖顏色

- `strokeStyle = 顏色`：改變畫出的邊框的顏色。

- `fillStyle = 顏色`：改變填滿的顏色。

[漸變顏色的做法可以參考這個網站。](https://developer.mozilla.org/zh-TW/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors)

(30 min practice)

## 使用Canvas繪製影像

- `drawImage(圖片, X, Y, 寬, 高)`：以座標(X, Y)為圖片右上角，畫出寬、高的圖片

範例程式：
```js
function draw() {
    const ctx = document.getElementById("canvas").getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 20, 20, 60, 40);
    };
    img.src = "https://cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg";
}  
draw();
```
- `drawImage(圖片, 切割起點X, 切割起點Y, 切割寬, 切割高, X, Y, 寬, 高)`：

  可以切割圖片的寫法，前面設定如何切割圖片，後面與前一條程式相同。

```js
export class Tileset {
  constructor(src, length, rawBlockSize) {
    this.rawBlockSize = rawBlockSize;
    this.length = length;

    this.image = new Image();
    this.image.src = src;
  }
  getRandomBlockId() {
    return 1;
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

*參考資料：[Canvas教學文件](https://developer.mozilla.org/zh-TW/docs/Web/API/Canvas_API/Tutorial)*

<hr>
