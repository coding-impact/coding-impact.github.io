
# 讓子彈擊中敵人時流血

解決完子彈的問題，接下來就是繼續增加子彈的功能，為了達成流血特效，並且對擊中的實體造成傷害，判斷是否有碰撞是非常重要的功能，所以我們就來做他吧！

如果用直觀的方法去寫的話，會把檢測碰撞的任務交給子彈，因為子彈有可能可以擊中各式各樣的物體。

但在我們這個範例裡面，我們只有 `EvilWizard` 會受到子彈的傷害，所以就用最高效率的做法吧，我們讓 `EvilWizard` 自己檢查有沒有子彈撞到自己：

```js
export class EvilWizard extends Sprite {
  checkCollision(entityManager) {
    if (!this.visiable) {
      return;
    }
    entityManager.entityList.forEach((entity) => {
      // is Bullet
      if (entity.type === "Bullet") {
        // have collision
        if (
          this.pos.x - this.boxW / 2 + this.boxOffsetX < entity.pos.x &&
          entity.pos.x < this.pos.x + this.boxW / 2 + this.boxOffsetX &&
          this.pos.y - this.boxH / 2 + this.boxOffsetY < entity.pos.y &&
          entity.pos.y < this.pos.y + this.boxH / 2 + this.boxOffsetY
        ) {
          entity.power /= 2;
          this.damage(entity.power);
        }
      }
    });
  }
}
```

並且在 `Sprite` 添加傷害函式：

```js
export class Sprite extends Entity {
  // ...前面省略
  damage(amount) {
    this.health -= amount;
  }
}
```

1. 當自己隱形時，無法被擊中
2. 對於每個實體
   1. 檢查他是不是子彈
   2. 檢查有沒有碰到
   3. 讓自己受傷

最後記得在 `EntityManager.update` 添加檢查碰撞：

```js
export class EntityManager {
  // ...前面省略
  update() {
    this.entityList.forEach((entity) => {
      if (typeof entity.update === "function") {
        entity.update();
      }
    });
    this.entityList.forEach((entity) => {
      if (typeof entity.checkCollision === "function") {
        entity.checkCollision(this);
      }
    });
  }
  // ...後面省略
}
```

這時候可以回到網頁看看

![boss damaged](/pictures/boss_damaged.png)

敵人受傷了！

## 製作流血特效

但只有血條的跳動，顯然回饋感不夠強，所以這時候，就必須加入流血的特效。

回到 `entity.js`，我們來設計一個粒子的類別吧！

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
    this.anima.render(ctx, camera, this.pos.x, this.pos.y, this.height);
    if (!this.repeat && this.anima.step === 0) {
      this.end = true;
    }
  }
}
```

看起來真是棒呆啦！與之前製作的許多類別一樣，這個一樣會被當成抽象類來使用

現在讓我們回到 `enemy.js`，添加流血特效：

```js
import { Anima } from "./anima.js";
import { Particle, Sprite } from "./entity.js";

class BloodParticle extends Particle {
  constructor(x, y) {
    super(x, y);
    this.anima = new Anima("assets/particle/blood.png", 22, 1);
    this.height = 100;
  }
}
```

```js
export class EvilWizard extends Sprite {
  // ...前面省略
  checkCollision(entityManager) {
    if (!this.visiable) {
      return;
    }
    entityManager.entityList.forEach((entity) => {
      // is Bullet
      if (entity.type === "Bullet") {
        // have collision
        if (
          this.pos.x - this.boxW / 2 + this.boxOffsetX < entity.pos.x &&
          entity.pos.x < this.pos.x + this.boxW / 2 + this.boxOffsetX &&
          this.pos.y - this.boxH / 2 + this.boxOffsetY < entity.pos.y &&
          entity.pos.y < this.pos.y + this.boxH / 2 + this.boxOffsetY
        ) {
          entity.power /= 2;
          entityManager.add(new BloodParticle(entity.pos.x, entity.pos.y));
          this.damage(entity.power);
        }
      }
    });
  }
  // ...後面省略
}
```

並且最後，記得在 `EntityManager` 移除播放完畢的粒子效果。

```js
export class EntityManager {
  // ...前面省略
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

    this.entityList = this.entityList.filter((entity) => {
      if (entity.hasOwnProperty("end")) {
        if (entity.end) {
          // 用於已結束的 particle
          return false;
        }
      }
      return true;
    });

    this.entityList.forEach((entity) => {
      entity.render(ctx, camera);
    });
  }
}
```

一切都做完後，可以回到網頁上測試看看，應該能看見有流血特效

![enemy bleed](/pictures/enemy_bleed.png)
