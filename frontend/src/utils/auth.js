import axios from "axios";

const AUTH_ROLE_KEY = "milkman_user_role";
const LEGACY_ADMIN_SESSION_KEY = "milkman_admin_logged_in";
const AUTH_USERNAME_KEY = "milkman_username";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const authKeys = {
  AUTH_ROLE_KEY,
  LEGACY_ADMIN_SESSION_KEY,
  AUTH_USERNAME_KEY,
};

export const getRole = () => {
  const role = localStorage.getItem(AUTH_ROLE_KEY);
  if (role) return role;

  if (localStorage.getItem(LEGACY_ADMIN_SESSION_KEY) === "true") {
    return "admin";
  }
  return null;
};

export const isAuthenticated = () => Boolean(getRole());

export const isAdmin = () => getRole() === "admin";

export const setRole = (role) => {
  localStorage.setItem(AUTH_ROLE_KEY, role);
  if (role === "admin") {
    localStorage.setItem(LEGACY_ADMIN_SESSION_KEY, "true");
  } else {
    localStorage.removeItem(LEGACY_ADMIN_SESSION_KEY);
  }
};

export const setUsername = (username) => {
  localStorage.setItem(AUTH_USERNAME_KEY, (username || "").trim());
};

export const getUsername = () => localStorage.getItem(AUTH_USERNAME_KEY) || "guest";

export const logout = () => {
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem(LEGACY_ADMIN_SESSION_KEY);
  localStorage.removeItem(AUTH_USERNAME_KEY);
};

export const authenticateUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/customers/login/`, {
      email,
      password,
    });
    return response.data;
  } catch {
    return { ok: false, role: null, username: null };
  }
};

export const registerCustomer = async ({ username, email, password, address, mobile }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/customers/`, {
      username,
      email,
      password,
      address,
      mobile,
    });
    return { ok: true, data: response.data };
  } catch (error) {
    const apiError = error?.response?.data;
    if (apiError?.email) return { ok: false, error: "Email already registered" };
    if (apiError?.username) return { ok: false, error: "Username already taken" };
    return { ok: false, error: "Signup failed" };
  }
};

export const getAllCustomers = async () => {
  const response = await axios.get(`${API_BASE_URL}/customers/`);
  return response.data;
};
