import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";

import {
  Upload,
  ImagePlus,
  Video,
} from "lucide-react";

function AddProduct() {
  const navigate = useNavigate();

  const { addProduct } = useProducts();
  const { user } = useAuth();

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

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Handle normal form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // Handle multiple images
  const handleImages = (e) => {
    const selectedImages = Array.from(e.target.files || []);

    setImages(selectedImages);
  };

  // Handle video
  const handleVideo = (e) => {
    const selectedVideo = e.target.files?.[0] || null;

    setVideo(selectedVideo);
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Make sure a user is logged in
    if (!user?.email) {
      setError(
        "You must be logged in before adding a product."
      );
      return;
    }

    // Basic validation
    if (!formData.name.trim()) {
      setError("Please enter a product name.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Please enter a product category.");
      return;
    }

    if (!formData.price) {
      setError("Please enter the product price.");
      return;
    }

    if (!formData.stock) {
      setError("Please enter the available stock.");
      return;
    }

    try {
      setUploading(true);

      const sellerName =
        `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim();

      const productData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: formData.price,
        discountPrice:
          formData.discountPrice || 0,
        stock: formData.stock,
        sku: formData.sku,
        description: formData.description,
        specifications:
          formData.specifications,
        weight: formData.weight,
        deliveryTime:
          formData.deliveryTime,
        status: formData.status,

        // Seller information
        sellerEmail: user.email,
        sellerName,

        // Files
        images,
        video,
      };

      // Wait for backend + Cloudinary upload
      await addProduct(productData);

      alert("Product added successfully!");

      // Reset form
      setFormData({
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

      setImages([]);
      setVideo(null);

      // Go to seller products
      navigate("/seller/products");

    } catch (err) {
      console.error(
        "Product upload failed:",
        err
      );

      setError(
        err?.message ||
          "Failed to upload product. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8">

        <h1 className="text-4xl font-bold mb-2">
          Add Product
        </h1>

        <p className="text-gray-500 mb-8">
          Upload a new product to your store.
        </p>

        {/* Error Message */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* Basic Information */}

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-xl p-4 outline-none focus:border-green-600"
              required
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
              className="border rounded-xl p-4 outline-none focus:border-green-600"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="border rounded-xl p-4 outline-none focus:border-green-600"
              required
            />

            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleChange}
              className="border rounded-xl p-4 outline-none focus:border-green-600"
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="border rounded-xl p-4 outline-none focus:border-green-600"
              required
            />

            <input
              type="number"
              name="discountPrice"
              placeholder="Discount Price"
              value={formData.discountPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="border rounded-xl p-4 outline-none focus:border-green-600"
            />

            <input
              type="number"
              name="stock"
              placeholder="Available Stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="border rounded-xl p-4 outline-none focus:border-green-600"
              required
            />

            <input
              type="text"
              name="weight"
              placeholder="Weight"
              value={formData.weight}
              onChange={handleChange}
              className="border rounded-xl p-4 outline-none focus:border-green-600"
            />

          </div>

          {/* Description */}

          <div>

            <label className="block font-semibold mb-3">
              Product Description
            </label>

            <textarea
              name="description"
              rows="5"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-4 outline-none focus:border-green-600"
              required
            />

          </div>

          {/* Specifications */}

          <div>

            <label className="block font-semibold mb-3">
              Specifications
            </label>

            <textarea
              name="specifications"
              rows="5"
              placeholder="Enter product specifications..."
              value={formData.specifications}
              onChange={handleChange}
              className="w-full border rounded-xl p-4 outline-none focus:border-green-600"
            />

          </div>

          {/* Upload Images */}

          <div>

            <label className="block font-semibold mb-3">
              Product Images
            </label>

            <label className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-green-600 transition">

              <ImagePlus
                size={45}
                className="text-green-600 mb-4"
              />

              <p className="font-semibold">
                Upload Product Images
              </p>

              <p className="text-gray-500 text-sm mt-2">
                You can select multiple images.
              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="hidden"
              />

            </label>

            {images.length > 0 && (
              <div className="mt-3">

                <p className="text-green-700 font-medium">
                  {images.length} image(s) selected
                </p>

                <div className="mt-2 space-y-1">

                  {images.map((image, index) => (
                    <p
                      key={`${image.name}-${index}`}
                      className="text-sm text-gray-500"
                    >
                      {image.name}
                    </p>
                  ))}

                </div>

              </div>
            )}

          </div>

          {/* Upload Video */}

          <div>

            <label className="block font-semibold mb-3">
              Product Video
            </label>

            <label className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-green-600 transition">

              <Video
                size={45}
                className="text-blue-600 mb-4"
              />

              <p className="font-semibold">
                Upload Product Video
              </p>

              <p className="text-gray-500 text-sm mt-2">
                Optional product demonstration video.
              </p>

              <input
                type="file"
                accept="video/*"
                onChange={handleVideo}
                className="hidden"
              />

            </label>

            {video && (
              <p className="mt-3 text-blue-700 font-medium">
                {video.name}
              </p>
            )}

          </div>

          {/* Delivery and Status */}

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              name="deliveryTime"
              placeholder="Delivery Time (e.g. 2–5 Days)"
              value={formData.deliveryTime}
              onChange={handleChange}
              className="border rounded-xl p-4 outline-none focus:border-green-600"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded-xl p-4 outline-none focus:border-green-600"
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

          {/* Submit */}

          <button
            type="submit"
            disabled={uploading}
            className={`w-full h-14 rounded-xl transition text-white font-bold text-lg flex items-center justify-center gap-3 ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >

            <Upload size={22} />

            {uploading
              ? "Uploading Product..."
              : "Save Product"}

          </button>

        </form>

      </div>

    </section>
  );
}

export default AddProduct;