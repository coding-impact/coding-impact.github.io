class UI {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
export class BossBar extends UI {
  constructor(target) {
    super(0, 0);
    this.target = target;
    this.title = 'Evil Wizard';
    this.visable = false;
    this.font = 'bold 24px pixel font';
    this.color = 'white';
    this.padding = 4;
    this.barLength = 300;
    this.barHeight = 4;
  }
  show() {
    this.visable = true;
  }
  hide() {
    this.visable = false;
  }
  render(ctx, canvas) {
    // render boss name
    if (!this.visable) {
      return;
    }
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.textAlign = 'center';
    ctx.fillText(this.title, canvas.width / 2, 32);

    // render health bar
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(
        (canvas.width - this.barLength) / 2, 40 + this.padding,
        Math.max(
            this.barLength * (this.target.health / this.target.maxHealth), 0),
        this.barHeight);
    ctx.strokeStyle = '#121212';
    ctx.rect(
        (canvas.width - this.barLength) / 2, 40 + this.padding, this.barLength,
        this.barHeight);
    ctx.stroke();
  }
}
export class UIManager {
  constructor() {
    this.UIList = [];
  }
  addUI(ui) {
    this.UIList.push(ui);
  }
  render(ctx, canvas) {
    this.UIList.forEach((uiElement) => {
      uiElement.render(ctx, canvas);
    });
  }
}