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

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
   * ==========================================
   * LOAD ALL PRODUCTS
   * ==========================================
   *
   * Products come directly from the live backend.
   */
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchAllProducts();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Failed to load products:",
        err
      );

      setError(
        err.message || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==========================================
   * ADD PRODUCT
   * ==========================================
   *
   * Used when a seller uploads a new product.
   *
   * The product is saved in the backend/database
   * and then added to the current frontend state.
   */
  const addProduct = async (productData) => {
    try {
      setError(null);

      const savedProduct =
        await createProductApi(productData);

      setProducts((currentProducts) => [
        ...currentProducts,
        savedProduct,
      ]);

      return savedProduct;
    } catch (err) {
      console.error(
        "Failed to add product:",
        err
      );

      setError(
        err.message || "Failed to add product"
      );

      throw err;
    }
  };

  /*
   * ==========================================
   * UPDATE PRODUCT
   * ==========================================
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

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productId
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

      setError(
        err.message || "Failed to update product"
      );

      throw err;
    }
  };

  /*
   * ==========================================
   * DELETE PRODUCT
   * ==========================================
   */
  const deleteProduct = async (productId) => {
    try {
      setError(null);

      await deleteProductApi(productId);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== productId
        )
      );
    } catch (err) {
      console.error(
        "Failed to delete product:",
        err
      );

      setError(
        err.message || "Failed to delete product"
      );

      throw err;
    }
  };

  /*
   * ==========================================
   * GET ONE PRODUCT
   * ==========================================
   */
  const getProduct = async (productId) => {
    try {
      setError(null);

      return await getProductById(productId);
    } catch (err) {
      console.error(
        "Failed to get product:",
        err
      );

      setError(
        err.message || "Failed to get product"
      );

      throw err;
    }
  };

  /*
   * ==========================================
   * GET SELLER PRODUCTS
   * ==========================================
   *
   * Returns products belonging to one seller.
   */
  const getSellerProducts = async (
    sellerEmail
  ) => {
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

      setError(
        err.message ||
          "Failed to get seller products"
      );

      throw err;
    }
  };

  /*
   * ==========================================
   * GET PRODUCTS BY CATEGORY
   * ==========================================
   *
   * Example:
   *
   * Men's Wear
   * Women's Wear
   * Shoes
   * Bags
   * Watches
   */
  const getCategoryProducts = async (
    category
  ) => {
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

      setError(
        err.message ||
          "Failed to get category products"
      );

      throw err;
    }
  };

  /*
   * ==========================================
   * GET PRODUCTS BY CATEGORY + SUBCATEGORY
   * ==========================================
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

        setError(
          err.message ||
            "Failed to get category and subcategory products"
        );

        throw err;
      }
    };

  /*
   * ==========================================
   * GET PRODUCTS BY SUBCATEGORY
   * ==========================================
   */
  const getSubcategoryProducts = async (
    subcategory
  ) => {
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

      setError(
        err.message ||
          "Failed to get subcategory products"
      );

      throw err;
    }
  };

  /*
   * ==========================================
   * SEARCH PRODUCTS
   * ==========================================
   *
   * Search is performed by the backend.
   */
  const searchProductList = async (name) => {
    try {
      setError(null);

      return await searchProducts(name);
    } catch (err) {
      console.error(
        "Failed to search products:",
        err
      );

      setError(
        err.message ||
          "Failed to search products"
      );

      throw err;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        /*
         * Current live products.
         */
        products,

        /*
         * Loading state.
         */
        loading,

        /*
         * Error state.
         */
        error,

        /*
         * Product management.
         */
        addProduct,
        updateProduct,
        deleteProduct,

        /*
         * Individual product.
         */
        getProduct,

        /*
         * Seller products.
         */
        getSellerProducts,

        /*
         * Reload all products.
         */
        getAllProducts: loadProducts,

        /*
         * Category.
         */
        getCategoryProducts,

        /*
         * Category + subcategory.
         */
        getCategoryAndSubcategoryProducts,

        /*
         * Subcategory.
         */
        getSubcategoryProducts,

        /*
         * Search.
         */
        searchProducts:
          searchProductList,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}