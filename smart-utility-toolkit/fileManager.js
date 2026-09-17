const fs = require("fs");

const fileName = "test.txt";

console.log("Creating file...");

fs.writeFile(fileName, "Hello Node.js\n", (err) => {
  if (err) {
    console.error("Create error:", err.message);
    return;
  }

  console.log("File created");

  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      console.error("Read error:", err.message);
      return;
    }

    console.log("File content:", data);

    fs.appendFile(fileName, "Learning FS Module\n", (err) => {
      if (err) {
        console.error("Update error:", err.message);
        return;
      }

      console.log("File updated");

      fs.readFile(fileName, "utf8", (err, updatedData) => {
        if (err) {
          console.error("Read error:", err.message);
          return;
        }

        console.log("Updated content:", updatedData);

        fs.unlink(fileName, (err) => {
          if (err) {
            console.error("Delete error:", err.message);
            return;
          }

          console.log("File deleted");
        });
      });
    });
  });
});