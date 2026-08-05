import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../../data/products";

import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Store,
} from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">
          Product not found
        </h2>
      </div>
    );
  }

  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">

      {/* Breadcrumb */}

      <div className="mb-8">

        <button
          onClick={() => navigate(-1)}
          className="text-green-700 font-semibold hover:underline"
        >
          ← Back to products
        </button>

        <p className="text-sm text-gray-500 mt-3">
          Home / Fashion / {product.name}
        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* LEFT */}

        <div>

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[550px] object-contain bg-gray-50 transition-all duration-300"
            />

          </div>

          <div className="grid grid-cols-4 gap-3 mt-4">

            {productImages.map((image, index) => (

              <div
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`cursor-pointer rounded-lg overflow-hidden transition border-2 ${
                  selectedImage === image
                    ? "border-green-600"
                    : "border-gray-200 hover:border-green-400"
                }`}
              >

                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="aspect-square object-cover"
                />

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT */}

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-4">

            <Star fill="#fbbf24" color="#fbbf24" size={20} />
            <Star fill="#fbbf24" color="#fbbf24" size={20} />
            <Star fill="#fbbf24" color="#fbbf24" size={20} />
            <Star fill="#fbbf24" color="#fbbf24" size={20} />
            <Star color="#d1d5db" size={20} />

            <span className="text-gray-600">
              (245 Reviews)
            </span>

          </div>

          <div className="mt-6">

            <h2 className="text-4xl font-bold text-green-700">
              ₦{product.price.toLocaleString()}
            </h2>

            <p className="text-gray-400 line-through mt-2">
              ₦{product.oldPrice.toLocaleString()}
            </p>

          </div>

          {/* Sizes */}

          <div className="mt-8">

            <h3 className="font-semibold mb-3">
              Available Sizes
            </h3>

            <div className="flex flex-wrap gap-3">

              {["S", "M", "L", "XL"].map((size) => (

                <button
                  key={size}
                  className="w-12 h-12 border rounded-lg hover:bg-green-600 hover:text-white transition"
                >
                  {size}
                </button>

              ))}

            </div>

          </div>

          {/* Colours */}

          <div className="mt-8">

            <h3 className="font-semibold mb-3">
              Colours
            </h3>

            <div className="flex gap-4">

              <div className="w-8 h-8 rounded-full bg-black border-2 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-red-600 border-2 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-blue-600 border-2 cursor-pointer"></div>

            </div>

          </div>

          {/* Quantity */}

          <div className="mt-8">

            <h3 className="font-semibold mb-3">
              Quantity
            </h3>

            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit bg-white">

              <button
                onClick={() =>
                  quantity > 1 && setQuantity(quantity - 1)
                }
                className="px-5 py-3 text-xl hover:bg-gray-100 transition"
              >
                -
              </button>

              <span className="px-6 font-semibold">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(quantity + 1)
                }
                className="px-5 py-3 text-xl hover:bg-gray-100 transition"
              >
                +
              </button>

            </div>

          </div>

          {/* Buttons */}

          <div className="flex gap-4 mt-10">

            <button className="flex-1 h-14 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-3 transition">

              <ShoppingCart size={20} />

              Add {quantity} To Cart

            </button>

            <button className="w-14 h-14 rounded-xl border hover:bg-gray-100 transition flex items-center justify-center">

              <Heart size={22} />

            </button>

          </div>

          {/* Delivery */}

          <div className="mt-10 space-y-6">

            <div className="flex gap-4">

              <Truck className="text-green-700" />

              <div>

                <h4 className="font-semibold">
                  Nationwide Delivery
                </h4>

                <p className="text-gray-500">
                  Fast delivery anywhere in Nigeria.
                </p>

              </div>

            </div>

            {/* Seller Card */}

<div className="mt-10 bg-white rounded-xl shadow border p-6">

  <div className="flex items-center gap-4">

    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">

      <Store
        className="text-green-700"
        size={28}
      />

    </div>

    <div>

      <h3 className="text-lg font-bold">
        Mandilas Fashion Hub
      </h3>

      <p className="text-gray-500">
        Verified Seller
      </p>

    </div>

  </div>

  <div className="flex items-center gap-2 mt-5">

    <Star
      fill="#fbbf24"
      color="#fbbf24"
      size={18}
    />

    <span className="font-semibold">
      4.8 Seller Rating
    </span>

  </div>

  <div className="grid grid-cols-2 gap-3 mt-6">

    <button className="h-12 rounded-lg border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition">

      Chat Seller

    </button>

    <button className="h-12 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">

      Visit Store

    </button>

  </div>

</div>

            <div className="flex gap-4">

              <ShieldCheck className="text-green-700" />

              <div>

                <h4 className="font-semibold">
                  Verified Seller
                </h4>

                <p className="text-gray-500">
                  Product sold by an approved Mandilas seller.
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <RotateCcw className="text-green-700" />

              <div>

                <h4 className="font-semibold">
                  Return Policy
                </h4>

                <p className="text-gray-500">
                  Returns accepted according to seller policy.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ProductDetails;