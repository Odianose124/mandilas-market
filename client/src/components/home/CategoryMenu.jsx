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

const categories = [
  { name: "Men's Wear", icon: <Shirt size={20} /> },
  { name: "Women's Wear", icon: <ShoppingBag size={20} /> },
  { name: "Shoes", icon: <Footprints size={20} /> },
  { name: "Watches", icon: <Watch size={20} /> },
  { name: "Jewelry", icon: <Gem size={20} /> },
  { name: "Kids Fashion", icon: <Baby size={20} /> },
  { name: "Beauty Products", icon: <Sparkles size={20} /> },
  { name: "Fabrics", icon: <Scissors size={20} /> },
  { name: "Sunglasses", icon: <Glasses size={20} /> },
];

function CategoryMenu() {
  return (
    <div className="bg-white rounded-lg shadow-sm">

      {categories.map((category, index) => (
        <button
          key={index}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-green-50 transition"
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