import {
  Search,
  ShoppingCart,
  User,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

function Header() {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const handleSearch = (
    event
  ) => {
    event.preventDefault();

    const term =
      search.trim();

    if (!term) {
      navigate("/shop");
      return;
    }

    navigate(
      `/shop?search=${encodeURIComponent(
        term
      )}`
    );
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="min-h-16 flex items-center gap-4">

          {/* LOGO */}

          <Link
            to="/"
            className="shrink-0"
          >
            <div className="text-xl sm:text-2xl font-bold text-green-700">
              Mandilas Market
            </div>
          </Link>

          {/* SEARCH */}

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-auto"
          >

            <div className="relative w-full">

              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search products..."
                className="w-full h-11 border border-gray-300 rounded-l-lg pl-10 pr-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            <button
              type="submit"
              className="px-6 bg-green-700 text-white font-semibold rounded-r-lg hover:bg-green-800 transition"
            >
              Search
            </button>

          </form>

          {/* ACTIONS */}

          <div className="ml-auto flex items-center gap-3 sm:gap-5">

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
              className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-green-700 transition"
            >

              <User size={20} />

              <span>
                Login
              </span>

            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/cart")
              }
              className="relative flex items-center gap-2 text-gray-700 hover:text-green-700 transition"
            >

              <ShoppingCart
                size={22}
              />

              <span className="hidden sm:inline">
                Cart
              </span>

            </button>

          </div>

        </div>

        {/* MOBILE SEARCH */}

        <form
          onSubmit={handleSearch}
          className="md:hidden pb-3"
        >

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search products..."
              className="w-full h-10 border border-gray-300 rounded-lg pl-10 pr-20 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-green-700 text-white rounded-md text-sm font-semibold"
            >
              Search
            </button>

          </div>

        </form>

      </div>

    </header>
  );
}

export default Header;