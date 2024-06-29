export const config = {
  showHitBox: false,
  runToError: 40,

  enemyHitBoxMap: {
    attack1: [
      150, 150, 150, -40, 1, 5, 1
    ],  // boxW, boxH, boxOffsetX, boxOffsetY, end remain frame, start remain
        // frame, damage
    attack2: [180, 270, 150, -60, 0, 4, 2],
  }
}
