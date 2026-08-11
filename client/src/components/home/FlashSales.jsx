import { useEffect, useState } from "react";
import { Clock3, ArrowRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { getAllProducts } from "../../services/productService";

function FlashSales() {
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
                console.error("Failed to load flash sale products:", err);
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    return (
        <section className="max-w-[1400px] mx-auto px-4 mt-8">

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                {/* Header */}

                <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <Clock3 size={24} />

                        <h2 className="text-xl font-bold">
                            Flash Sales
                        </h2>

                    </div>

                    <div className="hidden md:flex items-center gap-3">

                        <span className="text-sm">
                            Ends In
                        </span>

                        <div className="bg-white text-red-600 px-3 py-1 rounded font-bold">
                            02
                        </div>

                        <span>:</span>

                        <div className="bg-white text-red-600 px-3 py-1 rounded font-bold">
                            45
                        </div>

                        <span>:</span>

                        <div className="bg-white text-red-600 px-3 py-1 rounded font-bold">
                            18
                        </div>

                    </div>

                    <button className="flex items-center gap-2 font-semibold hover:gap-3 transition">

                        See All

                        <ArrowRight size={18} />

                    </button>

                </div>

                {/* Products */}

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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 p-5">

                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}

                    </div>
                )}

            </div>

        </section>
    );
}

export default FlashSales;