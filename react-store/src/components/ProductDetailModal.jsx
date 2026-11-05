import React from 'react';

function ProductDetailModal({ product, onClose, onAddToCart, fromCart, onBackToCart }) {
    if (!product) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Деталі товару</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="detail-content">
                    {product.imageUrl && (
                        <img src={product.imageUrl} alt={product.title} className="detail-image" />
                    )}

                    <div className="detail-body">
                        <h2>{product.title}</h2>
                        <div className="detail-meta">
                            <span className="badge">{product.category}</span>
                            <span className="stock-info">В наявності: <strong>{product.stock}</strong> шт.</span>
                        </div>

                        <p className="detail-price">{product.price} грн</p>

                        <div className="detail-desc-box">
                            <strong>Повний опис та характеристики:</strong>
                            <p>{product.description || 'Опис товару відсутній.'}</p>
                        </div>

                        <div className="detail-actions">
                            {fromCart ? (
                                <button className="btn btn-cart" onClick={onBackToCart}>
                                    ← Повернутися до кошика 🛒
                                </button>
                            ) : (
                                <button
                                    className="btn btn-cart"
                                    onClick={() => {
                                        onAddToCart(product);
                                        onClose();
                                    }}
                                >
                                    Додати в кошик 🛒
                                </button>
                            )}
                            <button className="btn btn-cancel" onClick={onClose}>
                                До каталогу
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailModal;