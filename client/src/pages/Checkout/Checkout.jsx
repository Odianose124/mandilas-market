import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import { useCart } from "../../context/CartContext";

import {
    createOrder,
} from "../../services/orderService";

import {
    initializePayment,
    verifyPayment,
} from "../../services/paystackService";


function Checkout() {

    const navigate = useNavigate();

    const [
        searchParams,
    ] = useSearchParams();

    const {
        cartItems,
        subtotal,
        clearCart,
        getSellingPrice,
    } = useCart();


    /*
     * Checkout customer information
     */
    const [
        formData,
        setFormData,
    ] = useState({

        fullName: "",
        email: "",
        phone: "",

        state: "",
        city: "",
        address: "",

        deliveryMethod: "Standard Delivery",

        paymentMethod: "Paystack",

    });


    /*
     * Checkout state
     */
    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        verifyingPayment,
        setVerifyingPayment,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState(false);

    const [
        orderNumber,
        setOrderNumber,
    ] = useState(null);


    /*
     * Delivery fee
     */
    const deliveryFee =
        formData.deliveryMethod === "Standard Delivery"
            ? 2500
            : 0;


    /*
     * Final total
     */
    const total =
        Number(subtotal || 0) +
        Number(deliveryFee || 0);


    /*
     * Handle input changes
     */
    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    /*
     * Make sure the cart is not empty.
     */
    useEffect(() => {

        if (
            cartItems.length === 0 &&
            !searchParams.get("reference")
        ) {

            navigate("/cart");

        }

    }, [
        cartItems,
        navigate,
        searchParams,
    ]);


    /*
     * Handle Paystack callback.
     *
     * Paystack redirects the customer back
     * to this page with a transaction reference.
     */
    useEffect(() => {

        const reference =
            searchParams.get("reference");

        if (!reference) {
            return;
        }

        verifyPaystackPayment(
            reference
        );

    }, [searchParams]);


    /*
     * Verify payment after Paystack redirects
     * the customer back to the application.
     */
    const verifyPaystackPayment = async (
        reference
    ) => {

        try {

            setVerifyingPayment(true);
            setError("");

            /*
             * Retrieve the checkout information
             * that was saved before redirecting
             * to Paystack.
             */
            const pendingCheckout =
                localStorage.getItem(
                    "mandilas-pending-checkout"
                );

            if (!pendingCheckout) {

                throw new Error(
                    "Checkout information could not be found."
                );

            }

            const checkoutData =
                JSON.parse(
                    pendingCheckout
                );


            /*
             * Verify transaction with Paystack.
             */
            const payment =
                await verifyPayment(
                    reference
                );


            /*
             * Payment must actually be successful
             * before creating the order.
             */
            if (!payment.paid) {

                throw new Error(
                    "Payment was not successful."
                );

            }


            /*
             * Create the order only after
             * successful Paystack verification.
             */
            const savedOrder =
                await createOrder({

                    fullName:
                        checkoutData.fullName,

                    email:
                        checkoutData.email,

                    phone:
                        checkoutData.phone,

                    state:
                        checkoutData.state,

                    city:
                        checkoutData.city,

                    address:
                        checkoutData.address,

                    deliveryMethod:
                        checkoutData.deliveryMethod,

                    paymentMethod:
                        "Paystack",

                    paymentStatus:
                        "Paid",

                    deliveryFee:
                        checkoutData.deliveryFee,

                    subtotal:
                        checkoutData.subtotal,

                    total:
                        checkoutData.total,

                    orderStatus:
                        "Processing",

                    items:
                        checkoutData.items,

                });


            /*
             * Clear the customer's cart after
             * the order has successfully been created.
             */
            clearCart();


            /*
             * Remove temporary checkout data.
             */
            localStorage.removeItem(
                "mandilas-pending-checkout"
            );


            /*
             * Save order number for confirmation.
             */
            setOrderNumber(
                savedOrder.id
            );

            setSuccess(true);

        } catch (err) {

            console.error(
                "Payment verification error:",
                err
            );

            setError(
                err.message ||
                "Payment verification failed."
            );

        } finally {

            setVerifyingPayment(false);

        }

    };


    /*
     * Validate checkout form.
     */
    const validateForm = () => {

        if (
            !formData.fullName.trim()
        ) {
            return "Please enter your full name.";
        }

        if (
            !formData.email.trim()
        ) {
            return "Please enter your email address.";
        }

        if (
            !formData.phone.trim()
        ) {
            return "Please enter your phone number.";
        }

        if (
            !formData.state.trim()
        ) {
            return "Please select your state.";
        }

        if (
            !formData.city.trim()
        ) {
            return "Please enter your city.";
        }

        if (
            !formData.address.trim()
        ) {
            return "Please enter your delivery address.";
        }

        if (
            cartItems.length === 0
        ) {
            return "Your cart is empty.";
        }

        return null;

    };


    /*
     * Start Paystack payment.
     */
    const handlePaystackPayment = async () => {

        const validationError =
            validateForm();

        if (validationError) {

            setError(
                validationError
            );

            return;

        }


        try {

            setLoading(true);
            setError("");


            /*
             * Prepare order items.
             *
             * Only the information required by
             * the backend is sent.
             */
            const orderItems =
                cartItems.map(
                    (item) => {

                        const price =
                            getSellingPrice(
                                item
                            );

                        return {

                            productId:
                                item.id,

                            productName:
                                item.name ||
                                item.productName ||
                                "Product",

                            imageUrl:
                                item.imageUrl ||
                                item.image ||
                                "",

                            sellerEmail:
                                item.sellerEmail ||
                                item.seller?.email ||
                                "",

                            sellerName:
                                item.sellerName ||
                                item.seller?.name ||
                                "",

                            quantity:
                                Number(
                                    item.quantity || 1
                                ),

                            price:
                                Number(
                                    price || 0
                                ),

                            total:
                                Number(price || 0) *
                                Number(
                                    item.quantity || 1
                                ),

                        };

                    }
                );


            /*
             * Save everything needed to create
             * the order after payment succeeds.
             */
            const pendingCheckout = {

                fullName:
                    formData.fullName.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim(),

                state:
                    formData.state.trim(),

                city:
                    formData.city.trim(),

                address:
                    formData.address.trim(),

                deliveryMethod:
                    formData.deliveryMethod,

                paymentMethod:
                    "Paystack",

                paymentStatus:
                    "Pending",

                orderStatus:
                    "Pending",

                subtotal:
                    Number(subtotal || 0),

                deliveryFee:
                    Number(deliveryFee || 0),

                total:
                    Number(total || 0),

                items:
                    orderItems,

            };


            localStorage.setItem(
                "mandilas-pending-checkout",
                JSON.stringify(
                    pendingCheckout
                )
            );


            /*
             * Initialize Paystack transaction.
             */
            const payment =
                await initializePayment(
                    formData.email.trim(),
                    total
                );


            /*
             * Paystack must return an authorization URL.
             */
            if (
                !payment ||
                !payment.authorization_url
            ) {

                throw new Error(
                    "Paystack did not return a payment authorization URL."
                );

            }


            /*
             * Redirect customer to Paystack.
             */
            window.location.href =
                payment.authorization_url;

        } catch (err) {

            console.error(
                "Payment initialization error:",
                err
            );

            setError(
                err.message ||
                "Unable to initialize payment."
            );

            setLoading(false);

        }

    };


    /*
     * Payment verification screen.
     */
    if (verifyingPayment) {

        return (

            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

                    <div className="w-14 h-14 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />

                    <h2 className="text-2xl font-bold text-gray-900 mb-3">

                        Verifying Payment

                    </h2>

                    <p className="text-gray-600">

                        Please wait while we confirm your
                        Paystack payment and create your order.

                    </p>

                </div>

            </div>

        );

    }


    /*
     * Successful order screen.
     */
    if (success) {

        return (

            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">

                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">

                        <span className="text-4xl text-green-600">

                            ✓

                        </span>

                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-3">

                        Order Confirmed!

                    </h1>

                    <p className="text-gray-600 mb-6">

                        Your payment was successful and
                        your order has been received.

                    </p>

                    {orderNumber && (

                        <div className="bg-gray-50 rounded-xl p-4 mb-6">

                            <p className="text-sm text-gray-500">

                                Order Number

                            </p>

                            <p className="text-xl font-bold text-gray-900">

                                #{orderNumber}

                            </p>

                        </div>

                    )}

                    <div className="flex flex-col sm:flex-row gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/buyer/orders`
                                )
                            }
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-xl transition"
                        >

                            View My Orders

                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/")
                            }
                            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-3 px-5 rounded-xl transition"
                        >

                            Continue Shopping

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    /*
     * Checkout page.
     */
    return (

        <div className="min-h-screen bg-gray-50 py-8 px-4">

            <div className="max-w-7xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-900 mb-8">

                    Checkout

                </h1>


                {error && (

                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

                        {error}

                    </div>

                )}


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


                    {/* Customer information */}

                    <div className="lg:col-span-2 space-y-6">


                        <div className="bg-white rounded-2xl shadow-sm p-6">

                            <h2 className="text-xl font-bold text-gray-900 mb-6">

                                Customer Information

                            </h2>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">

                                        Full Name

                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                                    />

                                </div>


                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">

                                        Email Address

                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                                    />

                                </div>


                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">

                                        Phone Number

                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="08012345678"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Delivery information */}

                        <div className="bg-white rounded-2xl shadow-sm p-6">

                            <h2 className="text-xl font-bold text-gray-900 mb-6">

                                Delivery Information

                            </h2>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">

                                        State

                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Lagos"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                                    />

                                </div>


                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">

                                        City / LGA

                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Eti-Osa"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                                    />

                                </div>


                                <div className="md:col-span-2">

                                    <label className="block text-sm font-medium text-gray-700 mb-2">

                                        Delivery Address

                                    </label>

                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Enter your complete delivery address"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Delivery method */}

                        <div className="bg-white rounded-2xl shadow-sm p-6">

                            <h2 className="text-xl font-bold text-gray-900 mb-5">

                                Delivery Method

                            </h2>


                            <label className="flex items-center gap-3 border border-green-500 bg-green-50 rounded-xl p-4 cursor-pointer">

                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value="Standard Delivery"
                                    checked={
                                        formData.deliveryMethod ===
                                        "Standard Delivery"
                                    }
                                    onChange={handleChange}
                                />

                                <div className="flex-1">

                                    <p className="font-semibold text-gray-900">

                                        Standard Delivery

                                    </p>

                                    <p className="text-sm text-gray-500">

                                        Delivery fee: ₦2,500

                                    </p>

                                </div>

                                <span className="font-semibold">

                                    ₦2,500

                                </span>

                            </label>

                        </div>


                        {/* Payment method */}

                        <div className="bg-white rounded-2xl shadow-sm p-6">

                            <h2 className="text-xl font-bold text-gray-900 mb-5">

                                Payment Method

                            </h2>


                            <label className="flex items-center gap-3 border border-green-500 bg-green-50 rounded-xl p-4">

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Paystack"
                                    checked
                                />

                                <div>

                                    <p className="font-semibold text-gray-900">

                                        Pay with Paystack

                                    </p>

                                    <p className="text-sm text-gray-500">

                                        Secure payment with card,
                                        bank transfer or other
                                        available Paystack methods.

                                    </p>

                                </div>

                            </label>

                        </div>

                    </div>


                    {/* Order summary */}

                    <div>

                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">

                            <h2 className="text-xl font-bold text-gray-900 mb-6">

                                Order Summary

                            </h2>


                            <div className="space-y-4 mb-6">

                                {cartItems.map(
                                    (item) => {

                                        const price =
                                            getSellingPrice(
                                                item
                                            );

                                        const quantity =
                                            Number(
                                                item.quantity || 1
                                            );

                                        return (

                                            <div
                                                key={item.id}
                                                className="flex gap-3"
                                            >

                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">

                                                    {(
                                                        item.imageUrl ||
                                                        item.image
                                                    ) && (

                                                        <img
                                                            src={
                                                                item.imageUrl ||
                                                                item.image
                                                            }
                                                            alt={
                                                                item.name ||
                                                                "Product"
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />

                                                    )}

                                                </div>


                                                <div className="flex-1 min-w-0">

                                                    <p className="font-medium text-gray-900 truncate">

                                                        {item.name ||
                                                            item.productName ||
                                                            "Product"}

                                                    </p>

                                                    <p className="text-sm text-gray-500">

                                                        Qty: {quantity}

                                                    </p>

                                                    <p className="font-semibold text-gray-900">

                                                        ₦
                                                        {(
                                                            price *
                                                            quantity
                                                        ).toLocaleString()}

                                                    </p>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>


                            <div className="border-t border-gray-200 pt-4 space-y-3">

                                <div className="flex justify-between">

                                    <span className="text-gray-600">

                                        Subtotal

                                    </span>

                                    <span className="font-medium">

                                        ₦
                                        {Number(
                                            subtotal || 0
                                        ).toLocaleString()}

                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span className="text-gray-600">

                                        Delivery

                                    </span>

                                    <span className="font-medium">

                                        ₦
                                        {Number(
                                            deliveryFee || 0
                                        ).toLocaleString()}

                                    </span>

                                </div>


                                <div className="border-t border-gray-200 pt-4 flex justify-between">

                                    <span className="text-lg font-bold">

                                        Total

                                    </span>

                                    <span className="text-xl font-bold text-green-600">

                                        ₦
                                        {Number(
                                            total || 0
                                        ).toLocaleString()}

                                    </span>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handlePaystackPayment
                                }
                                disabled={loading}
                                className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition"
                            >

                                {loading
                                    ? "Redirecting to Paystack..."
                                    : `Pay ₦${Number(
                                          total || 0
                                      ).toLocaleString()}`}

                            </button>


                            <p className="text-xs text-gray-500 text-center mt-4">

                                You will be redirected to
                                Paystack to securely complete
                                your payment.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Checkout;