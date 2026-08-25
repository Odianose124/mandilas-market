import { useEffect, useState } from "react";
import {
  Upload,
  X,
  Plus,
  Loader2,
} from "lucide-react";

import { useProducts } from "../../context/ProductContext";
import {
 useCategories
} from "../../context/CategoryContext";

function ProductForm({
  product = null,
  onSuccess,
  onCancel,
}) {
  const {
    addProduct,
    updateProduct,
  } = useProducts();

  const {
 categories,
 subcategories,
 loadSubcategories
}
=
useCategories();

  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
    brand: "",
    sku: "",
    discountPrice: "",
    weight: "",
    deliveryTime: "",
    status: "In Stock",
    specifications: "",
    sellerEmail: "",
    sellerName: "",
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const [existingImageUrls, setExistingImageUrls] =
    useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * Load existing product information
   * when editing a product.
   */
  useEffect(() => {
    if (!product) {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        subcategory: "",
        brand: "",
        sku: "",
        discountPrice: "",
        weight: "",
        deliveryTime: "",
        status: "In Stock",
        specifications: "",
        sellerEmail: "",
        sellerName: "",
      });

      setImages([]);
      setVideo(null);
      setExistingImageUrls([]);

      return;
    }

    setFormData({
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      category: product.category ?? "",
      subcategory: product.subcategory ?? "",
      brand: product.brand ?? "",
      sku: product.sku ?? "",
      discountPrice: product.discountPrice ?? "",
      weight: product.weight ?? "",
      deliveryTime: product.deliveryTime ?? "",
      status: product.status ?? "In Stock",
      specifications:
        product.specifications ?? "",
      sellerEmail:
        product.sellerEmail ?? "",
      sellerName:
        product.sellerName ?? "",
    });

    /*
     * Backend currently returns imageUrl.
     *
     * Multiple image URLs are stored as
     * comma-separated values.
     */
    if (product.imageUrl) {
      setExistingImageUrls(
        product.imageUrl
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean)
      );
    } else {
      setExistingImageUrls([]);
    }

    setImages([]);
    setVideo(null);
  }, [product]);

  /*
   * Find the selected category from the
   * central categories.js file.
   */
  

  /*
   * Handle normal form fields.
   */
  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    /*
     * If the category changes, reset the
     * previously selected subcategory.
     */
    if(name==="category"){


    setFormData(current=>({
        ...current,
        category:value,
        subcategory:""
    }));


    loadSubcategories(value);


    return;

}

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
   * Handle product images.
   */
  const handleImagesChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    const imageFiles = selectedFiles.filter(
      (file) =>
        file.type &&
        file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      setError(
        "Please select valid image files."
      );

      event.target.value = "";
      return;
    }

    setImages((current) => [
      ...current,
      ...imageFiles,
    ]);

    setError("");

    /*
     * Allows the same file to be selected again.
     */
    event.target.value = "";
  };

  /*
   * Remove newly selected image.
   */
  const removeImage = (index) => {
    setImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  /*
   * Remove an existing image from
   * the edit screen.
   */
  const removeExistingImage = (index) => {
    setExistingImageUrls((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  /*
   * Handle product video.
   */
  const handleVideoChange = (event) => {
    const selectedVideo =
      event.target.files?.[0] || null;

    if (!selectedVideo) {
      return;
    }

    if (
      !selectedVideo.type ||
      !selectedVideo.type.startsWith("video/")
    ) {
      setError(
        "Please select a valid video file."
      );

      event.target.value = "";
      return;
    }

    setVideo(selectedVideo);
    setError("");

    event.target.value = "";
  };

  /*
   * Remove selected video.
   */
  const removeVideo = () => {
    setVideo(null);
  };

  /*
   * Validate the form before submission.
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Product name is required.";
    }

    if (!formData.description.trim()) {
      return "Product description is required.";
    }

    if (
      formData.price === "" ||
      Number(formData.price) <= 0
    ) {
      return "Please enter a valid product price.";
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      return "Please enter a valid stock quantity.";
    }

    if (!formData.category) {
      return "Please select a category.";
    }

    if (!formData.subcategory) {
      return "Please select a subcategory.";
    }

    if (!formData.sellerName.trim()) {
      return "Seller name is required.";
    }

    if (!formData.sellerEmail.trim()) {
      return "Seller email is required.";
    }

    /*
     * New products must have at least
     * one image.
     */
    if (
      !isEditing &&
      images.length === 0
    ) {
      return (
        "Please upload at least one product image."
      );
    }

    /*
     * When editing, the product must still
     * have either an existing image or a
     * newly selected image.
     */
    if (
      isEditing &&
      existingImageUrls.length === 0 &&
      images.length === 0
    ) {
      return (
        "A product must have at least one image."
      );
    }

    return "";
  };

  /*
   * Submit product.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      /*
       * Prepare the data sent to the backend.
       */
      const productPayload = {
        name: formData.name.trim(),

        description:
          formData.description.trim(),

        price: Number(formData.price),

        stock: Number(formData.stock),

        category:
          formData.category,

        subcategory:
          formData.subcategory,

        brand:
          formData.brand.trim(),

        sku:
          formData.sku.trim(),

        discountPrice:
          formData.discountPrice === ""
            ? 0
            : Number(formData.discountPrice),

        weight:
          formData.weight.trim(),

        deliveryTime:
          formData.deliveryTime.trim(),

        status:
          formData.status,

        specifications:
          formData.specifications.trim(),

        sellerEmail:
          formData.sellerEmail.trim(),

        sellerName:
          formData.sellerName.trim(),

        /*
         * New image files.
         */
        images,

        /*
         * Product video.
         */
        video,
      };

      let savedProduct;

      if (isEditing) {
        savedProduct =
          await updateProduct(
            product.id,
            productPayload
          );
      } else {
        savedProduct =
          await addProduct(
            productPayload
          );
      }

      /*
       * Notify parent page.
       */
      if (onSuccess) {
        onSuccess(savedProduct);
      }
    } catch (err) {
      console.error(
        "Product submission failed:",
        err
      );

      setError(
        err?.message ||
          "Failed to save product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Generate temporary preview URLs
   * for newly selected images.
   */
  const getImagePreview = (image) => {
    return URL.createObjectURL(image);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8"
    >
      {/* ============================== */}
      {/* HEADER */}
      {/* ============================== */}

      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {isEditing
            ? "Edit Product"
            : "Add New Product"}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {isEditing
            ? "Update the actual information for this product."
            : "Enter the actual product information you want to publish on Mandilas Market."}
        </p>
      </div>

      {/* ============================== */}
      {/* ERROR */}
      {/* ============================== */}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ============================== */}
      {/* PRODUCT NAME */}
      {/* ============================== */}

      <div>
        <label className="block text-sm font-semibold mb-2">
          Product Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* ============================== */}
      {/* DESCRIPTION */}
      {/* ============================== */}

      <div>
        <label className="block text-sm font-semibold mb-2">
          Product Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
          required
        />
      </div>

      {/* ============================== */}
      {/* CATEGORY */}
      {/* ============================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">
              Select category
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.name}
                >
                  {category.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* ============================== */}
        {/* SUBCATEGORY */}
        {/* ============================== */}

        <div>
          <label className="block text-sm font-semibold mb-2">
            Subcategory
          </label>

          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            disabled={!formData.category}
            className="w-full border rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            required
          >
            <option value="">
              {formData.category
                ? "Select subcategory"
                : "Select category first"}
            </option>

            {subcategories.map(
              (subcategory) => (
                <option
                  key={subcategory.id}
                  value={subcategory.name}
                >
                  {subcategory.name}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* ============================== */}
      {/* PRICE / DISCOUNT / STOCK */}
      {/* ============================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Discount Price
          </label>

          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Stock Quantity
          </label>

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
      </div>

      {/* ============================== */}
      {/* BRAND / SKU */}
      {/* ============================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Brand
          </label>

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            SKU
          </label>

          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* ============================== */}
      {/* WEIGHT / DELIVERY / STATUS */}
      {/* ============================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Weight
          </label>

          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Delivery Time
          </label>

          <input
            type="text"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="In Stock">
              In Stock
            </option>

            <option value="Out of Stock">
              Out of Stock
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {/* ============================== */}
      {/* SPECIFICATIONS */}
      {/* ============================== */}

      <div>
        <label className="block text-sm font-semibold mb-2">
          Specifications
        </label>

        <textarea
          name="specifications"
          value={formData.specifications}
          onChange={handleChange}
          rows={6}
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      {/* ============================== */}
      {/* PRODUCT IMAGES */}
      {/* ============================== */}

      <div>
        <label className="block text-sm font-semibold mb-2">
          Product Images
        </label>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <Upload
              size={32}
              className="text-gray-400 mb-2"
            />

            <span className="text-sm font-medium">
              Upload product images
            </span>

            <span className="text-xs text-gray-500 mt-1">
              Select one or more product images
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="hidden"
            />
          </label>
        </div>

        {/* ============================== */}
        {/* EXISTING IMAGES */}
        {/* ============================== */}

        {existingImageUrls.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold mb-3">
              Current Product Images
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {existingImageUrls.map(
                (url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="relative rounded-lg overflow-hidden border"
                  >
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeExistingImage(index)
                      }
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* NEW IMAGES */}
        {/* ============================== */}

        {images.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold mb-3">
              New Images
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map(
                (image, index) => (
                  <div
                    key={`${image.name}-${image.lastModified}-${index}`}
                    className="relative rounded-lg overflow-hidden border"
                  >
                    <img
                      src={getImagePreview(image)}
                      alt={image.name}
                      className="w-full aspect-square object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================== */}
      {/* PRODUCT VIDEO */}
      {/* ============================== */}

      <div>
        <label className="block text-sm font-semibold mb-2">
          Product Video
        </label>

        <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl px-5 py-6 cursor-pointer hover:border-green-500 transition">
          <Upload
            size={24}
            className="text-gray-400"
          />

          <div>
            <p className="text-sm font-medium">
              Upload product video
            </p>

            <p className="text-xs text-gray-500">
              Optional
            </p>
          </div>

          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="hidden"
          />
        </label>

        {video && (
          <div className="mt-3 flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3">
            <span className="text-sm truncate">
              {video.name}
            </span>

            <button
              type="button"
              onClick={removeVideo}
              className="text-red-600 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ============================== */}
      {/* SELLER INFORMATION */}
      {/* ============================== */}

      <div>
        <h3 className="text-lg font-bold mb-4">
          Seller Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Seller Name
            </label>

            <input
              type="text"
              name="sellerName"
              value={formData.sellerName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Seller Email
            </label>

            <input
              type="email"
              name="sellerEmail"
              value={formData.sellerEmail}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* ACTION BUTTONS */}
      {/* ============================== */}

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 rounded-lg border border-gray-300 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              {isEditing
                ? "Updating Product..."
                : "Publishing Product..."}
            </>
          ) : (
            <>
              {!isEditing && (
                <Plus size={18} />
              )}

              {isEditing
                ? "Update Product"
                : "Publish Product"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;