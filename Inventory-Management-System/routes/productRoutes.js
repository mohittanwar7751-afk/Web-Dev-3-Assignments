
const express = require("express");
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    adjustStock,
    getLowStockProducts,
    getCategorySummary
} = require("../controllers/productController");

const validateProduct = require("../middleware/validateProduct");

// POST - Create Product
router.post("/", validateProduct, createProduct);

// GET - Get All Products
router.get("/", getAllProducts);

// GET - Low Stock Report
router.get("/reports/low-stock", getLowStockProducts);

// GET - Category Summary Report
router.get("/summary", getCategorySummary);

// GET - Get Product by ID
router.get("/:id", getProductById);

// PUT - Update Product
router.put("/:id", validateProduct, updateProduct);

// DELETE - Delete Product
router.delete("/:id", deleteProduct);

// PATCH - Adjust Stock
router.patch("/:id/stock", adjustStock);






module.exports = router;
