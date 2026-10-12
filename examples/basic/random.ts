declare const Utils: {
  randomInt(min: number, max: number): number;
};

const roll = Utils.randomInt(1, 6);
if (roll < 1 || roll > 6) {
  throw new Error('The generated value is outside the requested range.');
}
