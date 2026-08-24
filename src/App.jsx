import { Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminRoute from "@/routes/AdminRoute";

// Customer pages
import Home from "@/pages/customer/Home";
import ProductListing from "@/pages/customer/ProductListing";
import ProductDetails from "@/pages/customer/ProductDetails";
import SearchResults from "@/pages/customer/SearchResults";
import CategoryProducts from "@/pages/customer/CategoryProducts";
import BrandProducts from "@/pages/customer/BrandProducts";
import Cart from "@/pages/customer/Cart";
import Checkout from "@/pages/customer/Checkout";
import Addresses from "@/pages/customer/Addresses";
import OrderConfirmation from "@/pages/customer/OrderConfirmation";
import MyOrders from "@/pages/customer/MyOrders";
import ActiveOrders from "@/pages/customer/ActiveOrders";
import OrderDetails from "@/pages/customer/OrderDetails";
import Profile from "@/pages/customer/Profile";
import ChangePassword from "@/pages/customer/ChangePassword";
import Login from "@/pages/customer/Login";
import Register from "@/pages/customer/Register";

// Admin pages
import Dashboard from "@/pages/admin/Dashboard";
import ManageUsers from "@/pages/admin/ManageUsers";
import ManageProducts from "@/pages/admin/ManageProducts";
import AddProduct from "@/pages/admin/AddProduct";
import EditProduct from "@/pages/admin/EditProduct";
import ManageCategories from "@/pages/admin/ManageCategories";
import ManageBrands from "@/pages/admin/ManageBrands";
import ManageOrders from "@/pages/admin/ManageOrders";

import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/categories/:categoryId" element={<CategoryProducts />} />
        <Route path="/brands/:brandId" element={<BrandProducts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/active" element={<ActiveOrders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      {/* Admin protected */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/:productId/edit" element={<EditProduct />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/brands" element={<ManageBrands />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
