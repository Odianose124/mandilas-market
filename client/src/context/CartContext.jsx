import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const CartContext = createContext();

/*
 * Get the actual selling price of a product.
 *
 * If discountPrice exists and is lower than the
 * original price, the discount price is used.
 *
 * Otherwise, the normal price is used.
 */
const getSellingPrice = (product) => {
    const price = Number(product.price || 0);
    const discountPrice = Number(
        product.discountPrice || 0
    );

    if (
        discountPrice > 0 &&
        discountPrice < price
    ) {
        return discountPrice;
    }

    return price;
};

export function CartProvider({ children }) {

    /*
     * Load cart from localStorage when the app starts.
     */
    const [cartItems, setCartItems] = useState(() => {

        try {

            const savedCart =
                localStorage.getItem("mandilas-cart");

            return savedCart
                ? JSON.parse(savedCart)
                : [];

        } catch (error) {

            console.error(
                "Failed to load cart:",
                error
            );

            return [];

        }

    });

    /*
     * Save cart whenever cartItems changes.
     */
    useEffect(() => {

        localStorage.setItem(
            "mandilas-cart",
            JSON.stringify(cartItems)
        );

    }, [cartItems]);

    /*
     * Add product to cart.
     */
    const addToCart = (
        product,
        quantity = 1
    ) => {

        setCartItems((previousItems) => {

            const existingItem =
                previousItems.find(
                    (item) =>
                        item.id === product.id
                );

            /*
             * Product already exists.
             * Increase its quantity.
             */
            if (existingItem) {

                return previousItems.map(
                    (item) =>
                        item.id === product.id
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity +
                                      quantity,
                              }
                            : item
                );

            }

            /*
             * New product.
             */
            return [
                ...previousItems,
                {
                    ...product,
                    quantity,
                },
            ];

        });

    };

    /*
     * Remove product completely.
     */
    const removeFromCart = (id) => {

        setCartItems((previousItems) =>
            previousItems.filter(
                (item) => item.id !== id
            )
        );

    };

    /*
     * Increase product quantity.
     */
    const increaseQuantity = (id) => {

        setCartItems((previousItems) =>
            previousItems.map((item) => {

                if (item.id !== id) {
                    return item;
                }

                /*
                 * Do not allow quantity to exceed
                 * available stock.
                 */
                const stock = Number(
                    item.stock || 0
                );

                const currentQuantity =
                    Number(item.quantity || 0);

                if (
                    stock > 0 &&
                    currentQuantity >= stock
                ) {
                    return item;
                }

                return {
                    ...item,
                    quantity:
                        currentQuantity + 1,
                };

            })
        );

    };

    /*
     * Decrease product quantity.
     */
    const decreaseQuantity = (id) => {

        setCartItems((previousItems) =>
            previousItems
                .map((item) => {

                    if (item.id !== id) {
                        return item;
                    }

                    return {
                        ...item,
                        quantity:
                            Number(
                                item.quantity || 0
                            ) - 1,
                    };

                })
                .filter(
                    (item) =>
                        item.quantity > 0
                )
        );

    };

    /*
     * Empty the entire cart.
     */
    const clearCart = () => {

        setCartItems([]);

    };

    /*
     * Total number of products in cart.
     */
    const totalItems = cartItems.reduce(
        (sum, item) =>
            sum +
            Number(item.quantity || 0),
        0
    );

    /*
     * Cart subtotal.
     *
     * IMPORTANT:
     * Uses discountPrice when valid.
     */
    const subtotal = cartItems.reduce(
        (sum, item) => {

            const sellingPrice =
                getSellingPrice(item);

            const quantity =
                Number(item.quantity || 0);

            return (
                sum +
                sellingPrice * quantity
            );

        },
        0
    );

    /*
     * Total number of unique products.
     */
    const totalProducts =
        cartItems.length;

    return (
        <CartContext.Provider
            value={{
                cartItems,

                addToCart,

                removeFromCart,

                increaseQuantity,

                decreaseQuantity,

                clearCart,

                totalItems,

                totalProducts,

                subtotal,

                getSellingPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );

}

export function useCart() {

    return useContext(CartContext);

}
