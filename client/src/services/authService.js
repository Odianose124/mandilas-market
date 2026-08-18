const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

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
      storeName:
        userData.role?.toLowerCase() === "seller"
          ? userData.storeName || ""
          : "",
    }),
  });

  const text = await response.text();

  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        message: text,
      };
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Registration failed. Server returned ${response.status}.`
    );
  }

  return data;
}

/**
 * Login an existing buyer or seller.
 */
export async function loginUser(email, password) {
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

  const text = await response.text();

  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        message: text,
      };
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Login failed. Server returned ${response.status}.`
    );
  }

  return data;
}
