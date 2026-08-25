import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { CartProvider } from "./context/CartContext";
import {
 CategoryProvider
} from "./context/CategoryContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProductProvider } from "./context/ProductContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <BrowserRouter>

    <CategoryProvider>

      <AuthProvider>

        <CartProvider>

           <WishlistProvider>

        <ProductProvider>

          <App />

        </ProductProvider>

      </WishlistProvider>

        </CartProvider>

      </AuthProvider>
</CategoryProvider> 
    
    </BrowserRouter>

  </React.StrictMode>
);