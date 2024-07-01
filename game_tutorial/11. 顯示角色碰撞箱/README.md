
# 顯示角色碰撞箱

為了精確地利用角色的腳底進行排序，我們首先得知道幾件事情：

- 碰撞箱寬度
- 碰撞箱高度
- 碰撞箱 x 偏移量
- 碰撞箱 y 偏移量

而當我們設定好碰撞箱後，我們還希望可以在角色上面確定我們的碰撞箱的位置是正確的。所以讓我們來修改我們的 `Sprite` 吧！

```js
export class Sprite extends Entity {
  constructor(
    x,
    y,
    height,
    boxW,
    boxH,
    boxOffsetX,
    boxOffsetY,
    animaMap
  ) {
    super(x, y);

    this.stat = "idle";
    this.animaMap = animaMap;
    this.height = height;
    this.boxW = boxW;
    this.boxH = boxH;
    this.boxOffsetX = boxOffsetX;
    this.boxOffsetY = boxOffsetY;
  }

  render(ctx, camera) {
    this.animaMap[this.stat].render(
      ctx,
      camera,
      this.pos.x,
      this.pos.y,
      this.height
    );
    this.renderHitBox(ctx, camera);
  }
  renderHitBox(ctx, camera) {
    ctx.beginPath();
    ctx.fillStyle = "#00FF0030";
    ctx.fillRect(
      this.pos.x - camera.pos.x - this.boxW / 2 + this.boxOffsetX,
      this.pos.y - camera.pos.y - this.boxH / 2 + this.boxOffsetY,
      this.boxW,
      this.boxH
    );
    ctx.closePath();
  }
}
```

接下來就是 修改 `player` 和 `enemy` 的宣告：

```js
const player = new Player(32000, 32000, 64, 24, 60, 0, 0, {
  idle_down: new Anima("assets/player/idle_down.png", 1, general_speed),
  idle_up: new Anima("assets/player/idle_up.png", 1, general_speed),
  idle_left: new Anima("assets/player/idle_left.png", 1, general_speed),
  idle_right: new Anima("assets/player/idle_right.png", 1, general_speed),
  walk_down: new Anima("assets/player/walk_down.png", 2, general_speed),
  walk_up: new Anima("assets/player/walk_up.png", 2, general_speed),
  walk_left: new Anima("assets/player/walk_left.png", 2, general_speed),
  walk_right: new Anima("assets/player/walk_right.png", 2, general_speed),
});
```

```js
const enemy = new EvilWizard(32000, 31800, 512, 24, 96, 0, 32, {
  idle: new Anima("assets/evil_wizard/Idle.png", 8, general_speed),
});
```

如此，應該就能看見碰撞箱了。

![display hitbox](/pictures/display_hitbox.png)

那麼我們能看見精確的腳底位置了，現在就能來修改 `EntityManager.render` 當中排序的部分。

```js
export class EntityManager {
  // 前面省略
  render(ctx, camera) {
    this.entityList.sort(
      (a, b) =>
        a.pos.y +
        a.boxH / 2 +
        a.boxOffsetY -
        (b.pos.y + b.boxH / 2 + b.boxOffsetY)
    );
    this.entityList.forEach((entity) => {
      entity.render(ctx, camera);
    });
  }
}
```

如此一來，就不會發生錯誤的遮擋了！真是太完美了！

至於開關碰撞箱的部分，我們未來還會有其他地方可以開關他，目前由於開發需要，可以先繼續保持顯示碰撞箱。
