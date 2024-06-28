import {Vector} from '../utils.js';

export class Text {
  constructor(text, x, y, textAlign, color = '#eeeeee') {
    this.text = text;
    this.textAlign = textAlign;
    this.color = color;
    this.height = 32;
    this.font = `${this.height}px pixel font`;
    this.pos = new Vector(x, y);
    this.progress = 0.1;
    this.speed = 0.03;
  }
  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;
    const textArray = this.text.split('');
    const showArray =
        textArray.slice(0, Math.round(textArray.length * this.progress));
    for (let i = 0; i < Math.min(10, textArray.length - showArray.length);
         i++) {
      showArray.push(String.fromCharCode(Math.floor(Math.random() * 93 + 33)));
    }
    ctx.fillText(showArray.join(''), this.pos.x, this.pos.y + this.height);

    this.progress += this.speed;
    this.progress = Math.min(this.progress, 1);
  }
};
export class TextManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.padding = 16;
    this.textList = [];
    this.newTextY = (this.canvas.height - 48*4)/2;
  }
  addText(text, color) {
    const textObject =
        new Text(text, this.canvas.width / 2, this.newTextY, 'center', color);
    this.textList.push(textObject);
    this.newTextY += textObject.height;
    this.newTextY += this.padding;
    return textObject;
  }
  render(ctx) {
    this.textList.forEach(text => {
      text.render(ctx);
    });
  }
};

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
    this.visable = true
  }
  hide() {
    this.visable = false
  }
  render(ctx, canvas) {
    // render boss name
    if (!this.visable) {
      return;
    }
    ctx.beginPath();
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
    ctx.closePath();
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
    this.UIList.forEach(uiElement => {
      uiElement.render(ctx, canvas);
    })
  }
}