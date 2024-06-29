import {randomWeightChoose} from '../utils.js';
export class Tileset {
  constructor(src, length, rawBlockSize, blockMap, rule) {
    this.rawBlockSize = rawBlockSize;
    this.rule = rule;
    this.length = length;
    this.blockMap = blockMap;

    this.image = new Image();
    this.image.src = src;
  }
  getRandomBlockId() {
    const blockType = randomWeightChoose(this.rule);
    const length = this.blockMap[blockType].length;
    return this.blockMap[blockType][Math.floor(length * Math.random())];
  }
  render(ctx, x, y, blockSize, blockId) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        this.image, blockId % this.length * this.rawBlockSize,
        Math.floor(blockId / this.length) * this.rawBlockSize,
        this.rawBlockSize, this.rawBlockSize, x, y, blockSize, blockSize);
  }
}

export class Map {
  constructor(size, tileset) {
    this.size = size;
    this.tileset = tileset;
    this.blockSize = 64;
    this.map = Array();
  }
  getBlockId(x, y) {
    return this.map[x + y * this.size]
  }
  init() {
    for (let i = 0; i < this.size * this.size; i++) {
      this.map.push(this.tileset.getRandomBlockId())
    }
  }
  render(ctx, canvas, camera) {
    const cols = Math.round(canvas.width / this.blockSize) + 3;
    const rows = Math.round(canvas.height / this.blockSize) + 4;
    const xOffset = Math.max(Math.floor(camera.pos.x / this.blockSize) - 1, 0);
    const yOffset = Math.max(Math.floor(camera.pos.y / this.blockSize) - 1, 0);
    for (let i = xOffset; i < cols + xOffset; i++) {
      for (let j = yOffset; j < rows + yOffset; j++) {
        const blockId = this.getBlockId(i, j);
        this.tileset.render(
            ctx, i * this.blockSize - camera.pos.x,
            j * this.blockSize - camera.pos.y, this.blockSize, blockId);
      }
    }
  }
}
