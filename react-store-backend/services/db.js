import mongoose from "mongoose";

export const connectDB = async (mongoURI) => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
};
