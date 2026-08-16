import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import Header from "../../components/layout/Header";
import BackButton from "../../components/Navigation/BackButton";
import ProductCard from "../../components/product/ProductCard";
import categories from "../../data/categories";
import { useProducts } from "../../context/ProductContext";

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    products,
    loading,
    error,
    getAllProducts,
    getCategoryProducts,
    getCategoryAndSubcategoryProducts,
    getSubcategoryProducts,
    searchProducts,
  } = useProducts();

  const categorySlug =
    searchParams.get("category") || "";

  const subcategorySlug =
    searchParams.get("subcategory") || "";

  const searchQuery =
    searchParams.get("search") || "";

  const [shopProducts, setShopProducts] =
    useState([]);

  const [filterLoading, setFilterLoading] =
    useState(false);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  /*
   * =========================================================
   * FIND CURRENT CATEGORY
   * =========================================================
   */

  const currentCategory = useMemo(() => {
    if (!categorySlug) {
      return null;
    }

    return (
      categories.find(
        (category) =>
          category.slug === categorySlug
      ) || null
    );
  }, [categorySlug]);

  /*
   * =========================================================
   * FIND CURRENT SUBCATEGORY
   * =========================================================
   */

  const currentSubcategory = useMemo(() => {
    if (
      !currentCategory ||
      !subcategorySlug
    ) {
      return null;
    }

    return (
      currentCategory.subcategories?.find(
        (subcategory) =>
          subcategory.slug ===
          subcategorySlug
      ) || null
    );
  }, [
    currentCategory,
    subcategorySlug,
  ]);

  /*
   * =========================================================
   * LOAD PRODUCTS
   * =========================================================
   *
   * Priority:
   *
   * 1. Search
   * 2. Category + Subcategory
   * 3. Category
   * 4. Subcategory
   * 5. All Products
   */

  useEffect(() => {
    let cancelled = false;

    const loadShopProducts = async () => {
      try {
        setFilterLoading(true);

        let result = [];

        /*
         * SEARCH
         */

        if (searchQuery.trim()) {
          result = await searchProducts(
            searchQuery.trim()
          );
        }

        /*
         * CATEGORY + SUBCATEGORY
         */

        else if (
          categorySlug &&
          subcategorySlug
        ) {
          result =
            await getCategoryAndSubcategoryProducts(
              categorySlug,
              subcategorySlug
            );
        }

        /*
         * CATEGORY
         */

        else if (categorySlug) {
          result =
            await getCategoryProducts(
              categorySlug
            );
        }

        /*
         * SUBCATEGORY ONLY
         */

        else if (subcategorySlug) {
          result =
            await getSubcategoryProducts(
              subcategorySlug
            );
        }

        /*
         * ALL PRODUCTS
         */

        else {
          result =
            await getAllProducts();
        }

        if (!cancelled) {
          setShopProducts(
            Array.isArray(result)
              ? result
              : []
          );
        }
      } catch (err) {
        console.error(
          "Failed to load shop products:",
          err
        );

        if (!cancelled) {
          setShopProducts([]);
        }
      } finally {
        if (!cancelled) {
          setFilterLoading(false);
        }
      }
    };

    loadShopProducts();

    return () => {
      cancelled = true;
    };
  }, [
    categorySlug,
    subcategorySlug,
    searchQuery,
    getAllProducts,
    getCategoryProducts,
    getCategoryAndSubcategoryProducts,
    getSubcategoryProducts,
    searchProducts,
  ]);

  /*
   * =========================================================
   * DISPLAYED PRODUCTS
   * =========================================================
   */

  const displayedProducts = useMemo(() => {
    if (
      !categorySlug &&
      !subcategorySlug &&
      !searchQuery &&
      products.length > 0 &&
      shopProducts.length === 0 &&
      !filterLoading
    ) {
      return products;
    }

    return shopProducts;
  }, [
    products,
    shopProducts,
    categorySlug,
    subcategorySlug,
    searchQuery,
    filterLoading,
  ]);

  /*
   * =========================================================
   * PAGE TITLE
   * =========================================================
   */

  const pageTitle = useMemo(() => {
    if (searchQuery.trim()) {
      return `Search results for "${searchQuery}"`;
    }

    if (currentSubcategory) {
      return currentSubcategory.name;
    }

    if (currentCategory) {
      return currentCategory.name;
    }

    return "All Products";
  }, [
    searchQuery,
    currentCategory,
    currentSubcategory,
  ]);

  /*
   * =========================================================
   * PAGE DESCRIPTION
   * =========================================================
   */

  const pageDescription = useMemo(() => {
    if (searchQuery.trim()) {
      return `Products matching "${searchQuery}".`;
    }

    if (currentSubcategory) {
      return `Browse ${currentSubcategory.name} products on Mandilas Market.`;
    }

    if (currentCategory) {
      return `Browse ${currentCategory.name} products available on Mandilas Market.`;
    }

    return "Browse products available on Mandilas Market.";
  }, [
    searchQuery,
    currentCategory,
    currentSubcategory,
  ]);

  /*
   * =========================================================
   * CATEGORY NAVIGATION
   * =========================================================
   */

  const handleCategoryChange = (
    category
  ) => {
    const params =
      new URLSearchParams();

    params.set(
      "category",
      category.slug
    );

    setSearchParams(params);

    setMobileFiltersOpen(false);
  };

  /*
   * =========================================================
   * SUBCATEGORY NAVIGATION
   * =========================================================
   */

  const handleSubcategoryChange = (
    category,
    subcategory
  ) => {
    const params =
      new URLSearchParams();

    params.set(
      "category",
      category.slug
    );

    params.set(
      "subcategory",
      subcategory.slug
    );

    setSearchParams(params);

    setMobileFiltersOpen(false);
  };

  /*
   * =========================================================
   * CLEAR FILTERS
   * =========================================================
   */

  const clearFilters = () => {
    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const handleSearch = (
    event
  ) => {
    event.preventDefault();

    const formData =
      new FormData(
        event.currentTarget
      );

    const search =
      String(
        formData.get("search") || ""
      ).trim();

    const params =
      new URLSearchParams();

    if (search) {
      params.set(
        "search",
        search
      );
    }

    setSearchParams(params);
  };

  /*
   * =========================================================
   * ACTIVE FILTER
   * =========================================================
   */

  const hasActiveFilter =
    Boolean(
      categorySlug ||
        subcategorySlug ||
        searchQuery
    );

  /*
   * =========================================================
   * REMOVE SEARCH FILTER
   * =========================================================
   */

  const removeSearchFilter = () => {
    const params =
      new URLSearchParams(
        searchParams
      );

    params.delete("search");

    setSearchParams(params);
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* BACK BUTTON */}

        <div className="mb-5">
          <BackButton />
        </div>

        {/* BREADCRUMB */}

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 flex-wrap">

          <Link
            to="/"
            className="hover:text-green-700 transition"
          >
            Home
          </Link>

          <ChevronRight size={15} />

          <Link
            to="/shop"
            className="hover:text-green-700 transition"
          >
            Shop
          </Link>

          {currentCategory && (
            <>
              <ChevronRight size={15} />

              <button
                type="button"
                onClick={() =>
                  handleCategoryChange(
                    currentCategory
                  )
                }
                className="hover:text-green-700 transition"
              >
                {currentCategory.name}
              </button>
            </>
          )}

          {currentSubcategory && (
            <>
              <ChevronRight size={15} />

              <span className="text-gray-900 font-medium">
                {currentSubcategory.name}
              </span>
            </>
          )}

        </div>

        {/* PAGE HEADER */}

        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 mb-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {pageTitle}
              </h1>

              <p className="text-gray-500 mt-2">
                {pageDescription}
              </p>
            </div>

            <div className="text-sm text-gray-500">
              {filterLoading
                ? "Loading products..."
                : `${displayedProducts.length} product${
                    displayedProducts.length ===
                    1
                      ? ""
                      : "s"
                  }`}
            </div>

          </div>

          {/* SEARCH */}

          <form
            onSubmit={handleSearch}
            className="mt-6 flex gap-2"
          >

            <div className="relative flex-1">

              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="search"
                defaultValue={
                  searchQuery
                }
                placeholder="Search products..."
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            <button
              type="submit"
              className="bg-green-700 text-white px-5 sm:px-7 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Search
            </button>

          </form>

        </div>

        {/* MOBILE FILTER BUTTON */}

        <div className="lg:hidden mb-4">

          <button
            type="button"
            onClick={() =>
              setMobileFiltersOpen(true)
            }
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-3 font-semibold text-gray-800"
          >
            <Filter size={18} />
            Categories & Filters
          </button>

        </div>

        {/* MAIN SHOP AREA */}

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

          {/* DESKTOP SIDEBAR */}

          <aside className="hidden lg:block">

            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">

              <div className="px-5 py-4 border-b">
                <h2 className="font-bold text-lg">
                  Categories
                </h2>
              </div>

              <div className="p-3 max-h-[calc(100vh-150px)] overflow-y-auto">

                <button
                  type="button"
                  onClick={clearFilters}
                  className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 transition ${
                    !hasActiveFilter
                      ? "bg-green-50 text-green-700 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                >
                  All Products
                </button>

                {categories.map(
                  (category) => {
                    const activeCategory =
                      category.slug ===
                      categorySlug;

                    return (
                      <div
                        key={category.id}
                        className="mb-1"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            handleCategoryChange(
                              category
                            )
                          }
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                            activeCategory
                              ? "bg-green-50 text-green-700 font-semibold"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >

                          <span>
                            {category.name}
                          </span>

                          <ChevronDown
                            size={16}
                            className={`transition ${
                              activeCategory
                                ? "rotate-180"
                                : ""
                            }`}
                          />

                        </button>

                        {activeCategory &&
                          category.subcategories
                            ?.length > 0 && (
                            <div className="ml-3 mt-1 border-l border-gray-200 pl-3">

                              {category.subcategories.map(
                                (
                                  subcategory
                                ) => {

                                  const activeSubcategory =
                                    subcategory.slug ===
                                    subcategorySlug;

                                  return (
                                    <button
                                      key={
                                        subcategory.slug
                                      }
                                      type="button"
                                      onClick={() =>
                                        handleSubcategoryChange(
                                          category,
                                          subcategory
                                        )
                                      }
                                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${
                                        activeSubcategory
                                          ? "text-green-700 bg-green-50 font-semibold"
                                          : "text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      {
                                        subcategory.name
                                      }
                                    </button>
                                  );
                                }
                              )}

                            </div>
                          )}

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </aside>

          {/* PRODUCTS */}

          <section>

            {/* ACTIVE FILTERS */}

            {hasActiveFilter && (
              <div className="flex flex-wrap items-center gap-2 mb-5">

                {currentCategory && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCategoryChange(
                        currentCategory
                      )
                    }
                    className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full text-sm font-medium"
                  >
                    {currentCategory.name}
                    <X size={14} />
                  </button>
                )}

                {currentSubcategory && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCategoryChange(
                        currentCategory
                      )
                    }
                    className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full text-sm font-medium"
                  >
                    {currentSubcategory.name}
                    <X size={14} />
                  </button>
                )}

                {searchQuery && (
                  <button
                    type="button"
                    onClick={
                      removeSearchFilter
                    }
                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm font-medium"
                  >
                    Search: {searchQuery}
                    <X size={14} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear all
                </button>

              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-5">
                {error}
              </div>
            )}

            {/* LOADING */}

            {(loading ||
              filterLoading) &&
            displayedProducts.length ===
              0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">

                <Loader2
                  size={34}
                  className="animate-spin mx-auto text-green-700"
                />

                <p className="mt-4 text-gray-500">
                  Loading products...
                </p>

              </div>
            ) : displayedProducts.length ===
              0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">

                <div className="text-5xl mb-4">
                  🛍️
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  No products found
                </h2>

                <p className="text-gray-500 mt-2">
                  There are currently no
                  products matching this
                  selection.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition"
                >
                  View All Products
                </button>

              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">

                {displayedProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}

              </div>
            )}

          </section>

        </div>

      </main>

      {/* MOBILE FILTER DRAWER */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
          />

          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-white shadow-xl overflow-y-auto">

            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white z-10">

              <h2 className="font-bold text-lg">
                Categories
              </h2>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="p-4">

              <button
                type="button"
                onClick={clearFilters}
                className={`w-full text-left px-3 py-3 rounded-lg mb-2 ${
                  !hasActiveFilter
                    ? "bg-green-50 text-green-700 font-semibold"
                    : "hover:bg-gray-50"
                }`}
              >
                All Products
              </button>

              {categories.map(
                (category) => {

                  const activeCategory =
                    category.slug ===
                    categorySlug;

                  return (
                    <div
                      key={category.id}
                      className="mb-1"
                    >

                      <button
                        type="button"
                        onClick={() =>
                          handleCategoryChange(
                            category
                          )
                        }
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg ${
                          activeCategory
                            ? "bg-green-50 text-green-700 font-semibold"
                            : "hover:bg-gray-50"
                        }`}
                      >

                        <span>
                          {category.name}
                        </span>

                        <ChevronDown
                          size={17}
                          className={
                            activeCategory
                              ? "rotate-180"
                              : ""
                          }
                        />

                      </button>

                      {activeCategory &&
                        category.subcategories
                          ?.length > 0 && (
                          <div className="ml-3 border-l border-gray-200 pl-3">

                            {category.subcategories.map(
                              (
                                subcategory
                              ) => (
                                <button
                                  key={
                                    subcategory.slug
                                  }
                                  type="button"
                                  onClick={() =>
                                    handleSubcategoryChange(
                                      category,
                                      subcategory
                                    )
                                  }
                                  className={`w-full text-left px-3 py-2.5 text-sm rounded-md ${
                                    subcategory.slug ===
                                    subcategorySlug
                                      ? "bg-green-50 text-green-700 font-semibold"
                                      : "text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  {
                                    subcategory.name
                                  }
                                </button>
                              )
                            )}

                          </div>
                        )}

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Shop;