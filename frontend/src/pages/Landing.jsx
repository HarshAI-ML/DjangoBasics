import "./Landing.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getRole, getUsername, isAdmin, logout } from "../utils/auth";
import {
  AVAILABLE_PLANS,
  getCustomerSubscription,
  subscribeCustomerToPlan,
} from "../utils/subscription";

function Landing() {
  const navigate = useNavigate();
  const [role, setRole] = useState(() => getRole());
  const [username] = useState(() => getUsername());
  const [subscription, setSubscription] = useState(() =>
    getCustomerSubscription(getUsername())
  );
  const [message, setMessage] = useState("");

  const adminMode = isAdmin();
  const isCustomer = role === "customer";

  const handleExplorePlans = () => {
    document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
  };
  const handleMyPlan = () => navigate("/account");

  const handleLogout = () => {
    logout();
    setRole(null);
    setSubscription(null);
    setMessage("");
  };

  const handleSubscribe = (planId) => {
    if (!isCustomer) {
      navigate("/login");
      return;
    }

    const updated = subscribeCustomerToPlan(username, planId);
    if (!updated) return;
    setSubscription(updated);
    setMessage(`You are now subscribed to ${updated.name} plan.`);
  };

  return (
    <div className="landing">
      <header className="topbar">
        <div className="container">
          <div className="topbar-inner">
            <h2 className="logo">Milkman</h2>
            {role ? (
              <button className="admin-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="admin-btn" onClick={() => navigate("/login")}>
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <nav className="navbar">
        <div className="container">
          <div className="navbar-inner">
            <div className="nav-buttons">
              <button className="nav-btn" onClick={() => navigate("/shop")}>
                Shop
              </button>
              <button className="nav-btn" onClick={handleExplorePlans}>
                Plans
              </button>
              {isCustomer && (
                <button className="nav-btn" onClick={handleMyPlan}>
                  My Account
                </button>
              )}
              {adminMode && (
                <>
                  <button className="nav-btn" onClick={() => navigate("/staff")}>
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
            </div>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-text">
              <p className="eyebrow">Fresh dairy, every morning</p>
              <h1>Fresh Milk Delivered to Your Doorstep</h1>
              <p>
                Subscribe daily and get farm-fresh milk every morning. Pure.
                Hygienic. Reliable.
              </p>
              <div className="hero-actions">
                <button className="cta-btn" onClick={() => navigate("/shop")}>
                  Subscribe Now
                </button>
                <button className="ghost-btn" onClick={handleExplorePlans}>
                  View Plans
                </button>
              </div>
              <div className="hero-stats">
                <span>1200+ homes served</span>
                <span>4.9/5 customer rating</span>
              </div>
            </div>
            <div className="hero-img">
              <img
                src="https://raghuvanshagro.com/products/cow-buffalo-milk.jpg"
                alt="Fresh milk"
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

      <section className="pricing" id="plans">
        <div className="container">
          <h2>Flexible Plans</h2>
          <div className="pricing-cards">
            {AVAILABLE_PLANS.map((plan) => {
              const isCurrentPlan = subscription?.id === plan.id;
              return (
                <div
                  key={plan.id}
                  className={isCurrentPlan ? "price-card highlight" : "price-card"}
                >
                  <h3>{plan.name}</h3>
                  <p className="price">Rs {plan.monthlyPrice}/mo</p>
                  <p>{plan.quantity}</p>
                  <button
                    className={isCurrentPlan ? "plan-btn current" : "plan-btn"}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {isCurrentPlan ? "Current Plan" : "Subscribe"}
                  </button>
                </div>
              );
            })}
          </div>
          {!isCustomer && (
            <p className="plan-note">Login as customer to subscribe to a plan.</p>
          )}
          {isCustomer && message && <p className="plan-note success">{message}</p>}
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>Copyright 2026 Milkman. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
