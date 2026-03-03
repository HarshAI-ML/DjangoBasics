import { useEffect, useState } from "react";
import { getProducts,createProduct } from "../services/productservice";
import "./Products.css";

function Products() {
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
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    is_available: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct(formData);
      fetchProducts(); // refresh
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category: "",
        is_available: true,
      });
    } catch (err) {
      setError("Failed to create product");
    }
  };

  return (
    <>
      <header className="hero-products">
        <div className="hero-content">
          <h1>Explore Our Dairy Selection</h1>
          <p>Fresh, reliable, and delivered daily. Find your favorites below.</p>
        </div>
      </header>
      <div className="products-container">
        <h1 className="title">Products</h1>

        <form className="product-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={formData.description}
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

          <input
            name="category"
            placeholder="Category"
            value={formData.category}
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

          <button type="submit">Add Product</button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
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
                  <p className="price">₹ {product.price}</p>
                  <p className="muted small">Stock: {product.stock_quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
}

export default Products;
