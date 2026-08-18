import API_URL from "./api";

/*
 * =========================================================
 * AUTH HEADERS
 * =========================================================
 */
function getAuthHeaders() {

  const token =
    localStorage.getItem("mandilas-token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
}


/*
 * =========================================================
 * CREATE ORDER
 * =========================================================
 */
export async function createOrder(order) {

  const response =
    await fetch(
      `${API_URL}/orders`,
      {
        method: "POST",

        headers: {
          ...getAuthHeaders(),
        },

        body: JSON.stringify(order),
      }
    );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to create order"
    );
  }

  return response.json();
}


/*
 * =========================================================
 * GET ALL ORDERS
 * =========================================================
 */
export async function getAllOrders() {

  const response =
    await fetch(
      `${API_URL}/orders`,
      {
        method: "GET",

        headers: {
          ...getAuthHeaders(),
        },
      }
    );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to fetch orders"
    );
  }

  return response.json();
}


/*
 * =========================================================
 * GET ONE ORDER
 * =========================================================
 */
export async function getOrderById(id) {

  const response =
    await fetch(
      `${API_URL}/orders/${id}`,
      {
        method: "GET",

        headers: {
          ...getAuthHeaders(),
        },
      }
    );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to fetch order"
    );
  }

  return response.json();
}


/*
 * =========================================================
 * GET CUSTOMER ORDERS
 * =========================================================
 */
export async function getOrdersByEmail(
  email
) {

  if (
    !email ||
    !email.trim()
  ) {

    throw new Error(
      "Customer email is required"
    );
  }

  const response =
    await fetch(
      `${API_URL}/orders/customer/${encodeURIComponent(
        email
      )}`,
      {
        method: "GET",

        headers: {
          ...getAuthHeaders(),
        },
      }
    );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to fetch customer orders"
    );
  }

  return response.json();
}


/*
 * =========================================================
 * GET SELLER ORDERS
 *
 * IMPORTANT:
 *
 * The seller email is NOT sent from the frontend.
 *
 * The backend gets the seller identity from the JWT.
 *
 * Request:
 *
 * GET /api/orders/seller
 * =========================================================
 */
export async function getOrdersBySellerEmail() {

  const response =
    await fetch(
      `${API_URL}/orders/seller`,
      {
        method: "GET",

        headers: {
          ...getAuthHeaders(),
        },
      }
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


/*
 * =========================================================
 * GET ORDERS BY STATUS
 * =========================================================
 */
export async function getOrdersByStatus(
  status
) {

  if (
    !status ||
    !status.trim()
  ) {

    throw new Error(
      "Order status is required"
    );
  }

  const response =
    await fetch(
      `${API_URL}/orders/status/${encodeURIComponent(
        status
      )}`,
      {
        method: "GET",

        headers: {
          ...getAuthHeaders(),
        },
      }
    );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to fetch orders by status"
    );
  }

  return response.json();
}


/*
 * =========================================================
 * GET ORDERS BY PAYMENT STATUS
 * =========================================================
 */
export async function getOrdersByPaymentStatus(
  status
) {

  if (
    !status ||
    !status.trim()
  ) {

    throw new Error(
      "Payment status is required"
    );
  }

  const response =
    await fetch(
      `${API_URL}/orders/payment-status/${encodeURIComponent(
        status
      )}`,
      {
        method: "GET",

        headers: {
          ...getAuthHeaders(),
        },
      }
    );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to fetch orders by payment status"
    );
  }

  return response.json();
}


/*
 * =========================================================
 * UPDATE ORDER STATUS
 * =========================================================
 */
export async function updateOrderStatus(
  id,
  status
) {

  const response =
    await fetch(
      `${API_URL}/orders/${id}/status?status=${encodeURIComponent(
        status
      )}`,
      {
        method: "PUT",

        headers: {
          ...getAuthHeaders(),
        },
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


/*
 * =========================================================
 * UPDATE PAYMENT STATUS
 * =========================================================
 */
export async function updatePaymentStatus(
  id,
  status
) {

  const response =
    await fetch(
      `${API_URL}/orders/${id}/payment-status?status=${encodeURIComponent(
        status
      )}`,
      {
        method: "PUT",

        headers: {
          ...getAuthHeaders(),
        },
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


/*
 * =========================================================
 * DELETE ORDER
 * =========================================================
 */
export async function deleteOrder(id) {

  const response =
    await fetch(
      `${API_URL}/orders/${id}`,
      {
        method: "DELETE",

        headers: {
          ...getAuthHeaders(),
        },
      }
    );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to delete order"
    );
  }

  /*
   * DELETE may return 204 No Content.
   */
  if (
    response.status === 204
  ) {

    return true;
  }

  return response.json();
}