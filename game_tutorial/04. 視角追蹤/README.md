
# 追蹤視角

現在我們的角色可以動了，那麼是時候來加入攝影機，讓攝影機跟隨角色來移動。

```js
class Camera {
  constructor(traceTarget, canvas) {
    this.target = traceTarget;
    this.canvas = canvas;
    this.pos = new Vector(0, 0);
    this.center = this.target.pos;
  }
  update() {
    this.center = this.target.pos
      .add(this.center.multiply(19))
      .multiply(1 / 20);
    this.pos = {
      x: this.center.x - this.canvas.width / 2,
      y: this.center.y - this.canvas.height / 2,
    };
  }
}

const camera = new Camera(player, canvas);
```

其核心概念，就是利用目前攝影機的位置，和要追蹤的目標的位置，來計算出下一個攝影機的位置，達到平滑追蹤的效果。

而攝影機會動之後，我們就可以修改我們渲染角色的方式，必須要渲染在攝影機的相對位置。

```js
class Player extends Entity {
  // ... 前面省略
  render(ctx, camera) {
    ctx.beginPath();
    ctx.fillStyle = "#5252FF";
    ctx.fillRect(this.pos.x - camera.pos.x, this.pos.y - camera.pos.y, 20, 40);
    ctx.closePath();
  }
  // ... 後面省略
}

function update() {
  player.control(pressedMap);
  camera.update();
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].update();
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < entityList.length; i++) {
    entityList[i].render(ctx, camera);
  }
}
```

這時候，你會發現，我們的角色沒有在畫面正中間，這是因為我們繪製代替角色的長方形時，其實是從左上開始，往左下畫的，所以這部分得做一點小修改。

```js
class Player extends Entity {
  // ... 前面省略
  render(ctx, camera) {
    let width = 20;
    let height = 40;
    ctx.beginPath();
    ctx.fillStyle = "#5252FF";
    ctx.fillRect(
      this.pos.x - camera.pos.x - width / 2,
      this.pos.y - camera.pos.y - height / 2,
      width,
      height
    );
    ctx.closePath();
  }
  // ... 後面省略
}
```

[目前程式碼](https://github.com/coding-impact/coding-impact.github.io/blob/main/saves/trackable_camera/)
