import {
    Heart,
    ShoppingCart,
    Star,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
    const navigate = useNavigate();

    const { addToCart } = useCart();

    const imageUrl =
        product.imageUrl ||
        "https://via.placeholder.com/600x600?text=No+Image";

    const price = Number(product.price || 0);

    const discountPrice =
        Number(product.discountPrice || 0);

    const hasDiscount =
        discountPrice > 0 &&
        discountPrice < price;

    const displayPrice = hasDiscount
        ? discountPrice
        : price;

    const stock = Number(product.stock || 0);

    const handleAddToCart = (event) => {
        event.stopPropagation();

        if (stock <= 0) {
            return;
        }

        addToCart(product, 1);
    };

    const handleViewProduct = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div
            onClick={handleViewProduct}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        >

            {/* Product Image */}

            <div className="relative overflow-hidden">

                <img
                    src={imageUrl}
                    alt={product.name || "Product"}
                    className="w-full aspect-square object-cover group-hover:scale-110 transition duration-500"
                />

                {/* Wishlist */}

                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    className="absolute top-3 right-3 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-red-50 transition"
                    title="Add to Wishlist"
                >
                    <Heart size={20} />
                </button>

                {/* Category */}

                {product.category && (
                    <span className="absolute left-3 top-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        {product.category}
                    </span>
                )}

                {/* Discount Badge */}

                {hasDiscount && (
                    <span className="absolute left-3 bottom-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        SALE
                    </span>
                )}

            </div>

            {/* Product Details */}

            <div className="p-4">

                <h3 className="font-semibold line-clamp-2 h-12">
                    {product.name}
                </h3>

                {/* Rating */}

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

                {/* Price */}

                <div className="mt-3">

                    <div className="flex items-center gap-2 flex-wrap">

                        <h2 className="text-green-700 font-bold text-xl">
                            ₦{displayPrice.toLocaleString()}
                        </h2>

                        {hasDiscount && (
                            <span className="text-gray-400 line-through text-sm">
                                ₦{price.toLocaleString()}
                            </span>
                        )}

                    </div>

                    {hasDiscount && (
                        <p className="text-red-600 text-xs font-semibold mt-1">
                            Save ₦{(price - discountPrice).toLocaleString()}
                        </p>
                    )}

                </div>

                {/* Stock */}

                <p className="text-sm text-gray-500 mt-1">

                    {stock > 0
                        ? `${stock} available`
                        : "Out of stock"}

                </p>

                {/* Add To Cart */}

                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={stock <= 0}
                    className={`mt-4 w-full h-11 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition ${
                        stock > 0
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >

                    <ShoppingCart size={18} />

                    {stock > 0
                        ? "Add to Cart"
                        : "Out of Stock"}

                </button>

            </div>

        </div>
    );
}

export default ProductCard;