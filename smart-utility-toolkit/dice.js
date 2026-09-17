const crypto = require("crypto");

function rollDice() {
  return crypto.randomInt(1, 7);
}

for (let i = 1; i <= 5; i++) {
  console.log(`Dice roll ${i}: ${rollDice()}`);
}