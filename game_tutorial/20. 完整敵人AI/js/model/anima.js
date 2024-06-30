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