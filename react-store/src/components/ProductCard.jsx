import React, { useState, useRef, useEffect } from 'react';

function ProductCard({ product, onDelete, onUpdate, onAddToCart }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(product.title);
    const [editPrice, setEditPrice] = useState(product.price);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);

    const descRef = useRef(null);

    // Evaluate text overflowing across available lines
    useEffect(() => {
        const el = descRef.current;
        if (el) {
            setIsClamped(el.scrollHeight > el.clientHeight);
        }
    }, [product.description]);

    const handleSave = () => {
        if (!editTitle.trim() || editTitle.trim().length < 3) {
            alert("Назва має містити щонайменше 3 символи");
            return;
        }
        if (!editPrice || Number(editPrice) <= 0) {
            alert("Ціна має бути більшою за 0");
            return;
        }

        onUpdate(product.id, {
            ...product,
            title: editTitle.trim(),
            price: Number(editPrice)
        });
        setIsEditing(false);
    };

    return (
        <div className="product-card glow-card">
            {/* Dynamic radial glow highlight border */}
            <div className="glow-border"></div>

            {product.imageUrl && (
                <img src={product.imageUrl} alt={product.title} className="product-image" />
            )}

            <div className="product-info">
                {isEditing ? (
                    <div className="edit-box">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Назва"
                        />
                        <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            placeholder="Ціна"
                        />
                        <div className="card-actions">
                            <button onClick={handleSave} className="btn btn-save">Зберегти</button>
                            <button onClick={() => setIsEditing(false)} className="btn btn-cancel">Скасувати</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h4 className="product-title">{product.title}</h4>
                        <p className="product-price">{product.price} грн</p>
                        <div className="product-meta">
                            <span className="badge">{product.category}</span>
                            <small>В наявності: {product.stock} шт.</small>
                        </div>

                        {/* Description clamped container */}
                        <div className="desc-container">
                            <p
                                ref={descRef}
                                className={`product-desc ${isExpanded ? 'expanded' : 'clamped'}`}
                            >
                                {product.description || 'Опис товару відсутній.'}
                            </p>

                            {/* Show toggle button only when text is genuinely clamped */}
                            {(isClamped || isExpanded) && (
                                <button
                                    type="button"
                                    className="btn-toggle-desc"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    {isExpanded ? 'Згорнути ▲' : 'Читати більше ▼'}
                                </button>
                            )}
                        </div>

                        <div className="card-actions">
                            <button onClick={() => onAddToCart(product)} className="btn btn-cart">
                                В кошик 🛒
                            </button>
                            <button onClick={() => setIsEditing(true)} className="btn btn-edit">
                                Редагувати
                            </button>
                            <button onClick={() => onDelete(product.id)} className="btn btn-delete">
                                Видалити
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductCard;