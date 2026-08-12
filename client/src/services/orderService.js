const API_URL = "https://mandilas-market-production.up.railway.app/api/orders";

/**
 * Create a new order.
 */
export async function createOrder(orderData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            errorText || "Failed to create order"
        );
    }

    return response.json();
}

/**
 * Get all orders.
 */
export async function getAllOrders() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(
            "Failed to fetch orders"
        );
    }

    return response.json();
}

/**
 * Get one order by ID.
 */
export async function getOrderById(id) {
    const response = await fetch(
        `${API_URL}/${id}`
    );

    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }

        throw new Error(
            "Failed to fetch order"
        );
    }

    return response.json();
}

/**
 * Get orders belonging to a customer.
 */
export async function getOrdersByEmail(email) {
    const response = await fetch(
        `${API_URL}/customer/${encodeURIComponent(
            email
        )}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch customer orders"
        );
    }

    return response.json();
}

/**
 * Get orders belonging to a seller.
 *
 * The backend uses sellerEmail stored inside
 * each OrderItem to find the seller's orders.
 */
export async function getOrdersBySellerEmail(email) {
    if (!email || !email.trim()) {
        throw new Error(
            "Seller email is required"
        );
    }

    const response = await fetch(
        `${API_URL}/seller/${encodeURIComponent(
            email
        )}`
    );

    if (!response.ok) {
        const errorText =
            await response.text();

        throw new Error(
            errorText ||
            "Failed to fetch seller orders"
        );
    }

    return response.json();
}

/**
 * Get orders by order status.
 */
export async function getOrdersByStatus(status) {
    const response = await fetch(
        `${API_URL}/status/${encodeURIComponent(
            status
        )}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch orders by status"
        );
    }

    return response.json();
}

/**
 * Get orders by payment status.
 */
export async function getOrdersByPaymentStatus(status) {
    const response = await fetch(
        `${API_URL}/payment-status/${encodeURIComponent(
            status
        )}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch orders by payment status"
        );
    }

    return response.json();
}

/**
 * Update order status.
 */
export async function updateOrderStatus(
    id,
    status
) {
    const response = await fetch(
        `${API_URL}/${id}/status?status=${encodeURIComponent(
            status
        )}`,
        {
            method: "PUT",
        }
    );

    if (!response.ok) {
        const errorText =
            await response.text();

        throw new Error(
            errorText ||
            "Failed to update order status"
        );
    }

    return response.json();
}

/**
 * Update payment status.
 */
export async function updatePaymentStatus(
    id,
    status
) {
    const response = await fetch(
        `${API_URL}/${id}/payment-status?status=${encodeURIComponent(
            status
        )}`,
        {
            method: "PUT",
        }
    );

    if (!response.ok) {
        const errorText =
            await response.text();

        throw new Error(
            errorText ||
            "Failed to update payment status"
        );
    }

    return response.json();
}

/**
 * Delete an order.
 */
export async function deleteOrder(id) {
    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to delete order"
        );
    }

    return true;
}
