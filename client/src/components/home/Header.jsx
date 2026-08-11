import { useState } from "react";

import {
  Search,
  User,
  HelpCircle,
  ShoppingCart,
  ChevronDown,
  Menu,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Header() {

  const { totalItems } = useCart();

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (

    <header className="bg-white shadow-sm sticky top-0 z-50">

      <div className="max-w-[1400px] mx-auto px-4">

        <div className="h-20 flex items-center justify-between gap-5">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-2"
          >

            <div className="w-11 h-11 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-xl">
              M
            </div>

            <div className="hidden sm:block">

              <h2 className="text-2xl font-bold tracking-tight">

                Mandilas

                <span className="text-green-600">
                  Market
                </span>

              </h2>

            </div>

          </Link>

          {/* Search */}

          <div className="hidden md:flex flex-1 items-center gap-3">

            <div className="flex items-center flex-1 border border-gray-300 rounded-lg overflow-hidden">

              <Search
                size={20}
                className="ml-4 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search products, brands and categories"
                className="w-full h-12 px-3 outline-none"
              />

            </div>

            <button className="bg-green-600 hover:bg-green-700 transition text-white font-semibold h-12 px-8 rounded-lg">

              SEARCH

            </button>

          </div>

          {/* Right */}

          <div className="flex items-center gap-6">

            {/* Account */}

            {user ? (

              <div
                className="relative hidden lg:block"
                onMouseEnter={() => setShowAccountMenu(true)}
                onMouseLeave={() => setShowAccountMenu(false)}
              >

                <button className="flex items-center gap-2 hover:text-green-600 transition">

                  <User size={22} />

                  <span className="font-semibold">

                    Hi, {user.firstName}

                  </span>

                  <ChevronDown size={18} />

                </button>

                {showAccountMenu && (

                  <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">

                    <Link
  to="/dashboard"
  className="block px-5 py-4 hover:bg-gray-100 transition"
>
  👤 My Profile
</Link>

                    <Link
                      to="/orders"
                      className="block px-5 py-4 hover:bg-gray-100 transition"
                    >
                      📦 My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      className="block px-5 py-4 hover:bg-gray-100 transition"
                    >
                      ❤️ Wishlist
                    </Link>

                    <Link
                      to="/addresses"
                      className="block px-5 py-4 hover:bg-gray-100 transition"
                    >
                      📍 Saved Addresses
                    </Link>

                    <Link
                      to="/settings"
                      className="block px-5 py-4 hover:bg-gray-100 transition"
                    >
                      ⚙ Account Settings
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      className="w-full text-left px-5 py-4 text-red-600 hover:bg-red-50 transition"
                    >
                      🚪 Logout
                    </button>

                  </div>

                )}

              </div>

            ) : (

              <Link
                to="/login"
                className="hidden lg:flex items-center gap-2 hover:text-green-600 transition"
              >

                <User size={22} />

                <span>

                  Account

                </span>

                <ChevronDown size={18} />

              </Link>

            )}

                        {/* Help */}

            <button className="hidden lg:flex items-center gap-2 hover:text-green-600 transition">

              <HelpCircle size={22} />

              <span>
                Help
              </span>

              <ChevronDown size={18} />

            </button>

            {/* Cart */}

            <Link
              to="/cart"
              className="relative flex items-center gap-2 hover:text-green-600 transition"
            >

              <ShoppingCart size={24} />

              <span className="hidden lg:block">
                Cart
              </span>

              {totalItems > 0 && (

                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">

                  {totalItems}

                </div>

              )}

            </Link>

            {/* Mobile Menu */}

            <button className="lg:hidden">

              <Menu size={28} />

            </button>

          </div>

        </div>

        {/* Mobile Search */}

        <div className="md:hidden pb-4">

          <div className="flex gap-2">

            <div className="flex flex-1 items-center border border-gray-300 rounded-lg overflow-hidden">

              <Search
                size={20}
                className="ml-3 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search products, brands and categories"
                className="w-full h-11 px-3 outline-none"
              />

            </div>

            <button className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-lg">

              Go

            </button>

          </div>

        </div>

      </div>

    </header>

  );
}

export default Header;