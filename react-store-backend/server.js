import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./services/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

// Конфігурація CORS
const allowedOrigins = process.env.CLIENT_ORIGINS
    ? process.env.CLIENT_ORIGINS.split(",")
    : [];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());

// Маршрути
app.use("/products", productRoutes);

// Підключення до бази та запуск
const dbURI = process.env.MONGO_URI;
connectDB(dbURI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});