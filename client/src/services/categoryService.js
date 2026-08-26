import api from "./api";

// ======================================================
// GET ALL DEPARTMENTS
// ======================================================

export const getDepartments = async () => {

    const response =
        await api.get(
            "/categories/departments"
        );

    return response.data;
};

// ======================================================
// GET ALL CATEGORIES
// ======================================================

export const getCategories = async () => {

    const response =
        await api.get(
            "/categories"
        );

    return response.data;
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

    const response =
        await api.get(
            `/categories/department/${encodeURIComponent(
                department
            )}`
        );

    return response.data;
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

    const response =
        await api.get(
            `/categories/${encodeURIComponent(
                category
            )}/subcategories`
        );

    return response.data;
};

// ======================================================
// CREATE CATEGORY
// ======================================================

export const createCategory = async (
    name,
    department
) => {

    const response =
        await api.post(
            "/categories",
            {
                name,
                department
            }
        );

    return response.data;
};

// ======================================================
// CREATE SUBCATEGORY
// ======================================================

export const createSubcategory = async (
    category,
    name
) => {

    const response =
        await api.post(
            "/categories/subcategory",
            {
                category,
                name
            }
        );

    return response.data;
};
