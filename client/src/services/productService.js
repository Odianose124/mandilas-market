const API_URL = "http://localhost:8080/api/products";

/**
 * Get all products from the Mandilas Market backend.
 */
export async function getAllProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

/**
 * Get a single product by ID.
 */
export async function getProductById(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error("Failed to fetch product");
  }

  return response.json();
}

/**
 * Create a new product.
 *
 * Sends product information, multiple images,
 * and an optional video using multipart/form-data.
 */
export async function createProduct(product) {
  const formData = new FormData();

  // Basic product information
  formData.append("name", product.name || "");
  formData.append("description", product.description || "");
  formData.append("price", product.price || 0);
  formData.append("stock", product.stock || 0);
  formData.append("category", product.category || "");

  // Additional product information
  formData.append("brand", product.brand || "");
  formData.append("sku", product.sku || "");
  formData.append(
    "discountPrice",
    product.discountPrice || 0
  );
  formData.append("weight", product.weight || "");
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

  // Seller information
  formData.append(
    "sellerEmail",
    product.sellerEmail || ""
  );

  formData.append(
    "sellerName",
    product.sellerName || ""
  );

  /**
   * Multiple product images.
   *
   * The backend expects:
   * @RequestParam("images") MultipartFile[] images
   */
  if (product.images && product.images.length > 0) {
    product.images.forEach((image) => {
      if (image) {
        formData.append("images", image);
      }
    });
  }

  /**
   * Product video.
   *
   * The backend expects:
   * @RequestParam("video") MultipartFile video
   */
  if (product.video) {
    formData.append("video", product.video);
  }

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Failed to create product"
    );
  }

  return response.json();
}

/**
 * Update an existing product.
 *
 * The current backend update endpoint accepts JSON.
 */
export async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Failed to update product"
    );
  }

  return response.json();
}

/**
 * Delete a product.
 */
export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Failed to delete product"
    );
  }

  return true;
}

/**
 * Get products belonging to a specific seller.
 */
export async function getProductsBySeller(sellerEmail) {
  const response = await fetch(
    `${API_URL}/seller/${encodeURIComponent(
      sellerEmail
    )}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch seller products"
    );
  }

  return response.json();
}

/**
 * Get products by category.
 */
export async function getProductsByCategory(category) {
  const response = await fetch(
    `${API_URL}/category/${encodeURIComponent(category)}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch category products"
    );
  }

  return response.json();
}

/**
 * Search products by name.
 */
export async function searchProducts(name) {
  const response = await fetch(
    `${API_URL}/search?name=${encodeURIComponent(name)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  return response.json();
}
