export function randomWeightChoose(weightMap) {
  const totalWeight =
      Object.values(weightMap).reduce((sum, weight) => sum + weight, 0);
  const randomValue = Math.random() * totalWeight;

  let currentWeight = 0;
  for (const [key, weight] of Object.entries(weightMap)) {
    currentWeight += weight;
    if (randomValue <= currentWeight) {
      return key;
    }
  }

  // This should not happen, but just in case
  return null;
}

export function randomDirection() {
  if (Math.random() > 0.5) {
    return 1;
  } else {
    return -1;
  }
}

export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }
  normal() {
    const length = this.length();
    if (length === 0) {
      return new Vector(0, 0);
    }
    return new Vector(this.x / length, this.y / length);
  }
  multiply(mul) {
    return new Vector(this.x * mul, this.y * mul);
  }
  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y)
  }
  copy() {
    return new Vector(this.x, this.y);
  }
  isIn(x, y, w, h) {
    return (x <= this.x && this.x <= x + w && y <= this.y && this.y <= y + h)
  }
}