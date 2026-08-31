import api from "./api";

/*
 * =========================================================
 * USER SERVICE
 * =========================================================
 *
 * Handles user/seller lookup requests.
 */


/*
 * =========================================================
 * GET USER BY EMAIL
 * =========================================================
 *
 * Used when we have the seller's email from a product
 * but need the seller's database ID for chat.
 */

export const getUserByEmail = async (email) => {

  if (!email || !String(email).trim()) {
    throw new Error("Seller email is unavailable.");
  }

  const response = await api.get(
    `/users/email/${encodeURIComponent(
      String(email).trim()
    )}`
  );

  return response.data;
};