const CUSTOMER_SUBSCRIPTIONS_KEY = "milkman_customer_subscriptions";
const PLANS_KEY = "milkman_available_plans";
const DEFAULT_PLANS = [
  { id: "starter", name: "Starter", monthlyPrice: 199, quantity: "500ml daily" },
  { id: "standard", name: "Standard", monthlyPrice: 349, quantity: "1L daily" },
  { id: "family", name: "Family", monthlyPrice: 599, quantity: "2L daily" },
];

const getStoredSubscriptions = () => {
  const raw = localStorage.getItem(CUSTOMER_SUBSCRIPTIONS_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const setStoredSubscriptions = (value) => {
  localStorage.setItem(CUSTOMER_SUBSCRIPTIONS_KEY, JSON.stringify(value));
};

export const getAvailablePlans = () => {
  const raw = localStorage.getItem(PLANS_KEY);
  if (!raw) return DEFAULT_PLANS;

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_PLANS;
  } catch {
    return DEFAULT_PLANS;
  }
};

const setAvailablePlans = (value) => {
  localStorage.setItem(PLANS_KEY, JSON.stringify(value));
};

export const addPlan = ({ name, monthlyPrice, quantity }) => {
  const safeName = (name || "").trim();
  const safeQuantity = (quantity || "").trim();
  const safePrice = Number(monthlyPrice);
  if (!safeName || !safeQuantity || Number.isNaN(safePrice) || safePrice <= 0) {
    return null;
  }

  const plans = getAvailablePlans();
  const id = `plan-${Date.now()}`;
  const created = { id, name: safeName, monthlyPrice: safePrice, quantity: safeQuantity };
  setAvailablePlans([...plans, created]);
  return created;
};

export const deletePlan = (planId) => {
  const plans = getAvailablePlans().filter((plan) => plan.id !== planId);
  setAvailablePlans(plans);

  const subscriptions = getStoredSubscriptions();
  Object.keys(subscriptions).forEach((username) => {
    if (subscriptions[username]?.id === planId) {
      delete subscriptions[username];
    }
  });
  setStoredSubscriptions(subscriptions);
  return plans;
};

export const getAllCustomerSubscriptions = () => getStoredSubscriptions();

export const getCustomerSubscription = (username) => {
  if (!username) return null;
  const subscriptions = getStoredSubscriptions();
  return subscriptions[username] || null;
};

export const subscribeCustomerToPlan = (username, planId) => {
  if (!username) return null;
  const selectedPlan = getAvailablePlans().find((plan) => plan.id === planId);
  if (!selectedPlan) return null;

  const subscriptions = getStoredSubscriptions();
  const payload = {
    ...selectedPlan,
    status: "Active",
    subscribedAt: new Date().toISOString(),
  };
  subscriptions[username] = payload;
  setStoredSubscriptions(subscriptions);
  return payload;
};
