import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUsername } from "../utils/auth";
import { getCustomerOrders } from "../utils/orderHistory";
import "./OrderSummary.css";

function OrderSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = getUsername();
  const latestOrder = useMemo(() => getCustomerOrders(username)[0] || null, [username]);
  const order = location.state?.order || latestOrder;
  const cart = order?.items || [];
  const totalBill = Number(order?.totalBill || 0);

  if (!cart.length) {
    return (
      <div className="summary-page">
        <div className="summary-card">
          <h1>No order found</h1>
          <p>Please complete checkout first.</p>
          <button className="summary-btn" onClick={() => navigate("/shop")}>
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-page">
      <div className="summary-card">
        <h1>Order Summary</h1>
        <p className="summary-sub">Your payment was confirmed successfully.</p>

        <div className="summary-grid">
          <p>
            <span>Customer Username</span>
            <strong>{order.customerUsername || username}</strong>
          </p>
          <p>
            <span>Order Number</span>
            <strong>{order.orderNumber}</strong>
          </p>
          <p>
            <span>Total Bill</span>
            <strong>Rs {totalBill.toFixed(2)}</strong>
          </p>
          <p>
            <span>Order Date</span>
            <strong>{order.orderDate}</strong>
          </p>
        </div>

        <h2>Items</h2>
        <ul className="summary-list">
          {cart.map((item) => (
            <li key={item.id}>
              <span>
                {item.name} x {item.qty}
              </span>
              <strong>Rs {(Number(item.price) * item.qty).toFixed(2)}</strong>
            </li>
          ))}
        </ul>

        <button className="summary-btn" onClick={() => navigate("/shop")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSummary;
