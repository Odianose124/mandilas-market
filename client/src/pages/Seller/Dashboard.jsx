import { Link } from "react-router-dom";

import {
  Package,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Users,
} from "lucide-react";

function Dashboard() {

  const stats = [

    {
  title: "Products",
  value: 24,
  icon: Package,
  color: "bg-blue-500",
  link: "/seller/products",
},

    {
      title: "Orders",
      value: 18,
      icon: ShoppingCart,
      color: "bg-green-500",
    },

    {
      title: "Revenue",
      value: "₦850,000",
      icon: Wallet,
      color: "bg-yellow-500",
    },

    {
      title: "Customers",
      value: 41,
      icon: Users,
      color: "bg-purple-500",
    },

  ];

  return (

    <section className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-10">

        Seller Dashboard

      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item) => {

          const Icon = item.icon;

          return (

            <Link
  to={item.link || "#"}
  key={item.title}
  className="bg-white rounded-2xl shadow p-6 block hover:shadow-xl transition"
>

              <div
                className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center text-white`}
              >
                <Icon size={28} />
              </div>

              <h2 className="text-gray-500 mt-5">
                {item.title}
              </h2>

              <h3 className="text-3xl font-bold mt-2">
                {item.value}
              </h3>

            </Link>

          );

        })}

      </div>

            {/* Quick Actions */}

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <Link
  to="/seller/add-product"
  className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 text-left transition block"
>

  <h3 className="text-xl font-bold">
    ➕ Add Product
  </h3>

  <p className="mt-2 text-green-100">
    Upload a new product to your store.
  </p>

</Link>

        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 text-left transition">

          <h3 className="text-xl font-bold">

            📦 View Orders

          </h3>

          <p className="mt-2 text-blue-100">

            Manage customer orders.

          </p>

        </button>

        <button className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl p-6 text-left transition">

          <h3 className="text-xl font-bold">

            💰 Wallet

          </h3>

          <p className="mt-2 text-yellow-100">

            View your earnings and withdrawals.

          </p>

        </button>

      </div>

      {/* Recent Orders */}

      <div className="bg-white rounded-2xl shadow mt-10 p-6">

        <h2 className="text-2xl font-bold mb-6">

          Recent Orders

        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">Order ID</th>

                <th className="text-left py-3">Customer</th>

                <th className="text-left py-3">Product</th>

                <th className="text-left py-3">Amount</th>

                <th className="text-left py-3">Status</th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-b">

                <td className="py-4">MD-10001</td>

                <td>John Doe</td>

                <td>Luxury Senator Wear</td>

                <td>₦50,000</td>

                <td>

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">

                    Processing

                  </span>

                </td>

              </tr>

              <tr>

                <td className="py-4">MD-10002</td>

                <td>Mary Johnson</td>

                <td>Classic Men's Shoe</td>

                <td>₦18,000</td>

                <td>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                    Delivered

                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* Sales Overview */}

      <div className="bg-white rounded-2xl shadow mt-10 p-6">

        <div className="flex items-center gap-3 mb-6">

          <TrendingUp
            size={28}
            className="text-green-600"
          />

          <h2 className="text-2xl font-bold">

            Sales Overview

          </h2>

        </div>

        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl">

          <p className="text-gray-500">

            Sales chart will be connected here later.

          </p>

        </div>

      </div>

    </section>

  );

}

export default Dashboard;