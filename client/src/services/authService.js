const API_URL =
  "https://mandilas-market-production.up.railway.app/api/auth";

/**
 * Register a new buyer or seller.
 *
 * Expected backend response:
 *
 * {
 *   message: "...",
 *   token: "...",
 *   user: {
 *     id,
 *     firstName,
 *     lastName,
 *     email,
 *     phone,
 *     role,
 *     storeName,
 *     sellerVerified
 *   }
 * }
 */
export async function registerUser(userData) {
  const response = await fetch(
    `${API_URL}/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        firstName:
          userData.firstName,

        lastName:
          userData.lastName,

        email:
          userData.email,

        phone:
          userData.phone,

        password:
          userData.password,

        role:
          userData.role,

        /*
         * Store name is only sent for sellers.
         */
        storeName:
          userData.role === "seller"
            ? userData.storeName || ""
            : "",
      }),
    }
  );

  /*
   * Read the backend response.
   */
  const data = await response.json();

  /*
   * Handle registration errors.
   */
  if (!response.ok) {
    throw new Error(
      data.message ||
        "Registration failed."
    );
  }

  /*
   * Return the complete backend response.
   */
  return data;
}

/**
 * Login an existing buyer or seller.
 *
 * Backend response:
 *
 * {
 *   message,
 *   token,
 *   user
 * }
 */
export async function loginUser(
  email,
  password
) {
  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  /*
   * Read backend response.
   */
  const data = await response.json();

  /*
   * Handle login errors.
   */
  if (!response.ok) {
    throw new Error(
      data.message ||
        "Invalid email or password."
    );
  }

  /*
   * Return:
   * message
   * token
   * user
   */
  return data;
}