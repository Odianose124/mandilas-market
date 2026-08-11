import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import categories from "../../data/categories";

function CategoryMenu() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${category.slug}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => handleCategoryClick(category)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-green-50 active:bg-green-100 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              {category.name}
            </span>
          </div>

          <ChevronRight size={16} />
        </button>
      ))}

    </div>
  );
}

export default CategoryMenu;