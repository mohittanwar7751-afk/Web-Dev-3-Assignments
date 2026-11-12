require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

// Middleware
app.use(express.json());
app.use("/api/products", productRoutes);

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Inventory Management API is running!"
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: "API route not found"
    });
});

// Centralized error handler
app.use(errorHandler);



// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected successfully!");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
