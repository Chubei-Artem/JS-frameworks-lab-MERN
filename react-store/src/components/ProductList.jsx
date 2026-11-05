import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products, onDelete, onUpdate, onAddToCart }) {
    if (products.length === 0) {
        return <p className="empty-text">Товарів у цій категорії не знайдено.</p>;
    }

    // Update cursor coordinate variables for radial glow effect
    const handleMouseMove = (e) => {
        const grid = e.currentTarget;
        const cards = grid.getElementsByClassName('glow-card');
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    };

    return (
        <div className="products-grid" onMouseMove={handleMouseMove}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}

export default ProductList;