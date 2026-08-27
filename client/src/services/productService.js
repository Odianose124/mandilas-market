const API_URL =
  `${import.meta.env.VITE_API_URL}/products`;

if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is not configured.");
}

function getSellerEmail() {
  const savedUser =
    localStorage.getItem("mandilas-user");

  let sellerUser = null;

  try {
    sellerUser = savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch {
    sellerUser = null;
  }

  return sellerUser?.email || "";
}

async function getErrorMessage(
  response,
  fallbackMessage
) {
  let message = fallbackMessage;

  try {
    const contentType =
      response.headers.get("content-type") || "";

    if (
      contentType.includes("application/json")
    ) {
      const data = await response.json();

      message =
        data?.message ||
        data?.error ||
        data?.details ||
        fallbackMessage;
    } else {
      const text = await response.text();

      if (text) {
        message = text;
      }
    }
  } catch {
    // Keep fallback message.
  }

  return message;
}

async function parseJsonResponse(
  response,
  fallbackMessage
) {
  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      fallbackMessage
    );

    throw new Error(message);
  }

  return response.json();
}

/*
 * =========================================================
 * GET ALL PRODUCTS
 * =========================================================
 */

export async function getAllProducts() {
  const response =
    await fetch(API_URL);

  return parseJsonResponse(
    response,
    "Failed to fetch products"
  );
}

/*
 * =========================================================
 * GET PRODUCT BY ID
 * =========================================================
 */

export async function getProductById(id) {
  const sellerEmail = getSellerEmail();

  const query = sellerEmail
    ? `?email=${encodeURIComponent(
        sellerEmail
      )}`
    : "";

  const response =
    await fetch(
      `${API_URL}/${id}${query}`
    );

  if (response.status === 404) {
    return null;
  }

  return parseJsonResponse(
    response,
    "Failed to fetch product"
  );
}

/*
 * =========================================================
 * CREATE PRODUCT
 * =========================================================
 */

