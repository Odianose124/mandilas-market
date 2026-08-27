const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not configured.");
}

async function parseError(response, fallbackMessage) {
  let message = fallbackMessage;

  try {
    const contentType =
      response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();

      message =
        data?.error ||
        data?.message ||
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

async function requestJson(
  url,
  options,
  fallbackMessage
) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const message = await parseError(
      response,
      fallbackMessage
    );

    throw new Error(message);
  }

  return response.json();
}


// ======================================================
// GET ALL DEPARTMENTS
// ======================================================

export const getDepartments = async () => {
  return requestJson(
    `${API_URL}/categories/departments`,
    undefined,
    "Failed to load departments."
  );
};


// ======================================================
// GET ALL CATEGORIES
// ======================================================

export const getCategories = async () => {
  return requestJson(
    `${API_URL}/categories`,
    undefined,
    "Failed to load categories."
  );
};


// ======================================================
// GET CATEGORIES BY DEPARTMENT
// ======================================================

export const getCategoriesByDepartment = async (
  department
) => {
  if (!department) {
    return [];
  }

  return requestJson(
    `${API_URL}/categories/department/${encodeURIComponent(
      department
    )}`,
    undefined,
    "Failed to load categories for this department."
  );
};


// ======================================================
// GET SUBCATEGORIES BY CATEGORY
// ======================================================

export const getSubcategories = async (
  category
) => {
  if (!category) {
    return [];
  }

  return requestJson(
    `${API_URL}/categories/${encodeURIComponent(
      category
    )}/subcategories`,
    undefined,
    "Failed to load subcategories."
  );
};


// ======================================================
// CREATE CATEGORY — ADMIN
// ======================================================

export const createCategory = async (
  name,
  department
) => {
  return requestJson(
    `${API_URL}/categories`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        department,
      }),
    },
    "Failed to create category."
  );
};


// ======================================================
// CREATE SUBCATEGORY — ADMIN
// ======================================================

export const createSubcategory = async (
  category,
  name
) => {
  return requestJson(
    `${API_URL}/categories/subcategory`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category,
        name,
      }),
    },
    "Failed to create subcategory."
  );
};