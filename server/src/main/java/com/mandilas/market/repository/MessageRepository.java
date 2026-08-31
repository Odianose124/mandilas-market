package com.mandilas.market.repository;

import com.mandilas.market.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository
        extends JpaRepository<Message, Long> {

    /*
     * Get all messages belonging to a conversation,
     * oldest first.
     *
     * This is the order we want in the chat window.
     */
    List<Message> findByConversationIdOrderByCreatedAtAsc(
            Long conversationId
    );

    /*
     * Get unread messages sent by another user.
     *
     * We'll use this later for unread message counts.
     */
    List<Message> findByConversationIdAndSenderIdNotAndReadFalse(
            Long conversationId,
            Long senderId
    );

    /*
     * Count unread messages sent by another user.
     */
    long countByConversationIdAndSenderIdNotAndReadFalse(
            Long conversationId,
            Long senderId
    );
}