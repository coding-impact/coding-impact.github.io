# 製作課程目標需要知道的 JS 觀念

如果從資料產生的方式來分析的話（簡稱資料流），我們預計做的遊戲的結構會是這樣的：  

![basic data flowchart](/pictures/basic_data_flow.png)  

當中，玩家的滑鼠會移動角色的準心，按鍵操控角色方向，與發射。  
更新資料包含了計算鏡頭移動、所有實體被看到的正確的型態、敵人行動等。  
畫出新的畫面（簡稱渲染）包含了畫背景、畫所有實體、畫血條、畫文字等。  

我們會採用物件導向，和 [Entity Component System](https://en.wikipedia.org/wiki/Entity_component_system) 的方式來寫，整個遊戲引擎都包含在內。

而啟動遊戲開發可以分成三步：

1. 先在邏輯層面寫出遊戲雛形
2. 接到畫面上
3. 持續完善

## 在邏輯層面寫出遊戲雛形

想要在邏輯層面上寫出遊戲雛形，那麼我們得清楚我們想要寫的是什麼。  

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
import {Vector} from './utils.js';

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

[查看 utils.js](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/only_vector/utils.js)  

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
