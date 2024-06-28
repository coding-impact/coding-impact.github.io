import {Vector} from '../utils.js';

export class Cursor {
  constructor() {
    this.pos = new Vector(0, 0);
    this.cursorShow = false;
  }
  moveTo(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }
  show() {
    this.cursorShow = true;
  }
  hide() {
    this.cursorShow = false;
  }
  render(ctx) {
    if (this.cursorShow === true) {
      ctx.beginPath();
      ctx.fillStyle = '#121212';
      ctx.arc(this.pos.x, this.pos.y, 2, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.closePath();  
    }
    
  }
}