import { Product } from "../models/Product.js";

// GET /products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /products
export const createProduct = async (req, res) => {
    try {
        const stock = Number(req.body.stock) || 1;
        const status = stock > 0 ? "in_stock" : "out_of_stock";

        const product = new Product({
            ...req.body,
            stock,
            status,
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT /products/:id
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE /products/:id
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};