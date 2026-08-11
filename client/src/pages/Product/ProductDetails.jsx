import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../../data/products";
import reviews from "../../data/reviews";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Store,
  Eye,
} from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

const {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} = useWishlist();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const wishlistActive = isInWishlist(product?.id);

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

  const productImages = product.images;
  const productReviews = reviews.filter(
  (review) => review.productId === product.id
);

const similarProducts = products
  .filter(
    (item) =>
      item.category === product.category &&
      item.id !== product.id
  )
  .slice(0, 4);

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
  ({product.reviews} Reviews)
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

              {product.specifications.sizes.map((size) => (

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

            <button
  onClick={() => addToCart(product, quantity)}
  className="flex-1 h-14 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-3 transition"
>

              <ShoppingCart size={20} />

              Add {quantity} To Cart

            </button>

            <button

  onClick={() => {

    if (wishlistActive) {

      removeFromWishlist(product.id);

    } else {

      addToWishlist(product);

    }

  }}

  className={`w-14 h-14 rounded-xl border transition flex items-center justify-center ${
    
    wishlistActive

      ? "bg-red-50 border-red-500"

      : "hover:bg-gray-100"

  }`}

>


  <Heart

    size={22}

    className={

      wishlistActive

        ? "text-red-600 fill-red-600"

        : "text-gray-700"

    }

  />


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
  {product.seller}
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
  {product.rating} Seller Rating
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

          {/* Product Description */}

          <div className="mt-10 bg-white rounded-xl shadow border p-6">

            <h2 className="text-2xl font-bold mb-5">
              Product Description
            </h2>

            <p className="text-gray-600 leading-8">
  {product.description}
</p>

            <p className="text-gray-600 leading-8 mt-4">

              Carefully crafted to ensure long-lasting performance, this
              product offers excellent value for money and is supplied by
              verified sellers on Mandilas Market.

            </p>

          </div>

          {/* Product Specifications */}

<div className="mt-10 bg-white rounded-xl shadow border p-6">

  <h2 className="text-2xl font-bold mb-6">
    Product Specifications
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

    <div className="flex justify-between border-b pb-3">
      <span className="text-gray-500">Brand</span>
      <span className="font-semibold">{product.brand}</span>
    </div>

    <div className="flex justify-between border-b pb-3">
      <span className="text-gray-500">Category</span>
      <span className="font-semibold">{product.category}</span>
    </div>

    <div className="flex justify-between border-b pb-3">
      <span className="text-gray-500">Material</span>
      <span className="font-semibold">
        {product.specifications.material}
      </span>
    </div>

    <div className="flex justify-between border-b pb-3">
      <span className="text-gray-500">Colour</span>
      <span className="font-semibold">
        {product.specifications.colour}
      </span>
    </div>

    <div className="flex justify-between border-b pb-3">
      <span className="text-gray-500">Condition</span>
      <span className="font-semibold">
        {product.specifications.condition}
      </span>
    </div>

    <div className="flex justify-between border-b pb-3">
      <span className="text-gray-500">SKU</span>
      <span className="font-semibold">
        {product.sku}
      </span>
    </div>

    <div className="flex justify-between border-b pb-3">
      <span className="text-gray-500">Warranty</span>
      <span className="font-semibold">
        {product.warranty}
      </span>
    </div>

    <div className="flex justify-between border-b pb-3">
      <span className="text-gray-500">Delivery</span>
      <span className="font-semibold">
        {product.delivery}
      </span>
    </div>

    <div className="flex justify-between border-b pb-3 md:col-span-2">
      <span className="text-gray-500">
        Return Policy
      </span>

      <span className="font-semibold">
        {product.returnPolicy}
      </span>

    </div>

  </div>

</div>

        </div>

      </div>

      {/* Customer Reviews */}

<div className="mt-14">

  <h2 className="text-3xl font-bold mb-8">
    Customer Reviews
  </h2>

  {productReviews.length === 0 ? (

    <div className="bg-white rounded-xl shadow border p-8 text-center text-gray-500">
      No reviews yet.
    </div>

  ) : (

    <div className="space-y-6">

      {productReviews.map((review) => (

        <div
          key={review.id}
          className="bg-white rounded-xl shadow border p-6"
        >

          <div className="flex items-center justify-between">

            <div>

              <h3 className="font-bold text-lg">
                {review.user}
              </h3>

              <p className="text-sm text-gray-500">
                {review.date}
              </p>

            </div>

            <div className="flex">

              {[1,2,3,4,5].map((star)=>(

                <Star
                  key={star}
                  size={18}
                  fill={
                    star <= review.rating
                      ? "#fbbf24"
                      : "transparent"
                  }
                  color="#fbbf24"
                />

              ))}

            </div>

          </div>

          <p className="text-gray-600 leading-7 mt-5">

            {review.comment}

          </p>

        </div>

      ))}

    </div>

  )}

</div>

{/* Similar Products */}

<div className="mt-16">

  <h2 className="text-3xl font-bold mb-8">
    Similar Products
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

    {similarProducts.map((item) => (

      <Link
        key={item.id}
        to={`/product/${item.id}`}
        className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group"
      >

        <div className="relative overflow-hidden">

          <img
            src={item.image}
            alt={item.name}
            className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300"
          />

          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
            -{item.discount}%
          </span>

        </div>

        <div className="p-4">

          <h3 className="font-semibold line-clamp-2 min-h-[48px]">
            {item.name}
          </h3>

          <p className="text-green-700 font-bold text-xl mt-3">
            ₦{item.price.toLocaleString()}
          </p>

          <p className="text-gray-400 line-through text-sm">
            ₦{item.oldPrice.toLocaleString()}
          </p>

          <div className="flex items-center justify-between mt-4">

            <div className="flex items-center gap-1">

              <Star
                fill="#fbbf24"
                color="#fbbf24"
                size={16}
              />

              <span className="text-sm">
                {item.rating}
              </span>

            </div>

            <Eye
              className="text-gray-500"
              size={18}
            />

          </div>

        </div>

      </Link>

    ))}

  </div>

</div>

    </section>

  );
}

export default ProductDetails;