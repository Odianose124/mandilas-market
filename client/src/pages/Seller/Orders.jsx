import { useEffect, useMemo, useState } from "react";
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    RefreshCw,
    MapPin,
    Phone,
    Mail,
    User,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
    getOrdersBySellerEmail,
    updateOrderStatus,
} from "../../services/orderService";

function Orders() {
    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [updatingOrder, setUpdatingOrder] = useState(null);

    /*
     * Load seller orders from the backend.
     */
    const loadOrders = async (showRefresh = false) => {
        if (!user?.email) {
            setOrders([]);
            setLoading(false);
            return;
        }

        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const sellerOrders =
                await getOrdersBySellerEmail(
                    user.email
                );

            setOrders(
                Array.isArray(sellerOrders)
                    ? sellerOrders
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load seller orders:",
                err
            );

            setError(
                err.message ||
                    "Failed to load orders"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /*
     * Load orders when the seller account is available.
     */
    useEffect(() => {
        loadOrders();
    }, [user?.email]);

    /*
     * Get only this seller's products from an order.
     */
    const getSellerItems = (order) => {
        if (!order?.items || !user?.email) {
            return [];
        }

        return order.items.filter(
            (item) =>
                item.sellerEmail?.toLowerCase() ===
                user.email.toLowerCase()
        );
    };

    /*
     * Calculate the seller's total for an order.
     */
    const getSellerOrderTotal = (order) => {
        const sellerItems =
            getSellerItems(order);

        return sellerItems.reduce(
            (sum, item) =>
                sum +
                Number(item.total || 0),
            0
        );
    };

    /*
     * Get the total quantity of seller products
     * in an order.
     */
    const getSellerQuantity = (order) => {
        const sellerItems =
            getSellerItems(order);

        return sellerItems.reduce(
            (sum, item) =>
                sum +
                Number(item.quantity || 0),
            0
        );
    };

    /*
     * Format money.
     */
    const formatCurrency = (amount) => {
        return `₦${Number(
            amount || 0
        ).toLocaleString()}`;
    };

    /*
     * Format order date.
     */
    const formatDate = (date) => {
        if (!date) {
            return "Unknown date";
        }

        try {
            return new Date(
                date
            ).toLocaleString(
                "en-NG",
                {
                    dateStyle: "medium",
                    timeStyle: "short",
                }
            );
        } catch {
            return date;
        }
    };

    /*
     * Get delivery icon.
     */
    const getStatusIcon = (status) => {
        const normalizedStatus =
            String(status || "")
                .toLowerCase();

        if (
            normalizedStatus ===
                "delivered" ||
            normalizedStatus ===
                "completed"
        ) {
            return (
                <CheckCircle
                    size={20}
                    className="text-green-600"
                />
            );
        }

        if (
            normalizedStatus ===
                "cancelled" ||
            normalizedStatus ===
                "canceled"
        ) {
            return (
                <XCircle
                    size={20}
                    className="text-red-600"
                />
            );
        }

        if (
            normalizedStatus ===
                "shipped" ||
            normalizedStatus ===
                "out for delivery"
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
     * Get status styling.
     */
    const getStatusClasses = (status) => {
        const normalizedStatus =
            String(status || "")
                .toLowerCase();

        if (
            normalizedStatus ===
                "delivered" ||
            normalizedStatus ===
                "completed"
        ) {
            return "bg-green-100 text-green-700";
        }

        if (
            normalizedStatus ===
                "cancelled" ||
            normalizedStatus ===
                "canceled"
        ) {
            return "bg-red-100 text-red-700";
        }

        if (
            normalizedStatus ===
                "shipped" ||
            normalizedStatus ===
                "out for delivery"
        ) {
            return "bg-blue-100 text-blue-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    /*
     * Update seller order status.
     */
    const handleStatusChange = async (
        orderId,
        newStatus
    ) => {
        try {
            setUpdatingOrder(orderId);
            setError("");

            const updatedOrder =
                await updateOrderStatus(
                    orderId,
                    newStatus
                );

            setOrders(
                (previousOrders) =>
                    previousOrders.map(
                        (order) =>
                            order.id ===
                            orderId
                                ? updatedOrder
                                : order
                    )
            );
        } catch (err) {
            console.error(
                "Failed to update order status:",
                err
            );

            setError(
                err.message ||
                    "Failed to update order status"
            );
        } finally {
            setUpdatingOrder(null);
        }
    };

    /*
     * Seller statistics.
     */
    const statistics = useMemo(() => {
        let totalOrders = 0;
        let pendingOrders = 0;
        let processingOrders = 0;
        let completedOrders = 0;
        let cancelledOrders = 0;
        let totalSales = 0;

        orders.forEach((order) => {
            const sellerItems =
                getSellerItems(order);

            if (sellerItems.length === 0) {
                return;
            }

            totalOrders += 1;

            totalSales +=
                getSellerOrderTotal(order);

            const status =
                String(
                    order.orderStatus || ""
                ).toLowerCase();

            if (
                status === "pending"
            ) {
                pendingOrders += 1;
            } else if (
                status === "processing"
            ) {
                processingOrders += 1;
            } else if (
                status === "delivered" ||
                status === "completed"
            ) {
                completedOrders += 1;
            } else if (
                status === "cancelled" ||
                status === "canceled"
            ) {
                cancelledOrders += 1;
            }
        });

        return {
            totalOrders,
            pendingOrders,
            processingOrders,
            completedOrders,
            cancelledOrders,
            totalSales,
        };
    }, [orders, user?.email]);

    /*
     * Seller must be logged in.
     */
    if (!user) {
        return (
            <section className="min-h-screen bg-gray-100 py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-xl shadow p-8 text-center">
                        <User
                            size={48}
                            className="mx-auto text-gray-400 mb-4"
                        />

                        <h1 className="text-2xl font-bold text-gray-800">
                            Seller account required
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Please log in to view your
                            seller orders.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    /*
     * Loading state.
     */
    if (loading) {
        return (
            <section className="min-h-screen bg-gray-100 py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <RefreshCw
                                size={40}
                                className="mx-auto text-green-600 animate-spin"
                            />

                            <p className="mt-4 text-gray-600">
                                Loading your orders...
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-gray-100 py-8 md:py-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Orders
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Manage orders containing your products.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            loadOrders(true)
                        }
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60 transition"
                    >
                        <RefreshCw
                            size={18}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh Orders"}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
                        {error}
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <Package
                            size={24}
                            className="text-green-600 mb-3"
                        />

                        <p className="text-gray-500 text-sm">
                            Total Orders
                        </p>

                        <p className="text-2xl font-bold mt-1">
                            {statistics.totalOrders}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <Clock
                            size={24}
                            className="text-yellow-600 mb-3"
                        />

                        <p className="text-gray-500 text-sm">
                            Pending
                        </p>

                        <p className="text-2xl font-bold mt-1">
                            {statistics.pendingOrders}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <Truck
                            size={24}
                            className="text-blue-600 mb-3"
                        />

                        <p className="text-gray-500 text-sm">
                            Processing
                        </p>

                        <p className="text-2xl font-bold mt-1">
                            {statistics.processingOrders}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <CheckCircle
                            size={24}
                            className="text-green-600 mb-3"
                        />

                        <p className="text-gray-500 text-sm">
                            Completed
                        </p>

                        <p className="text-2xl font-bold mt-1">
                            {statistics.completedOrders}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5 col-span-2 lg:col-span-1">
                        <p className="text-gray-500 text-sm mb-2">
                            Your Sales
                        </p>

                        <p className="text-xl md:text-2xl font-bold text-green-700">
                            {formatCurrency(
                                statistics.totalSales
                            )}
                        </p>
                    </div>
                </div>

                {/* No orders */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center">

                        <Package
                            size={56}
                            className="mx-auto text-gray-300 mb-4"
                        />

                        <h2 className="text-2xl font-bold text-gray-800">
                            No orders yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Orders containing your products
                            will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">

                        {orders.map((order) => {

                            const sellerItems =
                                getSellerItems(
                                    order
                                );

                            if (
                                sellerItems.length ===
                                0
                            ) {
                                return null;
                            }

                            const sellerTotal =
                                getSellerOrderTotal(
                                    order
                                );

                            const sellerQuantity =
                                getSellerQuantity(
                                    order
                                );

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                                >

                                    {/* Order header */}
                                    <div className="p-5 md:p-6 border-b">

                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Order ID
                                                </p>

                                                <h2 className="text-xl font-bold text-gray-900">
                                                    #{order.id}
                                                </h2>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(
                                                        order.orderStatus
                                                    )}

                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClasses(
                                                            order.orderStatus
                                                        )}`}
                                                    >
                                                        {order.orderStatus ||
                                                            "Pending"}
                                                    </span>
                                                </div>

                                                <select
                                                    value={
                                                        order.orderStatus ||
                                                        "Pending"
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleStatusChange(
                                                            order.id,
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    disabled={
                                                        updatingOrder ===
                                                        order.id
                                                    }
                                                    className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                                >
                                                    <option value="Pending">
                                                        Pending
                                                    </option>

                                                    <option value="Processing">
                                                        Processing
                                                    </option>

                                                    <option value="Shipped">
                                                        Shipped
                                                    </option>

                                                    <option value="Out for Delivery">
                                                        Out for Delivery
                                                    </option>

                                                    <option value="Delivered">
                                                        Delivered
                                                    </option>

                                                    <option value="Cancelled">
                                                        Cancelled
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer information */}
                                    <div className="p-5 md:p-6 border-b bg-gray-50">

                                        <h3 className="font-bold text-gray-900 mb-4">
                                            Customer & Delivery
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                            <div className="flex gap-3">
                                                <User
                                                    size={20}
                                                    className="text-gray-500 mt-1"
                                                />

                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Customer
                                                    </p>

                                                    <p className="font-semibold">
                                                        {
                                                            order.fullName
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Phone
                                                    size={20}
                                                    className="text-gray-500 mt-1"
                                                />

                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Phone
                                                    </p>

                                                    <p className="font-semibold">
                                                        {
                                                            order.phone
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Mail
                                                    size={20}
                                                    className="text-gray-500 mt-1"
                                                />

                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Email
                                                    </p>

                                                    <p className="font-semibold break-all">
                                                        {
                                                            order.email
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <MapPin
                                                    size={20}
                                                    className="text-gray-500 mt-1"
                                                />

                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Delivery
                                                    </p>

                                                    <p className="font-semibold">
                                                        {
                                                            order.city
                                                        }
                                                        ,{" "}
                                                        {
                                                            order.state
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-xs text-gray-500">
                                                Delivery Address
                                            </p>

                                            <p className="font-medium text-gray-800 mt-1">
                                                {
                                                    order.address
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Seller products */}
                                    <div className="p-5 md:p-6">

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">

                                            <h3 className="font-bold text-lg">
                                                Your Products
                                            </h3>

                                            <span className="text-sm text-gray-500">
                                                {
                                                    sellerQuantity
                                                }{" "}
                                                item
                                                {sellerQuantity !==
                                                1
                                                    ? "s"
                                                    : ""}
                                            </span>
                                        </div>

                                        <div className="space-y-4">

                                            {sellerItems.map(
                                                (
                                                    item
                                                ) => (
                                                    <div
                                                        key={
                                                            item.id
                                                        }
                                                        className="flex flex-col sm:flex-row gap-4 border rounded-xl p-4"
                                                    >

                                                        {item.imageUrl ? (
                                                            <img
                                                                src={
                                                                    item.imageUrl
                                                                }
                                                                alt={
                                                                    item.productName
                                                                }
                                                                className="w-full sm:w-24 h-24 object-cover rounded-lg bg-gray-100"
                                                            />
                                                        ) : (
                                                            <div className="w-full sm:w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                <Package
                                                                    size={
                                                                        32
                                                                    }
                                                                    className="text-gray-400"
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="flex-1">

                                                            <h4 className="font-bold text-gray-900">
                                                                {
                                                                    item.productName
                                                                }
                                                            </h4>

                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Quantity:{" "}
                                                                {
                                                                    item.quantity
                                                                }
                                                            </p>

                                                            <p className="text-sm text-gray-500">
                                                                Unit price:{" "}
                                                                {formatCurrency(
                                                                    item.price
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div className="sm:text-right">

                                                            <p className="text-sm text-gray-500">
                                                                Item Total
                                                            </p>

                                                            <p className="text-lg font-bold text-green-700">
                                                                {formatCurrency(
                                                                    item.total
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* Order totals */}
                                        <div className="mt-6 pt-5 border-t">

                                            <div className="flex justify-between text-gray-600">
                                                <span>
                                                    Your products
                                                </span>

                                                <span>
                                                    {formatCurrency(
                                                        sellerTotal
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-gray-600 mt-2">
                                                <span>
                                                    Payment status
                                                </span>

                                                <span
                                                    className={
                                                        order.paymentStatus?.toLowerCase() ===
                                                        "paid"
                                                            ? "text-green-600 font-semibold"
                                                            : "text-yellow-600 font-semibold"
                                                    }
                                                >
                                                    {order.paymentStatus ||
                                                        "Pending"}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
                                                <span>
                                                    Seller Total
                                                </span>

                                                <span className="text-green-700">
                                                    {formatCurrency(
                                                        sellerTotal
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Orders;