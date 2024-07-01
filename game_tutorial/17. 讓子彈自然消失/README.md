
# 讓子彈自然消失

美麗的動畫時間結束了，是時候回來處理之前遺留下來的一些問題。

馬上趕到戰場的是，子彈不會自然消失的問題。

之所以現在才處理，是因為當我發現我漏寫的時候，目前進行的主題都不能中途插入子彈處理問題了，會打亂一點節奏，我又不想重寫前面全部的範例 code，所以只好現在回來處理。

總之，回去修改 `EntityManager`：

```js
export class EntityManager {
  // ...中間省略
  render(ctx, canvas, camera) {
    this.entityList.sort(
      (a, b) =>
        a.pos.y +
        a.boxH / 2 +
        a.boxOffsetY -
        (b.pos.y + b.boxH / 2 + b.boxOffsetY)
    );
    this.entityList = this.entityList.filter(
      (entity) =>
        !(
          entity.type === "Bullet" &&
          Math.abs(entity.pos.x - camera.pos.x) > canvas.width * 3 &&
          Math.abs(entity.pos.x - camera.pos.x) > canvas.height * 3
        )
    );
    this.entityList.forEach((entity) => {
      entity.render(ctx, camera);
    });
  }
}
```

並且修改 Bullet 類別：

```js
export class Bullet extends Entity {
  constructor(x, y, power, accerate) {
    super(x, y);
    this.type = "Bullet";
    this.power = power;
    this.accerate = accerate;
    this.speed = this.accerate.normal().multiply(this.power);
  }
  update() {
    this.speed = this.speed.add(this.accerate);
    super.update();
  }
}
```

並記得修改在 `index.js` 的 `entityManager.render`：

```js
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.render(ctx, canvas, camera);
  entityManager.render(ctx, canvas, camera);
  uiManager.render(ctx, canvas);
  textManager.render(ctx);
  cursor.render(ctx);
}
```

回到網頁測試時，可以在 render 裡面添加一個，顯示實體數量的協助測試有沒有成功：

```js
export class EntityManager {
  // ...中間省略
  render(ctx, canvas, camera) {
    console.log(this.entityList.length);
    // ...後面省略
  }
}
```

如圖

![bullet disappear log](/pictures/bullet_disappear_log.png)
