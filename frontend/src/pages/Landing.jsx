import "./Landing.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Landing() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (
      credentials.email === "harshshinde@gmail.com" &&
      credentials.password === "password"
    ) {
      setIsAdmin(true);
      setShowModal(false);
      setError("");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="landing">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-inner">
            <h2 className="logo">Milkman 🥛</h2>
            <div className="nav-buttons">
              {isAdmin && (
                <>
                  <button
                    className="nav-btn"
                    onClick={() => navigate("/staff")}
                  >
                    Staff
                  </button>
                  <button
                    className="nav-btn"
                    onClick={() => navigate("/products")}
                  >
                    Products
                  </button>
                </>
              )}
              <button
                className="nav-btn"
                onClick={() => navigate("/shop")}
              >
                Shop
              </button>
              <button
                className="nav-btn primary"
                onClick={() => setShowModal(true)}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-text">
              <h1>Fresh Milk Delivered to Your Doorstep</h1>
              <p>
                Subscribe daily and get farm-fresh milk every morning. Pure.
                Hygienic. Reliable.
              </p>
              <button className="cta-btn">Subscribe Now</button>
            </div>
            <div className="hero-img">
              <img
                src="https://raghuvanshagro.com/products/cow-buffalo-milk.jpg"
                alt="Buffalo"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Milkman?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Farm Fresh</h3>
              <p>Sourced directly from trusted local dairies every morning.</p>
            </div>
            <div className="feature-card">
              <h3>On-Time Delivery</h3>
              <p>Reliable doorstep delivery so you never run out.</p>
            </div>
            <div className="feature-card">
              <h3>Flexible Plans</h3>
              <p>Pause, resume, or change quantities anytime.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing">
        <div className="container">
          <h2>Flexible Plans</h2>
          <div className="pricing-cards">
            <div className="price-card">
              <h3>Starter</h3>
              <p className="price">₹199/mo</p>
              <p>500ml daily</p>
            </div>
            <div className="price-card highlight">
              <h3>Standard</h3>
              <p className="price">₹349/mo</p>
              <p>1L daily</p>
            </div>
            <div className="price-card">
              <h3>Family</h3>
              <p className="price">₹599/mo</p>
              <p>2L daily</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© 2026 Milkman. All rights reserved.</p>
        </div>
      </footer>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Admin Login</h3>

            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value,
                })
              }
            />

            {error && <p className="error">{error}</p>}

            <div className="modal-buttons">
              <button onClick={handleLogin}>Login</button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
