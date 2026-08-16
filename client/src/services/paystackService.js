const API_URL =
  `${import.meta.env.VITE_API_URL}/api/paystack`;

export async function initializePayment(
  email,
  amount
) {
  const response = await fetch(
    `${API_URL}/initialize`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        email,
        amount,
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to initialize payment"
    );
  }

  return response.json();
}

export async function verifyPayment(
  reference
) {
  const response = await fetch(
    `${API_URL}/verify/${encodeURIComponent(
      reference
    )}`
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        "Failed to verify payment"
    );
  }

  return response.json();
}
