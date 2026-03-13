import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/api`;

export const getCustomerOrders = async (username) => {
  if (!username) return [];
  const response = await axios.get(`${API_BASE_URL}/customer-orders/${username}/`);
  return response.data.map((order) => ({
    customerUsername: order.customer_username,
    orderNumber: order.order_number,
    totalBill: Number(order.total_bill),
    orderDate: new Date(order.order_date).toLocaleString(),
    rawOrderDate: order.order_date,
    items: order.items || [],
  }));
};

export const addCustomerOrder = async (username, order) => {
  if (!username || !order) return null;
  const payload = {
    customer_username: username,
    order_number: order.orderNumber,
    total_bill: order.totalBill,
    order_date: order.rawOrderDate || new Date().toISOString(),
    items: order.items || [],
  };
  const response = await axios.post(`${API_BASE_URL}/customer-orders/`, payload);
  const saved = response.data;
  return {
    customerUsername: saved.customer_username,
    orderNumber: saved.order_number,
    totalBill: Number(saved.total_bill),
    orderDate: new Date(saved.order_date).toLocaleString(),
    rawOrderDate: saved.order_date,
    items: saved.items || [],
  };
};
