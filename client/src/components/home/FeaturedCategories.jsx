import { useNavigate } from "react-router-dom";
import categories from "../../data/categories";

function FeaturedCategories() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${category.slug}`);
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 mt-10">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          Shop By Category
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategoryClick(category)}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden group text-left"
          >

            <div className="overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full aspect-square object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            <div className="p-3 text-center">
              <h3 className="text-sm font-semibold">
                {category.name}
              </h3>
            </div>

          </button>
        ))}

      </div>

    </section>
  );
}

export default FeaturedCategories;