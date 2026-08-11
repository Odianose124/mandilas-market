import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { getAllProducts } from "../../services/productService";

function NewArrivals() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProducts() {
            try {
                setLoading(true);
                setError("");

                const data = await getAllProducts();

                setProducts(data);
            } catch (err) {
                console.error("Failed to load products:", err);
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

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

            {loading && (
                <div className="text-center py-10 text-gray-500">
                    Loading products...
                </div>
            )}

            {!loading && error && (
                <div className="text-center py-10 text-red-500">
                    {error}
                </div>
            )}

            {!loading && !error && products.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No products available yet.
                </div>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}

                </div>
            )}

        </section>
    );
}

export default NewArrivals;