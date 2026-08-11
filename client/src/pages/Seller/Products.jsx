
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";

import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";

function Products() {
  const {
    getSellerProducts,
    deleteProduct,
  } = useProducts();

  const { user } = useAuth();

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // Load products belonging to the logged-in seller
  const loadSellerProducts = async () => {
    if (!user?.email) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const sellerProducts = await getSellerProducts(user.email);

      setProducts(sellerProducts || []);
    } catch (err) {
      console.error("Failed to load seller products:", err);

      setError(
        err.message || "Failed to load your products."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellerProducts();
  }, [user?.email]);

  // Delete product
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);

      await deleteProduct(productId);

      // Remove deleted product immediately from the page
      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== productId
        )
      );
    } catch (err) {
      console.error("Failed to delete product:", err);

      alert(
        err.message || "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // View product
  const handleView = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <section className="min-h-screen bg-gray-100 p-4 md:p-8">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            My Products
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all products in your store.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={loadSellerProducts}
            disabled={loading}
            className="border border-gray-300 bg-white hover:bg-gray-50 px-4 py-3 rounded-xl flex items-center gap-2 font-semibold transition disabled:opacity-50"
            title="Refresh products"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>

          <Link
            to="/seller/add-product"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition"
          >
            <Plus size={20} />

            Add Product
          </Link>

        </div>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

          <p className="font-semibold">
            Unable to load products
          </p>

          <p className="text-sm mt-1">
            {error}
          </p>

          <button
            type="button"
            onClick={loadSellerProducts}
            className="mt-3 text-sm font-semibold underline"
          >
            Try Again
          </button>

        </div>
      )}

      {/* Products Table */}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-6 py-4">
                  Product
                </th>

                <th className="text-left px-6 py-4">
                  Category
                </th>

                <th className="text-left px-6 py-4">
                  Price
                </th>

                <th className="text-left px-6 py-4">
                  Stock
                </th>

                <th className="text-left px-6 py-4">
                  Status
                </th>

                <th className="text-center px-6 py-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {/* Loading */}

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-16"
                  >

                    <RefreshCw
                      size={30}
                      className="mx-auto animate-spin text-green-600"
                    />

                    <p className="mt-4 text-gray-500">
                      Loading your products...
                    </p>

                  </td>

                </tr>

              ) : products.length === 0 ? (

                /* Empty */

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-16 text-gray-500"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">

                        <Plus
                          size={28}
                          className="text-gray-400"
                        />

                      </div>

                      <p className="font-semibold text-gray-700">
                        No products found.
                      </p>

                      <p className="text-sm mt-1">
                        Click "Add Product" to upload your first product.
                      </p>

                      <Link
                        to="/seller/add-product"
                        className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold"
                      >
                        Add Your First Product
                      </Link>

                    </div>

                  </td>

                </tr>

              ) : (

                /* Products */

                products.map((product) => (

                  <tr
                    key={product.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* Product */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">

                          {product.imageUrl ? (

                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />

                          ) : (

                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>

                          )}

                        </div>

                        <div>

                          <p className="font-semibold text-gray-900 line-clamp-2 max-w-[250px]">
                            {product.name}
                          </p>

                          {product.brand && (
                            <p className="text-sm text-gray-500 mt-1">
                              {product.brand}
                            </p>
                          )}

                        </div>

                      </div>

                    </td>

                    {/* Category */}

                    <td className="px-6 py-5">
                      {product.category || "-"}
                    </td>

                    {/* Price */}

                    <td className="px-6 py-5">

                      <div>

                        <p className="font-semibold text-green-700">
                          ₦
                          {Number(
                            product.price || 0
                          ).toLocaleString()}
                        </p>

                        {Number(product.discountPrice) > 0 &&
                          Number(product.discountPrice) <
                            Number(product.price) && (

                            <p className="text-sm text-gray-400 line-through">
                              ₦
                              {Number(
                                product.discountPrice
                              ).toLocaleString()}
                            </p>

                          )}

                      </div>

                    </td>

                    {/* Stock */}

                    <td className="px-6 py-5">
                      {product.stock ?? 0}
                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.status === "In Stock"
                            ? "bg-green-100 text-green-700"
                            : product.status === "Out of Stock"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.status || "In Stock"}
                      </span>

                    </td>

                    {/* Actions */}

                    <td className="px-6 py-5">

                      <div className="flex justify-center gap-3">

                        {/* View */}

                        <button
                          type="button"
                          onClick={() =>
                            handleView(product.id)
                          }
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                          title="View Product"
                        >

                          <Eye size={18} />

                        </button>

                        {/* Edit */}

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/seller/edit-product/${product.id}`
                            )
                          }
                          className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition"
                          title="Edit Product"
                        >

                          <Pencil size={18} />

                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product.id)
                          }
                          disabled={
                            deletingId === product.id
                          }
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Product"
                        >

                          {deletingId === product.id ? (

                            <RefreshCw
                              size={18}
                              className="animate-spin"
                            />

                          ) : (

                            <Trash2 size={18} />

                          )}

                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </section>
  );
}

export default Products;