import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import ProductDetails from "./pages/Product/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";

import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Dashboard from "./pages/Buyer/Dashboard";
import Profile from "./pages/Buyer/Profile";
import Orders from "./pages/Buyer/Orders";
import Wishlist from "./pages/Buyer/Wishlist";
import SellerDashboard from "./pages/Seller/Dashboard";
import Products from "./pages/Seller/Products";
import AddProduct from "./pages/Seller/AddProduct";
import EditProduct from "./pages/Seller/EditProduct";
import Store from "./pages/Store/Store";
import Chat from "./pages/Chat";
import SellerMessages from "./pages/Seller/Messages";


function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
  path="/shop"
  element={<Shop />}
/>

      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
  path="/dashboard"
  element={<Dashboard />}
/>

<Route
  path="/profile"
  element={<Profile />}
/>

<Route
  path="/orders"
  element={<Orders />}
/>

<Route
  path="/wishlist"
  element={<Wishlist />}
/>

<Route
  path="/seller/dashboard"
  element={<SellerDashboard />}
/>

<Route
  path="/seller/products"
  element={<Products />}
 />

 <Route
  path="/seller/add-product"
  element={<AddProduct />}
/>

<Route
  path="/seller/edit-product/:id"
  element={<EditProduct />}
/>

<Route
  path="/store/:slug"
  element={<Store />}
/>

<Route
  path="/chat/:conversationId"
  element={<Chat />}
/>

<Route
  path="/seller/messages"
  element={<SellerMessages />}
/>

    </Routes>
  );
}

export default App;