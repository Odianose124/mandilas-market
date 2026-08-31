import api from "./api";

/*
 * =========================================================
 * GET PUBLIC STORE
 * =========================================================
 *
 * GET /api/stores/{slug}
 */
export async function getStoreBySlug(slug) {
  if (!slug) {
    throw new Error("Store slug is required.");
  }

  const response = await api.get(
    `/stores/${encodeURIComponent(slug)}`
  );

  return response.data;
}


/*
 * =========================================================
 * GET STORE PRODUCTS
 * =========================================================
 *
 * GET /api/stores/{slug}/products
 */
export async function getStoreProducts(slug) {
  if (!slug) {
    throw new Error("Store slug is required.");
  }

  const response = await api.get(
    `/stores/${encodeURIComponent(slug)}/products`
  );

  return response.data;
}


/*
 * =========================================================
 * GET STORE PRODUCTS - NEWEST FIRST
 * =========================================================
 */
export async function getStoreProductsNewest(slug) {
  if (!slug) {
    throw new Error("Store slug is required.");
  }

  const response = await api.get(
    `/stores/${encodeURIComponent(slug)}/products/newest`
  );

  return response.data;
}


/*
 * =========================================================
 * GET STORE PRODUCTS BY CATEGORY
 * =========================================================
 */
export async function getStoreProductsByCategory(
  slug,
  category
) {
  if (!slug) {
    throw new Error("Store slug is required.");
  }

  if (!category) {
    throw new Error("Category is required.");
  }

  const response = await api.get(
    `/stores/${encodeURIComponent(
      slug
    )}/products/category/${encodeURIComponent(
      category
    )}`
  );

  return response.data;
}


/*
 * =========================================================
 * GET STORE BY SELLER EMAIL
 * =========================================================
 *
 * Used when we need to find the seller's store from a
 * product's sellerEmail.
 */
export async function getStoreBySellerEmail(
  email
) {
  if (!email) {
    throw new Error(
      "Seller email is required."
    );
  }

  const response = await api.get(
    `/stores/seller/${encodeURIComponent(email)}`
  );

  return response.data;
}