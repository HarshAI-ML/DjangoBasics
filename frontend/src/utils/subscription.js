import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getAvailablePlans = async () => {
  const response = await axios.get(`${API_BASE_URL}/plans/`);
  return response.data.map((plan) => ({
    id: plan.id,
    name: plan.name,
    monthlyPrice: Number(plan.monthly_price),
    quantity: plan.quantity,
  }));
};

export const addPlan = async ({ name, monthlyPrice, quantity }) => {
  const response = await axios.post(`${API_BASE_URL}/plans/`, {
    name,
    monthly_price: monthlyPrice,
    quantity,
  });
  return {
    id: response.data.id,
    name: response.data.name,
    monthlyPrice: Number(response.data.monthly_price),
    quantity: response.data.quantity,
  };
};

export const deletePlan = async (planId) => {
  await axios.delete(`${API_BASE_URL}/plans/${planId}/`);
  return true;
};

export const getAllCustomerSubscriptions = async () => {
  const response = await axios.get(`${API_BASE_URL}/subscriptions/`);
  return response.data;
};

export const getCustomerSubscription = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subscriptions/${username}/`);
    const sub = response.data;
    return {
      id: sub.plan,
      name: sub.plan_name,
      monthlyPrice: Number(sub.monthly_price),
      quantity: sub.quantity,
      status: sub.status,
      subscribedAt: sub.subscribed_at,
    };
  } catch {
    return null;
  }
};

export const subscribeCustomerToPlan = async (username, planId) => {
  const response = await axios.post(`${API_BASE_URL}/subscriptions/${username}/`, {
    plan: planId,
  });
  const sub = response.data;
  return {
    id: sub.plan,
    name: sub.plan_name,
    monthlyPrice: Number(sub.monthly_price),
    quantity: sub.quantity,
    status: sub.status,
    subscribedAt: sub.subscribed_at,
  };
};
