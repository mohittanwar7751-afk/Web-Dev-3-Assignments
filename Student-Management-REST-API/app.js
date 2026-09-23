const express = require("express");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Middleware to read JSON data from requests
app.use(express.json());

// Custom Logger middleware
app.use(logger);

// Student routes
app.use("/students", studentRoutes);

// Test route
app.get("/", (req, res) => {
    res.status(200).send("Student Management REST API");
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});