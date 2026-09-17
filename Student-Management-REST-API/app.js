const express = require("express");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

const PORT = 3000;

// Middleware to read JSON data from requests
app.use(express.json());

// Custom Logger middleware
app.use(logger);

// Student routes
app.use("/students", studentRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Student Management REST API is running"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});