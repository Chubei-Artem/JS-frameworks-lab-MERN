import React, { useState } from "react";

function AddProductForm({ onAddProduct }) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("5");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const categories = ["Peripherals", "Displays", "Audio"];

    const handleSubmit = (e) => {
        e.preventDefault();

        // Client-side input validation rules
        if (!title.trim() || title.trim().length < 3) {
            setError("Назва обов'язкова і має містити від 3 символів");
            return;
        }
        if (!price || Number(price) <= 0) {
            setError("Ціна має бути більшою за 0");
            return;
        }
        if (!category) {
            setError("Оберіть категорію");
            return;
        }

        const newProduct = {
            title: title.trim(),
            price: Number(price),
            category,
            stock: Number(stock) || 1,
            imageUrl:
                imageUrl.trim() ||
                "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
            description: description.trim() || "Опис товару відсутній.",
            createdAt: new Date().toISOString().split("T")[0],
            views: 0,
            status: Number(stock) > 0 ? "in_stock" : "out_of_stock"
        };

        onAddProduct(newProduct);

        // Reset input fields
        setTitle("");
        setPrice("");
        setCategory("");
        setStock("5");
        setImageUrl("");
        setDescription("");
        setError("");
    };

    return (
        <div className="form-container">
            <h3>Додати новий товар</h3>
            {error && <p className="error-text">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Назва товару"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-row">
                    <input
                        type="number"
                        placeholder="Ціна (грн)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Оберіть категорію</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Кількість на складі"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Посилання на картинку (URL)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <textarea
                        placeholder="Короткий опис товару..."
                        rows="2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Створити товар
                </button>
            </form>
        </div>
    );
}

export default AddProductForm;