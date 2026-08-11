import {
  Shirt,
  ShoppingBag,
  Footprints,
  Watch,
  Gem,
  Baby,
  Sparkles,
  Scissors,
  Glasses,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Men's Wear",
    slug: "mens-wear",
    icon: <Shirt size={20} />,
  },
  {
    name: "Women's Wear",
    slug: "womens-wear",
    icon: <ShoppingBag size={20} />,
  },
  {
    name: "Shoes",
    slug: "shoes",
    icon: <Footprints size={20} />,
  },
  {
    name: "Watches",
    slug: "watches",
    icon: <Watch size={20} />,
  },
  {
    name: "Jewelry",
    slug: "jewelry",
    icon: <Gem size={20} />,
  },
  {
    name: "Kids Fashion",
    slug: "kids-fashion",
    icon: <Baby size={20} />,
  },
  {
    name: "Beauty Products",
    slug: "beauty-products",
    icon: <Sparkles size={20} />,
  },
  {
    name: "Fabrics",
    slug: "fabrics",
    icon: <Scissors size={20} />,
  },
  {
    name: "Sunglasses",
    slug: "sunglasses",
    icon: <Glasses size={20} />,
  },
];

function CategoryMenu() {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/shop?category=${slug}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">

      {categories.map((category) => (
        <button
          key={category.slug}
          type="button"
          onClick={() =>
            handleCategoryClick(category.slug)
          }
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-green-50 active:bg-green-100 transition cursor-pointer"
        >

          <div className="flex items-center gap-3">

            {category.icon}

            <span className="text-sm">
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