import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters long"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price must be greater than or equal to 0"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        stock: {
            type: Number,
            default: 1,
            min: 0,
        },
        imageUrl: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        },
        description: {
            type: String,
            default: "Опис товару відсутній.",
        },
        createdAt: {
            type: String,
            default: () => new Date().toISOString().split("T")[0],
        },
        views: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["in_stock", "out_of_stock"],
            default: "in_stock",
        },
    },
    {
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id.toString();
                delete ret._id;
            },
        },
    },
);

export const Product = mongoose.model("Product", productSchema);
