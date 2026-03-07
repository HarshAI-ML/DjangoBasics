import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, createProduct } from "../services/productservice";
import "./Products.css";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    is_available: true,
    image: null,
  });
  const formRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

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

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files?.[0] ?? null
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("category", formData.category);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("stock_quantity", formData.stock_quantity);
    payload.append("is_available", formData.is_available);
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      await createProduct(payload);
      await fetchProducts();
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category: "",
        is_available: true,
        image: null,
      });
      formRef.current?.reset();
      setError("");
      setSubmitStatus("Product created successfully.");
    } catch (err) {
      setError("Failed to create product");
    }
  };

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const keyword = search.toLowerCase();
    return products.filter((product) =>
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [products, search]);

  const stats = useMemo(() => {
    const inStock = products.filter((p) => p.is_available).length;
    const totalValue = products.reduce(
      (sum, p) => sum + Number(p.price || 0) * Number(p.stock_quantity || 0),
      0
    );
    return {
      total: products.length,
      inStock,
      outOfStock: products.length - inStock,
      totalValue,
    };
  }, [products]);

  return (
    <div className="products-page">
      <header className="products-topbar">
        <div className="shell products-topbar-inner">
          <button className="brand-btn" onClick={() => navigate("/")}>
            Milkman Admin
          </button>
          <button className="back-btn" onClick={() => navigate("/")}>
            Back to Landing
          </button>
        </div>
      </header>

      <section className="products-hero shell">
        <h1>Product Management</h1>
        <p>
          Add, review, and track dairy products from one clean dashboard.
        </p>
        <div className="stat-row">
          <div className="stat-card">
            <span>Total Products</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card">
            <span>In Stock</span>
            <strong>{stats.inStock}</strong>
          </div>
          <div className="stat-card">
            <span>Out of Stock</span>
            <strong>{stats.outOfStock}</strong>
          </div>
          <div className="stat-card">
            <span>Inventory Value</span>
            <strong>Rs {stats.totalValue.toFixed(2)}</strong>
          </div>
        </div>
      </section>

      <main className="shell products-layout">
        <section className="panel form-panel">
          <h2>Add New Product</h2>
          <form ref={formRef} className="product-form" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <label htmlFor="product-image">Image to show (optional)</label>
            <input
              id="product-image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
            <input
              type="number"
              step="0.01"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="stock_quantity"
              placeholder="Stock Quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              required
            />
            <label className="checkbox">
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
              />
              Available
            </label>
            <button type="submit">Create Product</button>
          </form>
          {submitStatus && <p className="success">{submitStatus}</p>}
        </section>

        <section className="panel list-panel">
          <div className="list-head">
            <h2>Current Products</h2>
            <input
              className="search-input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="status">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="status">No products found.</p>
          ) : (
            <div className="products-grid">
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
                    <p className="price">Rs {product.price}</p>
                    <p className="muted small">Stock: {product.stock_quantity}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {error && <p className="error shell">{error}</p>}
    </div>
  );
}

export default Products;
