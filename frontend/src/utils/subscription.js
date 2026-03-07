const CUSTOMER_SUBSCRIPTIONS_KEY = "milkman_customer_subscriptions";

export const AVAILABLE_PLANS = [
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

export const getCustomerSubscription = (username) => {
  if (!username) return null;
  const subscriptions = getStoredSubscriptions();
  return subscriptions[username] || null;
};

export const subscribeCustomerToPlan = (username, planId) => {
  if (!username) return null;
  const selectedPlan = AVAILABLE_PLANS.find((plan) => plan.id === planId);
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
