import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUsername } from "../utils/auth";
import { addCustomerOrder } from "../utils/orderHistory";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];
  const username = getUsername();

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
    const delivery = subtotal > 0 ? 20 : 0;
    return {
      subtotal,
      delivery,
      total: subtotal + delivery,
      items: cart.reduce((sum, item) => sum + item.qty, 0),
    };
  }, [cart]);

  const handleConfirmPayment = () => {
    if (!cart.length) return;
    const order = {
      customerUsername: username,
      orderNumber: `ORD-${Date.now()}`,
      orderDate: new Date().toLocaleString(),
      totalBill: totals.total,
      items: cart,
    };
    addCustomerOrder(username, order);
    navigate("/order-summary", {
      state: { order },
    });
  };

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <h1>Checkout</h1>
        {cart.length === 0 ? (
          <>
            <p>Your cart is empty. Add products before checkout.</p>
            <button className="checkout-btn secondary" onClick={() => navigate("/shop")}>
              Back to Shop
            </button>
          </>
        ) : (
          <>
            <p className="checkout-sub">Review your order details before payment.</p>
            <ul className="checkout-list">
              {cart.map((item) => (
                <li key={item.id} className="checkout-item">
                  <span>
                    {item.name} x {item.qty}
                  </span>
                  <strong>Rs {(Number(item.price) * item.qty).toFixed(2)}</strong>
                </li>
              ))}
            </ul>

            <div className="checkout-total">
              <p>
                <span>Items</span>
                <strong>{totals.items}</strong>
              </p>
              <p>
                <span>Subtotal</span>
                <strong>Rs {totals.subtotal.toFixed(2)}</strong>
              </p>
              <p>
                <span>Delivery</span>
                <strong>Rs {totals.delivery.toFixed(2)}</strong>
              </p>
              <p className="grand-total">
                <span>Total Bill</span>
                <strong>Rs {totals.total.toFixed(2)}</strong>
              </p>
            </div>

            <div className="checkout-actions">
              <button className="checkout-btn secondary" onClick={() => navigate("/shop")}>
                Back to Shop
              </button>
              <button className="checkout-btn primary" onClick={handleConfirmPayment}>
                Confirm Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;
