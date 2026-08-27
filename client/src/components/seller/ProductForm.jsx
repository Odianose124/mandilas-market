import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Upload,
  X,
  Plus,
  Loader2,
} from "lucide-react";

import {
  useProducts,
} from "../../context/ProductContext";

import {
  useCategories,
} from "../../context/CategoryContext";

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

function getOptionValue(option) {
  if (typeof option === "string") {
    return option;
  }

  return (
    option?.id ??
    option?._id ??
    option?.value ??
    option?.slug ??
    option?.name ??
    ""
  );
}

function getOptionLabel(option) {
  if (typeof option === "string") {
    return option;
  }

  return (
    option?.name ??
    option?.title ??
    option?.label ??
    option?.value ??
    option?.slug ??
    option?.id ??
    option?._id ??
    ""
  );
}

function findOption(options = [], value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const currentValue = String(value);

  return (
    options.find((option) => {
      const optionValue = String(
        getOptionValue(option)
      );

      const optionLabel = String(
        getOptionLabel(option)
      );

      return (
        optionValue === currentValue ||
        optionLabel === currentValue
      );
    }) ?? null
  );
}

function getEntityId(entity) {
  if (!entity) {
    return "";
  }

  if (typeof entity === "string") {
    return "";
  }

  return String(
    entity.id ??
      entity._id ??
      entity.value ??
      entity.slug ??
      ""
  );
}

function getEntityName(entity) {
  if (!entity) {
    return "";
  }

  if (typeof entity === "string") {
    return entity;
  }

  return (
    entity.name ??
    entity.title ??
    entity.label ??
    entity.value ??
    entity.slug ??
    ""
  );
}

function normalizeImageUrls(imageUrl) {
  if (Array.isArray(imageUrl)) {
    return imageUrl
      .map((url) => {
        if (typeof url === "string") {
          return url.trim();
        }

        return (
          url?.url ??
          url?.secure_url ??
          ""
        );
      })
      .filter(Boolean);
  }

  if (typeof imageUrl === "string") {
    return imageUrl
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);
  }

  return [];
}

/*
 * ============================================================
 * EMPTY FORM
 * ============================================================
 */

const EMPTY_FORM_DATA = {
  name: "",
  description: "",

  /*
   * DEPARTMENT
   *
   * department = selected department name
   * departmentId = selected department ID when available
   */
  department: "",
  departmentId: "",
  departmentName: "",

  /*
   * CATEGORY
   */
  category: "",
  categoryId: "",
  categoryName: "",

  /*
   * SUBCATEGORY
   */
  subcategory: "",
  subcategoryId: "",
  subcategoryName: "",

  price: "",
  stock: "",

  brand: "",
  sku: "",

  discountPrice: "",

  weight: "",
  deliveryTime: "",

  status: "In Stock",

  specifications: "",

  sellerEmail: "",
  sellerName: "",
};

/*
 * ============================================================
 * PRODUCT FORM
 * ============================================================
 */

