import { useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";

function Shop() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  const categoryName = category
    ? category
        .split("-")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ")
    : "All Products";

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <main className="max-w-[1400px] mx-auto px-4 py-8">

        <div className="bg-white rounded-xl p-6 shadow-sm">

          <h1 className="text-3xl font-bold">
            {categoryName}
          </h1>

          <p className="text-gray-500 mt-2">
            Browse products available on Mandilas Market.
          </p>

          <div className="mt-8 text-center py-16">

            <h2 className="text-xl font-semibold">
              Products coming here
            </h2>

            <p className="text-gray-500 mt-2">
              Your products will be displayed here.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Shop;