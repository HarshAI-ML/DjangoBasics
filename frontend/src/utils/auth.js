const AUTH_ROLE_KEY = "milkman_user_role";
const LEGACY_ADMIN_SESSION_KEY = "milkman_admin_logged_in";
const AUTH_USERNAME_KEY = "milkman_username";
const REGISTERED_USERS_KEY = "milkman_registered_users";

const ADMIN_EMAIL = "harshshinde@gmail.com";
const ADMIN_PASSWORD = "password";
const CUSTOMER_EMAIL = "customer@milkman.com";
const CUSTOMER_PASSWORD = "password";

export const authKeys = {
  AUTH_ROLE_KEY,
  LEGACY_ADMIN_SESSION_KEY,
  AUTH_USERNAME_KEY,
  REGISTERED_USERS_KEY,
};

const getRegisteredUsers = () => {
  const raw = localStorage.getItem(REGISTERED_USERS_KEY);
  if (!raw) return [];

  try {
    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

const saveRegisteredUsers = (users) => {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
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

export const authenticateUser = (email, password) => {
  const safeEmail = (email || "").trim().toLowerCase();
  const safePassword = (password || "").trim();

  if (safeEmail === ADMIN_EMAIL && safePassword === ADMIN_PASSWORD) {
    return { ok: true, role: "admin", username: safeEmail.split("@")[0] };
  }

  if (safeEmail === CUSTOMER_EMAIL && safePassword === CUSTOMER_PASSWORD) {
    return { ok: true, role: "customer", username: safeEmail.split("@")[0] };
  }

  const user = getRegisteredUsers().find(
    (item) => item.email === safeEmail && item.password === safePassword
  );
  if (user) {
    return { ok: true, role: "customer", username: user.username };
  }

  return { ok: false, role: null, username: null };
};

export const registerCustomer = ({ username, email, password }) => {
  const safeUsername = (username || "").trim();
  const safeEmail = (email || "").trim().toLowerCase();
  const safePassword = (password || "").trim();
  const users = getRegisteredUsers();

  const isReservedEmail = safeEmail === ADMIN_EMAIL || safeEmail === CUSTOMER_EMAIL;
  if (isReservedEmail || users.some((item) => item.email === safeEmail)) {
    return { ok: false, error: "Email already registered" };
  }

  users.push({
    username: safeUsername,
    email: safeEmail,
    password: safePassword,
  });
  saveRegisteredUsers(users);
  return { ok: true };
};
