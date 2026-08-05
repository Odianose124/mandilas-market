import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

function ProductCard({ product }) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">

      {/* Product Image */}

      <div className="relative overflow-hidden">

        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-110 transition duration-500"
        />

        <button className="absolute top-3 right-3 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-red-50">

          <Heart size={20} />

        </button>

        <span className="absolute left-3 top-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">

          -{product.discount}%

        </span>

      </div>

      {/* Product Details */}

      <div className="p-4">

        <h3 className="font-semibold line-clamp-2 h-12">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-2">

          <Star
            size={15}
            fill="#FBBF24"
            color="#FBBF24"
          />

          <Star
            size={15}
            fill="#FBBF24"
            color="#FBBF24"
          />

          <Star
            size={15}
            fill="#FBBF24"
            color="#FBBF24"
          />

          <Star
            size={15}
            fill="#FBBF24"
            color="#FBBF24"
          />

          <Star
            size={15}
            color="#D1D5DB"
          />

          <span className="text-xs text-gray-500 ml-2">
            (24)
          </span>

        </div>

        <div className="mt-3">

          <h2 className="text-green-700 font-bold text-xl">

            ₦{product.price.toLocaleString()}

          </h2>

          <p className="line-through text-gray-400 text-sm">

            ₦{product.oldPrice.toLocaleString()}

          </p>

        </div>

        <button className="mt-4 w-full h-11 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition">

          <ShoppingCart size={18} />

          Add to Cart

        </button>

      </div>

    </div>
  );
}

export default ProductCard;