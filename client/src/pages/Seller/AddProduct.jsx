import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Upload,
  ImagePlus,
  Video,
} from "lucide-react";

import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../context/CategoryContext";

function AddProduct() {
  const navigate = useNavigate();

  const { addProduct } = useProducts();
  const { user } = useAuth();

  const {
    departments = [],
    categories = [],
    subcategories = [],

    loadCategoriesByDepartment,
    loadSubcategories,

    loadingDepartments = false,
    loadingCategories = false,
    loadingSubcategories = false,

    departmentError = "",
    categoryError = "",
    subcategoryError = "",
  } = useCategories();

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    category: "",
    subcategory: "",

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

  // =========================================================
  // NORMAL INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // =========================================================
  // DEPARTMENT CHANGE
  // =========================================================

  const handleDepartmentChange = async (
    event
  ) => {
    const department =
      event.target.value;

    setFormData((currentData) => ({
      ...currentData,

      department,

      // Reset dependent fields
      category: "",
      subcategory: "",
    }));

    setError("");

    if (!department) {
      return;
    }

    await loadCategoriesByDepartment(
      department
    );
  };

  // =========================================================
  // CATEGORY CHANGE
  // =========================================================

  const handleCategoryChange = async (
    event
  ) => {
    const category =
      event.target.value;

    setFormData((currentData) => ({
      ...currentData,

      category,

      // Reset dependent subcategory
      subcategory: "",
    }));

    setError("");

    if (!category) {
      return;
    }

    await loadSubcategories(
      category
    );
  };

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================

  const handleImages = (event) => {
    const selectedImages =
      Array.from(
        event.target.files || []
      );

    const validImages =
      selectedImages.filter(
        (file) =>
          file.type &&
          file.type.startsWith("image/")
      );

    if (
      validImages.length === 0
    ) {
      setError(
        "Please select valid image files."
      );

      event.target.value = "";

      return;
    }

    setImages(validImages);

    setError("");

    event.target.value = "";
  };

  // =========================================================
  // VIDEO UPLOAD
  // =========================================================

  const handleVideo = (event) => {
    const selectedVideo =
      event.target.files?.[0] || null;

    if (!selectedVideo) {
      return;
    }

    if (
      !selectedVideo.type ||
      !selectedVideo.type.startsWith(
        "video/"
      )
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

  // =========================================================
  // SUBMIT PRODUCT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ---------------------------------------------------------
    // LOGIN CHECK
    // ---------------------------------------------------------

    if (!user?.email) {
      setError(
        "You must be logged in before adding a product."
      );

      return;
    }

    // ---------------------------------------------------------
    // BASIC VALIDATION
    // ---------------------------------------------------------

    if (
      !formData.name.trim()
    ) {
      setError(
        "Please enter a product name."
      );

      return;
    }

    // ---------------------------------------------------------
    // DEPARTMENT
    // ---------------------------------------------------------

    if (
      !formData.department.trim()
    ) {
      setError(
        "Department is required."
      );

      return;
    }

    // ---------------------------------------------------------
    // CATEGORY
    // ---------------------------------------------------------

    if (
      !formData.category.trim()
    ) {
      setError(
        "Category is required."
      );

      return;
    }

    // ---------------------------------------------------------
    // SUBCATEGORY
    // ---------------------------------------------------------

    if (
      !formData.subcategory.trim()
    ) {
      setError(
        "Subcategory is required."
      );

      return;
    }

    // ---------------------------------------------------------
    // PRICE
    // ---------------------------------------------------------

    if (
      !formData.price ||
      Number(formData.price) <= 0
    ) {
      setError(
        "Please enter a valid product price."
      );

      return;
    }

    // ---------------------------------------------------------
    // STOCK
    // ---------------------------------------------------------

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      setError(
        "Please enter a valid stock quantity."
      );

      return;
    }

    // ---------------------------------------------------------
    // IMAGE
    // ---------------------------------------------------------

    if (
      images.length === 0
    ) {
      setError(
        "Please upload at least one product image."
      );

      return;
    }

    try {
      setUploading(true);

      // -------------------------------------------------------
      // SELLER NAME
      // -------------------------------------------------------

      const sellerName =
        `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim();

      // -------------------------------------------------------
      // PRODUCT PAYLOAD
      // -------------------------------------------------------

      const productData = {
        name:
          formData.name.trim(),

        description:
          formData.description.trim(),

        price:
          Number(formData.price),

        stock:
          Number(formData.stock),

        // IMPORTANT:
        // Department hierarchy
        department:
          formData.department.trim(),

        category:
          formData.category.trim(),

        subcategory:
          formData.subcategory.trim(),

        brand:
          formData.brand.trim(),

        sku:
          formData.sku.trim(),

        discountPrice:
          formData.discountPrice === ""
            ? 0
            : Number(
                formData.discountPrice
              ),

        weight:
          formData.weight.trim(),

        deliveryTime:
          formData.deliveryTime.trim(),

        status:
          formData.status,

        specifications:
          formData.specifications.trim(),

        // -----------------------------------------------------
        // SELLER INFORMATION
        // -----------------------------------------------------

        sellerEmail:
          user.email,

        sellerName,

        // -----------------------------------------------------
        // FILES
        // -----------------------------------------------------

        images,

        video,
      };

      console.log(
        "PRODUCT PAYLOAD:",
        productData
      );

      // -------------------------------------------------------
      // CREATE PRODUCT
      // -------------------------------------------------------

      await addProduct(
        productData
      );

      alert(
        "Product added successfully!"
      );

      // -------------------------------------------------------
      // RESET FORM
      // -------------------------------------------------------

      setFormData({
        name: "",
        department: "",
        category: "",
        subcategory: "",

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

      // -------------------------------------------------------
      // GO TO SELLER PRODUCTS
      // -------------------------------------------------------

      navigate(
        "/seller/products"
      );

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

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <h1 className="text-4xl font-bold mb-2">
          Add Product
        </h1>

        <p className="text-gray-500 mb-8">
          Upload a new product to your store.
        </p>

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* ================================================== */}
        {/* API ERRORS */}
        {/* ================================================== */}

        {departmentError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {departmentError}
          </div>
        )}

        {categoryError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {categoryError}
          </div>
        )}

        {subcategoryError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {subcategoryError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ================================================== */}
          {/* BASIC INFORMATION */}
          {/* ================================================== */}

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

            {/* ================================================= */}
            {/* DEPARTMENT */}
            {/* ================================================= */}

            <select
              name="department"
              value={formData.department}
              onChange={
                handleDepartmentChange
              }
              disabled={
                loadingDepartments
              }
              className="border rounded-xl p-4 outline-none focus:border-green-600 bg-white disabled:bg-gray-100"
              required
            >
              <option value="">
                {loadingDepartments
                  ? "Loading departments..."
                  : "Select Department"}
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={
                      department.id ??
                      department.name
                    }
                    value={
                      department.name
                    }
                  >
                    {department.name}
                  </option>
                )
              )}
            </select>

            {/* ================================================= */}
            {/* CATEGORY */}
            {/* ================================================= */}

            <select
              name="category"
              value={formData.category}
              onChange={
                handleCategoryChange
              }
              disabled={
                !formData.department ||
                loadingCategories
              }
              className="border rounded-xl p-4 outline-none focus:border-green-600 bg-white disabled:bg-gray-100"
              required
            >
              <option value="">
                {!formData.department
                  ? "Select Department First"
                  : loadingCategories
                  ? "Loading categories..."
                  : "Select Category"}
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category.id ??
                      category.name
                    }
                    value={
                      category.name
                    }
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>

            {/* ================================================= */}
            {/* SUBCATEGORY */}
            {/* ================================================= */}

            <select
              name="subcategory"
              value={
                formData.subcategory
              }
              onChange={
                (event) => {
                  setFormData(
                    (currentData) => ({
                      ...currentData,
                      subcategory:
                        event.target.value,
                    })
                  );

                  setError("");
                }
              }
              disabled={
                !formData.category ||
                loadingSubcategories
              }
              className="border rounded-xl p-4 outline-none focus:border-green-600 bg-white disabled:bg-gray-100"
              required
            >
              <option value="">
                {!formData.category
                  ? "Select Category First"
                  : loadingSubcategories
                  ? "Loading subcategories..."
                  : "Select Subcategory"}
              </option>

              {subcategories.map(
                (subcategory) => (
                  <option
                    key={
                      subcategory.id ??
                      subcategory.name
                    }
                    value={
                      subcategory.name
                    }
                  >
                    {subcategory.name}
                  </option>
                )
              )}
            </select>

            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleChange}
              className="border rounded-xl p-4 outline-none focus:border-green-600"
            />

            {/* ================================================= */}
            {/* PRICE */}
            {/* ================================================= */}

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
              value={
                formData.discountPrice
              }
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

          {/* ================================================== */}
          {/* DESCRIPTION */}
          {/* ================================================== */}

          <div>

            <label className="block font-semibold mb-3">
              Product Description
            </label>

            <textarea
              name="description"
              rows="5"
              placeholder="Describe your product..."
              value={
                formData.description
              }
              onChange={handleChange}
              className="w-full border rounded-xl p-4 outline-none focus:border-green-600"
              required
            />

          </div>

          {/* ================================================== */}
          {/* SPECIFICATIONS */}
          {/* ================================================== */}

          <div>

            <label className="block font-semibold mb-3">
              Specifications
            </label>

            <textarea
              name="specifications"
              rows="5"
              placeholder="Enter product specifications..."
              value={
                formData.specifications
              }
              onChange={handleChange}
              className="w-full border rounded-xl p-4 outline-none focus:border-green-600"
            />

          </div>

          {/* ================================================== */}
          {/* IMAGES */}
          {/* ================================================== */}

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

                  {images.map(
                    (image, index) => (
                      <p
                        key={`${image.name}-${index}`}
                        className="text-sm text-gray-500"
                      >
                        {image.name}
                      </p>
                    )
                  )}

                </div>

              </div>
            )}

          </div>

          {/* ================================================== */}
          {/* VIDEO */}
          {/* ================================================== */}

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

          {/* ================================================== */}
          {/* DELIVERY / STATUS */}
          {/* ================================================== */}

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              name="deliveryTime"
              placeholder="Delivery Time (e.g. 2–5 Days)"
              value={
                formData.deliveryTime
              }
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

          {/* ================================================== */}
          {/* SUBMIT */}
          {/* ================================================== */}

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