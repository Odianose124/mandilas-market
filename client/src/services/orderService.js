import API_URL from "./api";


/*
 * =========================================================
 * GET SIMPLE USER SESSION
 * =========================================================
 *
 * No JWT.
 *
 * Seller/customer identity comes from:
 *
 * mandilas-user
 *
 * =========================================================
 */
function getSavedUser() {

  const savedUser =
    localStorage.getItem(
      "mandilas-user"
    );

  if (!savedUser) {
    return null;
  }

  try {

    return JSON.parse(
      savedUser
    );

  } catch {

    return null;
  }
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
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(order),
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
        email.trim()
      )}`,
      {
        method: "GET",
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
 * =========================================================
 *
 * NO JWT.
 * NO Authorization header.
 *
 * Seller email comes from:
 *
 * mandilas-user
 *
 * Request:
 *
 * GET /api/orders/seller?email=seller@email.com
 *
 * =========================================================
 */
export async function getOrdersBySellerEmail() {

  const user =
    getSavedUser();


  const sellerEmail =
    user?.email || "";


  if (!sellerEmail) {

    throw new Error(
      "Please login as a seller."
    );
  }


  const response =
    await fetch(
      `${API_URL}/orders/seller?email=${encodeURIComponent(
        sellerEmail.trim()
      )}`,
      {
        method: "GET",
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
 * GET ORDERS BY ORDER STATUS
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
        status.trim()
      )}`,
      {
        method: "GET",
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
        status.trim()
      )}`,
      {
        method: "GET",
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
      `${API_URL}/orders/${id}/status?status=${encodeURIComponent(
        status.trim()
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


/*
 * =========================================================
 * UPDATE PAYMENT STATUS
 * =========================================================
 */
export async function updatePaymentStatus(
  id,
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
      `${API_URL}/orders/${id}/payment-status?status=${encodeURIComponent(
        status.trim()
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