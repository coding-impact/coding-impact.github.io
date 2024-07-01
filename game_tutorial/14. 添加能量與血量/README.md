
# 添加能量與血量

不過我們在製作碰撞傷害和特效之前，我們先來讓玩家和敵人，有血量和能量好了。

修改 `Sprite`，添加血量與能量設定。

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
    maxHealth,
    maxEnergy,
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

    this.maxHealth = maxHealth;
    this.maxEnergy = maxEnergy;
    this.health = this.maxHealth;
    this.energy = this.maxEnergy;
  }
  // ...後面省略
}
```

修改玩家和敵人宣告，都給他們 100 點血量和能量。

```js
const player = new Player(32000, 32000, 64, 24, 60, 0, 0, 100, 100, {
  idle_down: new Anima("assets/player/idle_down.png", 1, general_speed),
  idle_up: new Anima("assets/player/idle_up.png", 1, general_speed),
  idle_left: new Anima("assets/player/idle_left.png", 1, general_speed),
  idle_right: new Anima("assets/player/idle_right.png", 1, general_speed),
  walk_down: new Anima("assets/player/walk_down.png", 2, general_speed),
  walk_up: new Anima("assets/player/walk_up.png", 2, general_speed),
  walk_left: new Anima("assets/player/walk_left.png", 2, general_speed),
  walk_right: new Anima("assets/player/walk_right.png", 2, general_speed),
});

const enemy = new EvilWizard(32000, 31800, 512, 24, 96, 0, 32, 100, 100, {
  idle: new Anima("assets/evil_wizard/Idle.png", 8, general_speed),
});
```

確定一切都能正常運作後，接下來就可以替發射子彈加上能量消耗，順便增加一個回魔回血的邏輯：  

```js
export class Player extends Sprite {
  update() {
    super.update();
    this.energy += 0.1;
    this.energy = Math.min(this.maxEnergy, this.energy);
    this.health += 0.01;
    this.health = Math.min(this.maxHealth, this.health);
  }
  shoot(camera, cursor, entityManager) {
    if (this.energy > 0) {
      this.energy -= 10;
      const power = 5;
      const acc = this.pos.add(cursor.pos.add(camera.pos).multiply(-1))
      .normal()
      .multiply(-0.1);
      const bullet = new SmallFireBall(this.pos.x, this.pos.y, power, acc);
      entityManager.add(bullet);
    }
  }
  // ...後面省略
}
```

可以到網頁上瘋狂發射子彈，確認子彈是否會因為沒有能量，而射不出來。
