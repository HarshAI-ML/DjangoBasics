import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCustomers } from "../utils/auth";
import { getAllCustomerSubscriptions } from "../utils/subscription";
import "./Customers.css";

function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerData, subData] = await Promise.all([
          getAllCustomers(),
          getAllCustomerSubscriptions(),
        ]);
        setCustomers(customerData);
        setSubscriptions(subData);
      } catch {
        setCustomers([]);
        setSubscriptions([]);
      }
    };
    fetchData();
  }, []);

  const rows = useMemo(() => {
    return customers.map((customer) => {
      const sub = subscriptions.find((item) => item.customer_username === customer.username);
      return {
        ...customer,
        plan: sub?.plan_name || "No Plan",
        status: sub?.status || "-",
        subscribedOn: sub?.subscribed_at ? new Date(sub.subscribed_at).toLocaleString() : "-",
      };
    });
  }, [customers, subscriptions]);

  return (
    <div className="customers-page">
      <header className="customers-hero">
        <div>
          <h1>Customers</h1>
          <p>View customer accounts and active subscriptions.</p>
        </div>
        <button onClick={() => navigate("/")} className="customers-back">
          Back
        </button>
      </header>

      <main className="customers-content">
        <div className="customers-card">
          <h2>Customer List</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Subscription Plan</th>
                  <th>Status</th>
                  <th>Subscribed On</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.email}>
                    <td>{row.username}</td>
                    <td>{row.email}</td>
                    <td>{row.mobile}</td>
                    <td>{row.address}</td>
                    <td>{row.plan}</td>
                    <td>{row.status}</td>
                    <td>{row.subscribedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Customers;
