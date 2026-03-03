import { BrowserRouter, Routes, Route } from "react-router-dom";
import Staff from "../pages/staff";
import Landing from "../pages/Landing";
import Products from "../pages/Products";
import Shop from "../pages/Shop";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/staff" element={<Staff />} />
        <Route path="/" element={<Landing />} />
        <Route path="/products" element={<Products />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
