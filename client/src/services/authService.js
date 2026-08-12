const API_URL =
  "https://mandilas-market-production.up.railway.app/api/auth";

/**
 * Register a new buyer or seller.
 */
export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role,

      // Store name is required for seller accounts.
      storeName:
        userData.role === "seller"
          ? userData.storeName || ""
          : "",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed."
    );
  }

  return data;
}

/**
 * Login an existing buyer or seller.
 *
 * The backend returns:
 * - message
 * - token
 * - user
 */
export async function loginUser(
  email,
  password
) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Invalid email or password."
    );
  }

  return data;
}