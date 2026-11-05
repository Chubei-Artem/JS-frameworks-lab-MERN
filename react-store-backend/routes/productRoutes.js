import express from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import { validateProduct } from "../middleware/validate.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", validateProduct, createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;