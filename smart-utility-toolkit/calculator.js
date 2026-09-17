const [operation, first, second] = process.argv.slice(2);

const a = Number(first);
const b = Number(second);

if (!operation || Number.isNaN(a) || Number.isNaN(b)) {
  console.log("Usage: node calculator.js <add|sub|mul|div> <number> <number>");
} else {
  let result;

  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "sub":
      result = a - b;
      break;
    case "mul":
      result = a * b;
      break;
    case "div":
      result = b === 0 ? "Cannot divide by zero" : a / b;
      break;
    default:
      result = "Invalid operation. Use add, sub, mul, or div.";
  }

  console.log("Result:", result);
}