
# 初步設計敵人 AI

現在，玩家部分已經非常完美了，是時候來寫敵人的行為模式：

先思考一下我們有哪些素材，我們有兩種攻擊：

![attack 1](/pictures/Attack1.png)
![attack 2](/pictures/Attack2.png)

一種跑，和一種跳:

![run](/pictures/Run.png)
![jump](/pictures/Jump.png)

根據我們有的這些素材，我設計了以下的攻擊模式：

1. 首先，他會先「跑」向玩家
2. 跑到目標後
   1. 如果玩家在一定範圍內，就使用 Attack1
   2. 如果不在的話，就「跳」向玩家，使用 Attack2

對行為模式，有一點基礎的想像後，接下來就是慢慢實現它。

## 敵人動畫

我們先把整體框架做出一個雛形：

```js
export class EvilWizard extends Sprite {
  constructor(target, ...args) {
    super(...args);
    this.target = target;
  }
  checkCollision(entityManager) { ... } // ...省略
  play_animation_once(stat){}
  update(){

  }
}
```

我們的攻擊動畫，一樣會採用 `stat` 的方式播放，而當中的 `player_animation_once` 就可以放讓動畫只執行一遍的邏輯：

```js
export class EvilWizard extends Sprite {
  constructor(target, ...args) {
    super(...args);
    this.target = target;
    this.remaining_animation_frame = 0; // 目前正在進行的，不可中斷的動畫，的剩餘幀數（這裡的幀數指的是 EntityManager.render 的幀數）
    this.oldHealth = this.health;
  }
  // ...中間省略
  play_animation_once(stat) {
    this.stat = stat;
    this.animaMap[this.stat].step = 0;
    this.remaining_animation_frame =
      (this.animaMap[this.stat].length - 0.5) / this.animaMap[this.stat].speed;
  }
  update() {
    if (this.remaining_animation_frame > 0) {
      this.remaining_animation_frame--;
      // 動畫執行中，在這邊放攻擊傷害判定
    } else if (this.remaining_animation_frame <= 0) {
      // 動作執行完畢，可以判斷接下來要執行什麼動作

      if (this.health < this.oldHealth) {
        this.play_animation_once("attack1");
      } else {
        this.stat = "idle";
      }
    }
    // this.speed = this.target.pos.add(this.pos.multiply(-1)).normal();
    this.oldHealth = this.health;
  }
}
```

我們先寫一個，受傷之後，嘗試攻擊的測試模式，除此之外還額外把 `target` 加入了參數。

記得把目標加入參數，和新的動畫也加入 `animaMap`：

```js
const enemy = new EvilWizard(
  player,
  32000,
  31800,
  512,
  24,
  96,
  0,
  32,
  100,
  100,
  {
    idle: new Anima("assets/evil_wizard/Idle.png", 8, general_speed),
    attack1: new Anima("assets/evil_wizard/Attack1.png", 8, general_speed),
  }
);
```

這時候測試一下，應該可以看見敵人對你的攻擊作出反擊：

![enemy counter attack](/pictures/enemy_counter_attack.png)

那麼接下來，就是要讓敵人跑到指定位置，並且我們增加一個新機制，怒氣值，只有當怒氣值累積到一定程度時，才會進行攻擊，並順便添加受傷動畫：

```js
import { Vector } from "../utils.js";

export class EvilWizard extends Sprite {
  constructor(target, ...args) {
    super(...args);
    this.target = target;
    this.remaining_animation_frame = 0; // 目前正在進行的，不可中斷的動畫，的剩餘幀數（這裡的幀數指的是
    // EntityManager.render 的幀數）
    this.anger = 0;

    this.oldHealth = this.health;

    this.dest = undefined;
  }
  runTo(x, y) {
    this.dest = new Vector(x, y);
    this.moveSpeed = 10;
    this.stat = "run";
  }
  // ...中間省略
  update() {
    if (this.remaining_animation_frame > 0) {
      this.remaining_animation_frame--;
      // 動畫執行中，在這邊放攻擊傷害判定
    } else if (this.remaining_animation_frame <= 0) {
      // 動作執行完畢，可以判斷接下來要執行什麼動作

      if (this.health < this.oldHealth) {
        this.play_animation_once("damaged");
        this.anger += Math.random();
      } else if (this.anger >= 1.5) {
        this.anger -= 1.5;
        this.runTo(this.target.pos.x, this.target.pos.y);
      } else if (this.stat == "run") {
        this.pos = this.pos.add(
          this.dest.add(this.pos.multiply(-1)).normal().multiply(this.moveSpeed)
        );
        if (this.dest.add(this.pos.multiply(-1)).length() < 20) {
          this.stat = "idle";
        }
      } else {
        this.stat = "idle";
        this.anger += 0.01 * Math.random();
      }
    }
    // this.speed = this.target.pos.add(this.pos.multiply(-1)).normal();
    this.oldHealth = this.health;
  }
}
```

並記得把跑步和受傷加入 `animaMap`

```js
const enemy = new EvilWizard(
  player,
  32000,
  31800,
  512,
  24,
  96,
  0,
  32,
  100,
  100,
  {
    idle: new Anima("assets/evil_wizard/Idle.png", 8, general_speed),
    run: new Anima("assets/evil_wizard/Run.png", 8, general_speed),
    attack1: new Anima("assets/evil_wizard/Attack1.png", 8, general_speed),
    damaged: new Anima("assets/evil_wizard/Damaged.png", 3, general_speed),
  }
);
```

