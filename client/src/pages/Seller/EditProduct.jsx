import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useProducts } from "../../context/ProductContext";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getProduct,
    updateProduct,
    loading: contextLoading,
    error: contextError,
  } = useProducts();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    description: "",
    specifications: "",
    weight: "",
    deliveryTime: "",
    status: "In Stock",
  });

  // Load product from backend
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoadingProduct(true);
        setError("");

        const productId = Number(id);

        if (!productId || Number.isNaN(productId)) {
          setError("Invalid product ID.");
          return;
        }

        const existingProduct = await getProduct(productId);

        if (!existingProduct) {
          setProduct(null);
          return;
        }

        setProduct(existingProduct);

        setFormData({
          name: existingProduct.name || "",
          category: existingProduct.category || "",
          brand: existingProduct.brand || "",
          price: existingProduct.price ?? "",
          discountPrice: existingProduct.discountPrice ?? "",
          stock: existingProduct.stock ?? "",
          sku: existingProduct.sku || "",
          description: existingProduct.description || "",
          specifications: existingProduct.specifications || "",
          weight: existingProduct.weight || "",
          deliveryTime: existingProduct.deliveryTime || "",
          status: existingProduct.status || "In Stock",
        });
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(err.message || "Failed to load product.");
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [id, getProduct]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // Submit updated product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedProductData = {
        ...product,

        name: formData.name.trim(),
        description: formData.description.trim(),

        price: Number(formData.price) || 0,

        stock: Number(formData.stock) || 0,

        category: formData.category.trim(),

        brand: formData.brand.trim(),

        sku: formData.sku.trim(),

        discountPrice:
          formData.discountPrice === ""
            ? 0
            : Number(formData.discountPrice) || 0,

        weight: formData.weight.trim(),

        deliveryTime: formData.deliveryTime.trim(),

        status: formData.status,

        specifications:
          formData.specifications.trim(),
      };

      await updateProduct(
        Number(id),
        updatedProductData
      );

      alert("Product updated successfully!");

      navigate("/seller/products");
    } catch (err) {
      console.error("Failed to update product:", err);

      setError(
        err.message ||
          "Failed to update product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (loadingProduct || contextLoading) {
    return (
      <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-8 text-center max-w-md w-full">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-5"></div>

          <h1 className="text-xl font-bold">
            Loading Product...
          </h1>

          <p className="text-gray-500 mt-2">
            Please wait while we load the product information.
          </p>
        </div>
      </section>
    );
  }

  // Product not found
  if (!product) {
    return (
      <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-8 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-3">
            Product Not Found
          </h1>

          <p className="text-gray-500 mb-6">
            The product you are trying to edit does not exist
            or could not be found.
          </p>

          {(error || contextError) && (
            <p className="text-red-600 text-sm mb-5">
              {error || contextError}
            </p>
          )}

          <Link
            to="/seller/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
          >
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Edit Product
            </h1>

            <p className="text-gray-500 mt-2">
              Update your product information.
            </p>
          </div>

          <Link
            to="/seller/products"
            className="border border-gray-300 hover:bg-gray-100 px-5 py-3 rounded-xl transition text-center"
          >
            Back
          </Link>
        </div>

        {/* Error */}
        {(error || contextError) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error || contextError}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Product Name */}
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded-xl p-4 outline-none focus:border-green-600"
                required
              />

              {/* Brand */}
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                className="border rounded-xl p-4 outline-none focus:border-green-600"
              />

              {/* Category */}
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="border rounded-xl p-4 outline-none focus:border-green-600"
                required
              />

              {/* SKU */}
              <input
                type="text"
                name="sku"
                placeholder="SKU"
                value={formData.sku}
                onChange={handleChange}
                className="border rounded-xl p-4 outline-none focus:border-green-600"
              />

              {/* Price */}
              <input
                type="number"
                name="price"
                placeholder="Price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="border rounded-xl p-4 outline-none focus:border-green-600"
                required
              />

              {/* Discount Price */}
              <input
                type="number"
                name="discountPrice"
                placeholder="Discount Price"
                min="0"
                step="0.01"
                value={formData.discountPrice}
                onChange={handleChange}
                className="border rounded-xl p-4 outline-none focus:border-green-600"
              />

              {/* Stock */}
              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="border rounded-xl p-4 outline-none focus:border-green-600"
                required
              />

              {/* Weight */}
              <input
                type="text"
                name="weight"
                placeholder="Weight"
                value={formData.weight}
                onChange={handleChange}
                className="border rounded-xl p-4 outline-none focus:border-green-600"
              />

            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              Product Description
            </h2>

            <textarea
              name="description"
              rows="6"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-4 outline-none focus:border-green-600 resize-none"
              required
            />
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              Specifications
            </h2>

            <textarea
              name="specifications"
              rows="6"
              placeholder="Specifications"
              value={formData.specifications}
              onChange={handleChange}
              className="w-full border rounded-xl p-4 outline-none focus:border-green-600 resize-none"
            />
          </div>

          {/* Delivery & Status */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              Delivery & Status
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Delivery Time */}
              <input
                type="text"
                name="deliveryTime"
                placeholder="Delivery Time (e.g. 2–5 Days)"
                value={formData.deliveryTime}
                onChange={handleChange}
                className="border rounded-xl p-4 outline-none focus:border-green-600"
              />

              {/* Status */}
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border rounded-xl p-4 outline-none focus:border-green-600 bg-white"
              >
                <option value="In Stock">
                  In Stock
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>

                <option value="Draft">
                  Draft
                </option>
              </select>

            </div>
          </div>

          {/* Existing Media */}
          {(product.imageUrl || product.videoUrl) && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                Existing Media
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                {/* Existing Image */}
                {product.imageUrl && (
                  <div className="border rounded-xl p-4">
                    <p className="font-semibold mb-3">
                      Product Image
                    </p>

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Existing Video */}
                {product.videoUrl && (
                  <div className="border rounded-xl p-4">
                    <p className="font-semibold mb-3">
                      Product Video
                    </p>

                    <video
                      src={product.videoUrl}
                      controls
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className={`w-full h-14 rounded-xl text-white font-bold text-lg transition ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>

        </form>
      </div>
    </section>
  );
}

export default EditProduct;