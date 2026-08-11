import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";

import { useCart } from "../../context/CartContext";

function Cart() {
    const navigate = useNavigate();

    const {
        cartItems,
        subtotal,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
    } = useCart();

    /*
     * Get the actual selling price.
     *
     * If a product has a valid discount price,
     * use that price. Otherwise use the normal price.
     */
    const getSellingPrice = (item) => {
        const price = Number(item.price || 0);
        const discountPrice = Number(item.discountPrice || 0);

        if (
            discountPrice > 0 &&
            discountPrice < price
        ) {
            return discountPrice;
        }

        return price;
    };

    /*
     * Delivery fee
     *
     * For now we are using the existing
     * fixed ₦2,500 delivery charge.
     */
    const deliveryFee = 2500;

    const total = subtotal + deliveryFee;

    /*
     * Empty cart
     */
    if (cartItems.length === 0) {
        return (
            <section className="min-h-screen bg-gray-100 px-4 py-20">

                <div className="max-w-7xl mx-auto">

                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                <ShoppingBag
                                    size={38}
                                    className="text-green-600"
                                />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-4">
                            Your cart is empty
                        </h2>

                        <p className="text-gray-500 mb-8">
                            Looks like you haven't added any products yet.
                        </p>

                        <Link
                            to="/"
                            className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                            Continue Shopping
                        </Link>

                    </div>

                </div>

            </section>
        );
    }

    return (
        <section className="min-h-screen bg-gray-100 px-4 py-10">

            <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-bold mb-8">
                    Shopping Cart
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* =========================
                        CART ITEMS
                    ========================== */}

                    <div className="lg:col-span-2 space-y-6">

                        {cartItems.map((item) => {

                            const sellingPrice =
                                getSellingPrice(item);

                            const itemTotal =
                                sellingPrice * item.quantity;

                            const imageUrl =
                                item.imageUrl ||
                                item.image ||
                                "https://via.placeholder.com/600x600?text=No+Image";

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-sm p-5 flex flex-col md:flex-row gap-6"
                                >

                                    {/* Product Image */}

                                    <img
                                        src={imageUrl}
                                        alt={item.name}
                                        className="w-full md:w-40 h-40 object-cover rounded-lg"
                                    />

                                    {/* Product Information */}

                                    <div className="flex-1">

                                        <h2 className="text-xl md:text-2xl font-bold">
                                            {item.name}
                                        </h2>

                                        {item.category && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.category}
                                            </p>
                                        )}

                                        {/* Price */}

                                        <div className="mt-3">

                                            <div className="flex items-center gap-3">

                                                <p className="text-green-700 text-xl font-bold">
                                                    ₦{sellingPrice.toLocaleString()}
                                                </p>

                                                {Number(item.discountPrice) > 0 &&
                                                    Number(item.discountPrice) <
                                                    Number(item.price) && (
                                                        <p className="text-gray-400 line-through text-sm">
                                                            ₦{Number(item.price).toLocaleString()}
                                                        </p>
                                                    )}

                                            </div>

                                        </div>

                                        {/* Quantity */}

                                        <div className="flex items-center gap-4 mt-6">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decreaseQuantity(item.id)
                                                }
                                                className="w-10 h-10 rounded-lg border hover:bg-gray-100 transition text-lg"
                                            >
                                                −
                                            </button>

                                            <span className="font-bold text-lg min-w-[25px] text-center">
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    increaseQuantity(item.id)
                                                }
                                                className="w-10 h-10 rounded-lg border hover:bg-gray-100 transition text-lg"
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>

                                    {/* Item Actions */}

                                    <div className="flex flex-row md:flex-col justify-between items-end">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                            className="text-red-600 hover:text-red-700 transition"
                                            title="Remove product"
                                        >
                                            <Trash2 size={22} />
                                        </button>

                                        <p className="font-bold text-xl mt-4 md:mt-0">

                                            ₦{itemTotal.toLocaleString()}

                                        </p>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    {/* =========================
                        ORDER SUMMARY
                    ========================== */}

                    <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-28">

                        <h2 className="text-2xl font-bold mb-6">
                            Order Summary
                        </h2>

                        <div className="flex justify-between mb-4">

                            <span className="text-gray-600">
                                Subtotal
                            </span>

                            <span className="font-bold">
                                ₦{subtotal.toLocaleString()}
                            </span>

                        </div>

                        <div className="flex justify-between mb-6">

                            <span className="text-gray-600">
                                Delivery
                            </span>

                            <span className="font-bold">
                                ₦{deliveryFee.toLocaleString()}
                            </span>

                        </div>

                        <hr />

                        <div className="flex justify-between text-2xl font-bold mt-6 mb-8">

                            <span>
                                Total
                            </span>

                            <span className="text-green-700">
                                ₦{total.toLocaleString()}
                            </span>

                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/checkout")}
                            className="w-full h-14 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                        >
                            Proceed to Checkout
                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Cart;
