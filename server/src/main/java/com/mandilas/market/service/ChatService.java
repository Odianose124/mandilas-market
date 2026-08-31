package com.mandilas.market.service;

import com.mandilas.market.model.Conversation;
import com.mandilas.market.model.Message;
import com.mandilas.market.model.User;
import com.mandilas.market.repository.ConversationRepository;
import com.mandilas.market.repository.MessageRepository;
import com.mandilas.market.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public ChatService(
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            UserRepository userRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }


    // =========================================================
    // FIND USER ID BY EMAIL
    // =========================================================
    //
    // Used when the frontend has the seller's email but does
    // not have the seller's database ID.
    //

    public Long findUserIdByEmail(
            String email
    ) {

        if (email == null ||
                email.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Seller email is required."
            );
        }

        String normalizedEmail =
                email.trim();


        User user =
                userRepository
                        .findByEmail(
                                normalizedEmail
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Seller account not found."
                                )
                        );


        return user.getId();
    }


    // =========================================================
    // CREATE OR GET EXISTING CONVERSATION
    // =========================================================

    @Transactional
    public Conversation getOrCreateConversation(
            Long buyerId,
            Long sellerId,
            Long productId,
            String productName
    ) {

        if (buyerId == null) {

            throw new IllegalArgumentException(
                    "Buyer ID is required."
            );
        }

        if (sellerId == null) {

            throw new IllegalArgumentException(
                    "Seller ID is required."
            );
        }

        if (productId == null) {

            throw new IllegalArgumentException(
                    "Product ID is required."
            );
        }

        if (buyerId.equals(sellerId)) {

            throw new IllegalArgumentException(
                    "A seller cannot start a chat with themselves."
            );
        }


        /*
         * First look for an existing conversation.
         *
         * This prevents duplicate conversations when the
         * buyer clicks Chat Seller multiple times.
         */

        return conversationRepository
                .findByBuyerIdAndSellerIdAndProductId(
                        buyerId,
                        sellerId,
                        productId
                )
                .orElseGet(() -> {

                    Conversation conversation =
                            new Conversation();

                    conversation.setBuyerId(
                            buyerId
                    );

                    conversation.setSellerId(
                            sellerId
                    );

                    conversation.setProductId(
                            productId
                    );

                    conversation.setProductName(
                            productName
                    );

                    return conversationRepository.save(
                            conversation
                    );
                });
    }


    // =========================================================
    // GET CONVERSATION
    // =========================================================

    public Conversation getConversation(
            Long conversationId
    ) {

        if (conversationId == null) {

            throw new IllegalArgumentException(
                    "Conversation ID is required."
            );
        }

        return conversationRepository
                .findById(
                        conversationId
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Conversation not found."
                        )
                );
    }


    // =========================================================
    // GET USER CONVERSATIONS
    // =========================================================

    public List<Conversation> getUserConversations(
            Long userId
    ) {

        if (userId == null) {

            throw new IllegalArgumentException(
                    "User ID is required."
            );
        }

        return conversationRepository
                .findByBuyerIdOrSellerIdOrderByUpdatedAtDesc(
                        userId,
                        userId
                );
    }


    // =========================================================
    // SEND MESSAGE
    // =========================================================

    @Transactional
    public Message sendMessage(
            Long conversationId,
            Long senderId,
            String content
    ) {

        if (conversationId == null) {

            throw new IllegalArgumentException(
                    "Conversation ID is required."
            );
        }

        if (senderId == null) {

            throw new IllegalArgumentException(
                    "Sender ID is required."
            );
        }

        if (content == null ||
                content.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Message cannot be empty."
            );
        }


        /*
         * Make sure the conversation exists.
         */

        Conversation conversation =
                getConversation(
                        conversationId
                );


        /*
         * Only the buyer or seller belonging to this
         * conversation can send messages.
         */

        boolean isBuyer =
                senderId.equals(
                        conversation.getBuyerId()
                );

        boolean isSeller =
                senderId.equals(
                        conversation.getSellerId()
                );


        if (!isBuyer && !isSeller) {

            throw new IllegalArgumentException(
                    "You are not a participant in this conversation."
            );
        }


        /*
         * Create the message.
         */

        Message message =
                new Message();

        message.setConversationId(
                conversationId
        );

        message.setSenderId(
                senderId
        );

        message.setContent(
                content.trim()
        );

        message.setRead(
                false
        );


        /*
         * Save message.
         */

        Message savedMessage =
                messageRepository.save(
                        message
                );


        /*
         * Update conversation timestamp.
         */

        conversation.setUpdatedAt(
                java.time.LocalDateTime.now()
        );

        conversationRepository.save(
                conversation
        );


        return savedMessage;
    }


    // =========================================================
    // GET MESSAGES
    // =========================================================

    public List<Message> getMessages(
            Long conversationId
    ) {

        if (conversationId == null) {

            throw new IllegalArgumentException(
                    "Conversation ID is required."
            );
        }


        /*
         * Make sure the conversation exists.
         */

        getConversation(
                conversationId
        );


        return messageRepository
                .findByConversationIdOrderByCreatedAtAsc(
                        conversationId
                );
    }


    // =========================================================
    // MARK MESSAGES AS READ
    // =========================================================

    @Transactional
    public void markMessagesAsRead(
            Long conversationId,
            Long userId
    ) {

        if (conversationId == null) {

            throw new IllegalArgumentException(
                    "Conversation ID is required."
            );
        }

        if (userId == null) {

            throw new IllegalArgumentException(
                    "User ID is required."
            );
        }


        Conversation conversation =
                getConversation(
                        conversationId
                );


        /*
         * Only participants can mark messages as read.
         */

        boolean isBuyer =
                userId.equals(
                        conversation.getBuyerId()
                );

        boolean isSeller =
                userId.equals(
                        conversation.getSellerId()
                );


        if (!isBuyer && !isSeller) {

            throw new IllegalArgumentException(
                    "You are not a participant in this conversation."
            );
        }


        List<Message> unreadMessages =
                messageRepository
                        .findByConversationIdAndSenderIdNotAndReadFalse(
                                conversationId,
                                userId
                        );


        for (Message message :
                unreadMessages) {

            message.setRead(
                    true
            );
        }


        if (!unreadMessages.isEmpty()) {

            messageRepository.saveAll(
                    unreadMessages
            );
        }
    }


    // =========================================================
    // UNREAD MESSAGE COUNT
    // =========================================================

    public long getUnreadCount(
            Long conversationId,
            Long userId
    ) {

        if (conversationId == null) {

            throw new IllegalArgumentException(
                    "Conversation ID is required."
            );
        }

        if (userId == null) {

            throw new IllegalArgumentException(
                    "User ID is required."
            );
        }


        Conversation conversation =
                getConversation(
                        conversationId
                );


        boolean isBuyer =
                userId.equals(
                        conversation.getBuyerId()
                );

        boolean isSeller =
                userId.equals(
                        conversation.getSellerId()
                );


        if (!isBuyer && !isSeller) {

            throw new IllegalArgumentException(
                    "You are not a participant in this conversation."
            );
        }


        return messageRepository
                .countByConversationIdAndSenderIdNotAndReadFalse(
                        conversationId,
                        userId
                );
    }
}