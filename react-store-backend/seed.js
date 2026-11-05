import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Product } from "./models/Product.js";

dotenv.config();
// Function to seed the database from db.json
const seedFromDbJson = async () => {
    try {
        // read db.json
        const rawData = fs.readFileSync("./db.json", "utf8");
        const parsedData = JSON.parse(rawData);

        // check if the parsed data has a "products" property, otherwise use the parsed data directly
        const items = parsedData.products || parsedData;

        // prepare the products for insertion into the database
        const preparedProducts = items.map((item) => {
            const { id, _id, ...cleanItem } = item;
            return {
                ...cleanItem,
                stock: Number(cleanItem.stock) || 1,
                price: Number(cleanItem.price) || 0,
                views: Number(cleanItem.views) || 0,
                status: Number(cleanItem.stock) > 0 ? "in_stock" : "out_of_stock",
                createdAt: cleanItem.createdAt || new Date().toISOString().split("T")[0],
            };
        });

        // connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Підключено до MongoDB Atlas...");

        // clear existing products and insert the new ones
        await Product.deleteMany({});
        const inserted = await Product.insertMany(preparedProducts);

        console.log(`Успіх! Перенесено товарів: ${inserted.length}`);
        process.exit(0);
    } catch (err) {
        console.error("Помилка імпорту даних:", err);
        process.exit(1);
    }
};

seedFromDbJson();