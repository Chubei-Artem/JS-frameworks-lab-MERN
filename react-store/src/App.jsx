import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import AddProductForm from './components/AddProductForm';
import ProductList from './components/ProductList';
import ProductDetailModal from './components/ProductDetailModal';

// Switch API URL depending on the environment (local dev vs production build)
const API_URL = import.meta.env.DEV
  ? 'http://localhost:5000/products'
  : (import.meta.env.VITE_API_URL || 'https://react-store-backend-lab5.onrender.com/products');

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Initialize cart state from browser localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('react_store_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Detect user system theme preference or retrieve stored preference
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('react_store_theme');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewedProduct, setViewedProduct] = useState(null);

  const categories = ['Peripherals', 'Displays', 'Audio'];

  // Persist selected theme in localStorage
  useEffect(() => {
    localStorage.setItem('react_store_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Synchronize theme with OS settings changes if not explicitly overridden
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e) => {
      const savedTheme = localStorage.getItem('react_store_theme');
      if (!savedTheme) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Persist cart items in localStorage
  useEffect(() => {
    localStorage.setItem('react_store_cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch initial product catalog from REST API (GET)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      setApiError("Не вдалося з'єднатися з REST API. Переконайтеся, що запущено Node.js server на порту 5000.");
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new product item (POST)
  const handleAddProduct = async (newProduct) => {
    try {
      setApiError(null);
      const res = await axios.post(API_URL, newProduct);
      setProducts((prev) => [...prev, res.data]);
    } catch (err) {
      setApiError('Помилка при створенні товару на сервері.');
      console.error('Error creating product:', err);
    }
  };

  // Update existing product details (PUT)
  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      setApiError(null);
      const res = await axios.put(`${API_URL}/${id}`, updatedProduct);
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? res.data : item))
      );
    } catch (err) {
      setApiError('Помилка при оновленні товару.');
      console.error('Error updating product:', err);
    }
  };

  // Delete product by identifier (DELETE)
  const handleDeleteProduct = async (id) => {
    try {
      setApiError(null);
      await axios.delete(`${API_URL}/${id}`);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      setCart((prev) => prev.filter((item) => item.id !== id));
      if (viewedProduct?.id === id) setViewedProduct(null);
    } catch (err) {
      setApiError('Помилка при видаленні товару.');
      console.error('Error deleting product:', err);
    }
  };

  // Add item to cart with unique client-side cart identifier
  const handleAddToCart = (product) => {
    const cartItem = {
      ...product,
      cartId: `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setCart((prev) => [...prev, cartItem]);
  };

  // Remove specific item instance from cart
  const handleRemoveFromCart = (cartIdToRemove) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartIdToRemove));
  };

  // Navigate to product detail view and track entity view counter
  const handleOpenProductDetail = async (product) => {
    setIsCartOpen(false);
    const updatedViews = (product.views || 0) + 1;

    // Strip transient UI properties before persisting entity updates
    const { cartId, openedFromCart: _ignore, ...cleanProduct } = product;
    const serverProduct = { ...cleanProduct, views: updatedViews };

    setViewedProduct({ ...serverProduct, openedFromCart: true });

    try {
      await axios.put(`${API_URL}/${product.id}`, serverProduct);
      setProducts((prev) =>
        prev.map((item) => (item.id === product.id ? serverProduct : item))
      );
    } catch (err) {
      console.error('Failed to increment view counter:', err);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className={`app-wrapper ${isDark ? 'dark-theme' : ''}`}>
      <div className="app-container">
        {/* Header navigation and global controls */}
        <header className="header">
          <h1>Fullstack Store Lab 5 MERN(MongoDB + Express + React + Node.js) </h1>

          <div className="header-actions">
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className="theme-toggle-btn"
            >
              {isDark ? '☀️ Світла' : '🌙 Темна'}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="cart-btn"
            >
              🛒 Кошик: {cart.length} шт. ({totalCartPrice} грн)
            </button>
          </div>
        </header>

        {/* Product creation form */}
        <AddProductForm onAddProduct={handleAddProduct} />

        {/* Product catalog section */}
        <div className="catalog-section">
          <div className="catalog-title">Каталог товарів</div>

          <div className="filter-box">
            <label><strong>Категорія:</strong></label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Всі категорії</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* API error alert indicator */}
          {apiError && (
            <div
              className="error-text"
              style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            >
              ⚠️ {apiError}
            </div>
          )}

          {/* Catalog grid renderer */}
          {loading ? (
            <p>Завантаження каталогу товарів...</p>
          ) : (
            <ProductList
              products={filteredProducts}
              onDelete={handleDeleteProduct}
              onUpdate={handleUpdateProduct}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>

        {/* Cart overlay modal */}
        {isCartOpen && (
          <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Ваш кошик 🛒</h3>
                <button className="close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
              </div>

              {cart.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Кошик наразі порожній.</p>
              ) : (
                <>
                  <div className="cart-items-list">
                    {cart.map((item) => (
                      <div key={item.cartId} className="cart-item">
                        <div
                          className="cart-item-clickable"
                          onClick={() => handleOpenProductDetail(item)}
                          title="Клікніть, щоб переглянути детальний опис"
                        >
                          <strong>{item.title} ↗</strong>
                          <div style={{ fontSize: '13px', color: 'var(--price-color)', fontWeight: 'bold' }}>
                            {item.price} грн
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            className="btn btn-view-item"
                            onClick={() => handleOpenProductDetail(item)}
                          >
                            Деталі
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => handleRemoveFromCart(item.cartId)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-total">
                    <span>Разом до сплати:</span>
                    <span style={{ color: 'var(--price-color)' }}>{totalCartPrice} грн</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn btn-delete"
                      style={{ flex: 1 }}
                      onClick={() => setCart([])}
                    >
                      Очистити
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => {
                        alert('Замовлення успішно оформлено!');
                        setCart([]);
                        setIsCartOpen(false);
                      }}
                    >
                      Оформити
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Detailed product overview modal */}
        {viewedProduct && (
          <ProductDetailModal
            product={viewedProduct}
            fromCart={Boolean(viewedProduct.openedFromCart)}
            onBackToCart={() => {
              setViewedProduct(null);
              setIsCartOpen(true);
            }}
            onClose={() => setViewedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
}

export default App;