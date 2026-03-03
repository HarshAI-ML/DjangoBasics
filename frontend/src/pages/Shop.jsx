import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/productservice";
import "./Products.css";
import "./Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);

  const getProductImage = (p) => {
    const key = (p.category || p.name || "").toLowerCase();
    if (key.includes("milk")) {
      return "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1200&auto=format&fit=crop";
    }
    if (key.includes("curd") || key.includes("yogurt")) {
      return "https://images.unsplash.com/photo-1541692641319-8bdc8040c013?q=80&w=1200&auto=format&fit=crop";
    }
    if (key.includes("cheese")) {
      return "https://images.unsplash.com/photo-1542902093-3151b7b0c035?q=80&w=1200&auto=format&fit=crop";
    }
    if (key.includes("butter") || key.includes("ghee")) {
      return "https://images.unsplash.com/photo-1615485737666-47adad9bc212?q=80&w=1200&auto=format&fit=crop";
    }
    return "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=1200&auto=format&fit=crop";
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (e) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increment = (id) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const decrement = (id) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, i) => sum + Number(i.price) * i.qty, 0);
    return { subtotal, items: cart.reduce((s, i) => s + i.qty, 0) };
  }, [cart]);

  return (
    <>
      <header className="hero-products">
        <div className="hero-content">
          <h1>Shop Fresh Dairy</h1>
          <p>Select products and add them to your cart.</p>
        </div>
      </header>

      <div className="shop-container">
        <div className="shop-grid">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-media">
                  <img
                    className="product-image"
                    src={getProductImage(product)}
                    alt={product.name}
                    loading="lazy"
                  />
                  <span
                    className={
                      "badge " + (product.is_available ? "available" : "unavailable")
                    }
                  >
                    {product.is_available ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="product-body">
                  <h3>{product.name}</h3>
                  <p className="muted">{product.category}</p>
                  <p className="description">{product.description}</p>
                  <div className="card-bottom">
                    <span className="price">₹ {product.price}</span>
                    <button
                      disabled={!product.is_available}
                      className="btn-add"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="cart">
          <div className="cart-header">
            <h2>Cart</h2>
            <span className="cart-count">{totals.items}</span>
          </div>
          {cart.length === 0 ? (
            <p className="muted">Your cart is empty</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="cart-info">
                      <strong>{item.name}</strong>
                      <span className="muted small">₹ {item.price}</span>
                    </div>
                    <div className="cart-actions">
                      <button onClick={() => decrement(item.id)}>-</button>
                      <span className="qty">{item.qty}</span>
                      <button onClick={() => increment(item.id)}>+</button>
                      <button className="remove" onClick={() => removeItem(item.id)}>
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-footer">
                <div className="totals">
                  <span>Subtotal</span>
                  <strong>₹ {totals.subtotal.toFixed(2)}</strong>
                </div>
                <button className="btn-clear" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}

export default Shop;
