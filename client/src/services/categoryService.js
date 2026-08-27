import api from "./api";

/*
 * ============================================================
 * DEPARTMENT API
 * ============================================================
 *
 * The backend exposes:
 *
 * GET /api/departments
 *
 * api.js automatically provides the /api prefix.
 *
 * Therefore we use:
 *
 * api.get("/departments")
 *
 * ============================================================
 */

export const getDepartments = async () => {
  const response = await api.get(
    "/departments"
  );

  return response.data;
};


/*
 * ============================================================
 * GET ALL CATEGORIES
 * ============================================================
 *
 * Backend:
 *
 * GET /api/categories
 *
 * ============================================================
 */

export const getCategories = async () => {
  const response = await api.get(
    "/categories"
  );

  return response.data;
};


/*
 * ============================================================
 * GET CATEGORIES BY DEPARTMENT
 * ============================================================
 *
 * Backend:
 *
 * GET /api/categories/department/{department}
 *
 * ============================================================
 */

export const getCategoriesByDepartment = async (
  department
) => {

  if (!department) {
    return [];
  }

  const response = await api.get(
    `/categories/department/${encodeURIComponent(
      department
    )}`
  );

  return response.data;
};


/*
 * ============================================================
 * GET SUBCATEGORIES BY CATEGORY
 * ============================================================
 *
 * Backend:
 *
 * GET /api/categories/{category}/subcategories
 *
 * ============================================================
 */

export const getSubcategories = async (
  category
) => {

  if (!category) {
    return [];
  }

  const response = await api.get(
    `/categories/${encodeURIComponent(
      category
    )}/subcategories`
  );

  return response.data;
};


/*
 * ============================================================
 * CREATE CATEGORY — ADMIN
 * ============================================================
 *
 * Backend accepts:
 *
 * {
 *   name,
 *   departmentName
 * }
 *
 * ============================================================
 */

export const createCategory = async (
  name,
  department
) => {

  const response = await api.post(
    "/categories",
    {
      name,
      departmentName: department,
    }
  );

  return response.data;
};


/*
 * ============================================================
 * CREATE SUBCATEGORY — ADMIN
 * ============================================================
 *
 * Backend:
 *
 * POST /api/categories/subcategory
 *
 * ============================================================
 */

export const createSubcategory = async (
  category,
  name
) => {

  const response = await api.post(
    "/categories/subcategory",
    {
      category,
      name,
    }
  );

  return response.data;
};