function ProductForm({
  product = null,
  onSuccess,
  onCancel,
}) {
  /*
   * ==========================================================
   * PRODUCT CONTEXT
   * ==========================================================
   */

  const {
    addProduct,
    updateProduct,
  } = useProducts();

  /*
   * ==========================================================
   * CATEGORY CONTEXT
   * ==========================================================
   */

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

  const isEditing = Boolean(product);

  /*
   * ==========================================================
   * FORM STATE
   * ==========================================================
   */

  const [
    formData,
    setFormData,
  ] = useState({
    ...EMPTY_FORM_DATA,
  });

  /*
   * ==========================================================
   * MEDIA STATE
   * ==========================================================
   */

  const [
    images,
    setImages,
  ] = useState([]);

  const [
    video,
    setVideo,
  ] = useState(null);

  const [
    existingImageUrls,
    setExistingImageUrls,
  ] = useState([]);

  /*
   * ==========================================================
   * GENERAL STATE
   * ==========================================================
   */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * ==========================================================
   * IMAGE PREVIEWS
   * ==========================================================
   */

  const imagePreviews = useMemo(() => {
    return images.map((image) =>
      URL.createObjectURL(image)
    );
  }, [images]);

  /*
   * ==========================================================
   * CLEAN IMAGE PREVIEW URLS
   * ==========================================================
   */

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  /*
   * ==========================================================
   * LOAD EXISTING PRODUCT
   * ==========================================================
   */

  useEffect(() => {
    if (!product) {
      setFormData({
        ...EMPTY_FORM_DATA,
      });

      setImages([]);
      setVideo([]);
      setVideo(null);
      setExistingImageUrls([]);
      setError("");

      return;
    }

    /*
     * --------------------------------------------------------
     * DEPARTMENT
     * --------------------------------------------------------
     */

    const departmentObject =
      typeof product.department === "object"
        ? product.department
        : null;

    const existingDepartmentId =
      product.departmentId ??
      getEntityId(departmentObject);

    const existingDepartmentName =
      product.departmentName ||
      getEntityName(departmentObject) ||
      (typeof product.department === "string"
        ? product.department
        : "");

    /*
     * --------------------------------------------------------
     * CATEGORY
     * --------------------------------------------------------
     */

    const categoryObject =
      typeof product.category === "object"
        ? product.category
        : null;

    const existingCategoryId =
      product.categoryId ??
      getEntityId(categoryObject);

    const existingCategoryName =
      product.categoryName ||
      getEntityName(categoryObject) ||
      (typeof product.category === "string"
        ? product.category
        : "");

    /*
     * --------------------------------------------------------
     * SUBCATEGORY
     * --------------------------------------------------------
     */

    const subcategoryObject =
      typeof product.subcategory === "object"
        ? product.subcategory
        : null;

    const existingSubcategoryId =
      product.subcategoryId ??
      getEntityId(subcategoryObject);

    const existingSubcategoryName =
      product.subcategoryName ||
      getEntityName(subcategoryObject) ||
      (typeof product.subcategory === "string"
        ? product.subcategory
        : "");

    /*
     * --------------------------------------------------------
     * SET FORM
     * --------------------------------------------------------
     */

    setFormData({
      name: product.name ?? "",

      description:
        product.description ?? "",

      /*
       * IMPORTANT:
       * department contains the actual department NAME.
       */
      department:
        existingDepartmentName,

      departmentId:
        existingDepartmentId,

      departmentName:
        existingDepartmentName,

      category:
        existingCategoryName,

      categoryId:
        existingCategoryId,

      categoryName:
        existingCategoryName,

      subcategory:
        existingSubcategoryName,

      subcategoryId:
        existingSubcategoryId,

      subcategoryName:
        existingSubcategoryName,

      price:
        product.price ?? "",

      stock:
        product.stock ?? "",

      brand:
        product.brand ?? "",

      sku:
        product.sku ?? "",

      discountPrice:
        product.discountPrice ?? "",

      weight:
        product.weight ?? "",

      deliveryTime:
        product.deliveryTime ?? "",

      status:
        product.status ?? "In Stock",

      specifications:
        typeof product.specifications ===
        "string"
          ? product.specifications
          : product.specifications
            ? JSON.stringify(
                product.specifications,
                null,
                2
              )
            : "",

      sellerEmail:
        product.sellerEmail ?? "",

      sellerName:
        product.sellerName ?? "",
    });

    /*
     * --------------------------------------------------------
     * EXISTING IMAGES
     * --------------------------------------------------------
     */

    setExistingImageUrls(
      normalizeImageUrls(
        product.imageUrl ??
          product.images
      )
    );

    setImages([]);
    setVideo(null);
    setError("");

    /*
     * --------------------------------------------------------
     * LOAD CATEGORY HIERARCHY
     * --------------------------------------------------------
     */

    if (existingDepartmentName) {
      loadCategoriesByDepartment(
        existingDepartmentName
      );
    }

    if (existingCategoryName) {
      loadSubcategories(
        existingCategoryName
      );
    }
  }, [
    product,
    loadCategoriesByDepartment,
    loadSubcategories,
  ]);

  /*
   * ==========================================================
   * DEPARTMENT CHANGE
   * ==========================================================
   */

  const handleDepartmentChange = (
    event
  ) => {
    const selectedValue =
      event.target.value;

    const selectedDepartment =
      findOption(
        departments,
        selectedValue
      );

    const departmentName =
      selectedDepartment
        ? getOptionLabel(
            selectedDepartment
          )
        : "";

    const departmentId =
      selectedDepartment
        ? getOptionValue(
            selectedDepartment
          )
        : "";

    /*
     * Store BOTH:
     *
     * department = department name
     * departmentName = department name
     *
     * This guarantees the product payload
     * contains the correct backend field.
     */

    setFormData((current) => ({
      ...current,

      department:
        departmentName,

      departmentId:
        departmentId,

      departmentName:
        departmentName,

      /*
       * Changing department resets category.
       */

      category: "",
      categoryId: "",
      categoryName: "",

      /*
       * Changing department also resets
       * subcategory.
       */

      subcategory: "",
      subcategoryId: "",
      subcategoryName: "",
    }));

    setError("");

    if (!departmentName) {
      return;
    }

    /*
     * Load categories belonging ONLY
     * to the selected department.
     */

    loadCategoriesByDepartment(
      departmentName
    );
  };

  /*
   * ==========================================================
   * CATEGORY CHANGE
   * ==========================================================
   */

  const handleCategoryChange = (
    event
  ) => {
    const selectedValue =
      event.target.value;

    const selectedCategory =
      findOption(
        categories,
        selectedValue
      );

    const categoryName =
      selectedCategory
        ? getOptionLabel(
            selectedCategory
          )
        : "";

    const categoryId =
      selectedCategory
        ? getOptionValue(
            selectedCategory
          )
        : "";

    setFormData((current) => ({
      ...current,

      category:
        categoryName,

      categoryId:
        categoryId,

      categoryName:
        categoryName,

      /*
       * Reset subcategory whenever
       * category changes.
       */

      subcategory: "",
      subcategoryId: "",
      subcategoryName: "",
    }));

    setError("");

    if (!categoryName) {
      return;
    }

    /*
     * Load subcategories for the
     * selected category.
     */

    loadSubcategories(
      categoryName
    );
  };

  /*
   * ==========================================================
   * SUBCATEGORY CHANGE
   * ==========================================================
   */

  const handleSubcategoryChange = (
    event
  ) => {
    const selectedValue =
      event.target.value;

    const selectedSubcategory =
      findOption(
        subcategories,
        selectedValue
      );

    const subcategoryName =
      selectedSubcategory
        ? getOptionLabel(
            selectedSubcategory
          )
        : "";

    const subcategoryId =
      selectedSubcategory
        ? getOptionValue(
            selectedSubcategory
          )
        : "";

    setFormData((current) => ({
      ...current,

      subcategory:
        subcategoryName,

      subcategoryId:
        subcategoryId,

      subcategoryName:
        subcategoryName,
    }));

    setError("");
  };

  /*
   * ==========================================================
   * NORMAL INPUT CHANGE
   * ==========================================================
   */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    /*
     * These are controlled by their
     * dedicated handlers.
     */

    if (
      name === "department" ||
      name === "category" ||
      name === "subcategory"
    ) {
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
   * ==========================================================
   * IMAGE UPLOAD
   * ==========================================================
   */

  const handleImagesChange = (
    event
  ) => {
    const selectedFiles =
      Array.from(
        event.target.files || []
      );

    if (
      selectedFiles.length === 0
    ) {
      return;
    }

    const imageFiles =
      selectedFiles.filter(
        (file) =>
          file.type &&
          file.type.startsWith(
            "image/"
          )
      );

    if (
      imageFiles.length === 0
    ) {
      setError(
        "Please select valid image files."
      );

      event.target.value = "";

      return;
    }

    /*
     * Keep the image upload behavior
     * that was already working for you.
     */

    setImages((current) => [
      ...current,
      ...imageFiles,
    ]);

    setError("");

    event.target.value = "";
  };

  /*
   * ==========================================================
   * REMOVE NEW IMAGE
   * ==========================================================
   */

  const removeImage = (
    index
  ) => {
    setImages(
      (current) =>
        current.filter(
          (_, imageIndex) =>
            imageIndex !== index
        )
    );
  };

  /*
   * ==========================================================
   * REMOVE EXISTING IMAGE
   * ==========================================================
   */

  const removeExistingImage = (
    index
  ) => {
    setExistingImageUrls(
      (current) =>
        current.filter(
          (_, imageIndex) =>
            imageIndex !== index
        )
    );
  };

  /*
   * ==========================================================
   * VIDEO UPLOAD
   * ==========================================================
   */

  const handleVideoChange = (
    event
  ) => {
    const selectedVideo =
      event.target.files?.[0] ||
      null;

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

  /*
   * ==========================================================
   * REMOVE VIDEO
   * ==========================================================
   */

  const removeVideo = () => {
    setVideo(null);
  };

  /*
   * ==========================================================
   * VALIDATE FORM
   * ==========================================================
   */

  const validateForm = () => {
    if (
      !formData.name.trim()
    ) {
      return (
        "Product name is required."
      );
    }

    if (
      !formData.description.trim()
    ) {
      return (
        "Product description is required."
      );
    }

    /*
     * DEPARTMENT IS REQUIRED
     *
     * This is the field that was causing
     * your current 400 error.
     */

    if (
      !formData.department.trim()
    ) {
      return (
        "Please select a department."
      );
    }

    /*
     * CATEGORY
     */

    if (
      !formData.category.trim()
    ) {
      return (
        "Please select a category."
      );
    }

    /*
     * SUBCATEGORY
     */

    if (
      !formData.subcategory.trim()
    ) {
      return (
        "Please select a subcategory."
      );
    }

    if (
      formData.price === "" ||
      Number(formData.price) <= 0
    ) {
      return (
        "Please enter a valid product price."
      );
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      return (
        "Please enter a valid stock quantity."
      );
    }

    if (
      formData.discountPrice !== "" &&
      Number(formData.discountPrice) < 0
    ) {
      return (
        "Discount price cannot be negative."
      );
    }

    if (
      !formData.sellerName.trim()
    ) {
      return (
        "Seller name is required."
      );
    }

    if (
      !formData.sellerEmail.trim()
    ) {
      return (
        "Seller email is required."
      );
    }

    /*
     * New products need at least
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
     * Edited products must still
     * have an image.
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
   * ==========================================================
   * SUBMIT
   * ==========================================================
   */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    try {
      setLoading(true);

      /*
       * ======================================================
       * NORMALIZE CATEGORY HIERARCHY
       * ======================================================
       */

      const departmentName =
        (
          formData.departmentName ||
          formData.department ||
          ""
        ).trim();

      const categoryName =
        (
          formData.categoryName ||
          formData.category ||
          ""
        ).trim();

      const subcategoryName =
        (
          formData.subcategoryName ||
          formData.subcategory ||
          ""
        ).trim();

      /*
       * ======================================================
       * FINAL PRODUCT PAYLOAD
       * ======================================================
       *
       * IMPORTANT:
       *
       * The backend expects:
       *
       * department
       * category
       * subcategory
       *
       * as multipart form fields.
       */

      const productPayload = {
        /*
         * PRODUCT
         */

        name:
          formData.name.trim(),

        description:
          formData.description.trim(),

        price:
          Number(formData.price),

        stock:
          Number(formData.stock),

        /*
         * ====================================================
         * DEPARTMENT / CATEGORY / SUBCATEGORY
         * ====================================================
         *
         * THIS IS THE IMPORTANT PART.
         */

        department:
          departmentName,

        category:
          categoryName,

        subcategory:
          subcategoryName,

        /*
         * IDs are also kept in the
         * frontend payload.
         *
         * The productService currently
         * sends the three required names
         * to the backend.
         */

        departmentId:
          formData.departmentId ||
          undefined,

        categoryId:
          formData.categoryId ||
          undefined,

        subcategoryId:
          formData.subcategoryId ||
          undefined,

        /*
         * PRODUCT INFORMATION
         */

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

        /*
         * SELLER
         */

        sellerEmail:
          formData.sellerEmail.trim(),

        sellerName:
          formData.sellerName.trim(),

        /*
         * MEDIA
         */

        images,

        video,
      };

      /*
       * ======================================================
       * DEBUG
       * ======================================================
       *
       * This makes it easy to confirm in
       * the browser console that department
       * is actually being sent.
       */

      console.log(
        "PRODUCT PAYLOAD:",
        {
          ...productPayload,

          department:
            productPayload.department,

          category:
            productPayload.category,

          subcategory:
            productPayload.subcategory,

          images:
            images.map(
              (image) => ({
                name:
                  image.name,
                size:
                  image.size,
                type:
                  image.type,
              })
            ),

          video:
            video
              ? {
                  name:
                    video.name,
                  size:
                    video.size,
                  type:
                    video.type,
                }
              : null,
        }
      );

      /*
       * ======================================================
       * SAVE
       * ======================================================
       */

      let savedProduct;

      if (isEditing) {
        savedProduct =
          await updateProduct(
            product.id ??
              product._id,
            productPayload
          );
      } else {
        savedProduct =
          await addProduct(
            productPayload
          );
      }

      /*
       * ======================================================
       * SUCCESS
       * ======================================================
       */

      if (onSuccess) {
        onSuccess(
          savedProduct
        );
      }
    } catch (err) {
      console.error(
        "Product submission failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8"
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

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

      {/* ======================================================
          GENERAL ERROR
      ====================================================== */}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ======================================================
          DEPARTMENT API ERROR
      ====================================================== */}

      {departmentError && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          {departmentError}
        </div>
      )}

      {/* ======================================================
          PRODUCT NAME
      ====================================================== */}

      <div>
        <label className="block text-sm font-semibold mb-2">
          Product Name
        </label>

        <input
          type="text"
          name="name"
          value={
            formData.name
          }
          onChange={
            handleChange
          }
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* ======================================================
          DESCRIPTION
      ====================================================== */}

      <div>
        <label className="block text-sm font-semibold mb-2">
          Product Description
        </label>

        <textarea
          name="description"
          value={
            formData.description
          }
          onChange={
            handleChange
          }
          rows={6}
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
          required
        />
      </div>

      {/* ======================================================
          DEPARTMENT / CATEGORY / SUBCATEGORY
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* ====================================================
            DEPARTMENT
        ==================================================== */}

        <div>
          <label className="block text-sm font-semibold mb-2">
            Department
          </label>

          <select
            name="department"
            value={
              formData.department
            }
            onChange={
              handleDepartmentChange
            }
            disabled={
              loadingDepartments
            }
            className="w-full border rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            required
          >
            <option value="">
              {loadingDepartments
                ? "Loading departments..."
                : departments.length ===
                    0
                  ? "No departments available"
                  : "Select department"}
            </option>

            {departments.map(
              (department) => {
                const label =
                  getOptionLabel(
                    department
                  );

                const value =
                  label;

                const id =
                  getOptionValue(
                    department
                  );

                if (!label) {
                  return null;
                }

                return (
                  <option
                    key={
                      id || label
                    }
                    value={
                      value
                    }
                  >
                    {label}
                  </option>
                );
              }
            )}
          </select>

          {!loadingDepartments &&
            departments.length ===
              0 &&
            !departmentError && (
              <p className="text-xs text-red-500 mt-2">
                No departments are available.
              </p>
            )}
        </div>

        {/* ====================================================
            CATEGORY
        ==================================================== */}

        <div>
          <label className="block text-sm font-semibold mb-2">
            Category
          </label>

          <select
            name="category"
            value={
              formData.category
            }
            onChange={
              handleCategoryChange
            }
            disabled={
              !formData.department ||
              loadingCategories
            }
            className="w-full border rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            required
          >
            <option value="">
              {!formData.department
                ? "Select department first"
                : loadingCategories
                  ? "Loading categories..."
                  : categories.length ===
                      0
                    ? "No categories available"
                    : "Select category"}
            </option>

            {categories.map(
              (category) => {
                const label =
                  getOptionLabel(
                    category
                  );

                const value =
                  label;

                const id =
                  getOptionValue(
                    category
                  );

                if (!label) {
                  return null;
                }

                return (
                  <option
                    key={
                      id || label
                    }
                    value={
                      value
                    }
                  >
                    {label}
                  </option>
                );
              }
            )}
          </select>

          {categoryError && (
            <p className="text-xs text-red-500 mt-2">
              {categoryError}
            </p>
          )}

          {formData.department &&
            !loadingCategories &&
            categories.length ===
              0 &&
            !categoryError && (
              <p className="text-xs text-gray-500 mt-2">
                No categories found for this department.
              </p>
            )}
        </div>

        {/* ====================================================
            SUBCATEGORY
        ==================================================== */}

        <div>
          <label className="block text-sm font-semibold mb-2">
            Subcategory
          </label>

          <select
            name="subcategory"
            value={
              formData.subcategory
            }
            onChange={
              handleSubcategoryChange
            }
            disabled={
              !formData.category ||
              loadingSubcategories
            }
            className="w-full border rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            required
          >
            <option value="">
              {!formData.category
                ? "Select category first"
                : loadingSubcategories
                  ? "Loading subcategories..."
                  : subcategories.length ===
                      0
                    ? "No subcategories available"
                    : "Select subcategory"}
            </option>

            {subcategories.map(
              (subcategory) => {
                const label =
                  getOptionLabel(
                    subcategory
                  );

                const value =
                  label;

                const id =
                  getOptionValue(
                    subcategory
                  );

                if (!label) {
                  return null;
                }

                return (
                  <option
                    key={
                      id || label
                    }
                    value={
                      value
                    }
                  >
                    {label}
                  </option>
                );
              }
            )}
          </select>

          {subcategoryError && (
            <p className="text-xs text-red-500 mt-2">
              {subcategoryError}
            </p>
          )}

          {formData.category &&
            !loadingSubcategories &&
            subcategories.length ===
              0 &&
            !subcategoryError && (
              <p className="text-xs text-gray-500 mt-2">
                No subcategories found for this category.
              </p>
            )}
        </div>
      </div>

      {/* ======================================================
          PRICE / DISCOUNT / STOCK
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div>
          <label className="block text-sm font-semibold mb-2">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={
              formData.price
            }
            onChange={
              handleChange
            }
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
            value={
              formData.discountPrice
            }
            onChange={
              handleChange
            }
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
            value={
              formData.stock
            }
            onChange={
              handleChange
            }
            min="0"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
      </div>

      {/* ======================================================
          BRAND / SKU
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
          <label className="block text-sm font-semibold mb-2">
            Brand
          </label>

          <input
            type="text"
            name="brand"
            value={
              formData.brand
            }
            onChange={
              handleChange
            }
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
            value={
              formData.sku
            }
            onChange={
              handleChange
            }
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* ======================================================
          WEIGHT / DELIVERY / STATUS
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div>
          <label className="block text-sm font-semibold mb-2">
            Weight
          </label>

          <input
            type="text"
            name="weight"
            value={
              formData.weight
            }
            onChange={
              handleChange
            }
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
            value={
              formData.deliveryTime
            }
            onChange={
              handleChange
            }
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Status
          </label>

          <select
            name="status"
            value={
              formData.status
            }
            onChange={
              handleChange
            }
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

      {/* ======================================================
          SPECIFICATIONS
      ====================================================== */}

      <div>
        <label className="block text-sm font-semibold mb-2">
          Specifications
        </label>

        <textarea
          name="specifications"
          value={
            formData.specifications
          }
          onChange={
            handleChange
          }
          rows={6}
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      {/* ======================================================
          PRODUCT IMAGES
      ====================================================== */}

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
              Select one or more images
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImagesChange
              }
              className="hidden"
            />

          </label>

          {/* EXISTING IMAGES */}

          {existingImageUrls.length >
            0 && (
            <div className="mt-6">

              <p className="text-sm font-semibold mb-3">
                Existing Images
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {existingImageUrls.map(
                  (
                    url,
                    index
                  ) => (
                    <div
                      key={`${url}-${index}`}
                      className="relative group"
                    >
                      <img
                        src={url}
                        alt={`Product ${
                          index + 1
                        }`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(
                            index
                          )
                        }
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X
                          size={16}
                        />
                      </button>
                    </div>
                  )
                )}

              </div>
            </div>
          )}

          {/* NEW IMAGES */}

          {images.length >
            0 && (
            <div className="mt-6">

              <p className="text-sm font-semibold mb-3">
                New Images
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {images.map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      key={`${image.name}-${image.lastModified}-${index}`}
                      className="relative group"
                    >

                      <img
                        src={
                          imagePreviews[
                            index
                          ]
                        }
                        alt={
                          image.name
                        }
                        className="w-full h-32 object-cover rounded-lg border"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            index
                          )
                        }
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X
                          size={16}
                        />
                      </button>

                    </div>
                  )
                )}

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ======================================================
          PRODUCT VIDEO
      ====================================================== */}

      <div>

        <label className="block text-sm font-semibold mb-2">
          Product Video
        </label>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">

          {!video ? (
            <label className="flex flex-col items-center justify-center cursor-pointer">

              <Upload
                size={32}
                className="text-gray-400 mb-2"
              />

              <span className="text-sm font-medium">
                Upload product video
              </span>

              <span className="text-xs text-gray-500 mt-1">
                Optional
              </span>

              <input
                type="file"
                accept="video/*"
                onChange={
                  handleVideoChange
                }
                className="hidden"
              />

            </label>
          ) : (
            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3 min-w-0">

                <div className="bg-gray-100 rounded-lg p-3">
                  <Upload
                    size={20}
                    className="text-gray-600"
                  />
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-medium truncate">
                    {video.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {(
                      video.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={
                  removeVideo
                }
                className="text-red-600 hover:text-red-700"
              >
                <X size={20} />
              </button>

            </div>
          )}

        </div>
      </div>

      {/* ======================================================
          SELLER INFORMATION
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>

          <label className="block text-sm font-semibold mb-2">
            Seller Name
          </label>

          <input
            type="text"
            name="sellerName"
            value={
              formData.sellerName
            }
            onChange={
              handleChange
            }
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
            value={
              formData.sellerEmail
            }
            onChange={
              handleChange
            }
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />

        </div>

      </div>

      {/* ======================================================
          BUTTONS
      ====================================================== */}

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">

        {onCancel && (
          <button
            type="button"
            onClick={
              onCancel
            }
            disabled={
              loading
            }
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={
            loading
          }
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >

          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              {isEditing
                ? "Updating..."
                : "Creating..."}
            </>
          ) : (
            <>
              <Plus
                size={18}
              />

              {isEditing
                ? "Update Product"
                : "Create Product"}
            </>
          )}

        </button>

      </div>

    </form>
  );
}

export default ProductForm;