import {
  Heart,
  ShoppingCart,
  Trash2,
} from "lucide-react";


import { useWishlist } from "../../context/WishlistContext";

import { useCart } from "../../context/CartContext";



function Wishlist() {


  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist();



  const {
    addToCart,
  } = useCart();

    return (

    <section className="min-h-screen bg-gray-100 py-10">


      <div className="max-w-6xl mx-auto px-4">


        <div className="flex items-center gap-3 mb-8">


          <Heart
            size={35}
            className="text-red-600"
          />


          <h1 className="text-4xl font-bold">

            My Wishlist

          </h1>


        </div>



        {wishlistItems.length === 0 ? (


          <div className="bg-white rounded-xl shadow p-10 text-center">


            <Heart

              size={60}

              className="mx-auto text-gray-300 mb-5"

            />


            <h2 className="text-2xl font-bold">

              Your wishlist is empty

            </h2>


            <p className="text-gray-500 mt-2">

              Save products you love and view them here later.

            </p>


          </div>



        ) : (


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">


            {wishlistItems.map((product) => (


              <div

                key={product.id}

                className="bg-white rounded-xl shadow overflow-hidden"

              >


                <img

                  src={product.image}

                  alt={product.name}

                  className="w-full h-64 object-cover"

                />



                <div className="p-5">


                  <h2 className="text-xl font-bold">

                    {product.name}

                  </h2>



                  <p className="text-green-700 font-bold text-lg mt-3">

                    ₦{product.price.toLocaleString()}

                  </p>



                  <div className="flex gap-3 mt-5">


                    <button

                      onClick={() => addToCart(product)}

                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"

                    >

                      <ShoppingCart size={18} />

                      Cart

                    </button>



                    <button

                      onClick={() => removeFromWishlist(product.id)}

                      className="px-4 border border-red-500 text-red-600 rounded-lg hover:bg-red-50"

                    >

                      <Trash2 size={20} />

                    </button>


                  </div>


                </div>


              </div>


            ))}


          </div>


        )}


      </div>


    </section>


  );


}


export default Wishlist;