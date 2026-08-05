import {
  Search,
  User,
  HelpCircle,
  ShoppingCart,
  ChevronDown,
  Menu,
} from "lucide-react";

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      <div className="max-w-[1400px] mx-auto px-4">

        <div className="h-20 flex items-center justify-between gap-5">

          {/* Logo */}

          <div className="flex items-center gap-2 cursor-pointer">

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

          </div>

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

            <button className="hidden lg:flex items-center gap-2 hover:text-green-600 transition">

              <User size={22} />

              <span>
                Account
              </span>

              <ChevronDown size={18} />

            </button>

            <button className="hidden lg:flex items-center gap-2 hover:text-green-600 transition">

              <HelpCircle size={22} />

              <span>
                Help
              </span>

              <ChevronDown size={18} />

            </button>

            <button className="relative flex items-center gap-2 hover:text-green-600 transition">

              <ShoppingCart size={24} />

              <span className="hidden md:block">
                Cart
              </span>

              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                0
              </div>

            </button>

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
                placeholder="Search..."
                className="w-full h-11 px-3 outline-none"
              />

            </div>

            <button className="bg-green-600 text-white px-5 rounded-lg">
              Go
            </button>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;