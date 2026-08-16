const API_URL =
  `${import.meta.env.VITE_API_URL}/api/products`;


/*
 * =========================================================
 * AUTH HEADERS
 * =========================================================
 */

function getAuthHeaders() {
  const token =
    localStorage.getItem(
      "mandilas-token"
    );

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}


/*
 * =========================================================
 * GET ALL PRODUCTS
 * =========================================================
 */

export async function getAllProducts() {
  const response =
    await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      "Failed to fetch products"
    );
  }

  return response.json();
}


/*
 * =========================================================
 * GET PRODUCT BY ID
 * =========================================================
 */

export async function getProductById(
  id
) {
  const response =
    await fetch(
      `${API_URL}/${id}`
    );

  if (!response.ok) {

    if (
      response.status === 404
    ) {
      return null;
    }

    throw new Error(
      "Failed to fetch product"
    );
  }

  return response.json();
}


/*
 * =========================================================
 * CREATE PRODUCT
 * =========================================================
 */

export async function createProduct(
  product
) {

  const formData =
    new FormData();

  formData.append(
    "name",
    product.name || ""
  );

  formData.append(
    "description",
    product.description || ""
  );

  formData.append(
    "price",
    product.price ?? "0"
  );

  formData.append(
    "stock",
    product.stock ?? "0"
  );

  formData.append(
    "category",
    product.category || ""
  );

  formData.append(
    "subcategory",
    product.subcategory || ""
  );

  formData.append(
    "brand",
    product.brand || ""
  );

  formData.append(
    "sku",
    product.sku || ""
  );

  formData.append(
    "discountPrice",
    product.discountPrice ?? "0"
  );

  formData.append(
    "weight",
    product.weight || ""
  );

  formData.append(
    "deliveryTime",
    product.deliveryTime || ""
  );

  formData.append(
    "status",
    product.status || "In Stock"
  );

  formData.append(
    "specifications",
    product.specifications || ""
  );


  /*
   * IMAGES
   */

  if (
    Array.isArray(
      product.images
    )
  ) {

    product.images.forEach(
      (image) => {

        if (
          image instanceof File
        ) {

          formData.append(
            "images",
            image
          );

        }

      }
    );

  }


  /*
   * VIDEO
   */

  if (
    product.video instanceof File
  ) {

    formData.append(
      "video",
      product.video
    );

  }


  /*
   * REQUEST
   */

  const response =
    await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          ...getAuthHeaders(),
        },

        body: formData,
      }
    );


  if (!response.ok) {

    let message =
      `Failed to create product (${response.status})`;

    try {

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        contentType.includes(
          "application/json"
        )
      ) {

        const data =
          await response.json();

        if (data.message) {
          message =
            data.message;
        }

      } else {

        const text =
          await response.text();

        if (text) {
          message = text;
        }

      }

    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}


/*
 * =========================================================
 * UPDATE PRODUCT
 * =========================================================
 */

export async function updateProduct(
  id,
  product
) {

  const response =
    await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",

          ...getAuthHeaders(),
        },

        body:
          JSON.stringify(
            product
          ),
      }
    );


  if (!response.ok) {

    let message =
      "Failed to update product";

    try {

      const data =
        await response.json();

      if (data.message) {
        message =
          data.message;
      }

    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}


/*
 * =========================================================
 * DELETE PRODUCT
 * =========================================================
 */

export async function deleteProduct(
  id
) {

  const response =
    await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",

        headers: {
          ...getAuthHeaders(),
        },
      }
    );


  if (!response.ok) {

    let message =
      "Failed to delete product";

    try {

      const data =
        await response.json();

      if (data.message) {
        message =
          data.message;
      }

    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return true;
}


/*
 * =========================================================
 * GET SELLER PRODUCTS
 * =========================================================
 *
 * Seller identity comes from JWT.
 *
 * IMPORTANT:
 * We intentionally do NOT send sellerEmail
 * in the URL.
 */

export async function getProductsBySeller() {

  const response =
    await fetch(
      `${API_URL}/seller`,
      {
        method: "GET",

        headers: {
          ...getAuthHeaders(),
        },
      }
    );


  if (!response.ok) {

    let message =
      "Failed to fetch seller products";

    try {

      const data =
        await response.json();

      if (data.message) {
        message =
          data.message;
      }

    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}


/*
 * =========================================================
 * GET PRODUCTS BY CATEGORY
 * =========================================================
 */

export async function getProductsByCategory(
  category
) {

  const response =
    await fetch(
      `${API_URL}/category/${encodeURIComponent(
        category
      )}`
    );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch category products"
    );
  }

  return response.json();
}


/*
 * =========================================================
 * GET PRODUCTS BY CATEGORY + SUBCATEGORY
 * =========================================================
 */

export async function getProductsByCategoryAndSubcategory(
  category,
  subcategory
) {

  const response =
    await fetch(
      `${API_URL}/category/${encodeURIComponent(
        category
      )}/subcategory/${encodeURIComponent(
        subcategory
      )}`
    );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch category and subcategory products"
    );
  }

  return response.json();
}


/*
 * =========================================================
 * GET PRODUCTS BY SUBCATEGORY
 * =========================================================
 */

export async function getProductsBySubcategory(
  subcategory
) {

  const response =
    await fetch(
      `${API_URL}/subcategory/${encodeURIComponent(
        subcategory
      )}`
    );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch subcategory products"
    );
  }

  return response.json();
}


/*
 * =========================================================
 * SEARCH PRODUCTS
 * =========================================================
 */

export async function searchProducts(
  name
) {

  const term =
    name?.trim();


  /*
   * Empty search = all products
   */

  if (!term) {
    return getAllProducts();
  }


  const response =
    await fetch(
      `${API_URL}/search?name=${encodeURIComponent(
        term
      )}`
    );


  if (!response.ok) {

    let message =
      "Failed to search products";

    try {

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        contentType.includes(
          "application/json"
        )
      ) {

        const data =
          await response.json();

        if (data.message) {
          message =
            data.message;
        }

      } else {

        const text =
          await response.text();

        if (text) {
          message = text;
        }

      }

    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}