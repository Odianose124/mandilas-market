/*
 * =========================================================
 * MANDILAS MARKET
 * CHAT SERVICE
 * =========================================================
 *
 * Handles:
 *
 * 1. Creating/getting buyer ↔ seller conversations
 * 2. Getting conversations for a user
 * 3. Getting one conversation
 * 4. Getting messages
 * 5. Sending messages
 * 6. Marking messages/conversations as read
 *
 * IMPORTANT:
 *
 * We are using ONE chat system for both buyers and sellers.
 *
 * Buyer:
 *   buyerId = logged-in buyer
 *   sellerId = product seller
 *
 * Seller:
 *   sellerId = logged-in seller
 *   buyerId = original buyer
 *
 * Both users use the SAME conversation ID.
 *
 * =========================================================
 */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api";


/*
 * =========================================================
 * GET SAVED USER
 * =========================================================
 */

function getSavedUser() {

  try {

    const savedUser =
      localStorage.getItem("mandilas-user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);

  } catch (error) {

    console.error(
      "Failed to read mandilas-user:",
      error
    );

    return null;
  }
}


/*
 * =========================================================
 * GET CURRENT USER ID
 * =========================================================
 */

function getCurrentUserId() {

  const user =
    getSavedUser();

  const id =
    Number(user?.id);

  if (
    !user?.id ||
    Number.isNaN(id) ||
    id <= 0
  ) {

    return null;
  }

  return id;
}


/*
 * =========================================================
 * PARSE RESPONSE
 * =========================================================
 */

async function parseResponse(
  response,
  defaultMessage
) {

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  let data = null;


  try {

    if (
      contentType.includes(
        "application/json"
      )
    ) {

      data =
        await response.json();

    } else {

      const text =
        await response.text();

      data =
        text
          ? {
              message: text,
            }
          : null;
    }

  } catch (error) {

    console.error(
      "Failed to parse server response:",
      error
    );

  }


  if (!response.ok) {

    const serverMessage =
      data?.message ||
      data?.error ||
      data?.detail;


    throw new Error(
      serverMessage ||
      defaultMessage ||
      `Request failed (${response.status})`
    );

  }


  return data;
}


/*
 * =========================================================
 * CREATE / GET CONVERSATION
 * =========================================================
 *
 * Buyer normally calls this from ProductDetails.
 *
 * Example:
 *
 * getOrCreateConversation({
 *   buyerId: 5,
 *   sellerId: 8,
 *   sellerEmail: "seller@example.com",
 *   productId: 12,
 *   productName: "Kaftan"
 * })
 *
 * =========================================================
 */

export async function getOrCreateConversation({
  buyerId,
  sellerId,
  sellerEmail,
  productId,
  productName,
} = {}) {

  const currentUserId =
    getCurrentUserId();


  /*
   * -------------------------------------------------------
   * BUYER ID
   * -------------------------------------------------------
   */

  const numericBuyerId =
    Number(
      buyerId ||
      currentUserId
    );


  if (
    Number.isNaN(
      numericBuyerId
    ) ||
    numericBuyerId <= 0
  ) {

    throw new Error(
      "Your account ID could not be found. Please log in again."
    );

  }


  /*
   * -------------------------------------------------------
   * SELLER ID
   * -------------------------------------------------------
   */

  let numericSellerId = null;


  if (
    sellerId !== undefined &&
    sellerId !== null &&
    sellerId !== ""
  ) {

    const convertedSellerId =
      Number(
        sellerId
      );


    if (
      !Number.isNaN(
        convertedSellerId
      ) &&
      convertedSellerId > 0
    ) {

      numericSellerId =
        convertedSellerId;
    }

  }


  /*
   * -------------------------------------------------------
   * SELLER EMAIL
   * -------------------------------------------------------
   */

  const normalizedSellerEmail =
    sellerEmail
      ? String(
          sellerEmail
        )
          .trim()
          .toLowerCase()
      : "";


  /*
   * -------------------------------------------------------
   * PRODUCT ID
   * -------------------------------------------------------
 */

  let numericProductId = null;


  if (
    productId !== undefined &&
    productId !== null &&
    productId !== ""
  ) {

    const convertedProductId =
      Number(
        productId
      );


    if (
      !Number.isNaN(
        convertedProductId
      ) &&
      convertedProductId > 0
    ) {

      numericProductId =
        convertedProductId;
    }

  }


  /*
   * -------------------------------------------------------
   * VALIDATION
   * -------------------------------------------------------
   */

  if (
    !numericSellerId &&
    !normalizedSellerEmail
  ) {

    throw new Error(
      "Seller information is missing."
    );

  }


  /*
   * -------------------------------------------------------
   * PREVENT SELF CHAT
   * -------------------------------------------------------
   */

  if (
    numericSellerId &&
    numericBuyerId ===
      numericSellerId
  ) {

    throw new Error(
      "You cannot start a chat with yourself."
    );

  }


  /*
   * -------------------------------------------------------
   * REQUEST BODY
   * -------------------------------------------------------
 */

  const payload = {

    buyerId:
      numericBuyerId,

    productId:
      numericProductId,

    productName:
      productName || "",

  };


  /*
   * Add sellerId when available.
   */

  if (numericSellerId) {

    payload.sellerId =
      numericSellerId;
  }


  /*
   * Add sellerEmail when available.
   */

  if (normalizedSellerEmail) {

    payload.sellerEmail =
      normalizedSellerEmail;
  }


  console.log(
    "Creating/getting conversation:",
    payload
  );


  /*
   * -------------------------------------------------------
   * REQUEST
   * -------------------------------------------------------
 */

  const response =
    await fetch(
      `${API_URL}/chat/conversations`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),
      }
    );


  const conversation =
    await parseResponse(
      response,
      "Unable to create or open the conversation."
    );


  console.log(
    "Conversation created/found:",
    conversation
  );


  return conversation;
}