這時候敵人會跑了！但是...

![enemy run backward](/pictures/enemy_run_backward.png)

他卻是向後跑的！不過不用擔心，我們只需要替 `Sprite` 添加一個 `direction` 參數，並在 `Anima.render` 裡面，根據 `direction` 決定要不要水平翻轉就行了。

修改 `Sprite`

```js
export class Sprite extends Entity {
  constructor(
      x, y, height, boxW, boxH, boxOffsetX, boxOffsetY, maxHealth, maxEnergy,
      animaMap) {
    super(x, y);

    this.stat = 'idle';
    this.animaMap = animaMap;
    this.direction = 1;
    this.height = height;
    this.boxW = boxW;
    this.boxH = boxH;
    this.boxOffsetX = boxOffsetX;
    this.boxOffsetY = boxOffsetY;

    this.maxHealth = maxHealth;
    this.maxEnergy = maxEnergy;
    this.health = this.maxHealth;
    this.energy = this.maxEnergy;
    this.visiable = true;
  }
  // ...中間省略
  render(ctx, camera) {
    if (this.visiable) {
      this.animaMap[this.stat].render(
          ctx, camera, this.pos.x, this.pos.y, this.height, this.direction);
    }
    this.renderHitBox(ctx, camera);
  }
  // ...後面省略
}
```

修改 `Anima`

```js
export class Anima {
  constructor(src, length, speed) {
    this.step = 0;
    this.image = new Image();
    this.image.src = src;
    this.speed = speed;
    this.length = length;
  }
  render(ctx, camera, rawX, rawY, height, direction, rotate = 0) {
    const sWidth = (this.image.width / this.length);
    const scale = height / this.image.height
    const sx = Math.floor(this.step) * sWidth;

    const displayWidth = sWidth * scale;
    const displayHeight = height;

    const x = rawX - camera.pos.x;
    const y = rawY - camera.pos.y;

    ctx.save();
    ctx.scale(direction, 1);
    ctx.translate(
        (x - displayWidth / 2) * direction + displayWidth * direction * 0.5,
        y - displayHeight / 2 + displayHeight * 0.5)
    ctx.rotate(rotate);
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
        this.image, sx, 0, sWidth, this.image.height,
        displayWidth * direction * (-0.5), displayHeight * (-0.5),
        displayWidth * direction, displayHeight);

    ctx.restore();
    this.step += this.speed;
    this.step %= this.length;
  }
};
```

修改 `Bullet` 和 `Particle`：

```js
export class SmallFireBall extends Bullet {
  constructor(...args) {
    super(...args);
    this.animation = smallFireBallAnima;
  }
  render(ctx, camera) {
    this.animation.render(
        ctx, camera, this.pos.x, this.pos.y, 32, 1,
        Math.atan2(this.speed.y, this.speed.x) - Math.PI / 2);
  }
}
```

```js
export class Particle {
  constructor(x, y, anima, repeat = false) {
    this.pos = new Vector(x, y);
    this.anima = anima;
    this.height = undefined;
    this.repeat = repeat;
    this.end = false;
  }
  render(ctx, camera) {
    this.anima.render(ctx, camera, this.pos.x, this.pos.y, this.height, 1);
    if (!this.repeat && this.anima.step === 0) {
      this.end = true;
    }
  }
}
```

這時候，再幫 `EvilWizard` 添加轉向的功能：

```js
export class EvilWizard extends Sprite {
  // ...前面省略
  reface(useDest = false) {
    let facePos = undefined;
    if (useDest) {
      facePos = this.dest;
    } else {
      facePos = this.target.pos;
    }
    if (facePos.x > this.pos.x) {
      this.direction = 1;
    } else {
      this.direction = -1;
    }
  }
  runTo(x, y) {
    this.dest = new Vector(x, y);
    this.reface(true);   // <-- 添加這裡
    this.moveSpeed = 10;
    this.stat = "run";
  }
  // ...中間省略
  update() {
    if (this.remaining_animation_frame > 0) {
      this.remaining_animation_frame--;
      // 動畫執行中，在這邊放攻擊傷害判定
    } else if (this.remaining_animation_frame <= 0) {
      // 動作執行完畢，可以判斷接下來要執行什麼動作

      if (this.health < this.oldHealth) {
        this.play_animation_once("damaged");
        this.anger += Math.random();
      } else if (this.anger >= 1.5) {
        this.anger -= 1.5;
        this.runTo(this.target.pos.x, this.target.pos.y);
      } else if (this.stat == "run") {
        this.pos = this.pos.add(
          this.dest.add(this.pos.multiply(-1)).normal().multiply(this.moveSpeed)
        );
        if (this.dest.add(this.pos.multiply(-1)).length() < 20) {
          this.stat = "idle";
        }
      } else {
        this.reface();   // <-- 添加這裡
        this.stat = "idle";
        this.anger += 0.01 * Math.random();
      }
    }
    // this.speed = this.target.pos.add(this.pos.multiply(-1)).normal();
    this.oldHealth = this.health;
  }
}
```

現在他能夠轉向了！

![enemy reface](/pictures/enemy_reface.png)
