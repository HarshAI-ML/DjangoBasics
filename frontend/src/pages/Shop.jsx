import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productservice";
import { isAdmin } from "../utils/auth";
import "./Shop.css";

function Shop() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const adminMode = isAdmin();

  const getProductImage = (p) => {
    if (p.image) {
      return p.image;
    }
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

  useEffect(() => {
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
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(products.map((p) => (p.category || "Others").trim()))
    ).filter(Boolean);
    return ["All", ...values];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== "All") {
      list = list.filter((p) => (p.category || "Others") === activeCategory);
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();
      list = list.filter((p) =>
        `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(keyword)
      );
    }

    if (sortBy === "priceAsc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "priceDesc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "nameAsc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => Number(b.is_available) - Number(a.is_available));
    }

    return list;
  }, [products, activeCategory, search, sortBy]);

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
  const proceedToCheckout = () => {
    if (!cart.length) return;
    navigate("/checkout", { state: { cart } });
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, i) => sum + Number(i.price) * i.qty, 0);
    const delivery = subtotal > 0 ? 20 : 0;
    return {
      subtotal,
      delivery,
      total: subtotal + delivery,
      items: cart.reduce((s, i) => s + i.qty, 0),
    };
  }, [cart]);

  const availableCount = products.filter((item) => item.is_available).length;

  return (
    <div className="shop-page">
      <header className="shop-topbar">
        <div className="shell topbar-inner">
          <button className="brand" onClick={() => navigate("/")}>
            Milkman
          </button>
          <div className="topbar-actions">
            <button className="link-btn" onClick={() => navigate("/")}>
              Home
            </button>
            {adminMode && (
              <button className="link-btn" onClick={() => navigate("/products")}>
                Products
              </button>
            )}
            <button className="cart-pill">Cart {totals.items}</button>
          </div>
        </div>
      </header>

      <section className="shop-hero">
        <div className="shell hero-inner">
          <div>
            <p className="kicker">Daily essentials storefront</p>
            <h1>Fresh dairy products, delivered fast</h1>
            <p className="hero-sub">
              Real-time availability, clear pricing, and a smooth cart experience.
            </p>
            <div className="trust-row">
              <span>{products.length} total products</span>
              <span>{availableCount} in stock</span>
              <span>Delivery in 30 mins</span>
            </div>
          </div>
        </div>
      </section>

      <main className="shell shop-layout">
        <section className="catalog">
          <div className="controls">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search milk, cheese, curd..."
              className="search"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort"
            >
              <option value="featured">Featured</option>
              <option value="nameAsc">Name A-Z</option>
              <option value="priceAsc">Price Low-High</option>
              <option value="priceDesc">Price High-Low</option>
            </select>
          </div>

          <div className="chip-row">
            {categories.map((category) => (
              <button
                key={category}
                className={category === activeCategory ? "chip active" : "chip"}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="shop-status">Loading products...</p>
          ) : error ? (
            <p className="shop-status error">{error}</p>
          ) : filteredProducts.length === 0 ? (
            <p className="shop-status">No products match your filters.</p>
          ) : (
            <div className="shop-grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-media">
                    <img
                      className="product-image"
                      src={getProductImage(product)}
                      alt={product.name}
                      loading="lazy"
                    />
                    <span
                      className={
                        product.is_available ? "badge available" : "badge unavailable"
                      }
                    >
                      {product.is_available ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="product-body">
                    <p className="category">{product.category || "Others"}</p>
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                    <div className="card-bottom">
                      <span className="price">Rs {product.price}</span>
                      <button
                        disabled={!product.is_available}
                        className="btn-add"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="cart">
          <div className="cart-header">
            <h2>Your Cart</h2>
            <span className="cart-count">{totals.items}</span>
          </div>
          {cart.length === 0 ? (
            <p className="empty-note">Your cart is empty</p>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="cart-info">
                      <strong>{item.name}</strong>
                      <span>Rs {item.price}</span>
                    </div>
                    <div className="cart-actions">
                      <button onClick={() => decrement(item.id)}>-</button>
                      <span className="qty">{item.qty}</span>
                      <button onClick={() => increment(item.id)}>+</button>
                      <button className="remove" onClick={() => removeItem(item.id)}>
                        x
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-footer">
                <div className="totals">
                  <span>Subtotal</span>
                  <strong>Rs {totals.subtotal.toFixed(2)}</strong>
                </div>
                <div className="totals">
                  <span>Delivery</span>
                  <strong>Rs {totals.delivery.toFixed(2)}</strong>
                </div>
                <div className="totals grand">
                  <span>Total</span>
                  <strong>Rs {totals.total.toFixed(2)}</strong>
                </div>
                <button className="btn-clear" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="btn-checkout" onClick={proceedToCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

export default Shop;
