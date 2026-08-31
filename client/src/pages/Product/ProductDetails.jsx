import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Store,
  Loader2,
  ArrowLeft,
  Check,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useProducts } from "../../context/ProductContext";
import reviews from "../../data/reviews";

import {
  getStoreBySellerEmail,
} from "../../services/storeService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const {
    getProduct,
    products,
    loading: productsLoading,
  } = useProducts();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColour, setSelectedColour] = useState("");

  /*
   * =========================================================
   * SELLER STORE
   * =========================================================
   */

  const [sellerStore, setSellerStore] = useState(null);
  const [storeLoading, setStoreLoading] = useState(false);

  /*
   * =========================================================
   * LOAD PRODUCT FROM LIVE API
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getProduct(id);

        if (cancelled) {
          return;
        }

        if (!result) {
          setProduct(null);
          setError("Product not found.");
          return;
        }

        setProduct(result);
      } catch (err) {
        console.error(
          "Failed to load product details:",
          err
        );

        if (!cancelled) {
          setProduct(null);
          setError(
            err?.message ||
              "Failed to load product."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadProduct();
    } else {
      setLoading(false);
      setError("Invalid product ID.");
    }

    return () => {
      cancelled = true;
    };
  }, [id, getProduct]);

  /*
   * =========================================================
   * LOAD SELLER STORE
   * =========================================================
   *
   * Once the product has loaded, use the seller's email
   * to find their active store.
   */

  useEffect(() => {
    let cancelled = false;

    const loadSellerStore = async () => {
      if (!product?.sellerEmail) {
        setSellerStore(null);
        return;
      }

      try {
        setStoreLoading(true);

        const store =
          await getStoreBySellerEmail(
            product.sellerEmail
          );

        if (!cancelled) {
          setSellerStore(store);
        }
      } catch (error) {
        console.error(
          "Failed to load seller store:",
          error
        );

        if (!cancelled) {
          setSellerStore(null);
        }
      } finally {
        if (!cancelled) {
          setStoreLoading(false);
        }
      }
    };

    loadSellerStore();

    return () => {
      cancelled = true;
    };
  }, [product]);

  /*
   * =========================================================
   * NORMALIZE PRODUCT IMAGES
   * =========================================================
   *
   * Backend:
   * imageUrl
   * imageUrls
   *
   * Older frontend:
   * image
   * images
   *
   * We support both.
   */

  const productImages = useMemo(() => {
    if (!product) {
      return [];
    }

    const images = [];

    if (
      typeof product.imageUrl === "string" &&
      product.imageUrl.trim()
    ) {
      images.push(product.imageUrl.trim());
    }

    if (Array.isArray(product.imageUrls)) {
      product.imageUrls.forEach((image) => {
        if (
          typeof image === "string" &&
          image.trim()
        ) {
          images.push(image.trim());
        }
      });
    }

    if (
      typeof product.image === "string" &&
      product.image.trim()
    ) {
      images.push(product.image.trim());
    }

    if (Array.isArray(product.images)) {
      product.images.forEach((image) => {
        if (
          typeof image === "string" &&
          image.trim()
        ) {
          images.push(image.trim());
        }
      });
    }

    return [...new Set(images)];
  }, [product]);

  /*
   * =========================================================
   * SET MAIN IMAGE
   * =========================================================
   */

  useEffect(() => {
    if (productImages.length > 0) {
      setSelectedImage(productImages[0]);
    } else {
      setSelectedImage("");
    }
  }, [productImages]);

  /*
   * =========================================================
   * PRODUCT VALUES
   * =========================================================
   */

  const price = Number(
    product?.price || 0
  );

  const discountPrice = Number(
    product?.discountPrice || 0
  );

  const hasDiscount =
    discountPrice > 0 &&
    discountPrice < price;

  const displayPrice = hasDiscount
    ? discountPrice
    : price;

  const stock = Number(
    product?.stock || 0
  );

  const oldPrice = hasDiscount
    ? price
    : Number(
        product?.oldPrice || 0
      );

  const rating = Number(
    product?.rating || 0
  );

  const reviewCount = Number(
    product?.reviews || 0
  );

  /*
   * =========================================================
   * SPECIFICATIONS
   * =========================================================
   */

  const specifications =
    product?.specifications &&
    typeof product.specifications ===
      "object"
      ? product.specifications
      : {};

  const sizes = Array.isArray(
    specifications.sizes
  )
    ? specifications.sizes
    : [];

  const colours = [];

  if (specifications.colour) {
    colours.push(
      specifications.colour
    );
  }

  if (
    Array.isArray(
      specifications.colours
    )
  ) {
    specifications.colours.forEach(
      (colour) => {
        if (
          colour &&
          !colours.includes(colour)
        ) {
          colours.push(colour);
        }
      }
    );
  }

  /*
   * =========================================================
   * WISHLIST
   * =========================================================
   */

  const wishlistActive =
    product
      ? isInWishlist(product.id)
      : false;

  /*
   * =========================================================
   * REVIEWS
   * =========================================================
   */

  const productReviews =
    product
      ? reviews.filter(
          (review) =>
            String(review.productId) ===
            String(product.id)
        )
      : [];

  /*
   * =========================================================
   * SIMILAR PRODUCTS
   * =========================================================
   */

  const similarProducts = useMemo(() => {
    if (
      !product ||
      !Array.isArray(products)
    ) {
      return [];
    }

    return products
      .filter((item) => {
        if (
          String(item.id) ===
          String(product.id)
        ) {
          return false;
        }

        /*
         * Prefer matching subcategory.
         */

        if (
          product.subcategory &&
          item.subcategory
        ) {
          return (
            String(
              item.subcategory
            ).toLowerCase() ===
            String(
              product.subcategory
            ).toLowerCase()
          );
        }

        /*
         * Otherwise match category.
         */

        if (
          product.category &&
          item.category
        ) {
          return (
            String(
              item.category
            ).toLowerCase() ===
            String(
              product.category
            ).toLowerCase()
          );
        }

        return false;
      })
      .slice(0, 4);
  }, [products, product]);

  /*
   * =========================================================
   * QUANTITY
   * =========================================================
   */

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(
        (current) => current + 1
      );
    }
  };

  const decreaseQuantity = () => {
    setQuantity(
      (current) =>
        current > 1
          ? current - 1
          : 1
    );
  };

  /*
   * =========================================================
   * ADD TO CART
   * =========================================================
   */

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    if (stock <= 0) {
      return;
    }

    addToCart(
      product,
      quantity
    );
  };

  /*
   * =========================================================
   * WISHLIST
   * =========================================================
   */

  const handleWishlist = () => {
    if (!product) {
      return;
    }

    if (wishlistActive) {
      removeFromWishlist(
        product.id
      );
    } else {
      addToWishlist(product);
    }
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading || productsLoading) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">

          <Loader2
            size={42}
            className="mx-auto text-green-600 animate-spin"
          />

          <p className="mt-4 text-gray-600">
            Loading product...
          </p>

        </div>
      </section>
    );
  }

  /*
   * =========================================================
   * PRODUCT NOT FOUND
   * =========================================================
   */

  if (!product) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="text-center">

          <h2 className="text-3xl font-bold text-gray-900">
            Product not found
          </h2>

          <p className="text-gray-500 mt-3">
            {error ||
              "The product you are looking for does not exist."}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

        </div>

      </section>
    );
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* =====================================================
          BACK / BREADCRUMB
          ===================================================== */}

      <div className="mb-8">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-green-700 font-semibold hover:underline"
        >
          <ArrowLeft size={18} />
          Back to products
        </button>

        <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mt-4">

          <Link
            to="/"
            className="hover:text-green-700"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/shop"
            className="hover:text-green-700"
          >
            Shop
          </Link>

          {product.department && (
            <>
              <span>/</span>

              <span>
                {product.department}
              </span>
            </>
          )}

          {product.category && (
            <>
              <span>/</span>

              <span>
                {product.category}
              </span>
            </>
          )}

          {product.subcategory && (
            <>
              <span>/</span>

              <span>
                {product.subcategory}
              </span>
            </>
          )}

          <span>/</span>

          <span className="text-gray-900 font-medium">
            {product.name}
          </span>

        </div>

      </div>

      {/* =====================================================
          MAIN PRODUCT AREA
          ===================================================== */}

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

        {/* ===================================================
            LEFT — IMAGES
            =================================================== */}

        <div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

            {selectedImage ? (
              <img
                src={selectedImage}
                alt={
                  product.name ||
                  "Product"
                }
                className="w-full h-[420px] sm:h-[500px] lg:h-[550px] object-contain bg-gray-50"
              />
            ) : (
              <div className="w-full h-[420px] sm:h-[500px] lg:h-[550px] bg-gray-100 flex items-center justify-center text-gray-400">
                No product image
              </div>
            )}

          </div>

          {/* THUMBNAILS */}

          {productImages.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">

              {productImages
                .slice(0, 8)
                .map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          image
                        )
                      }
                      className={`rounded-lg overflow-hidden border-2 transition ${
                        selectedImage ===
                        image
                          ? "border-green-600"
                          : "border-gray-200 hover:border-green-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${
                          index + 1
                        }`}
                        className="w-full aspect-square object-cover"
                      />
                    </button>
                  )
                )}

            </div>
          )}

          {/* VIDEO */}

          {product.videoUrl && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border p-4">

              <h3 className="font-bold text-lg mb-4">
                Product Video
              </h3>

              <video
                src={product.videoUrl}
                controls
                className="w-full rounded-lg bg-black max-h-[500px]"
              />

            </div>
          )}

        </div>

        {/* ===================================================
            RIGHT — PRODUCT INFORMATION
            =================================================== */}

        <div>

          {/* PRODUCT NAME */}

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          {/* BRAND */}

          {product.brand && (
            <p className="text-gray-500 mt-2">
              Brand:{" "}
              <span className="font-semibold text-gray-700">
                {product.brand}
              </span>
            </p>
          )}

          {/* RATING */}

          <div className="flex items-center gap-2 mt-4">

            <div className="flex">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={
                      star <=
                      Math.round(
                        rating
                      )
                        ? "#fbbf24"
                        : "transparent"
                    }
                    color="#fbbf24"
                  />
                )
              )}

            </div>

            <span className="text-gray-600">
              {rating > 0
                ? rating.toFixed(1)
                : "No rating"}
            </span>

            <span className="text-gray-500">
              ({reviewCount} Reviews)
            </span>

          </div>

          {/* PRICE */}

          <div className="mt-6">

            <div className="flex items-center gap-3 flex-wrap">

              <h2 className="text-3xl sm:text-4xl font-bold text-green-700">
                ₦
                {displayPrice.toLocaleString()}
              </h2>

              {hasDiscount && (
                <span className="text-gray-400 line-through text-lg">
                  ₦
                  {oldPrice.toLocaleString()}
                </span>
              )}

            </div>

            {hasDiscount && (
              <p className="text-red-600 font-semibold mt-2">
                Save ₦
                {(
                  price -
                  discountPrice
                ).toLocaleString()}
              </p>
            )}

          </div>

          {/* STOCK */}

          <div className="mt-5">

            {stock > 0 ? (
              <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold">
                <Check size={16} />
                {stock} available
              </span>
            ) : (
              <span className="inline-flex bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold">
                Out of stock
              </span>
            )}

          </div>

          {/* SIZE */}

          {sizes.length > 0 && (
            <div className="mt-8">

              <h3 className="font-semibold mb-3">
                Available Sizes
              </h3>

              <div className="flex flex-wrap gap-3">

                {sizes.map(
                  (size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setSelectedSize(
                          size
                        )
                      }
                      className={`min-w-[52px] px-4 py-3 border rounded-lg transition ${
                        selectedSize ===
                        size
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-300 hover:border-green-600 hover:text-green-700"
                      }`}
                    >
                      {size}
                    </button>
                  )
                )}

              </div>

            </div>
          )}

          {/* COLOUR */}

          {colours.length > 0 && (
            <div className="mt-8">

              <h3 className="font-semibold mb-3">
                Colour
              </h3>

              <div className="flex flex-wrap gap-3">

                {colours.map(
                  (colour) => (
                    <button
                      key={colour}
                      type="button"
                      onClick={() =>
                        setSelectedColour(
                          colour
                        )
                      }
                      className={`px-4 py-2 rounded-lg border transition ${
                        selectedColour ===
                        colour
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-300 hover:border-green-600"
                      }`}
                    >
                      {colour}
                    </button>
                  )
                )}

              </div>

            </div>
          )}

          {/* QUANTITY */}

          <div className="mt-8">

            <h3 className="font-semibold mb-3">
              Quantity
            </h3>

            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit bg-white">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
                className="px-5 py-3 text-xl hover:bg-gray-100 disabled:opacity-40 transition"
              >
                -
              </button>

              <span className="px-7 font-semibold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  quantity >= stock
                }
                className="px-5 py-3 text-xl hover:bg-gray-100 disabled:opacity-40 transition"
              >
                +
              </button>

            </div>

          </div>

          {/* ACTION BUTTONS */}

          <div className="flex gap-3 sm:gap-4 mt-8">

            <button
              type="button"
              onClick={
                handleAddToCart
              }
              disabled={stock <= 0}
              className={`flex-1 h-14 rounded-xl text-white flex items-center justify-center gap-3 font-semibold transition ${
                stock > 0
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <ShoppingCart
                size={21}
              />

              {stock > 0
                ? `Add ${quantity} To Cart`
                : "Out of Stock"}
            </button>

            <button
              type="button"
              onClick={
                handleWishlist
              }
              className={`w-14 h-14 rounded-xl border flex items-center justify-center transition ${
                wishlistActive
                  ? "bg-red-50 border-red-500"
                  : "hover:bg-gray-100 border-gray-300"
              }`}
              title={
                wishlistActive
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"
              }
            >
              <Heart
                size={23}
                className={
                  wishlistActive
                    ? "text-red-600 fill-red-600"
                    : "text-gray-700"
                }
              />
            </button>

          </div>

          {/* DELIVERY / SECURITY */}

          <div className="mt-10 space-y-6">

            <div className="flex gap-4">

              <Truck className="text-green-700 shrink-0" />

              <div>

                <h4 className="font-semibold">
                  Nationwide Delivery
                </h4>

                <p className="text-gray-500 text-sm mt-1">
                  {product.deliveryTime ||
                    product.delivery ||
                    "Fast delivery anywhere in Nigeria."}
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <ShieldCheck className="text-green-700 shrink-0" />

              <div>

                <h4 className="font-semibold">
                  Verified Seller
                </h4>

                <p className="text-gray-500 text-sm mt-1">
                  Product sold by an approved Mandilas Market seller.
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <RotateCcw className="text-green-700 shrink-0" />

              <div>

                <h4 className="font-semibold">
                  Return Policy
                </h4>

                <p className="text-gray-500 text-sm mt-1">
                  {product.returnPolicy ||
                    "Returns accepted according to seller policy."}
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              SELLER CARD
              ================================================= */}

          <div className="mt-10 bg-white rounded-xl shadow-sm border p-6">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">

                <Store
                  className="text-green-700"
                  size={28}
                />

              </div>

              <div className="min-w-0">

                <h3 className="text-lg font-bold truncate">
                  {product.seller ||
                    product.sellerName ||
                    "Mandilas Seller"}
                </h3>

                <p className="text-gray-500">
                  Verified Seller
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 mt-5">

              <Star
                fill="#fbbf24"
                color="#fbbf24"
                size={18}
              />

              <span className="font-semibold">
                {rating > 0
                  ? rating.toFixed(1)
                  : "New"}{" "}
                Seller Rating
              </span>

            </div>

            {/* SELLER ACTIONS */}

            <div className="grid grid-cols-2 gap-3 mt-6">

              {/* CHAT SELLER */}

              <button
                type="button"
                className="h-12 rounded-lg border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition"
              >
                Chat Seller
              </button>

              {/* VISIT STORE */}

              {sellerStore?.slug ? (
                <Link
                  to={`/store/${sellerStore.slug}`}
                  className="h-12 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center justify-center"
                >
                  Visit Store
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="h-12 rounded-lg bg-gray-300 text-gray-500 font-semibold cursor-not-allowed"
                >
                  {storeLoading
                    ? "Loading Store..."
                    : "Store Unavailable"}
                </button>
              )}

            </div>

          </div>

          {/* =================================================
              PRODUCT DESCRIPTION
              ================================================= */}

          <div className="mt-10 bg-white rounded-xl shadow-sm border p-6">

            <h2 className="text-2xl font-bold mb-5">
              Product Description
            </h2>

            {product.description ? (
              <p className="text-gray-600 leading-8 whitespace-pre-line">
                {product.description}
              </p>
            ) : (
              <p className="text-gray-500">
                No product description provided.
              </p>
            )}

          </div>

          {/* =================================================
              PRODUCT SPECIFICATIONS
              ================================================= */}

          <div className="mt-10 bg-white rounded-xl shadow-sm border p-6">

            <h2 className="text-2xl font-bold mb-6">
              Product Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {product.brand && (
                <div className="flex justify-between gap-4 border-b pb-3">

                  <span className="text-gray-500">
                    Brand
                  </span>

                  <span className="font-semibold text-right">
                    {product.brand}
                  </span>

                </div>
              )}

              {product.department && (
                <div className="flex justify-between gap-4 border-b pb-3">

                  <span className="text-gray-500">
                    Department
                  </span>

                  <span className="font-semibold text-right">
                    {product.department}
                  </span>

                </div>
              )}

              {product.category && (
                <div className="flex justify-between gap-4 border-b pb-3">

                  <span className="text-gray-500">
                    Category
                  </span>

                  <span className="font-semibold text-right">
                    {product.category}
                  </span>

                </div>
              )}

              {product.subcategory && (
                <div className="flex justify-between gap-4 border-b pb-3">

                  <span className="text-gray-500">
                    Subcategory
                  </span>

                  <span className="font-semibold text-right">
                    {product.subcategory}
                  </span>

                </div>
              )}

              {specifications.material && (
                <div className="flex justify-between gap-4 border-b pb-3">

                  <span className="text-gray-500">
                    Material
                  </span>

                  <span className="font-semibold text-right">
                    {specifications.material}
                  </span>

                </div>
              )}

              {specifications.colour && (
                <div className="flex justify-between gap-4 border-b pb-3">

                  <span className="text-gray-500">
                    Colour
                  </span>

                  <span className="font-semibold text-right">
                    {specifications.colour}
                  </span>

                </div>
              )}

              {specifications.condition && (
                <div className="flex justify-between gap-4 border-b pb-3">

                  <span className="text-gray-500">
                    Condition
                  </span>

                  <span className="font-semibold text-right">
                    {specifications.condition}
                  </span>

                </div>
              )}

              {specifications.weight && (
                <div className="flex justify-between gap-4 border-b pb-3">

                  <span className="text-gray-500">
                    Weight
                  </span>

                  <span className="font-semibold text-right">
                    {specifications.weight}
                  </span>

                </div>
              )}

              {product.sku && (
                <div className="flex justify-between gap-4 border-b pb-3">

                  <span className="text-gray-500">
                    SKU
                  </span>

                  <span className="font-semibold text-right">
                    {product.sku}
                  </span>

                </div>
              )}

              {product.warranty && (
                <div className="flex justify-between gap-4 border-b pb-3">

                  <span className="text-gray-500">
                    Warranty
                  </span>

                  <span className="font-semibold text-right">
                    {product.warranty}
                  </span>

                </div>
              )}

              {product.deliveryTime && (
                <div className="flex justify-between gap-4 border-b pb-3">

                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-semibold text-right">
                    {product.deliveryTime}
                  </span>

                </div>
              )}

              {product.returnPolicy && (
                <div className="flex justify-between gap-4 border-b pb-3 md:col-span-2">

                  <span className="text-gray-500">
                    Return Policy
                  </span>

                  <span className="font-semibold text-right">
                    {product.returnPolicy}
                  </span>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          CUSTOMER REVIEWS
          ===================================================== */}

      <div className="mt-14">

        <h2 className="text-3xl font-bold mb-8">
          Customer Reviews
        </h2>

        {productReviews.length ===
        0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
            No reviews yet.
          </div>
        ) : (
          <div className="space-y-6">

            {productReviews.map(
              (review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl shadow-sm border p-6"
                >

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div>

                      <h3 className="font-bold text-lg">
                        {review.user}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {review.date}
                      </p>

                    </div>

                    <div className="flex">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <Star
                            key={star}
                            size={18}
                            fill={
                              star <=
                              Number(
                                review.rating ||
                                  0
                              )
                                ? "#fbbf24"
                                : "transparent"
                            }
                            color="#fbbf24"
                          />
                        )
                      )}

                    </div>

                  </div>

                  <p className="text-gray-600 leading-7 mt-5">
                    {review.comment}
                  </p>

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          SIMILAR PRODUCTS
          ===================================================== */}

      {similarProducts.length > 0 && (
        <div className="mt-16">

          <h2 className="text-3xl font-bold mb-8">
            Similar Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

            {similarProducts.map(
              (item) => {
                const itemImage =
                  item.imageUrl ||
                  (Array.isArray(
                    item.imageUrls
                  )
                    ? item.imageUrls[0]
                    : "") ||
                  item.image ||
                  "";

                const itemPrice =
                  Number(
                    item.price || 0
                  );

                const itemDiscount =
                  Number(
                    item.discountPrice ||
                      0
                  );

                const itemHasDiscount =
                  itemDiscount > 0 &&
                  itemDiscount < itemPrice;

                const itemDisplayPrice =
                  itemHasDiscount
                    ? itemDiscount
                    : itemPrice;

                return (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition overflow-hidden group"
                  >

                    <div className="relative overflow-hidden">

                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={
                            item.name ||
                            "Product"
                          }
                          className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}

                      {itemHasDiscount && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold">
                          SALE
                        </span>
                      )}

                    </div>

                    <div className="p-4">

                      <h3 className="font-semibold line-clamp-2 min-h-[48px]">
                        {item.name}
                      </h3>

                      <div className="mt-3">

                        <span className="text-green-700 font-bold text-lg">
                          ₦
                          {itemDisplayPrice.toLocaleString()}
                        </span>

                        {itemHasDiscount && (
                          <span className="ml-2 text-gray-400 line-through text-sm">
                            ₦
                            {itemPrice.toLocaleString()}
                          </span>
                        )}

                      </div>

                    </div>

                  </Link>
                );
              }
            )}

          </div>

        </div>
      )}

    </section>
  );
}

export default ProductDetails;