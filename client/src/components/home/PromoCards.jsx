function PromoCards() {
  return (
    <div className="flex flex-col gap-5 h-[430px]">

      {/* Card 1 */}

      <div className="flex-1 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-sm hover:shadow-lg transition duration-300 cursor-pointer">

        <span className="text-sm uppercase tracking-widest">
          New Collection
        </span>

        <h2 className="text-2xl font-bold mt-4">
          Discover The Latest Fashion Trends
        </h2>

        <p className="mt-3 text-sm text-orange-100">
          Shop directly from trusted Mandilas sellers.
        </p>

        <button className="mt-6 bg-white text-orange-600 px-5 py-2 rounded-md font-semibold hover:bg-gray-100">
          Shop Now
        </button>

      </div>

      {/* Card 2 */}

      <div className="flex-1 bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-sm hover:shadow-lg transition duration-300 cursor-pointer">

        <span className="text-sm uppercase tracking-widest">
          Limited Offer
        </span>

        <h2 className="text-2xl font-bold mt-4">
          Up To 50% OFF Selected Items
        </h2>

        <p className="mt-3 text-sm text-green-100">
          Don't miss today's best fashion deals.
        </p>

        <button className="mt-6 bg-white text-green-700 px-5 py-2 rounded-md font-semibold hover:bg-gray-100">
          View Deals
        </button>

      </div>

    </div>
  );
}

export default PromoCards;