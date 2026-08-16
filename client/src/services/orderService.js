const API_URL =
  `${import.meta.env.VITE_API_URL}/api/orders`;

function getAuthHeaders() {
  const token =
    localStorage.getItem("mandilas-token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createOrder(orderData) {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },

    body: JSON.stringify(orderData),
  });

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

export async function getAllOrders() {
  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(
      "Failed to fetch orders"
    );
  }

  return response.json();
}

export async function getOrderById(id) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "GET",

      headers: {
        ...getAuthHeaders(),
      },
    }
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

export async function getOrdersByEmail(
  email
) {
  const response = await fetch(
    `${API_URL}/customer/${encodeURIComponent(
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
    throw new Error(
      "Failed to fetch customer orders"
    );
  }

  return response.json();
}

export async function getOrdersBySellerEmail(
  email
) {
  if (!email || !email.trim()) {
    throw new Error(
      "Seller email is required"
    );
  }

  const response = await fetch(
    `${API_URL}/seller/${encodeURIComponent(
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
        "Failed to fetch seller orders"
    );
  }

  return response.json();
}

export async function getOrdersByStatus(
  status
) {
  const response = await fetch(
    `${API_URL}/status/${encodeURIComponent(
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
    throw new Error(
      "Failed to fetch orders by status"
    );
  }

  return response.json();
}

export async function getOrdersByPaymentStatus(
  status
) {
  const response = await fetch(
    `${API_URL}/payment-status/${encodeURIComponent(
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
    throw new Error(
      "Failed to fetch orders by payment status"
    );
  }

  return response.json();
}

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

export async function deleteOrder(id) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",

      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete order"
    );
  }

  return true;
}
