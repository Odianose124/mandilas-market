import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  RefreshCw,
  Store,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  getConversations,
  getMessages,
  markConversationAsRead,
} from "../../services/chatService";


function Messages() {

  /*
   * =========================================================
   * AUTHENTICATED USER
   * =========================================================
   */

  const {
    user,
    loading: authLoading,
  } = useAuth();


  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [
    conversations,
    setConversations,
  ] = useState([]);

  const [
    unreadCounts,
    setUnreadCounts,
  ] = useState({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  /*
   * =========================================================
   * CURRENT USER ID
   * =========================================================
   */

  const currentUserId =
    user?.id
      ? Number(user.id)
      : null;


  /*
   * =========================================================
   * LOAD UNREAD COUNT
   * =========================================================
   *
   * We calculate unread messages from the messages returned
   * by the conversation.
   *
   * A message is unread for the current user when:
   *
   * senderId !== currentUserId
   *
   * and it has not been marked as read.
   *
   * The code also supports common backend field names:
   *
   * read
   * isRead
   * readAt
   * seen
   * isSeen
   *
   * =========================================================
   */

  const getConversationUnreadCount =
    async (
      conversation
    ) => {

      if (
        !conversation?.id ||
        !currentUserId ||
        Number.isNaN(currentUserId)
      ) {

        return 0;
      }


      try {

        const result =
          await getMessages(
            Number(
              conversation.id
            )
          );


        const messageList =
          Array.isArray(result)
            ? result
            : [];


        return messageList.filter(
          (
            item
          ) => {

            const senderId =
              Number(
                item?.senderId ??
                item?.sender?.id
              );


            /*
             * Ignore messages sent by
             * the current logged-in user.
             */

            if (
              senderId ===
              currentUserId
            ) {

              return false;
            }


            /*
             * Support different backend
             * read-status field names.
             */

            const isRead =
              item?.read === true ||
              item?.isRead === true ||
              item?.seen === true ||
              item?.isSeen === true ||
              Boolean(
                item?.readAt
              );


            return !isRead;
          }
        ).length;

      } catch (err) {

        console.error(
          "Failed to calculate unread messages:",
          err
        );

        return 0;
      }
    };


  /*
   * =========================================================
   * LOAD CONVERSATIONS
   * =========================================================
   */

  const loadConversations =
    useCallback(
      async (
        showLoader = true
      ) => {

        if (
          !currentUserId ||
          Number.isNaN(currentUserId)
        ) {

          setConversations([]);
          setUnreadCounts({});
          setLoading(false);

          return;
        }


        try {

          if (showLoader) {
            setLoading(true);
          }

          setError("");


          /*
           * Get all conversations belonging
           * to the logged-in user.
           */

          const result =
            await getConversations(
              currentUserId
            );


          const conversationList =
            Array.isArray(result)
              ? result
              : [];


          /*
           * Sort newest conversation first.
           */

          const sortedConversations =
            [
              ...conversationList,
            ].sort(
              (
                a,
                b
              ) => {

                const dateA =
                  new Date(
                    a?.updatedAt ||
                    a?.createdAt ||
                    0
                  ).getTime();

                const dateB =
                  new Date(
                    b?.updatedAt ||
                    b?.createdAt ||
                    0
                  ).getTime();

                return (
                  dateB -
                  dateA
                );
              }
            );


          setConversations(
            sortedConversations
          );


          /*
           * =================================================
           * LOAD UNREAD COUNTS
           * =================================================
           */

          const counts = {};


          await Promise.all(
            sortedConversations.map(
              async (
                conversation
              ) => {

                if (
                  !conversation?.id
                ) {

                  return;
                }


                const count =
                  await getConversationUnreadCount(
                    conversation
                  );


                counts[
                  conversation.id
                ] =
                  count;

              }
            )
          );


          setUnreadCounts(
            counts
          );

        } catch (err) {

          console.error(
            "Failed to load conversations:",
            err
          );


          setError(
            err?.message ||
            "Failed to load your messages."
          );


          setConversations(
            []
          );

          setUnreadCounts(
            {}
          );

        } finally {

          setLoading(false);
          setRefreshing(false);
        }
      },
      [
        currentUserId,
      ]
    );


  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {

    if (!authLoading) {

      loadConversations(
        true
      );
    }

  }, [
    authLoading,
    loadConversations,
  ]);


  /*
   * =========================================================
   * AUTO REFRESH
   * =========================================================
   *
   * Check for new conversations/messages
   * every 5 seconds.
   *
   * =========================================================
   */

  useEffect(() => {

    if (
      !currentUserId ||
      Number.isNaN(currentUserId)
    ) {

      return undefined;
    }


    const interval =
      setInterval(
        () => {

          loadConversations(
            false
          );

        },
        5000
      );


    return () => {

      clearInterval(
        interval
      );

    };

  }, [
    currentUserId,
    loadConversations,
  ]);


  /*
   * =========================================================
   * TOTAL UNREAD
   * =========================================================
   */

  const totalUnread =
    useMemo(
      () => {

        return Object.values(
          unreadCounts
        ).reduce(
          (
            total,
            count
          ) => {

            return (
              total +
              Number(
                count || 0
              )
            );

          },
          0
        );

      },
      [
        unreadCounts,
      ]
    );


  /*
   * =========================================================
   * REFRESH
   * =========================================================
   */

  const handleRefresh =
    async () => {

      setRefreshing(true);

      await loadConversations(
        false
      );
    };


  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (
    authLoading ||
    loading
  ) {

    return (

      <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

        <div className="text-center">

          <Loader2
            size={42}
            className="mx-auto text-green-600 animate-spin"
          />

          <p className="mt-4 text-gray-600">
            Loading your messages...
          </p>

        </div>

      </section>
    );
  }


  /*
   * =========================================================
   * NOT LOGGED IN
   * =========================================================
   */

  if (!user) {

    return (

      <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center max-w-md w-full">

          <MessageCircle
            size={50}
            className="mx-auto text-gray-400"
          />

          <h1 className="text-2xl font-bold mt-5">
            Login Required
          </h1>

          <p className="text-gray-500 mt-3">
            Please log in to view your messages.
          </p>

          <Link
            to="/login?redirect=/seller/messages"
            className="inline-flex mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Login
          </Link>

        </div>

      </section>
    );
  }


  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (

    <section className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="max-w-5xl mx-auto">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

          <div>

            <Link
              to="/seller/dashboard"
              className="inline-flex items-center gap-2 text-green-700 font-semibold hover:underline mb-4"
            >

              <ArrowLeft
                size={18}
              />

              Seller Dashboard

            </Link>


            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">

              Messages

            </h1>


            <p className="text-gray-500 mt-2">

              Messages from buyers about your products.

            </p>

          </div>


          <button
            type="button"
            onClick={
              handleRefresh
            }
            disabled={
              refreshing
            }
            className="bg-white border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
          >

            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

            {error}

          </div>

        )}


        {/* =================================================
            MESSAGE CONTAINER
        ================================================= */}

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">


          {/* =================================================
              TITLE
          ================================================= */}

          <div className="border-b px-5 py-4 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <MessageCircle
                className="text-green-600"
                size={24}
              />

              <div>

                <h2 className="font-bold text-lg">

                  Buyer Conversations

                </h2>

                <p className="text-sm text-gray-500">

                  {conversations.length} conversation
                  {conversations.length === 1
                    ? ""
                    : "s"}

                </p>

              </div>

            </div>


            {totalUnread > 0 && (

              <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">

                {totalUnread} unread

              </span>

            )}

          </div>


          {/* =================================================
              NO CONVERSATIONS
          ================================================= */}

          {conversations.length === 0 ? (

            <div className="py-20 px-6 text-center">

              <MessageCircle
                size={56}
                className="mx-auto text-gray-300"
              />

              <h2 className="text-xl font-bold text-gray-800 mt-5">

                No buyer messages yet

              </h2>

              <p className="text-gray-500 mt-2 max-w-md mx-auto">

                When a buyer clicks
                "Chat Seller" on one
                of your products,
                the conversation will
                appear here.

              </p>


              <Link
                to="/seller/products"
                className="inline-flex mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >

                View My Products

              </Link>

            </div>

          ) : (


            /* =================================================
               CONVERSATION LIST
            ================================================= */

            <div className="divide-y">

              {conversations.map(
                (
                  conversation
                ) => {

                  const unread =
                    Number(
                      unreadCounts[
                        conversation.id
                      ] || 0
                    );


                  const productName =
                    conversation?.productName ||
                    "Product conversation";


                  /*
                   * Determine whether the
                   * current user is the buyer
                   * or seller.
                   */

                  const isCurrentUserBuyer =
                    Number(
                      conversation?.buyerId
                    ) ===
                    Number(
                      currentUserId
                    );


                  const isCurrentUserSeller =
                    Number(
                      conversation?.sellerId
                    ) ===
                    Number(
                      currentUserId
                    );


                  /*
                   * Display the other person's
                   * identity.
                   */

                  let personLabel =
                    "Buyer";


                  if (
                    isCurrentUserBuyer
                  ) {

                    personLabel =
                      conversation?.sellerName ||
                      conversation?.seller?.name ||
                      conversation?.sellerEmail ||
                      "Seller";

                  } else if (
                    isCurrentUserSeller
                  ) {

                    personLabel =
                      conversation?.buyerName ||
                      conversation?.buyer?.name ||
                      conversation?.buyerEmail ||
                      (
                        conversation?.buyerId
                          ? `Buyer #${conversation.buyerId}`
                          : "Buyer"
                      );

                  }


                  return (

                    <Link
                      key={
                        conversation.id
                      }
                      to={`/chat/${conversation.id}`}
                      className="flex items-center gap-4 p-5 hover:bg-green-50 transition"
                    >


                      {/* =================================================
                          AVATAR
                      ================================================= */}

                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">

                        <Store
                          size={23}
                          className="text-green-700"
                        />

                      </div>


                      {/* =================================================
                          INFORMATION
                      ================================================= */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-3">

                          <h3
                            className={`truncate ${
                              unread > 0
                                ? "font-bold"
                                : "font-semibold"
                            } text-gray-900`}
                          >

                            {personLabel}

                          </h3>


                          {conversation?.updatedAt && (

                            <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">

                              {new Date(
                                conversation.updatedAt
                              ).toLocaleString()}

                            </span>

                          )}

                        </div>


                        <p className="text-sm text-gray-500 truncate mt-1">

                          About:{" "}

                          {productName}

                        </p>


                        {unread > 0 && (

                          <span className="inline-flex mt-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">

                            {unread} unread

                          </span>

                        )}

                      </div>


                      {/* =================================================
                          OPEN
                      ================================================= */}

                      <span className="text-green-700 font-semibold text-sm hidden sm:block">

                        Open

                      </span>

                    </Link>

                  );

                }
              )}

            </div>

          )}

        </div>

      </div>

    </section>
  );
}


export default Messages;