import api from "./api";

/*
 * =========================================================
 * CHAT SERVICE
 * =========================================================
 *
 * All buyer/seller chat API requests live here.
 *
 * ProductDetails and Chat pages should NOT make axios
 * requests directly.
 */


/*
 * =========================================================
 * CREATE OR GET CONVERSATION
 * =========================================================
 *
 * A conversation is unique to:
 *
 * buyer + seller + product
 *
 * The seller can be identified by either:
 *
 * sellerId
 *
 * OR
 *
 * sellerEmail
 *
 * sellerEmail is especially useful for products uploaded
 * by sellers where the product contains the seller email
 * but not the seller database ID.
 */

export const getOrCreateConversation = async ({
  buyerId,
  sellerId,
  sellerEmail,
  productId,
  productName,
}) => {

  const requestData = {
    buyerId,
    productId,
    productName,
  };


  /*
   * If sellerId is available, use it.
   */

  if (
    sellerId !== undefined &&
    sellerId !== null &&
    sellerId !== ""
  ) {
    requestData.sellerId = sellerId;
  }


  /*
   * Otherwise use sellerEmail.
   */

  if (
    sellerEmail &&
    String(sellerEmail).trim()
  ) {
    requestData.sellerEmail =
      String(sellerEmail).trim();
  }


  const response = await api.post(
    "/chat/conversations",
    requestData
  );


  return response.data;
};


/*
 * =========================================================
 * GET USER CONVERSATIONS
 * =========================================================
 */

export const getUserConversations = async (
  userId
) => {

  const response = await api.get(
    `/chat/conversations/user/${userId}`
  );

  return response.data;
};


/*
 * =========================================================
 * GET SINGLE CONVERSATION
 * =========================================================
 */

export const getConversation = async (
  conversationId
) => {

  const response = await api.get(
    `/chat/conversations/${conversationId}`
  );

  return response.data;
};


/*
 * =========================================================
 * GET MESSAGES
 * =========================================================
 */

export const getMessages = async (
  conversationId
) => {

  const response = await api.get(
    `/chat/conversations/${conversationId}/messages`
  );

  return response.data;
};


/*
 * =========================================================
 * SEND MESSAGE
 * =========================================================
 */

export const sendMessage = async ({
  conversationId,
  senderId,
  content,
}) => {

  const response = await api.post(
    `/chat/conversations/${conversationId}/messages`,
    {
      senderId,
      content,
    }
  );

  return response.data;
};


/*
 * =========================================================
 * MARK MESSAGES AS READ
 * =========================================================
 */

export const markMessagesAsRead = async ({
  conversationId,
  userId,
}) => {

  const response = await api.put(
    `/chat/conversations/${conversationId}/read/${userId}`
  );

  return response.data;
};


/*
 * =========================================================
 * GET UNREAD COUNT
 * =========================================================
 */

export const getUnreadCount = async ({
  conversationId,
  userId,
}) => {

  const response = await api.get(
    `/chat/conversations/${conversationId}/unread/${userId}`
  );

  return response.data;
};