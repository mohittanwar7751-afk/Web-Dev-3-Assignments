
const validateProduct = (req, res, next) => {
    const {
        name,
        sku,
        category,
        price,
        quantity,
        reorderLevel,
        supplier
    } = req.body;

    const errors = [];

    if (req.method === "POST") {
        if (!name) errors.push("Name is required");
        if (!sku) errors.push("SKU is required");
        if (!category) errors.push("Category is required");
        if (price === undefined) errors.push("Price is required");
        if (quantity === undefined) errors.push("Quantity is required");
        if (!supplier) errors.push("Supplier is required");
    }

    if (price !== undefined && (typeof price !== "number" || price < 0)) {
        errors.push("Price must be a non-negative number");
    }

    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
        errors.push("Quantity must be a non-negative integer");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: "Validation failed",
            errors
        });
    }

    next();
};

module.exports = validateProduct;
