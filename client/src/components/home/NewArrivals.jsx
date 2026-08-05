import { ArrowRight } from "lucide-react";
import products from "../../data/products";
import ProductCard from "../product/ProductCard";

function NewArrivals() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 mt-10">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-3xl font-bold">
          New Arrivals
        </h2>

        <button className="flex items-center gap-2 text-green-700 font-semibold hover:gap-3 transition">

          View All

          <ArrowRight size={18} />

        </button>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
}

export default NewArrivals;