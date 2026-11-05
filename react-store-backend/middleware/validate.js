export const validateProduct = (req, res, next) => {
    const { title, price, category } = req.body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
        return res.status(400).json({
            message: "Invalid product title. Minimum 3 characters required.",
        });
    }

    if (price === undefined || typeof price !== "number" || price <= 0) {
        return res.status(400).json({
            message: "Invalid product price. Must be a positive number.",
        });
    }

    if (!category || typeof category !== "string") {
        return res.status(400).json({
            message: "Category is required.",
        });
    }

    next();
};
