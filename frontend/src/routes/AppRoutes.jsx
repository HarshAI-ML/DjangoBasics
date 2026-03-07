import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Staff from "../pages/staff";
import Landing from "../pages/Landing";
import Products from "../pages/Products";
import Shop from "../pages/Shop";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Checkout from "../pages/Checkout";
import OrderSummary from "../pages/OrderSummary";
import CustomerAccount from "../pages/CustomerAccount";
import { getRole, isAuthenticated, isAdmin } from "../utils/auth";

function AdminRoute({ children }) {
  return isAdmin() ? children : <Navigate to="/login" replace />;
}

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function CustomerRoute({ children }) {
  return getRole() === "customer" ? children : <Navigate to="/login" replace />;
}

function LoginRoute() {
  const role = getRole();
  if (role === "admin") return <Navigate to="/products" replace />;
  if (role === "customer") return <Navigate to="/shop" replace />;
  return <Login />;
}

function SignupRoute() {
  const role = getRole();
  if (role === "admin") return <Navigate to="/products" replace />;
  if (role === "customer") return <Navigate to="/shop" replace />;
  return <Signup />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignupRoute />} />
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-summary"
          element={
            <ProtectedRoute>
              <OrderSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <CustomerRoute>
              <CustomerAccount />
            </CustomerRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <AdminRoute>
              <Staff />
            </AdminRoute>
          }
        />
        <Route
          path="/products"
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
