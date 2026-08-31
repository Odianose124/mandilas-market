import api from "./api";

/*
 * =========================================================
 * CHAT SERVICE
 * =========================================================
 *
 * All buyer/seller chat API requests live here.
 *
 * The ProductDetails page and Chat page should NOT make
 * axios requests directly.
 */


/*
 * =========================================================
 * CREATE OR GET CONVERSATION
 * =========================================================
 *
 * If the buyer has already chatted with this seller about
 * this product, the existing conversation is returned.
 *
 * Otherwise, a new conversation is created.
 */
export const getOrCreateConversation = async ({
  buyerId,
  sellerId,
  productId,
  productName,
}) => {
  const response = await api.post(
    "/chat/conversations",
    {
      buyerId,
      sellerId,
      productId,
      productName,
    }
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