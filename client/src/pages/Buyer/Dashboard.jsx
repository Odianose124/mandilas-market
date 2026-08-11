import { Link } from "react-router-dom";

import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  Package,
} from "lucide-react";

function Dashboard() {
  return (

    <section className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-4xl font-bold mb-8">

          My Dashboard

        </h1>

        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sidebar */}

          <div className="bg-white rounded-xl shadow p-6 h-fit">

            <h2 className="font-bold text-xl mb-6">

              My Account

            </h2>

            <div className="space-y-2">

            </div>

                        <Link
              to="/profile"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >

              <User size={20} className="text-green-600" />

              <span>
                My Profile
              </span>

            </Link>


            <Link
              to="/orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >

              <ShoppingBag size={20} className="text-green-600" />

              <span>
                My Orders
              </span>

            </Link>


            <Link
              to="/wishlist"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >

              <Heart size={20} className="text-green-600" />

              <span>
                Wishlist
              </span>

            </Link>


            <Link
              to="/addresses"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >

              <MapPin size={20} className="text-green-600" />

              <span>
                Saved Addresses
              </span>

            </Link>


            <Link
              to="/settings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >

              <Settings size={20} className="text-green-600" />

              <span>
                Account Settings
              </span>

            </Link>


          </div>

        </div>


        {/* Dashboard Content */}

        <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">


          <div className="bg-white rounded-xl shadow p-6">

            <Package
              size={35}
              className="text-green-600 mb-4"
            />

            <h3 className="text-xl font-bold">

              Orders

            </h3>

            <p className="text-gray-500 mt-2">

              Track your purchases and delivery status.

            </p>

          </div>


          <div className="bg-white rounded-xl shadow p-6">

            <Heart
              size={35}
              className="text-green-600 mb-4"
            />

            <h3 className="text-xl font-bold">

              Wishlist

            </h3>

            <p className="text-gray-500 mt-2">

              View products you saved for later.

            </p>

          </div>


          <div className="bg-white rounded-xl shadow p-6">

            <User
              size={35}
              className="text-green-600 mb-4"
            />

            <h3 className="text-xl font-bold">

              Profile

            </h3>

            <p className="text-gray-500 mt-2">

              Manage your personal information.

            </p>

          </div>


          <div className="bg-white rounded-xl shadow p-6">

            <MapPin
              size={35}
              className="text-green-600 mb-4"
            />

            <h3 className="text-xl font-bold">

              Addresses

            </h3>

            <p className="text-gray-500 mt-2">

              Manage your delivery locations.

            </p>

          </div>


        </div>


      </div>

    </section>

  );
}

export default Dashboard;