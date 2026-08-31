package com.mandilas.market.repository;

import com.mandilas.market.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository
        extends JpaRepository<Conversation, Long> {

    /*
     * Find an existing conversation between a buyer,
     * seller and product.
     *
     * This prevents the system from creating a new
     * conversation every time the buyer clicks
     * "Chat Seller".
     */
    Optional<Conversation> findByBuyerIdAndSellerIdAndProductId(
            Long buyerId,
            Long sellerId,
            Long productId
    );

    /*
     * Get all conversations where the user is the buyer.
     */
    List<Conversation> findByBuyerIdOrderByUpdatedAtDesc(
            Long buyerId
    );

    /*
     * Get all conversations where the user is the seller.
     */
    List<Conversation> findBySellerIdOrderByUpdatedAtDesc(
            Long sellerId
    );

    /*
     * Get every conversation involving the user.
     *
     * Useful later for a general chat inbox.
     */
    List<Conversation> findByBuyerIdOrSellerIdOrderByUpdatedAtDesc(
            Long buyerId,
            Long sellerId
    );
}