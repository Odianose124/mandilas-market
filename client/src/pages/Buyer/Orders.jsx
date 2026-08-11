import { useEffect, useState } from "react";
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    MapPin,
    CreditCard,
    Loader2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getOrdersByEmail } from "../../services/orderService";

function Orders() {
    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /*
     * Load customer's orders from backend.
     */
    useEffect(() => {
        const loadOrders = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const customerOrders =
                    await getOrdersByEmail(user.email);

                setOrders(customerOrders || []);
            } catch (err) {
                console.error(
                    "Failed to load orders:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load your orders."
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [user?.email]);

    /*
     * Format date.
     */
    const formatDate = (date) => {
        if (!date) {
            return "Unknown date";
        }

        try {
            return new Date(date).toLocaleDateString(
                "en-NG",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }
            );
        } catch {
            return date;
        }
    };

    /*
     * Format Naira.
     */
    const formatCurrency = (amount) => {
        return `₦${Number(
            amount || 0
        ).toLocaleString("en-NG")}`;
    };

    /*
     * Get delivery/order status icon.
     */
    const getStatusIcon = (status) => {
        const normalizedStatus =
            String(status || "")
                .toLowerCase();

        if (
            normalizedStatus.includes("delivered") ||
            normalizedStatus.includes("completed")
        ) {
            return (
                <CheckCircle
                    size={20}
                    className="text-green-600"
                />
            );
        }

        if (
            normalizedStatus.includes("cancel")
        ) {
            return (
                <XCircle
                    size={20}
                    className="text-red-600"
                />
            );
        }

        if (
            normalizedStatus.includes("shipped") ||
            normalizedStatus.includes("transit")
        ) {
            return (
                <Truck
                    size={20}
                    className="text-blue-600"
                />
            );
        }

        return (
            <Clock
                size={20}
                className="text-yellow-600"
            />
        );
    };

    /*
     * Get status badge styling.
     */
    const getStatusClass = (status) => {
        const normalizedStatus =
            String(status || "")
                .toLowerCase();

        if (
            normalizedStatus.includes("delivered") ||
            normalizedStatus.includes("completed") ||
            normalizedStatus.includes("paid") ||
            normalizedStatus.includes("success")
        ) {
            return "bg-green-100 text-green-700";
        }

        if (
            normalizedStatus.includes("cancel") ||
            normalizedStatus.includes("failed")
        ) {
            return "bg-red-100 text-red-700";
        }

        if (
            normalizedStatus.includes("shipped") ||
            normalizedStatus.includes("transit")
        ) {
            return "bg-blue-100 text-blue-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    /*
     * Loading state.
     */
    if (loading) {
        return (
            <section className="min-h-screen bg-gray-100 py-10">
                <div className="max-w-6xl mx-auto px-4">

                    <div className="flex items-center gap-3 mb-8">
                        <Package
                            size={32}
                            className="text-green-700"
                        />

                        <h1 className="text-3xl md:text-4xl font-bold">
                            My Orders
                        </h1>
                    </div>

                    <div className="bg-white rounded-xl shadow p-10 flex flex-col items-center justify-center">

                        <Loader2
                            size={40}
                            className="text-green-700 animate-spin mb-4"
                        />

                        <p className="text-gray-600">
                            Loading your orders...
                        </p>

                    </div>

                </div>
            </section>
        );
    }

    /*
     * User is not logged in.
     */
    if (!user) {
        return (
            <section className="min-h-screen bg-gray-100 py-10">
                <div className="max-w-6xl mx-auto px-4">

                    <div className="bg-white rounded-xl shadow p-10 text-center">

                        <Package
                            size={50}
                            className="mx-auto text-gray-400 mb-4"
                        />

                        <h1 className="text-2xl font-bold mb-2">
                            Please log in
                        </h1>

                        <p className="text-gray-500">
                            You need to log in to view your orders.
                        </p>

                    </div>

                </div>
            </section>
        );
    }

    /*
     * Error state.
     */
    if (error) {
        return (
            <section className="min-h-screen bg-gray-100 py-10">
                <div className="max-w-6xl mx-auto px-4">

                    <div className="bg-white rounded-xl shadow p-10 text-center">

                        <XCircle
                            size={50}
                            className="mx-auto text-red-500 mb-4"
                        />

                        <h1 className="text-2xl font-bold mb-2">
                            Unable to load orders
                        </h1>

                        <p className="text-gray-500 mb-6">
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                window.location.reload()
                            }
                            className="px-6 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 transition"
                        >
                            Try Again
                        </button>

                    </div>

                </div>
            </section>
        );
    }

    /*
     * Empty orders.
     */
    if (orders.length === 0) {
        return (
            <section className="min-h-screen bg-gray-100 py-10">
                <div className="max-w-6xl mx-auto px-4">

                    <div className="flex items-center gap-3 mb-8">

                        <Package
                            size={32}
                            className="text-green-700"
                        />

                        <h1 className="text-3xl md:text-4xl font-bold">
                            My Orders
                        </h1>

                    </div>

                    <div className="bg-white rounded-xl shadow p-10 text-center">

                        <Package
                            size={60}
                            className="mx-auto text-gray-300 mb-5"
                        />

                        <h2 className="text-2xl font-bold mb-2">
                            No orders yet
                        </h2>

                        <p className="text-gray-500">
                            You haven't placed any orders yet.
                        </p>

                    </div>

                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-gray-100 py-10">

            <div className="max-w-6xl mx-auto px-4">

                {/* Page Header */}

                <div className="flex items-center gap-3 mb-8">

                    <Package
                        size={32}
                        className="text-green-700"
                    />

                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            My Orders
                        </h1>

                        <p className="text-gray-500 mt-1">
                            {orders.length}{" "}
                            {orders.length === 1
                                ? "order"
                                : "orders"}{" "}
                            placed
                        </p>
                    </div>

                </div>


                {/* Orders */}

                <div className="space-y-6">

                    {orders.map((order) => (

                        <div
                            key={order.id}
                            className="bg-white rounded-xl shadow overflow-hidden"
                        >

                            {/* Order Header */}

                            <div className="p-5 md:p-6 border-b bg-gray-50">

                                <div className="flex flex-col md:flex-row justify-between gap-4">

                                    <div>

                                        <h2 className="font-bold text-lg md:text-xl">
                                            Order #{order.id}
                                        </h2>

                                        <p className="text-gray-500 mt-1">
                                            Placed on{" "}
                                            {formatDate(
                                                order.createdAt
                                            )}
                                        </p>

                                    </div>


                                    {/* Order Status */}

                                    <div className="flex items-center gap-2">

                                        {getStatusIcon(
                                            order.orderStatus
                                        )}

                                        <span
                                            className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusClass(
                                                order.orderStatus
                                            )}`}
                                        >
                                            {order.orderStatus ||
                                                "Pending"}
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* Order Items */}

                            <div className="p-5 md:p-6">

                                {order.items &&
                                    order.items.map(
                                        (item) => (

                                            <div
                                                key={item.id}
                                                className="flex flex-col sm:flex-row gap-5 py-5 border-b last:border-b-0"
                                            >

                                                {/* Product Image */}

                                                <div className="w-full sm:w-28 h-28 flex-shrink-0">

                                                    {item.imageUrl ? (
                                                        <img
                                                            src={
                                                                item.imageUrl
                                                            }
                                                            alt={
                                                                item.productName
                                                            }
                                                            className="w-full h-full object-cover rounded-lg bg-gray-100"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">

                                                            <Package
                                                                size={35}
                                                                className="text-gray-400"
                                                            />

                                                        </div>
                                                    )}

                                                </div>


                                                {/* Product Information */}

                                                <div className="flex-1">

                                                    <h3 className="text-lg font-bold">
                                                        {
                                                            item.productName
                                                        }
                                                    </h3>

                                                    {item.sellerName && (
                                                        <p className="text-gray-500 text-sm mt-1">
                                                            Seller:{" "}
                                                            {
                                                                item.sellerName
                                                            }
                                                        </p>
                                                    )}

                                                    <p className="text-gray-600 mt-2">
                                                        Quantity:{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </p>

                                                    <p className="text-gray-600">
                                                        Price:{" "}
                                                        <span className="font-semibold">
                                                            {formatCurrency(
                                                                item.price
                                                            )}
                                                        </span>
                                                    </p>

                                                    <p className="text-gray-600">
                                                        Item Total:{" "}
                                                        <span className="font-bold text-green-700">
                                                            {formatCurrency(
                                                                item.total
                                                            )}
                                                        </span>
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                            </div>


                            {/* Order Summary */}

                            <div className="border-t bg-gray-50 p-5 md:p-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Delivery */}

                                    <div>

                                        <h3 className="font-bold mb-3 flex items-center gap-2">

                                            <MapPin
                                                size={19}
                                                className="text-green-700"
                                            />

                                            Delivery Information

                                        </h3>

                                        <div className="text-sm text-gray-600 space-y-1">

                                            <p>
                                                <span className="font-semibold">
                                                    Method:
                                                </span>{" "}
                                                {
                                                    order.deliveryMethod
                                                }
                                            </p>

                                            <p>
                                                <span className="font-semibold">
                                                    State:
                                                </span>{" "}
                                                {order.state}
                                            </p>

                                            <p>
                                                <span className="font-semibold">
                                                    City:
                                                </span>{" "}
                                                {order.city}
                                            </p>

                                            <p>
                                                <span className="font-semibold">
                                                    Address:
                                                </span>{" "}
                                                {order.address}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Payment */}

                                    <div>

                                        <h3 className="font-bold mb-3 flex items-center gap-2">

                                            <CreditCard
                                                size={19}
                                                className="text-green-700"
                                            />

                                            Payment Information

                                        </h3>

                                        <div className="text-sm space-y-2">

                                            <p className="text-gray-600">
                                                Method:{" "}
                                                <span className="font-semibold">
                                                    {
                                                        order.paymentMethod
                                                    }
                                                </span>
                                            </p>

                                            <p className="text-gray-600">
                                                Payment Status:{" "}
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                        order.paymentStatus
                                                    )}`}
                                                >
                                                    {
                                                        order.paymentStatus
                                                    }
                                                </span>
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* Total */}

                                <div className="mt-6 pt-5 border-t">

                                    <div className="flex justify-between items-center">

                                        <div>

                                            <p className="text-gray-500 text-sm">
                                                Order Total
                                            </p>

                                            <p className="text-2xl font-bold text-green-700">
                                                {formatCurrency(
                                                    order.total
                                                )}
                                            </p>

                                        </div>

                                        <div className="text-right">

                                            <p className="text-gray-500 text-sm">
                                                Delivery Fee
                                            </p>

                                            <p className="font-semibold">
                                                {formatCurrency(
                                                    order.deliveryFee
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}

export default Orders;