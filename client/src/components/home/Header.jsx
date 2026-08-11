import { useState } from "react";

import {
  Search,
  User,
  HelpCircle,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  Package,
  Heart,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  /*
   * Close mobile menu after navigating.
   */
  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  /*
   * Logout user.
   */
  const handleLogout = () => {
    logout();
    setShowAccountMenu(false);
    setShowMobileMenu(false);
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* =========================
            MAIN HEADER
        ========================= */}

        <div className="h-20 flex items-center justify-between gap-4">
          {/* LOGO */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 shrink-0"
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

          {/* DESKTOP SEARCH */}

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

            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 transition text-white font-semibold h-12 px-8 rounded-lg"
            >
              SEARCH
            </button>
          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-4 sm:gap-6">
            {/* DESKTOP ACCOUNT */}

            {user ? (
              <div
                className="relative hidden lg:block"
                onMouseEnter={() =>
                  setShowAccountMenu(true)
                }
                onMouseLeave={() =>
                  setShowAccountMenu(false)
                }
              >
                <button
                  type="button"
                  className="flex items-center gap-2 hover:text-green-600 transition"
                >
                  <User size={22} />

                  <span className="font-semibold">
                    Hi, {user.firstName}
                  </span>

                  <ChevronDown size={18} />
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[100]">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-5 py-4 hover:bg-gray-100 transition"
                    >
                      <UserCircle size={19} />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-5 py-4 hover:bg-gray-100 transition"
                    >
                      <Package size={19} />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 px-5 py-4 hover:bg-gray-100 transition"
                    >
                      <Heart size={19} />
                      <span>Wishlist</span>
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-5 py-4 hover:bg-gray-100 transition"
                    >
                      <Settings size={19} />
                      <span>Account Settings</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 text-left px-5 py-4 text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={19} />
                      <span>Logout</span>
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

                <span>Account</span>

                <ChevronDown size={18} />
              </Link>
            )}

            {/* DESKTOP HELP */}

            <button
              type="button"
              className="hidden lg:flex items-center gap-2 hover:text-green-600 transition"
            >
              <HelpCircle size={22} />

              <span>Help</span>

              <ChevronDown size={18} />
            </button>

            {/* CART */}

            <Link
              to="/cart"
              onClick={closeMobileMenu}
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

            {/* MOBILE MENU BUTTON */}

            <button
              type="button"
              aria-label="Open mobile menu"
              aria-expanded={showMobileMenu}
              onClick={() =>
                setShowMobileMenu(
                  !showMobileMenu
                )
              }
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition"
            >
              {showMobileMenu ? (
                <X size={28} />
              ) : (
                <Menu size={28} />
              )}
            </button>
          </div>
        </div>

        {/* =========================
            MOBILE SEARCH
        ========================= */}

        <div className="md:hidden pb-4">
          <div className="flex gap-2">
            <div className="flex flex-1 items-center border border-gray-300 rounded-lg overflow-hidden">
              <Search
                size={20}
                className="ml-3 text-gray-500 shrink-0"
              />

              <input
                type="text"
                placeholder="Search products, brands and categories"
                className="w-full h-11 px-3 outline-none"
              />
            </div>

            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-lg"
            >
              Go
            </button>
          </div>
        </div>

        {/* =========================
            MOBILE MENU
        ========================= */}

        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <nav className="flex flex-col">
              {/* HOME */}

              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-gray-100 active:bg-gray-200"
              >
                <UserCircle size={21} />
                <span className="font-medium">
                  Home
                </span>
              </Link>

              {/* ACCOUNT */}

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-gray-100 active:bg-gray-200"
                  >
                    <User size={21} />

                    <div>
                      <span className="font-medium block">
                        My Profile
                      </span>

                      <span className="text-xs text-gray-500">
                        Hi, {user.firstName}
                      </span>
                    </div>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-gray-100 active:bg-gray-200"
                  >
                    <Package size={21} />
                    <span className="font-medium">
                      My Orders
                    </span>
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-gray-100 active:bg-gray-200"
                  >
                    <Heart size={21} />
                    <span className="font-medium">
                      Wishlist
                    </span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-gray-100 active:bg-gray-200"
                  >
                    <Settings size={21} />
                    <span className="font-medium">
                      Account Settings
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-4 rounded-lg text-red-600 hover:bg-red-50 active:bg-red-100 text-left"
                  >
                    <LogOut size={21} />

                    <span className="font-medium">
                      Logout
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-gray-100 active:bg-gray-200"
                  >
                    <User size={21} />

                    <span className="font-medium">
                      Login
                    </span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-gray-100 active:bg-gray-200"
                  >
                    <UserCircle size={21} />

                    <span className="font-medium">
                      Create Account
                    </span>
                  </Link>
                </>
              )}

              {/* CART */}

              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-4 py-4 rounded-lg hover:bg-gray-100 active:bg-gray-200"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={21} />

                  <span className="font-medium">
                    Shopping Cart
                  </span>
                </div>

                {totalItems > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold rounded-full min-w-6 h-6 px-2 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* HELP */}

              <button
                type="button"
                className="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-left"
              >
                <HelpCircle size={21} />

                <span className="font-medium">
                  Help & Support
                </span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;