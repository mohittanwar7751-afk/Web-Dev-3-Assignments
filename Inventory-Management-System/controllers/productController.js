const Product = require("../models/Product");

// Create a new product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            sku,
            category,
            price,
            quantity,
            reorderLevel,
            supplier
        } = req.body;

        const product = new Product({
            name,
            sku,
            category,
            price,
            quantity,
            reorderLevel,
            supplier
        });

        const savedProduct = await product.save();

        res.status(201).json({
            message: "Product created successfully",
            product: savedProduct
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "SKU already exists"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// Get all products with filtering, sorting and pagination
const getAllProducts = async (req, res) => {
    try {
        const {
            category,
            search,
            sortBy = "createdAt",
            order = "desc",
            page = 1,
            limit = 10
        } = req.query;

        // Filtering
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Sorting
        const sortOrder = order === "asc" ? 1 : -1;
        const sort = { [sortBy]: sortOrder };

        // Pagination
        const currentPage = Math.max(1, parseInt(page) || 1);
        const pageLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const skip = (currentPage - 1) * pageLimit;

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageLimit);

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            total,
            page: currentPage,
            totalPages: Math.ceil(total / pageLimit),
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: "SKU already exists"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            id: product._id
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



const adjustStock = async (req, res) => {
    try {
        const { change } = req.body;

        if (
            typeof change !== "number" ||
            !Number.isInteger(change) ||
            change === 0
        ) {
            return res.status(400).json({
                message: "Change must be a non-zero integer"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.quantity + change < 0) {
            return res.status(400).json({
                message: "Insufficient stock"
            });
        }

        product.quantity += change;

        await product.save();

        res.status(200).json({
            message: "Stock updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({
            $expr: {
                $lte: ["$quantity", "$reorderLevel"]
            }
        });

        res.status(200).json({
            message: "Low stock report generated successfully",
            totalLowStock: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



const getCategorySummary = async (req, res) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",

                    totalItems: {
                        $sum: 1
                    },

                    totalQuantity: {
                        $sum: "$quantity"
                    },

                    totalStockValue: {
                        $sum: {
                            $multiply: ["$price", "$quantity"]
                        }
                    },

                    avgPrice: {
                        $avg: "$price"
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        res.status(200).json({
            categories: summary.length,
            summary
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};




module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    adjustStock,
    getLowStockProducts,
    getCategorySummary
};
