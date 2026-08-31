import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Loader2,
  MessageCircle,
  Store,
} from "lucide-react";

import {
  getConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../services/chatService";


function Chat() {
  const { conversationId } = useParams();

  const [conversation, setConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const messagesEndRef =
    useRef(null);


  /*
   * =========================================================
   * CURRENT USER
   * =========================================================
   *
   * For now we read the logged-in user from localStorage.
   *
   * We'll connect this to your actual authentication context
   * once the chat interface is working.
   */

  const getCurrentUserId = () => {
    const possibleUsers = [
      localStorage.getItem("userId"),
      localStorage.getItem("user_id"),
      localStorage.getItem("currentUserId"),
    ];

    for (const value of possibleUsers) {
      if (value && value !== "null") {
        const numberValue = Number(value);

        if (!Number.isNaN(numberValue)) {
          return numberValue;
        }
      }
    }

    return null;
  };


  const currentUserId =
    getCurrentUserId();


  /*
   * =========================================================
   * LOAD CHAT
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    const loadChat = async () => {
      if (!conversationId) {
        setError("Invalid conversation.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          conversationData,
          messagesData,
        ] = await Promise.all([
          getConversation(conversationId),
          getMessages(conversationId),
        ]);

        if (cancelled) {
          return;
        }

        setConversation(
          conversationData
        );

        setMessages(
          Array.isArray(messagesData)
            ? messagesData
            : []
        );


        /*
         * Mark messages as read when we enter
         * the conversation.
         */
        if (currentUserId) {
          try {
            await markMessagesAsRead({
              conversationId:
                Number(conversationId),

              userId:
                currentUserId,
            });
          } catch (readError) {
            console.error(
              "Failed to mark messages as read:",
              readError
            );
          }
        }

      } catch (err) {
        console.error(
          "Failed to load chat:",
          err
        );

        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load conversation."
          );
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadChat();

    return () => {
      cancelled = true;
    };

  }, [conversationId]);


  /*
   * =========================================================
   * AUTO SCROLL
   * =========================================================
   */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  /*
   * =========================================================
   * SEND MESSAGE
   * =========================================================
   */

  const handleSendMessage = async (
    event
  ) => {

    event.preventDefault();

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (!currentUserId) {
      setError(
        "Please log in before sending a message."
      );
      return;
    }

    if (sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const newMessage =
        await sendMessage({
          conversationId:
            Number(conversationId),

          senderId:
            currentUserId,

          content:
            trimmedMessage,
        });


      /*
       * Add the newly sent message immediately
       * to the chat window.
       */
      setMessages(
        (currentMessages) => [
          ...currentMessages,
          newMessage,
        ]
      );

      setMessage("");

    } catch (err) {
      console.error(
        "Failed to send message:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send message."
      );

    } finally {
      setSending(false);
    }
  };


  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4">

        <div className="text-center">

          <Loader2
            size={42}
            className="mx-auto text-green-600 animate-spin"
          />

          <p className="mt-4 text-gray-600">
            Loading conversation...
          </p>

        </div>

      </section>
    );
  }


  /*
   * =========================================================
   * ERROR / NOT FOUND
   * =========================================================
   */

  if (error && !conversation) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-16">

        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">

          <MessageCircle
            size={48}
            className="mx-auto text-gray-400"
          />

          <h2 className="text-2xl font-bold text-gray-900 mt-5">
            Unable to open chat
          </h2>

          <p className="text-gray-500 mt-3">
            {error}
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>

        </div>

      </section>
    );
  }


  /*
   * =========================================================
   * SELLER / BUYER INFORMATION
   * =========================================================
   */

  const isBuyer =
    currentUserId &&
    Number(conversation?.buyerId) ===
      Number(currentUserId);

  const otherUserId =
    isBuyer
      ? conversation?.sellerId
      : conversation?.buyerId;


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section className="bg-gray-50 min-h-[calc(100vh-80px)]">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* =================================================
            BACK
            ================================================= */}

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-green-700 font-semibold hover:underline mb-5"
        >
          <ArrowLeft size={18} />
          Back to Shop
        </Link>


        {/* =================================================
            CHAT CONTAINER
            ================================================= */}

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          {/* =================================================
              CHAT HEADER
              ================================================= */}

          <div className="border-b px-5 py-4 flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">

              <Store
                size={24}
                className="text-green-700"
              />

            </div>

            <div className="min-w-0 flex-1">

              <h1 className="font-bold text-lg truncate">
                {isBuyer
                  ? "Seller"
                  : "Buyer"}
              </h1>

              <p className="text-sm text-gray-500 truncate">

                {conversation?.productName
                  ? `About: ${conversation.productName}`
                  : "Mandilas Market"}

              </p>

            </div>

          </div>


          {/* =================================================
              ERROR MESSAGE
              ================================================= */}

          {error && (
            <div className="mx-5 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}


          {/* =================================================
              MESSAGES
              ================================================= */}

          <div className="h-[500px] overflow-y-auto p-5 bg-gray-50">

            {messages.length === 0 ? (

              <div className="h-full flex flex-col items-center justify-center text-center">

                <MessageCircle
                  size={48}
                  className="text-gray-300"
                />

                <h2 className="font-semibold text-gray-700 mt-4">
                  Start the conversation
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Send a message to the seller about this product.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {messages.map(
                  (item, index) => {

                    const mine =
                      Number(
                        item.senderId
                      ) ===
                      Number(
                        currentUserId
                      );

                    return (
                      <div
                        key={
                          item.id ||
                          `${item.createdAt}-${index}`
                        }
                        className={`flex ${
                          mine
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >

                        <div
                          className={`max-w-[80%] sm:max-w-[65%] rounded-2xl px-4 py-3 ${
                            mine
                              ? "bg-green-600 text-white rounded-br-md"
                              : "bg-white border text-gray-800 rounded-bl-md"
                          }`}
                        >

                          <p className="whitespace-pre-wrap break-words">
                            {item.content}
                          </p>

                          {item.createdAt && (
                            <p
                              className={`text-[11px] mt-2 ${
                                mine
                                  ? "text-green-100"
                                  : "text-gray-400"
                              }`}
                            >
                              {new Date(
                                item.createdAt
                              ).toLocaleString()}
                            </p>
                          )}

                        </div>

                      </div>
                    );
                  }
                )}

                <div
                  ref={
                    messagesEndRef
                  }
                />

              </div>
            )}

          </div>


          {/* =================================================
              MESSAGE INPUT
              ================================================= */}

          <form
            onSubmit={
              handleSendMessage
            }
            className="border-t p-4 bg-white"
          >

            <div className="flex items-center gap-3">

              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                placeholder="Type a message..."
                disabled={sending}
                className="flex-1 h-12 border border-gray-300 rounded-xl px-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
              />

              <button
                type="submit"
                disabled={
                  sending ||
                  !message.trim()
                }
                className="w-12 h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >

                {sending ? (
                  <Loader2
                    size={21}
                    className="animate-spin"
                  />
                ) : (
                  <Send size={21} />
                )}

              </button>

            </div>

          </form>

        </div>

      </div>

    </section>
  );
}

export default Chat;