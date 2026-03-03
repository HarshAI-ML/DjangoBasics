import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Staff from "../pages/staff";
import Landing from "../pages/Landing";
import Products from "../pages/Products";
import Shop from "../pages/Shop";

const ADMIN_SESSION_KEY = "milkman_admin_logged_in";

function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem(ADMIN_SESSION_KEY) === "true";
  return isAdmin ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/shop" element={<Shop />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
