import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsername } from "../utils/auth";
import { getCustomerOrders } from "../utils/orderHistory";
import { getCustomerSubscription } from "../utils/subscription";
import "./CustomerAccount.css";

function CustomerAccount() {
  const navigate = useNavigate();
  const username = getUsername();
  const [activeTab, setActiveTab] = useState("subscription");

  const subscription = getCustomerSubscription(username);
  const orders = getCustomerOrders(username);

  const subscriptionDate = useMemo(() => {
    if (!subscription?.subscribedAt) return "-";
    return new Date(subscription.subscribedAt).toLocaleString();
  }, [subscription]);

  return (
    <div className="account-page">
      <div className="account-wrap">
        <div className="account-header">
          <h1>My Account</h1>
          <button onClick={() => navigate("/")} className="account-back">
            Back
          </button>
        </div>
        <p className="account-sub">Manage your plan and track your orders.</p>

        <div className="account-tabs">
          <button
            className={activeTab === "subscription" ? "active" : ""}
            onClick={() => setActiveTab("subscription")}
          >
            Subscription
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>

        {activeTab === "subscription" && (
          <section className="account-card">
            <h2>Current Plan</h2>
            {subscription ? (
              <div className="account-grid">
                <p>
                  <span>Customer</span>
                  <strong>{username}</strong>
                </p>
                <p>
                  <span>Plan</span>
                  <strong>{subscription.name}</strong>
                </p>
                <p>
                  <span>Status</span>
                  <strong>{subscription.status}</strong>
                </p>
                <p>
                  <span>Monthly Bill</span>
                  <strong>Rs {subscription.monthlyPrice}</strong>
                </p>
                <p>
                  <span>Delivery</span>
                  <strong>{subscription.quantity}</strong>
                </p>
                <p>
                  <span>Subscribed On</span>
                  <strong>{subscriptionDate}</strong>
                </p>
              </div>
            ) : (
              <p>No active plan. Subscribe from plans on the home page.</p>
            )}
          </section>
        )}

        {activeTab === "orders" && (
          <section className="account-card">
            <h2>Order History</h2>
            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <ul className="order-list">
                {orders.map((order) => (
                  <li key={order.orderNumber}>
                    <div>
                      <strong>{order.orderNumber}</strong>
                      <span>{order.orderDate}</span>
                    </div>
                    <strong>Rs {Number(order.totalBill).toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === "profile" && (
          <section className="account-card">
            <h2>Profile</h2>
            <p>
              Logged in as <strong>{username}</strong>.
            </p>
            <p>More profile settings can be added here.</p>
          </section>
        )}
      </div>
    </div>
  );
}

export default CustomerAccount;
