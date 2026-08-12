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
 * Get a single product by its ID.
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
 */
export async function createProduct(product) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        throw new Error("Failed to create product");
    }

    return response.json();
}

/**
 * Update an existing product.
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
        throw new Error("Failed to update product");
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
        throw new Error("Failed to delete product");
    }

    return true;
}

/**
 * Get products belonging to a specific seller.
 */
export async function getProductsBySeller(sellerEmail) {
    const response = await fetch(
        `${API_URL}/seller/${encodeURIComponent(sellerEmail)}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch seller products");
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
        throw new Error("Failed to fetch category products");
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