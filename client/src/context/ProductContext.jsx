import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getAllProducts as fetchAllProducts,
  getProductById,
  getProductsBySeller,
  getProductsByCategory,
  getProductsByCategoryAndSubcategory,
  getProductsBySubcategory,
  searchProducts,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
} from "../services/productService";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
   * =========================================================
   * LOAD ALL PRODUCTS
   * =========================================================
   *
   * Loads products directly from the live backend.
   *
   * IMPORTANT:
   * This function RETURNS the products as well as updating
   * the context state.
   *
   * Shop.jsx depends on this return value when it does:
   *
   * const result = await getAllProducts();
   *
   * Therefore, returning the fetched array is required.
   */

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchAllProducts();

      const productList = Array.isArray(data)
        ? data
        : [];

      setProducts(productList);

      /*
       * IMPORTANT:
       * Return the products so Shop.jsx and other components
       * can directly use the result.
       */
      return productList;
    } catch (err) {
      console.error(
        "Failed to load products:",
        err
      );

      const message =
        err?.message ||
        "Failed to load products";

      setError(message);

      /*
       * Return an empty array instead of undefined.
       *
       * This prevents Shop.jsx from receiving undefined
       * when it expects an array.
       */
      return [];
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * INITIAL PRODUCT LOAD
   * =========================================================
   */

  useEffect(() => {
    loadProducts();
  }, []);

  /*
   * =========================================================
   * ADD PRODUCT
   * =========================================================
   *
   * Used when a seller creates/uploads a product.
   */

  const addProduct = async (
    productData
  ) => {
    try {
      setError(null);

      const savedProduct =
        await createProductApi(
          productData
        );

      /*
       * Add the newly created product to
       * the current frontend state.
       */
      setProducts(
        (currentProducts) => [
          ...currentProducts,
          savedProduct,
        ]
      );

      return savedProduct;
    } catch (err) {
      console.error(
        "Failed to add product:",
        err
      );

      const message =
        err?.message ||
        "Failed to add product";

      setError(message);

      throw err;
    }
  };

  /*
   * =========================================================
   * UPDATE PRODUCT
   * =========================================================
   */

  const updateProduct = async (
    productId,
    productData
  ) => {
    try {
      setError(null);

      const updatedProduct =
        await updateProductApi(
          productId,
          productData
        );

      /*
       * Replace the old product with
       * the updated product.
       */
      setProducts(
        (currentProducts) =>
          currentProducts.map(
            (product) =>
              String(product.id) ===
              String(productId)
                ? updatedProduct
                : product
          )
      );

      return updatedProduct;
    } catch (err) {
      console.error(
        "Failed to update product:",
        err
      );

      const message =
        err?.message ||
        "Failed to update product";

      setError(message);

      throw err;
    }
  };

  /*
   * =========================================================
   * DELETE PRODUCT
   * =========================================================
   */

  const deleteProduct = async (
    productId
  ) => {
    try {
      setError(null);

      await deleteProductApi(
        productId
      );

      /*
       * Remove the deleted product
       * from frontend state.
       */
      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (product) =>
              String(product.id) !==
              String(productId)
          )
      );
    } catch (err) {
      console.error(
        "Failed to delete product:",
        err
      );

      const message =
        err?.message ||
        "Failed to delete product";

      setError(message);

      throw err;
    }
  };

  /*
   * =========================================================
   * GET ONE PRODUCT
   * =========================================================
   */

  const getProduct = async (
    productId
  ) => {
    try {
      setError(null);

      return await getProductById(
        productId
      );
    } catch (err) {
      console.error(
        "Failed to get product:",
        err
      );

      const message =
        err?.message ||
        "Failed to get product";

      setError(message);

      throw err;
    }
  };

  /*
   * =========================================================
   * GET SELLER PRODUCTS
   * =========================================================
   *
   * Used by the seller dashboard.
   */

  const getSellerProducts =
    async (sellerEmail) => {
      try {
        setError(null);

        return await getProductsBySeller(
          sellerEmail
        );
      } catch (err) {
        console.error(
          "Failed to get seller products:",
          err
        );

        const message =
          err?.message ||
          "Failed to get seller products";

        setError(message);

        throw err;
      }
    };

  /*
   * =========================================================
   * GET PRODUCTS BY CATEGORY
   * =========================================================
   *
   * Example:
   *
   * Men's Wear
   * Women's Wear
   * Shoes
   * Bags
   * Watches
   */

  const getCategoryProducts =
    async (category) => {
      try {
        setError(null);

        return await getProductsByCategory(
          category
        );
      } catch (err) {
        console.error(
          "Failed to get category products:",
          err
        );

        const message =
          err?.message ||
          "Failed to get category products";

        setError(message);

        throw err;
      }
    };

  /*
   * =========================================================
   * GET PRODUCTS BY CATEGORY + SUBCATEGORY
   * =========================================================
   *
   * Example:
   *
   * Men's Wear -> Shirts
   * Women's Wear -> Dresses
   * Shoes -> Sneakers
   */

  const getCategoryAndSubcategoryProducts =
    async (
      category,
      subcategory
    ) => {
      try {
        setError(null);

        return await getProductsByCategoryAndSubcategory(
          category,
          subcategory
        );
      } catch (err) {
        console.error(
          "Failed to get category and subcategory products:",
          err
        );

        const message =
          err?.message ||
          "Failed to get category and subcategory products";

        setError(message);

        throw err;
      }
    };

  /*
   * =========================================================
   * GET PRODUCTS BY SUBCATEGORY
   * =========================================================
   */

  const getSubcategoryProducts =
    async (subcategory) => {
      try {
        setError(null);

        return await getProductsBySubcategory(
          subcategory
        );
      } catch (err) {
        console.error(
          "Failed to get subcategory products:",
          err
        );

        const message =
          err?.message ||
          "Failed to get subcategory products";

        setError(message);

        throw err;
      }
    };

  /*
   * =========================================================
   * SEARCH PRODUCTS
   * =========================================================
   *
   * Search is handled by the backend.
   *
   * Searches:
   * - Product name
   * - Category
   * - Subcategory
   * - Brand
   * - Description
   */

  const searchProductList =
    async (name) => {
      try {
        setError(null);

        return await searchProducts(
          name
        );
      } catch (err) {
        console.error(
          "Failed to search products:",
          err
        );

        const message =
          err?.message ||
          "Failed to search products";

        setError(message);

        throw err;
      }
    };

  /*
   * =========================================================
   * CLEAR ERROR
   * =========================================================
   *
   * Useful for forms/pages that need to manually clear
   * an existing product error.
   */

  const clearError = () => {
    setError(null);
  };

  /*
   * =========================================================
   * CONTEXT VALUE
   * =========================================================
   */

  const contextValue = {
    /*
     * -------------------------------------------------------
     * CURRENT PRODUCTS
     * -------------------------------------------------------
     */

    products,

    /*
     * -------------------------------------------------------
     * LOADING
     * -------------------------------------------------------
     */

    loading,

    /*
     * -------------------------------------------------------
     * ERROR
     * -------------------------------------------------------
     */

    error,

    /*
     * -------------------------------------------------------
     * ERROR CONTROL
     * -------------------------------------------------------
     */

    clearError,

    /*
     * -------------------------------------------------------
     * PRODUCT MANAGEMENT
     * -------------------------------------------------------
     */

    addProduct,

    updateProduct,

    deleteProduct,

    /*
     * -------------------------------------------------------
     * SINGLE PRODUCT
     * -------------------------------------------------------
     */

    getProduct,

    /*
     * -------------------------------------------------------
     * SELLER PRODUCTS
     * -------------------------------------------------------
     */

    getSellerProducts,

    /*
     * -------------------------------------------------------
     * ALL PRODUCTS
     * -------------------------------------------------------
     *
     * IMPORTANT:
     * getAllProducts now RETURNS an array.
     *
     * This is required by Shop.jsx.
     */

    getAllProducts:
      loadProducts,

    /*
     * -------------------------------------------------------
     * CATEGORY PRODUCTS
     * -------------------------------------------------------
     */

    getCategoryProducts,

    /*
     * -------------------------------------------------------
     * CATEGORY + SUBCATEGORY
     * -------------------------------------------------------
     */

    getCategoryAndSubcategoryProducts,

    /*
     * -------------------------------------------------------
     * SUBCATEGORY PRODUCTS
     * -------------------------------------------------------
     */

    getSubcategoryProducts,

    /*
     * -------------------------------------------------------
     * SEARCH
     * -------------------------------------------------------
     *
     * Both names are exposed for compatibility.
     *
     * Shop.jsx currently uses:
     *
     * searchProductList
     *
     * Other components can use:
     *
     * searchProducts
     */

    searchProductList,

    searchProducts:
      searchProductList,

    /*
     * -------------------------------------------------------
     * REFRESH PRODUCTS
     * -------------------------------------------------------
     *
     * Alias that can be used by seller/admin pages after
     * creating/updating/deleting products.
     */

    refreshProducts:
      loadProducts,
  };

  /*
   * =========================================================
   * PROVIDER
   * =========================================================
   */

  return (
    <ProductContext.Provider
      value={contextValue}
    >
      {children}
    </ProductContext.Provider>
  );
}

/*
 * ===========================================================
 * USE PRODUCTS HOOK
 * ===========================================================
 */

export function useProducts() {
  const context =
    useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside a ProductProvider"
    );
  }

  return context;
}