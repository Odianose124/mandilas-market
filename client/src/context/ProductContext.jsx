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

  // Load products from backend
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchAllProducts();

      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add product
  const addProduct = async (productData) => {
    try {
      setError(null);

      const savedProduct = await createProductApi(productData);

      setProducts((currentProducts) => [
        ...currentProducts,
        savedProduct,
      ]);

      return savedProduct;
    } catch (err) {
      console.error("Failed to add product:", err);
      setError(err.message);

      throw err;
    }
  };

  // Update product
  const updateProduct = async (productId, productData) => {
    try {
      setError(null);

      const updatedProduct = await updateProductApi(
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
      console.error("Failed to update product:", err);
      setError(err.message);

      throw err;
    }
  };

  // Delete product
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
      console.error("Failed to delete product:", err);
      setError(err.message);

      throw err;
    }
  };

  // Get one product
  const getProduct = async (productId) => {
    try {
      setError(null);

      return await getProductById(productId);
    } catch (err) {
      console.error("Failed to get product:", err);
      setError(err.message);

      throw err;
    }
  };

  // Get seller products
  const getSellerProducts = async (sellerEmail) => {
    try {
      setError(null);

      return await getProductsBySeller(sellerEmail);
    } catch (err) {
      console.error("Failed to get seller products:", err);
      setError(err.message);

      throw err;
    }
  };

  // Get products by category
  const getCategoryProducts = async (category) => {
    try {
      setError(null);

      return await getProductsByCategory(category);
    } catch (err) {
      console.error("Failed to get category products:", err);
      setError(err.message);

      throw err;
    }
  };

  // Search products
  const searchProductList = async (name) => {
    try {
      setError(null);

      return await searchProducts(name);
    } catch (err) {
      console.error("Failed to search products:", err);
      setError(err.message);

      throw err;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,

        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        getSellerProducts,
        getAllProducts: loadProducts,

        getCategoryProducts,
        searchProducts: searchProductList,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}