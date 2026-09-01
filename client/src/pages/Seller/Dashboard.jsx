import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Package,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Users,
  RefreshCw,
  AlertCircle,
  Plus,
  MessageCircle,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useProducts,
} from "../../context/ProductContext";

import {
  getOrdersBySellerEmail,
} from "../../services/orderService";

import {
  getConversations,
  getUnreadCount,
} from "../../services/chatService";


function Dashboard() {

  const {
    user,
  } = useAuth();


  const {
    getSellerProducts,
  } = useProducts();


  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    orders,
    setOrders,
  ] = useState([]);


  /*
   * =========================================================
   * CHAT STATE
   * =========================================================
   */

  const [
    conversations,
    setConversations,
  ] = useState([]);


  const [
    unreadMessages,
    setUnreadMessages,
  ] = useState(0);


  /*
   * =========================================================
   * GENERAL STATE
   * =========================================================
   */

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /*
   * =========================================================
   * CURRENT SELLER ID
   * =========================================================
   */

  const currentUserId =
    user?.id
      ? Number(user.id)
      : null;


  /*
   * =========================================================
   * LOAD LIVE SELLER DATA
   * =========================================================
   */

  const loadDashboardData =
    async () => {

      if (!user?.email) {

        setProducts([]);
        setOrders([]);
        setConversations([]);
        setUnreadMessages(0);
        setLoading(false);

        return;
      }


      try {

        setLoading(true);
        setError("");


        const sellerEmail =
          user.email
            .trim()
            .toLowerCase();


        /*
         * =====================================================
         * LOAD PRODUCTS + ORDERS
         * =====================================================
         */

        const [
          sellerProducts,
          sellerOrders,
        ] = await Promise.all([

          getSellerProducts(
            sellerEmail
          ),

          getOrdersBySellerEmail(
            sellerEmail
          ),

        ]);


        setProducts(
          Array.isArray(
            sellerProducts
          )
            ? sellerProducts
            : []
        );


        setOrders(
          Array.isArray(
            sellerOrders
          )
            ? sellerOrders
            : []
        );


        /*
         * =====================================================
         * LOAD SELLER CONVERSATIONS
         * =====================================================
         *
         * IMPORTANT:
         *
         * The existing Seller Messages page uses the logged
         * in user's ID to load conversations.
         *
         * We use the SAME method here.
         *
         * This means we are NOT creating another messaging
         * system.
         */

        if (
          currentUserId &&
          !Number.isNaN(
            currentUserId
          )
        ) {

          try {

            const sellerConversations =
              await getConversations(
                currentUserId
              );


            const conversationList =
              Array.isArray(
                sellerConversations
              )
                ? sellerConversations
                : [];


            setConversations(
              conversationList
            );


            /*
             * =================================================
             * LOAD TOTAL UNREAD MESSAGES
             * =================================================
             */

            let totalUnread = 0;


            await Promise.all(
              conversationList.map(
                async (
                  conversation
                ) => {

                  if (
                    !conversation?.id
                  ) {
                    return;
                  }


                  try {

                    const unreadResult =
                      await getUnreadCount({

                        conversationId:
                          Number(
                            conversation.id
                          ),

                        userId:
                          currentUserId,

                      });


                    let count = 0;


                    if (
                      typeof unreadResult ===
                      "number"
                    ) {

                      count =
                        unreadResult;

                    } else {

                      count =
                        Number(
                          unreadResult?.count ??
                          unreadResult?.unreadCount ??
                          0
                        );

                    }


                    if (
                      !Number.isNaN(
                        count
                      )
                    ) {

                      totalUnread +=
                        count;

                    }

                  } catch (
                    unreadError
                  ) {

                    console.error(
                      "Failed to load unread message count:",
                      unreadError
                    );

                  }

                }
              )
            );


            setUnreadMessages(
              totalUnread
            );

          } catch (
            chatError
          ) {

            /*
             * Do not break the seller dashboard if
             * chat is temporarily unavailable.
             */

            console.error(
              "Failed to load seller conversations:",
              chatError
            );


            setConversations([]);
            setUnreadMessages(0);

          }

        } else {

          setConversations([]);
          setUnreadMessages(0);

        }

      } catch (
        err
      ) {

        console.error(
          "Failed to load seller dashboard:",
          err
        );


        setError(
          err?.message ||
          "Failed to load your dashboard data."
        );


        setProducts([]);
        setOrders([]);

      } finally {

        setLoading(false);

      }

    };


  /*
   * =========================================================
   * LOAD DASHBOARD
   * =========================================================
   */

  useEffect(() => {

    loadDashboardData();

  }, [
    user?.email,
    user?.id,
  ]);


  /*
   * =========================================================
   * LIVE PRODUCT COUNT
   * =========================================================
   */

  const productCount =
    products.length;


  /*
   * =========================================================
   * LIVE ORDER COUNT
   * =========================================================
   */

  const orderCount =
    orders.length;


  /*
   * =========================================================
   * GET SELLER ORDER ITEMS
   * =========================================================
   */

  const sellerOrderItems =
    useMemo(() => {

      if (!user?.email) {
        return [];
      }


      const sellerEmail =
        user.email
          .trim()
          .toLowerCase();


      const items = [];


      orders.forEach(
        (
          order
        ) => {

          if (
            !Array.isArray(
              order?.items
            )
          ) {

            return;
          }


          order.items.forEach(
            (
              item
            ) => {

              if (!item) {
                return;
              }


              const itemSellerEmail =
                item.sellerEmail
                  ?.trim()
                  .toLowerCase();


              if (
                itemSellerEmail ===
                sellerEmail
              ) {

                items.push({
                  ...item,
                  order,
                });

              }

            }
          );

        }
      );


      return items;

    }, [
      orders,
      user?.email,
    ]);


  /*
   * =========================================================
   * LIVE REVENUE
   * =========================================================
   */

  const revenue =
    useMemo(() => {

      return sellerOrderItems
        .filter(
          (
            item
          ) => {

            const status =
              item.order?.orderStatus
                ?.toLowerCase();


            return status !==
              "cancelled";

          }
        )
        .reduce(
          (
            total,
            item
          ) => {

            const itemTotal =
              Number(
                item.total
              ) ||
              Number(
                item.price || 0
              ) *
              Number(
                item.quantity || 0
              );


            return (
              total +
              itemTotal
            );

          },
          0
        );

    }, [
      sellerOrderItems,
    ]);


  /*
   * =========================================================
   * LIVE UNIQUE CUSTOMERS
   * =========================================================
   */

  const customerCount =
    useMemo(() => {

      const customers =
        new Set();


      orders.forEach(
        (
          order
        ) => {

          if (
            order?.email
          ) {

            customers.add(
              order.email
                .trim()
                .toLowerCase()
            );

          }

        }
      );


      return customers.size;

    }, [
      orders,
    ]);


  /*
   * =========================================================
   * RECENT ORDERS
   * =========================================================
   */

  const recentOrders =
    useMemo(() => {

      return [
        ...orders,
      ]
        .sort(
          (
            a,
            b
          ) => {

            const dateA =
              new Date(
                a?.createdAt || 0
              ).getTime();


            const dateB =
              new Date(
                b?.createdAt || 0
              ).getTime();


            return dateB -
              dateA;

          }
        )
        .slice(
          0,
          5
        );

    }, [
      orders,
    ]);


  /*
   * =========================================================
   * SALES TOTALS
   * =========================================================
   */

  const salesOverview =
    useMemo(() => {

      const totals = {};


      sellerOrderItems.forEach(
        (
          item
        ) => {

          const order =
            item.order;


          const status =
            order?.orderStatus
              ?.toLowerCase();


          if (
            status ===
            "cancelled"
          ) {

            return;

          }


          const date =
            order?.createdAt
              ? new Date(
                  order.createdAt
                )
              : null;


          if (
            !date ||
            Number.isNaN(
              date.getTime()
            )
          ) {

            return;

          }


          const monthKey =
            date.toLocaleDateString(
              "en-US",
              {
                month:
                  "short",
                year:
                  "numeric",
              }
            );


          const itemTotal =
            Number(
              item.total
            ) ||
            Number(
              item.price || 0
            ) *
            Number(
              item.quantity || 0
            );


          totals[monthKey] =
            (
              totals[monthKey] ||
              0
            ) +
            itemTotal;

        }
      );


      return Object.entries(
        totals
      )
        .map(
          (
            [
              month,
              amount,
            ]
          ) => ({
            month,
            amount,
          })
        )
        .sort(
          (
            a,
            b
          ) =>
            new Date(
              a.month
            ) -
            new Date(
              b.month
            )
        )
        .slice(
          -6
        );

    }, [
      sellerOrderItems,
    ]);


  /*
   * =========================================================
   * CURRENCY FORMAT
   * =========================================================
   */

  const formatCurrency =
    (
      amount
    ) => {

      return `₦${Number(
        amount || 0
      ).toLocaleString(
        "en-NG"
      )}`;

    };


  /*
   * =========================================================
   * ORDER STATUS STYLE
   * =========================================================
   */

  const getStatusClass =
    (
      status
    ) => {

      const normalized =
        status?.toLowerCase();


      if (
        normalized ===
          "delivered" ||
        normalized ===
          "completed"
      ) {

        return "bg-green-100 text-green-700";

      }


      if (
        normalized ===
          "cancelled" ||
        normalized ===
          "failed"
      ) {

        return "bg-red-100 text-red-700";

      }


      if (
        normalized ===
          "shipped" ||
        normalized ===
          "processing"
      ) {

        return "bg-blue-100 text-blue-700";

      }


      return "bg-yellow-100 text-yellow-700";

    };


  /*
   * =========================================================
   * SELLER ORDER AMOUNT
   * =========================================================
   */

  const getSellerOrderAmount =
    (
      order
    ) => {

      if (
        !order ||
        !Array.isArray(
          order.items
        )
      ) {

        return 0;

      }


      const sellerEmail =
        user?.email
          ?.trim()
          .toLowerCase();


      return order.items
        .filter(
          (
            item
          ) =>
            item?.sellerEmail
              ?.trim()
              .toLowerCase() ===
            sellerEmail
        )
        .reduce(
          (
            total,
            item
          ) => {

            const itemTotal =
              Number(
                item.total
              ) ||
              Number(
                item.price || 0
              ) *
              Number(
                item.quantity || 0
              );


            return (
              total +
              itemTotal
            );

          },
          0
        );

    };


  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */

  if (loading) {

    return (

      <section className="min-h-screen bg-gray-100 p-4 md:p-8">

        <div className="flex items-center justify-center min-h-[500px]">

          <div className="text-center">

            <RefreshCw
              size={40}
              className="mx-auto text-green-600 animate-spin"
            />

            <p className="mt-4 text-gray-500">

              Loading your seller dashboard...

            </p>

          </div>

        </div>

      </section>

    );

  }


  /*
   * =========================================================
   * DASHBOARD
   * =========================================================
   */

  return (

    <section className="min-h-screen bg-gray-100 p-4 md:p-8">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

        <div>

          <h1 className="text-3xl md:text-4xl font-bold">

            Seller Dashboard

          </h1>


          <p className="text-gray-500 mt-2">

            Welcome back
            {user?.firstName
              ? `, ${user.firstName}`
              : ""}.

          </p>

        </div>


        <button
          type="button"
          onClick={
            loadDashboardData
          }
          disabled={
            loading
          }
          className="bg-white border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition disabled:opacity-50"
        >

          <RefreshCw
            size={18}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh Dashboard

        </button>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 flex gap-3">

          <AlertCircle
            size={22}
            className="flex-shrink-0"
          />

          <div>

            <p className="font-semibold">

              Unable to load dashboard data

            </p>


            <p className="text-sm mt-1">

              {error}

            </p>


            <button
              type="button"
              onClick={
                loadDashboardData
              }
              className="mt-3 underline text-sm font-semibold"
            >

              Try Again

            </button>

          </div>

        </div>

      )}


      {/* =====================================================
          LIVE STATS
      ===================================================== */}

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">


        {/* PRODUCTS */}

        <Link
          to="/seller/products"
          className="bg-white rounded-2xl shadow-sm p-6 block hover:shadow-xl transition"
        >

          <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center text-white">

            <Package
              size={28}
            />

          </div>


          <h2 className="text-gray-500 mt-5">

            Products

          </h2>


          <h3 className="text-3xl font-bold mt-2">

            {productCount}

          </h3>


          <p className="text-sm text-gray-400 mt-2">

            Products in your store

          </p>

        </Link>


        {/* ORDERS */}

        <Link
          to="/seller/orders"
          className="bg-white rounded-2xl shadow-sm p-6 block hover:shadow-xl transition"
        >

          <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center text-white">

            <ShoppingCart
              size={28}
            />

          </div>


          <h2 className="text-gray-500 mt-5">

            Orders

          </h2>


          <h3 className="text-3xl font-bold mt-2">

            {orderCount}

          </h3>


          <p className="text-sm text-gray-400 mt-2">

            Orders containing your products

          </p>

        </Link>


        {/* REVENUE */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="w-14 h-14 rounded-xl bg-yellow-500 flex items-center justify-center text-white">

            <Wallet
              size={28}
            />

          </div>


          <h2 className="text-gray-500 mt-5">

            Revenue

          </h2>


          <h3 className="text-3xl font-bold mt-2">

            {formatCurrency(
              revenue
            )}

          </h3>


          <p className="text-sm text-gray-400 mt-2">

            From your orders

          </p>

        </div>


        {/* CUSTOMERS */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center text-white">

            <Users
              size={28}
            />

          </div>


          <h2 className="text-gray-500 mt-5">

            Customers

          </h2>


          <h3 className="text-3xl font-bold mt-2">

            {customerCount}

          </h3>


          <p className="text-sm text-gray-400 mt-2">

            Unique customers

          </p>

        </div>


        {/* MESSAGES */}

        <Link
          to="/seller/messages"
          className="bg-white rounded-2xl shadow-sm p-6 block hover:shadow-xl transition relative"
        >

          {unreadMessages > 0 && (

            <span className="absolute top-4 right-4 min-w-[28px] h-7 px-2 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">

              {unreadMessages > 99
                ? "99+"
                : unreadMessages}

            </span>

          )}


          <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center text-white">

            <MessageCircle
              size={28}
            />

          </div>


          <h2 className="text-gray-500 mt-5">

            Messages

          </h2>


          <h3 className="text-3xl font-bold mt-2">

            {conversations.length}

          </h3>


          <p className="text-sm text-gray-400 mt-2">

            {unreadMessages > 0
              ? `${unreadMessages} unread message${
                  unreadMessages === 1
                    ? ""
                    : "s"
                }`
              : "Buyer conversations"}

          </p>

        </Link>

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <div className="grid md:grid-cols-4 gap-6 mt-10">


        {/* ADD PRODUCT */}

        <Link
          to="/seller/add-product"
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 text-left transition block"
        >

          <div className="flex items-center gap-3">

            <Plus
              size={24}
            />

            <h3 className="text-xl font-bold">

              Add Product

            </h3>

          </div>


          <p className="mt-2 text-green-100">

            Upload a new product to your store.

          </p>

        </Link>


        {/* ORDERS */}

        <Link
          to="/seller/orders"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 text-left transition block"
        >

          <div className="flex items-center gap-3">

            <ShoppingCart
              size={24}
            />

            <h3 className="text-xl font-bold">

              View Orders

            </h3>

          </div>


          <p className="mt-2 text-blue-100">

            Manage your customer orders.

          </p>

        </Link>


        {/* MESSAGES */}

        <Link
          to="/seller/messages"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-6 text-left transition block"
        >

          <div className="flex items-center gap-3">

            <MessageCircle
              size={24}
            />

            <h3 className="text-xl font-bold">

              Messages

            </h3>

          </div>


          <p className="mt-2 text-orange-100">

            {unreadMessages > 0
              ? `${unreadMessages} unread message${
                  unreadMessages === 1
                    ? ""
                    : "s"
                } from buyers.`
              : "View messages from your buyers."}

          </p>

        </Link>


        {/* WALLET */}

        <Link
          to="/seller/wallet"
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl p-6 text-left transition block"
        >

          <div className="flex items-center gap-3">

            <Wallet
              size={24}
            />

            <h3 className="text-xl font-bold">

              Wallet

            </h3>

          </div>


          <p className="mt-2 text-yellow-100">

            View your earnings and withdrawals.

          </p>

        </Link>

      </div>


      {/* =====================================================
          RECENT ORDERS
      ===================================================== */}

      <div className="bg-white rounded-2xl shadow-sm mt-10 p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

          <div>

            <h2 className="text-2xl font-bold">

              Recent Orders

            </h2>


            <p className="text-gray-500 text-sm mt-1">

              Orders containing your products

            </p>

          </div>


          <Link
            to="/seller/orders"
            className="text-green-600 font-semibold hover:underline"
          >

            View All Orders

          </Link>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Order ID
                </th>

                <th className="text-left py-3">
                  Customer
                </th>

                <th className="text-left py-3">
                  Products
                </th>

                <th className="text-left py-3">
                  Amount
                </th>

                <th className="text-left py-3">
                  Status
                </th>

                <th className="text-left py-3">
                  Date
                </th>

              </tr>

            </thead>


            <tbody>

              {recentOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-14 text-gray-500"
                  >

                    <ShoppingCart
                      size={36}
                      className="mx-auto text-gray-300"
                    />


                    <p className="mt-3 font-semibold">

                      No orders yet

                    </p>


                    <p className="text-sm mt-1">

                      Your real customer orders will appear here.

                    </p>

                  </td>

                </tr>

              ) : (

                recentOrders.map(
                  (
                    order
                  ) => {

                    const sellerItems =
                      Array.isArray(
                        order.items
                      )
                        ? order.items.filter(
                            (
                              item
                            ) =>
                              item?.sellerEmail
                                ?.trim()
                                .toLowerCase() ===
                              user?.email
                                ?.trim()
                                .toLowerCase()
                          )
                        : [];


                    return (

                      <tr
                        key={
                          order.id
                        }
                        className="border-b hover:bg-gray-50 transition"
                      >

                        <td className="py-4 font-semibold">

                          {order.id
                            ? `MD-${String(
                                order.id
                              ).padStart(
                                5,
                                "0"
                              )}`
                            : "-"}

                        </td>


                        <td>

                          <div>

                            <p className="font-medium">

                              {order.fullName ||
                                "Customer"}

                            </p>


                            <p className="text-sm text-gray-400">

                              {order.email ||
                                "-"}

                            </p>

                          </div>

                        </td>


                        <td>

                          <div className="space-y-1">

                            {sellerItems
                              .slice(
                                0,
                                2
                              )
                              .map(
                                (
                                  item
                                ) => (

                                  <p
                                    key={
                                      item.id ||
                                      item.productId
                                    }
                                    className="text-sm"
                                  >

                                    {item.productName ||
                                      "Product"}

                                    {Number(
                                      item.quantity
                                    ) > 1 &&
                                      ` × ${item.quantity}`}

                                  </p>

                                )
                              )}


                            {sellerItems.length >
                              2 && (

                              <p className="text-xs text-gray-400">

                                +
                                {sellerItems.length -
                                  2}{" "}
                                more

                              </p>

                            )}

                          </div>

                        </td>


                        <td className="font-semibold text-green-700">

                          {formatCurrency(
                            getSellerOrderAmount(
                              order
                            )
                          )}

                        </td>


                        <td>

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                              order.orderStatus
                            )}`}
                          >

                            {order.orderStatus ||
                              "Pending"}

                          </span>

                        </td>


                        <td className="text-sm text-gray-500">

                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                "en-NG",
                                {
                                  day:
                                    "2-digit",
                                  month:
                                    "short",
                                  year:
                                    "numeric",
                                }
                              )
                            : "-"}

                        </td>

                      </tr>

                    );

                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          SALES OVERVIEW
      ===================================================== */}

      <div className="bg-white rounded-2xl shadow-sm mt-10 p-6">

        <div className="flex items-center gap-3 mb-6">

          <TrendingUp
            size={28}
            className="text-green-600"
          />


          <div>

            <h2 className="text-2xl font-bold">

              Sales Overview

            </h2>


            <p className="text-gray-500 text-sm">

              Based on your actual orders

            </p>

          </div>

        </div>


        {salesOverview.length === 0 ? (

          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl">

            <div className="text-center">

              <TrendingUp
                size={40}
                className="mx-auto text-gray-300"
              />


              <p className="text-gray-500 mt-3">

                No sales data yet

              </p>


              <p className="text-sm text-gray-400 mt-1">

                Sales will appear here when customers purchase your products.

              </p>

            </div>

          </div>

        ) : (

          <div className="space-y-5">

            {salesOverview.map(
              (
                sale
              ) => {

                const maxAmount =
                  Math.max(
                    ...salesOverview.map(
                      (
                        item
                      ) =>
                        item.amount
                    ),
                    1
                  );


                const percentage =
                  Math.min(
                    100,
                    (
                      sale.amount /
                      maxAmount
                    ) *
                    100
                  );


                return (

                  <div
                    key={
                      sale.month
                    }
                  >

                    <div className="flex justify-between items-center mb-2">

                      <span className="font-medium text-gray-700">

                        {sale.month}

                      </span>


                      <span className="font-semibold text-green-700">

                        {formatCurrency(
                          sale.amount
                        )}

                      </span>

                    </div>


                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-green-600 rounded-full transition-all duration-500"
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>

    </section>

  );

}


export default Dashboard;