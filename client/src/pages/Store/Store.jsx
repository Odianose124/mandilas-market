import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Loader2,
  MapPin,
  Package,
  Search,
  Store as StoreIcon,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getStoreBySlug,
  getStoreProductsNewest,
} from "../../services/storeService";


function Store() {
  const { slug } = useParams();

  const [store, setStore] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  /*
   * ========================================================
   * LOAD STORE
   * ========================================================
   */

  useEffect(() => {
    let cancelled = false;

    const loadStore = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          storeData,
          productData,
        ] = await Promise.all([
          getStoreBySlug(slug),
          getStoreProductsNewest(slug),
        ]);

        if (cancelled) {
          return;
        }

        setStore(storeData);

        setProducts(
          Array.isArray(productData)
            ? productData
            : []
        );

      } catch (err) {
        console.error(
          "Failed to load store:",
          err
        );

        if (!cancelled) {
          setError(
            err?.message ||
              "Failed to load store."
          );
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      loadStore();
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);


  /*
   * ========================================================
   * SEARCH PRODUCTS
   * ========================================================
   */

  const filteredProducts =
    products.filter((product) =>
      String(
        product.name || ""
      )
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );


  /*
   * ========================================================
   * LOADING
   * ========================================================
   */

  if (loading) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center">

        <div className="text-center">

          <Loader2
            size={42}
            className="mx-auto text-green-600 animate-spin"
          />

          <p className="mt-4 text-gray-600">
            Loading store...
          </p>

        </div>

      </section>
    );
  }


  /*
   * ========================================================
   * ERROR
   * ========================================================
   */

  if (error || !store) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="text-center">

          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">

            <StoreIcon
              size={36}
              className="text-red-500"
            />

          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-6">
            Store unavailable
          </h1>

          <p className="text-gray-500 mt-3">
            {error ||
              "This store could not be found."}
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>

        </div>

      </section>
    );
  }


  /*
   * ========================================================
   * RENDER
   * ========================================================
   */

  return (
    <section className="bg-gray-50 min-h-screen pb-16">

      {/* ====================================================
          STORE BANNER
          ==================================================== */}

      <div className="relative">

        {store.bannerUrl ? (
          <img
            src={store.bannerUrl}
            alt={
              store.storeName
            }
            className="w-full h-[220px] sm:h-[280px] lg:h-[340px] object-cover"
          />
        ) : (
          <div className="w-full h-[220px] sm:h-[280px] lg:h-[340px] bg-green-700" />
        )}

        <div className="absolute inset-0 bg-black/30" />

      </div>


      {/* ====================================================
          STORE INFORMATION
          ==================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative -mt-16 sm:-mt-20">

          <div className="bg-white rounded-2xl shadow-lg border p-5 sm:p-7">

            <div className="flex flex-col md:flex-row md:items-center gap-5">

              {/* STORE LOGO */}

              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden shrink-0">

                {store.logoUrl ? (
                  <img
                    src={store.logoUrl}
                    alt={
                      store.storeName
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-green-100 flex items-center justify-center">

                    <StoreIcon
                      size={42}
                      className="text-green-700"
                    />

                  </div>
                )}

              </div>


              {/* STORE DETAILS */}

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {store.storeName}
                  </h1>

                  {store.active && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                      Active Store
                    </span>
                  )}

                </div>


                {store.description && (
                  <p className="text-gray-600 mt-2 max-w-3xl">
                    {store.description}
                  </p>
                )}


                <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-500">

                  {store.location && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin
                        size={17}
                        className="text-green-700"
                      />

                      {store.location}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-2">
                    <Package
                      size={17}
                      className="text-green-700"
                    />

                    {products.length} Products
                  </span>

                </div>

              </div>


              {/* BACK */}

              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-green-600 hover:text-green-700 px-5 py-3 rounded-lg font-semibold transition"
              >
                <ArrowLeft
                  size={18}
                />

                Back to Shop
              </Link>

            </div>

          </div>

        </div>


        {/* ==================================================
            PRODUCTS
            ================================================== */}

        <div className="mt-10">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Store Products
              </h2>

              <p className="text-gray-500 mt-1">
                Browse products from{" "}
                {store.storeName}.
              </p>

            </div>


            {/* SEARCH */}

            <div className="relative w-full sm:w-80">

              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search this store..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white outline-none focus:border-green-600"
              />

            </div>

          </div>


          {filteredProducts.length ===
          0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">

              <Package
                size={45}
                className="mx-auto text-gray-300"
              />

              <h3 className="font-bold text-xl mt-4">
                No products found
              </h3>

              <p className="text-gray-500 mt-2">
                {search
                  ? "No products match your search."
                  : "This store has no products yet."}
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

              {filteredProducts.map(
                (product) => {

                  const image =
                    product.imageUrl ||
                    (
                      Array.isArray(
                        product.imageUrls
                      )
                        ? product
                            .imageUrls[0]
                        : ""
                    );

                  const price =
                    Number(
                      product.price ||
                        0
                    );

                  const discountPrice =
                    Number(
                      product.discountPrice ||
                        0
                    );

                  const hasDiscount =
                    discountPrice >
                      0 &&
                    discountPrice <
                      price;

                  const displayPrice =
                    hasDiscount
                      ? discountPrice
                      : price;

                  return (
                    <Link
                      key={
                        product.id
                      }
                      to={`/product/${product.id}`}
                      className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition group"
                    >

                      <div className="relative aspect-square bg-gray-100 overflow-hidden">

                        {image ? (
                          <img
                            src={image}
                            alt={
                              product.name
                            }
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}

                        {hasDiscount && (
                          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            SALE
                          </span>
                        )}

                      </div>


                      <div className="p-4">

                        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[48px]">
                          {product.name}
                        </h3>


                        <div className="mt-3">

                          <span className="text-green-700 font-bold text-lg">
                            ₦
                            {displayPrice.toLocaleString()}
                          </span>

                          {hasDiscount && (
                            <span className="ml-2 text-sm text-gray-400 line-through">
                              ₦
                              {price.toLocaleString()}
                            </span>
                          )}

                        </div>

                      </div>

                    </Link>
                  );
                }
              )}

            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default Store;