export async function createProduct(product) {
  const formData =
    new FormData();

  const sellerEmail =
    getSellerEmail();

  if (!sellerEmail) {
    throw new Error(
      "Please login as a seller before adding a product."
    );
  }

  /*
   * Seller identity.
   *
   * The current backend expects sellerEmail as a
   * multipart form field and does not require a JWT
   * for this product endpoint.
   */

  formData.append(
    "sellerEmail",
    sellerEmail
  );

  formData.append(
    "name",
    product?.name || ""
  );

  formData.append(
    "description",
    product?.description || ""
  );

  formData.append(
    "price",
    product?.price ?? "0"
  );

  formData.append(
    "stock",
    product?.stock ?? "0"
  );

  /*
   * =======================================================
   * DEPARTMENT → CATEGORY → SUBCATEGORY
   * =======================================================
   *
   * The ProductController currently expects the names
   * through these exact multipart fields:
   *
   * department
   * category
   * subcategory
   *
   * ProductForm sends the selected department/category/
   * subcategory names here.
   */

  formData.append(
    "department",
    product?.department ||
      product?.departmentName ||
      ""
  );

  formData.append(
    "category",
    product?.category ||
      product?.categoryName ||
      ""
  );

  formData.append(
    "subcategory",
    product?.subcategory ||
      product?.subcategoryName ||
      ""
  );

  formData.append(
    "brand",
    product?.brand || ""
  );

  formData.append(
    "sku",
    product?.sku || ""
  );

  formData.append(
    "discountPrice",
    product?.discountPrice ?? "0"
  );

  formData.append(
    "weight",
    product?.weight || ""
  );

  formData.append(
    "deliveryTime",
    product?.deliveryTime || ""
  );

  formData.append(
    "status",
    product?.status || "In Stock"
  );

  formData.append(
    "specifications",
    product?.specifications || ""
  );

  /*
   * =======================================================
   * IMAGES
   * =======================================================
   */

  if (
    Array.isArray(product?.images)
  ) {
    product.images.forEach(
      (image) => {
        if (image instanceof File) {
          formData.append(
            "images",
            image
          );
        }
      }
    );
  }

  /*
   * =======================================================
   * VIDEO
   * =======================================================
   */

  if (
    product?.video instanceof File
  ) {
    formData.append(
      "video",
      product.video
    );
  }

  /*
   * =======================================================
   * REQUEST
   * =======================================================
   *
   * Do NOT set Content-Type manually for FormData.
   * The browser adds the multipart boundary.
   */

  const response =
    await fetch(
      API_URL,
      {
        method: "POST",
        body: formData,
      }
    );

  return parseJsonResponse(
    response,
    `Failed to create product (${response.status})`
  );
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
  const sellerEmail =
    getSellerEmail();

  if (!sellerEmail) {
    throw new Error(
      "Please login as a seller."
    );
  }

  /*
   * Keep the department hierarchy in the JSON
   * sent to the existing PUT endpoint.
   */

  const payload = {
    ...product,

    department:
      product?.department ||
      product?.departmentName ||
      "",

    category:
      product?.category ||
      product?.categoryName ||
      "",

    subcategory:
      product?.subcategory ||
      product?.subcategoryName ||
      "",
  };

  const response =
    await fetch(
      `${API_URL}/${id}?email=${encodeURIComponent(
        sellerEmail
      )}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          payload
        ),
      }
    );

  return parseJsonResponse(
    response,
    "Failed to update product"
  );
}

/*
 * =========================================================
 * DELETE PRODUCT
 * =========================================================
 */

export async function deleteProduct(id) {
  const sellerEmail =
    getSellerEmail();

  if (!sellerEmail) {
    throw new Error(
      "Please login as a seller."
    );
  }

  const response =
    await fetch(
      `${API_URL}/${id}?email=${encodeURIComponent(
        sellerEmail
      )}`,
      {
        method: "DELETE",
      }
    );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response,
        "Failed to delete product"
      );

    throw new Error(message);
  }

  return true;
}

/*
 * =========================================================
 * GET SELLER PRODUCTS
 * =========================================================
 */

export async function getProductsBySeller() {
  const sellerEmail =
    getSellerEmail();

  if (!sellerEmail) {
    throw new Error(
      "Please login as a seller."
    );
  }

  const response =
    await fetch(
      `${API_URL}/seller?email=${encodeURIComponent(
        sellerEmail
      )}`
    );

  return parseJsonResponse(
    response,
    "Failed to fetch seller products"
  );
}

/*
 * =========================================================
 * GET PRODUCTS BY DEPARTMENT
 * =========================================================
 */

export async function getProductsByDepartment(
  department
) {
  if (!department) {
    return [];
  }

  const response =
    await fetch(
      `${API_URL}/department/${encodeURIComponent(
        department
      )}`
    );

  return parseJsonResponse(
    response,
    "Failed to fetch department products"
  );
}

/*
 * =========================================================
 * GET PRODUCTS BY DEPARTMENT + CATEGORY
 * =========================================================
 */

export async function getProductsByDepartmentAndCategory(
  department,
  category
) {
  if (!department || !category) {
    return [];
  }

  const response =
    await fetch(
      `${API_URL}/department/${encodeURIComponent(
        department
      )}/category/${encodeURIComponent(
        category
      )}`
    );

  return parseJsonResponse(
    response,
    "Failed to fetch department and category products"
  );
}

/*
 * =========================================================
 * GET PRODUCTS BY DEPARTMENT + CATEGORY + SUBCATEGORY
 * =========================================================
 */

export async function getProductsByDepartmentAndCategoryAndSubcategory(
  department,
  category,
  subcategory
) {
  if (
    !department ||
    !category ||
    !subcategory
  ) {
    return [];
  }

  const response =
    await fetch(
      `${API_URL}/department/${encodeURIComponent(
        department
      )}/category/${encodeURIComponent(
        category
      )}/subcategory/${encodeURIComponent(
        subcategory
      )}`
    );

  return parseJsonResponse(
    response,
    "Failed to fetch department, category and subcategory products"
  );
}

/*
 * =========================================================
 * GET PRODUCTS BY CATEGORY
 * =========================================================
 */

export async function getProductsByCategory(
  category
) {
  if (!category) {
    return [];
  }

  const response =
    await fetch(
      `${API_URL}/category/${encodeURIComponent(
        category
      )}`
    );

  return parseJsonResponse(
    response,
    "Failed to fetch category products"
  );
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
  if (!category || !subcategory) {
    return [];
  }

  const response =
    await fetch(
      `${API_URL}/category/${encodeURIComponent(
        category
      )}/subcategory/${encodeURIComponent(
        subcategory
      )}`
    );

  return parseJsonResponse(
    response,
    "Failed to fetch category and subcategory products"
  );
}

/*
 * =========================================================
 * GET PRODUCTS BY SUBCATEGORY
 * =========================================================
 */

export async function getProductsBySubcategory(
  subcategory
) {
  if (!subcategory) {
    return [];
  }

  const response =
    await fetch(
      `${API_URL}/subcategory/${encodeURIComponent(
        subcategory
      )}`
    );

  return parseJsonResponse(
    response,
    "Failed to fetch subcategory products"
  );
}

/*
 * =========================================================
 * SEARCH PRODUCTS
 * =========================================================
 */

export async function searchProducts(name) {
  const term =
    name?.trim();

  if (!term) {
    return getAllProducts();
  }

  const response =
    await fetch(
      `${API_URL}/search?name=${encodeURIComponent(
        term
      )}`
    );

  return parseJsonResponse(
    response,
    "Failed to search products"
  );
}
