const CUSTOMER_ORDERS_KEY = "milkman_customer_orders";

const getStoredOrders = () => {
  const raw = localStorage.getItem(CUSTOMER_ORDERS_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const setStoredOrders = (value) => {
  localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(value));
};

export const getCustomerOrders = (username) => {
  if (!username) return [];
  const all = getStoredOrders();
  return Array.isArray(all[username]) ? all[username] : [];
};

export const addCustomerOrder = (username, order) => {
  if (!username || !order) return null;
  const all = getStoredOrders();
  const existing = Array.isArray(all[username]) ? all[username] : [];
  all[username] = [order, ...existing];
  setStoredOrders(all);
  return order;
};
