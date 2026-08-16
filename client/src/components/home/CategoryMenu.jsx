import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import categories from "../../data/categories";

function CategoryMenu() {
  const navigate = useNavigate();

  const [
    openCategory,
    setOpenCategory,
  ] = useState(null);

  /*
   * =========================================================
   * CATEGORY CLICK
   * =========================================================
   */

  const handleCategoryClick = (
    category
  ) => {
    setOpenCategory(
      (current) =>
        current === category.id
          ? null
          : category.id
    );

    navigate(
      `/shop?category=${encodeURIComponent(
        category.slug
      )}`
    );
  };

  /*
   * =========================================================
   * SUBCATEGORY CLICK
   * =========================================================
   */

  const handleSubcategoryClick = (
    category,
    subcategory
  ) => {
    navigate(
      `/shop?category=${encodeURIComponent(
        category.slug
      )}&subcategory=${encodeURIComponent(
        subcategory.slug
      )}`
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">

      {categories.map(
        (category) => {

          const isOpen =
            openCategory ===
            category.id;

          return (
            <div
              key={category.id}
              className="border-b last:border-b-0"
            >

              {/* CATEGORY */}

              <button
                type="button"
                onClick={() =>
                  handleCategoryClick(
                    category
                  )
                }
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-green-50 active:bg-green-100 transition cursor-pointer"
              >

                <span className="text-sm font-medium text-gray-800">
                  {category.name}
                </span>

                {isOpen ? (
                  <ChevronDown
                    size={17}
                    className="text-green-700"
                  />
                ) : (
                  <ChevronRight
                    size={17}
                    className="text-gray-500"
                  />
                )}

              </button>

              {/* SUBCATEGORIES */}

              {isOpen &&
                category.subcategories
                  ?.length > 0 && (
                  <div className="bg-gray-50 px-4 pb-3">

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
                            handleSubcategoryClick(
                              category,
                              subcategory
                            )
                          }
                          className="w-full flex items-center gap-2 text-left text-sm text-gray-600 hover:text-green-700 hover:bg-white px-3 py-2 rounded-md transition"
                        >

                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />

                          {subcategory.name}

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
  );
}

export default CategoryMenu;