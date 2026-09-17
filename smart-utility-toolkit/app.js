const isEven = require("./modules/isEven");

const number = 10;

if (isEven(number)) {
  console.log(number + " is even");
} else {
  console.log(number + " is odd");
}