/*
 * =========================================================
 * GET USER CONVERSATIONS
 * =========================================================
 *
 * Used by:
 *
 * Buyer Messages
 * Seller Messages
 *
 * The current logged-in user can be passed in.
 *
 * =========================================================
 */

export async function getUserConversations(
  userId = null
) {

  const numericUserId =
    Number(
      userId ||
      getCurrentUserId()
    );


  if (
    Number.isNaN(
      numericUserId
    ) ||
    numericUserId <= 0
  ) {

    throw new Error(
      "Your account ID could not be found. Please log in again."
    );

  }


  const response =
    await fetch(
      `${API_URL}/chat/conversations/user/${numericUserId}`
    );


  const conversations =
    await parseResponse(
      response,
      "Unable to load your conversations."
    );


  /*
   * Backend may return:
   *
   * [...]
   */

  if (
    Array.isArray(
      conversations
    )
  ) {

    return conversations;
  }


  /*
   * Backend may return:
   *
   * {
   *   content: [...]
   * }
   */

  if (
    Array.isArray(
      conversations?.content
    )
  ) {

    return conversations.content;
  }


  /*
   * Backend may return:
   *
   * {
   *   conversations: [...]
   * }
   */

  if (
    Array.isArray(
      conversations?.conversations
    )
  ) {

    return conversations.conversations;
  }


  return [];
}


/*
 * =========================================================
 * BACKWARD COMPATIBILITY
 * =========================================================
 *
 * Some existing pages may still import:
 *
 * getConversations()
 *
 * Keep it working.
 *
 * =========================================================
 */

export async function getConversations(
  userId = null
) {

  return getUserConversations(
    userId
  );
}


/*
 * =========================================================
 * GET ONE CONVERSATION
 * =========================================================
 */

export async function getConversation(
  conversationId
) {

  const numericConversationId =
    Number(
      conversationId
    );


  if (
    Number.isNaN(
      numericConversationId
    ) ||
    numericConversationId <= 0
  ) {

    throw new Error(
      "Invalid conversation ID."
    );

  }


  const response =
    await fetch(
      `${API_URL}/chat/conversations/${numericConversationId}`
    );


  return parseResponse(
    response,
    "Unable to load the conversation."
  );
}


/*
 * =========================================================
 * GET MESSAGES
 * =========================================================
 *
 * Returns all messages belonging to the conversation.
 *
 * =========================================================
 */

export async function getMessages(
  conversationId
) {

  const numericConversationId =
    Number(
      conversationId
    );


  if (
    Number.isNaN(
      numericConversationId
    ) ||
    numericConversationId <= 0
  ) {

    throw new Error(
      "Invalid conversation ID."
    );

  }


  const response =
    await fetch(
      `${API_URL}/chat/conversations/${numericConversationId}/messages`
    );


  const messages =
    await parseResponse(
      response,
      "Unable to load messages."
    );


  /*
   * Direct array.
   */

  if (
    Array.isArray(
      messages
    )
  ) {

    return messages;
  }


  /*
   * {
   *   messages: [...]
   * }
   */

  if (
    Array.isArray(
      messages?.messages
    )
  ) {

    return messages.messages;
  }


  /*
   * {
   *   content: [...]
   * }
   */

  if (
    Array.isArray(
      messages?.content
    )
  ) {

    return messages.content;
  }


  return [];
}


/*
 * =========================================================
 * SEND MESSAGE
 * =========================================================
 *
 * BOTH buyer and seller use this function.
 *
 * Buyer:
 *   senderId = buyer ID
 *
 * Seller:
 *   senderId = seller ID
 *
 * The backend determines the recipient from the
 * conversation.
 *
 * =========================================================
 */

export async function sendMessage({
  conversationId,
  senderId,
  message,
  content,
} = {}) {

  const numericConversationId =
    Number(
      conversationId
    );


  const numericSenderId =
    Number(
      senderId ||
      getCurrentUserId()
    );


  /*
   * Support both:
   *
   * message
   *
   * and:
   *
   * content
   */

  const messageText =
    String(
      message ??
      content ??
      ""
    ).trim();


  /*
   * -------------------------------------------------------
   * VALIDATE CONVERSATION
   * -------------------------------------------------------
   */

  if (
    Number.isNaN(
      numericConversationId
    ) ||
    numericConversationId <= 0
  ) {

    throw new Error(
      "Invalid conversation ID."
    );

  }


  /*
   * -------------------------------------------------------
   * VALIDATE SENDER
   * -------------------------------------------------------
   */

  if (
    Number.isNaN(
      numericSenderId
    ) ||
    numericSenderId <= 0
  ) {

    throw new Error(
      "Your account ID could not be found. Please log in again."
    );

  }


  /*
   * -------------------------------------------------------
   * VALIDATE MESSAGE
   * -------------------------------------------------------
   */

  if (!messageText) {

    throw new Error(
      "Please enter a message."
    );

  }


  /*
   * -------------------------------------------------------
   * REQUEST BODY
   * -------------------------------------------------------
   *
   * IMPORTANT:
   *
   * Your existing backend service expects:
   *
   * {
   *   senderId: 1,
   *   message: "Hello"
   * }
   *
   * We keep that format.
   *
   * -------------------------------------------------------
   */

  const payload = {

  senderId:
    numericSenderId,

  content:
    messageText,

};


  console.log(
    "Sending chat message:",
    {
      conversationId:
        numericConversationId,

      senderId:
        numericSenderId,

      payload,
    }
  );


  const response =
    await fetch(
      `${API_URL}/chat/conversations/${numericConversationId}/messages`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),
      }
    );


  const savedMessage =
    await parseResponse(
      response,
      "Unable to send message."
    );


  console.log(
    "Message sent:",
    savedMessage
  );


  return savedMessage;
}


/*
 * =========================================================
 * MARK MESSAGES AS READ
 * =========================================================
 *
 * Your Chat.jsx currently calls:
 *
 * markMessagesAsRead({
 *   conversationId,
 *   userId
 * })
 *
 * So this function is required.
 *
 * =========================================================
 */

export async function markMessagesAsRead({
  conversationId,
  userId,
} = {}) {

  const numericConversationId =
    Number(
      conversationId
    );


  const numericUserId =
    Number(
      userId ||
      getCurrentUserId()
    );


  if (
    Number.isNaN(
      numericConversationId
    ) ||
    numericConversationId <= 0
  ) {

    throw new Error(
      "Invalid conversation ID."
    );

  }


  if (
    Number.isNaN(
      numericUserId
    ) ||
    numericUserId <= 0
  ) {

    throw new Error(
      "Your account ID could not be found."
    );

  }


  const response =
    await fetch(
      `${API_URL}/chat/conversations/${numericConversationId}/read`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            userId:
              numericUserId,
          }),
      }
    );


  return parseResponse(
    response,
    "Unable to mark messages as read."
  );
}


/*
 * =========================================================
 * BACKWARD COMPATIBILITY
 * =========================================================
 *
 * Your older code may call:
 *
 * markConversationAsRead()
 *
 * Keep that function working.
 *
 * =========================================================
 */

export async function markConversationAsRead(
  conversationId,
  userId = null
) {

  return markMessagesAsRead({

    conversationId,

    userId,

  });
}


/*
 * =========================================================
 * GET UNREAD COUNT
 * =========================================================
 *
 * Used by Messages.jsx to display:
 *
 * 1 unread
 * 2 unread
 * etc.
 *
 * =========================================================
 */

export async function getUnreadCount({
  conversationId,
  userId,
} = {}) {

  const numericConversationId =
    Number(
      conversationId
    );


  const numericUserId =
    Number(
      userId ||
      getCurrentUserId()
    );


  if (
    Number.isNaN(
      numericConversationId
    ) ||
    numericConversationId <= 0
  ) {

    throw new Error(
      "Invalid conversation ID."
    );

  }


  if (
    Number.isNaN(
      numericUserId
    ) ||
    numericUserId <= 0
  ) {

    throw new Error(
      "Your account ID could not be found."
    );

  }


  /*
   * Try the standard unread endpoint.
   */

  const response =
    await fetch(
      `${API_URL}/chat/conversations/${numericConversationId}/unread/${numericUserId}`
    );


  return parseResponse(
    response,
    "Unable to load unread message count."
  );
}


/*
 * =========================================================
 * DEFAULT EXPORT
 * =========================================================
 */

const chatService = {

  getOrCreateConversation,

  getUserConversations,

  getConversations,

  getConversation,

  getMessages,

  sendMessage,

  markMessagesAsRead,

  markConversationAsRead,

  getUnreadCount,

};


export default chatService;