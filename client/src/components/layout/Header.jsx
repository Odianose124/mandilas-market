function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">

        <div className="text-2xl font-bold text-green-700">
          Mandilas Market
        </div>

        <div>
          Search
        </div>

        <div className="flex items-center gap-6">
          <button>Login</button>
          <button>Cart</button>
        </div>

      </div>
    </header>
  );
}

export default Header;