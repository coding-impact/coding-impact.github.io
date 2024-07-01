
# 角色發射子彈

[此階段完成品 DEMO](https://coding-impact.github.io/game_tutorial/13.%20發射子彈/)

我們現在有準心了，所以終於可以發射子彈，在 `Player` 裡面添加一個發射子彈的 `function` 吧！

我們會需要 `camera`、`cursor` 和 `entitymanager` 這三個參數。前兩者是為了組合出游標的世界位置，後者是為了要添加子彈，

```js
export class Player extends Sprite {
  // ...前面省略
  shoot(camera, cursor, entityManager) {
    const power = 5;
    const bullet = new Bullet(this.pos.x, this.pos.y, power);
    entityManager.add(bullet);
  }
  // ...後面省略
}
```

我們差不多知道我們要怎麼使用 `Bullet` 了，那麼是時候來寫一個，可以寫在 `player.js` 裡面。

```js
import { Sprite, Entity } from "./entity.js";

export class Bullet extends Entity {
  constructor(x, y, power, accerate) {
    super(x, y);
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

希望大家都還記得我們 `Entity.update` 本身就會根據 `speed` 更新物件的位置，而我順著這個特性，設計成讓我們的子彈會根據發射時設定的加速度，來加速前進。

由於我想要保留擁有各種子彈的可能性，所以這個 `Bullet` 我也會把他當抽象類來用。雖然最後還是只有一種子彈，但我們還是建立另外一個物件，叫做 `SmallFireBall`，這將會是玩家發射的唯一一種子彈，當然你們想怎麼修改都是沒問題的。

```js
import { Anima } from "./anima.js";

const smallFireBallAnima = new Anima(
  "assets/bullet/small_fire_ball.png",
  4,
  0.15
);

export class SmallFireBall extends Bullet {
  constructor(...args) {
    super(...args);
    this.animation = smallFireBallAnima;
  }
  render(ctx, camera) {
    this.animation.render(ctx, camera, this.pos.x, this.pos.y, 32);
  }
}
```

這時再修改一下玩家發射的部分：

```js
export class Player extends Sprite {
  // ...前面省略
  shoot(camera, cursor, entityManager) {
    const power = 5;
    const acc = this.pos
      .add(cursor.pos.add(camera.pos).multiply(-1))
      .normal()
      .multiply(-0.1);
    const bullet = new SmallFireBall(this.pos.x, this.pos.y, power, acc);
    entityManager.add(bullet);
  }
  // ...後面省略
}
```

並修改 index.js 中，鍵盤操作的部分，確定能正確觸發玩家射擊的函式：

```js
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && !pressedMap["Space"]) {
    player.shoot(camera, cursor, entityManager);
  }
  if (controlKeys.includes(event.code)) {
    event.preventDefault();
    pressedMap[event.code] = 1;
  }
});
```

這時可以回到網頁上測試看看能不能透過空白鍵發射子彈。

![shoot some glitch bullet](/pictures/shoot_some_glitch_bullet.png)

成功射出來了！但子彈的方向好像怪怪的...沒有關係，這時候我們就可以稍微修改一下。

我們先了解一下，在 `canvas` 渲染圖片時，該怎麼以圖片中心點旋轉特定角度？

結論是：沒有簡單的做法。

而最簡單的做法，就是在渲染圖片時，透過 `ctx.translate`，將圖片繪製在畫布中心，再旋轉整個畫布。上面這段描述有沒有讓你很熟悉呢？

沒錯，我們的 `Anima` 其實已經有幫大家先移動畫布位置，把圖片繪製在畫布中心，再移動回來了。所以現在就是再加上一個旋轉的參數。

```js
export class Anima {
  // ...前面省略
  render(ctx, camera, rawX, rawY, height, rotate = 0) {
    const sWidth = this.image.width / this.length;
    const scale = height / this.image.height;
    const sx = Math.floor(this.step) * sWidth;

    const displayWidth = sWidth * scale;
    const displayHeight = height;

    const x = rawX - camera.pos.x;
    const y = rawY - camera.pos.y;
    ctx.save();

    ctx.translate(
      x - displayWidth / 2 + displayWidth * 0.5,
      y - displayHeight / 2 + displayHeight * 0.5
    );
    ctx.imageSmoothingEnabled = false;
    ctx.rotate(rotate);
    ctx.drawImage(
      this.image,
      sx,
      0,
      sWidth,
      this.image.height,
      displayWidth * -0.5,
      displayHeight * -0.5,
      displayWidth,
      displayHeight
    );
    ctx.restore();
    this.step += this.speed;
    this.step %= this.length;
  }
}
```

並且，再讓子彈根據行進方向輸入旋轉角度。

```js
export class SmallFireBall extends Bullet {
  constructor(...args) {
    super(...args);
    this.animation = smallFireBallAnima;
  }
  render(ctx, camera) {
    this.animation.render(
      ctx,
      camera,
      this.pos.x,
      this.pos.y,
      32,
      Math.atan2(this.speed.y, this.speed.x) - Math.PI / 2
    );
  }
}
```

這時候，你會發現，子彈完美的轉向正確的方向了！

![bullet rotate](/pictures/bullet_rotate.png)
