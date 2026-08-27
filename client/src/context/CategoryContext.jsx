import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getDepartments,
  getCategories,
  getCategoriesByDepartment,
  getSubcategories,
} from "../services/categoryService";


const CategoryContext =
  createContext(null);


/*
 * ============================================================
 * NORMALIZE API RESPONSE
 * ============================================================
 *
 * Supports:
 *
 * []
 *
 * {
 *   data: []
 * }
 *
 * {
 *   departments: []
 * }
 *
 * {
 *   categories: []
 * }
 *
 * {
 *   subcategories: []
 * }
 *
 * ============================================================
 */

function normalizeArray(data) {

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.departments)) {
    return data.departments;
  }

  if (Array.isArray(data?.categories)) {
    return data.categories;
  }

  if (Array.isArray(data?.subcategories)) {
    return data.subcategories;
  }

  return [];
}


export function CategoryProvider({
  children,
}) {

  const [
    departments,
    setDepartments,
  ] = useState([]);


  const [
    categories,
    setCategories,
  ] = useState([]);


  const [
    subcategories,
    setSubcategories,
  ] = useState([]);


  const [
    loadingDepartments,
    setLoadingDepartments,
  ] = useState(false);


  const [
    loadingCategories,
    setLoadingCategories,
  ] = useState(false);


  const [
    loadingSubcategories,
    setLoadingSubcategories,
  ] = useState(false);


  const [
    departmentError,
    setDepartmentError,
  ] = useState("");


  const [
    categoryError,
    setCategoryError,
  ] = useState("");


  const [
    subcategoryError,
    setSubcategoryError,
  ] = useState("");


  /*
   * ==========================================================
   * LOAD DEPARTMENTS
   * ==========================================================
   */

  const loadDepartments =
    useCallback(async () => {

      try {

        setLoadingDepartments(true);
        setDepartmentError("");

        const response =
          await getDepartments();

        const data =
          normalizeArray(response);

        console.log(
          "DEPARTMENTS FROM API:",
          data
        );

        setDepartments(data);

        return data;

      } catch (error) {

        console.error(
          "Failed to load departments:",
          error
        );

        setDepartments([]);

        setDepartmentError(
          error?.message ||
            "Failed to load departments."
        );

        return [];

      } finally {

        setLoadingDepartments(false);

      }

    }, []);


  /*
   * ==========================================================
   * LOAD ALL CATEGORIES
   * ==========================================================
   */

  const loadCategories =
    useCallback(async () => {

      try {

        setLoadingCategories(true);
        setCategoryError("");

        const response =
          await getCategories();

        const data =
          normalizeArray(response);

        setCategories(data);

        return data;

      } catch (error) {

        console.error(
          "Failed to load categories:",
          error
        );

        setCategories([]);

        setCategoryError(
          error?.message ||
            "Failed to load categories."
        );

        return [];

      } finally {

        setLoadingCategories(false);

      }

    }, []);


  /*
   * ==========================================================
   * LOAD CATEGORIES BY DEPARTMENT
   * ==========================================================
   */

  const loadCategoriesByDepartment =
    useCallback(
      async (department) => {

        if (!department) {

          setCategories([]);
          setSubcategories([]);

          setCategoryError("");
          setSubcategoryError("");

          return [];
        }


        try {

          setLoadingCategories(true);
          setCategoryError("");

          setCategories([]);
          setSubcategories([]);

          setSubcategoryError("");

          const response =
            await getCategoriesByDepartment(
              department
            );

          const data =
            normalizeArray(response);

          console.log(
            "CATEGORIES FOR DEPARTMENT:",
            department,
            data
          );

          setCategories(data);

          return data;

        } catch (error) {

          console.error(
            "Failed to load categories by department:",
            error
          );

          setCategories([]);
          setSubcategories([]);

          setCategoryError(
            error?.message ||
              "Failed to load categories for this department."
          );

          return [];

        } finally {

          setLoadingCategories(false);

        }

      },
      []
    );


  /*
   * ==========================================================
   * LOAD SUBCATEGORIES
   * ==========================================================
   */

  const loadSubcategories =
    useCallback(
      async (category) => {

        if (!category) {

          setSubcategories([]);
          setSubcategoryError("");

          return [];
        }


        try {

          setLoadingSubcategories(true);
          setSubcategoryError("");

          setSubcategories([]);

          const response =
            await getSubcategories(
              category
            );

          const data =
            normalizeArray(response);

          console.log(
            "SUBCATEGORIES FOR CATEGORY:",
            category,
            data
          );

          setSubcategories(data);

          return data;

        } catch (error) {

          console.error(
            "Failed to load subcategories:",
            error
          );

          setSubcategories([]);

          setSubcategoryError(
            error?.message ||
              "Failed to load subcategories."
          );

          return [];

        } finally {

          setLoadingSubcategories(false);

        }

      },
      []
    );


  /*
   * ==========================================================
   * INITIAL LOAD
   * ==========================================================
   */

  useEffect(() => {

    loadDepartments();

  }, [
    loadDepartments,
  ]);


  /*
   * ==========================================================
   * CONTEXT
   * ==========================================================
   */

  return (
    <CategoryContext.Provider
      value={{

        departments,

        categories,

        subcategories,


        loadingDepartments,

        loadingCategories,

        loadingSubcategories,


        departmentError,

        categoryError,

        subcategoryError,


        loadDepartments,

        loadCategories,

        loadCategoriesByDepartment,

        loadSubcategories,

      }}
    >

      {children}

    </CategoryContext.Provider>
  );
}


export function useCategories() {

  const context =
    useContext(
      CategoryContext
    );

  if (!context) {

    throw new Error(
      "useCategories must be used inside a CategoryProvider."
    );

  }

  return context;
}