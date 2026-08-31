package com.mandilas.market.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;


/**
 * =========================================================
 * CHAT CONVERSATION
 * =========================================================
 *
 * Represents a private conversation between:
 *
 *      BUYER
 *        ↕
 *      SELLER
 *
 * A conversation can also be connected to the product
 * that the buyer originally contacted the seller about.
 *
 * Example:
 *
 * Buyer clicks "Chat Seller" on:
 *
 *      T-shirt by ODIRA
 *
 * The conversation stores:
 *
 *      buyerId
 *      sellerId
 *      productId
 *
 * This allows the same chat system to work for every seller.
 */
@Entity
@Table(
        name = "conversations",
        indexes = {
                @Index(name = "idx_conversation_buyer", columnList = "buyer_id"),
                @Index(name = "idx_conversation_seller", columnList = "seller_id"),
                @Index(name = "idx_conversation_product", columnList = "product_id")
        }
)
public class Conversation {


    // =========================================================
    // PRIMARY KEY
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // BUYER
    // =========================================================
    //
    // We store the buyer's User ID.
    //
    // We intentionally use the ID instead of email because
    // database IDs are stable even if a user's email changes.
    //

    @Column(
            name = "buyer_id",
            nullable = false
    )
    private Long buyerId;


    // =========================================================
    // SELLER
    // =========================================================
    //
    // We store the seller's User ID.
    //

    @Column(
            name = "seller_id",
            nullable = false
    )
    private Long sellerId;


    // =========================================================
    // PRODUCT
    // =========================================================
    //
    // The product that started the conversation.
    //
    // This is not a JPA relationship intentionally.
    //
    // Your existing Product model currently identifies sellers
    // using sellerEmail, so keeping productId as a simple ID
    // avoids changing your existing Product model.
    //

    @Column(
            name = "product_id"
    )
    private Long productId;


    // =========================================================
    // PRODUCT NAME
    // =========================================================
    //
    // We keep the product name so the conversation list can
    // display what the buyer contacted the seller about
    // without needing to load the product every time.
    //

    @Column(
            name = "product_name",
            length = 255
    )
    private String productName;


    // =========================================================
    // CREATED AT
    // =========================================================

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;


    // =========================================================
    // UPDATED AT
    // =========================================================

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public Conversation() {
    }


    // =========================================================
    // PRE-PERSIST
    // =========================================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }
    }


    // =========================================================
    // PRE-UPDATE
    // =========================================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }


    // =========================================================
    // GET ID
    // =========================================================

    public Long getId() {
        return id;
    }


    // =========================================================
    // SET ID
    // =========================================================

    public void setId(Long id) {
        this.id = id;
    }


    // =========================================================
    // GET BUYER ID
    // =========================================================

    public Long getBuyerId() {
        return buyerId;
    }


    // =========================================================
    // SET BUYER ID
    // =========================================================

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }


    // =========================================================
    // GET SELLER ID
    // =========================================================

    public Long getSellerId() {
        return sellerId;
    }


    // =========================================================
    // SET SELLER ID
    // =========================================================

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }


    // =========================================================
    // GET PRODUCT ID
    // =========================================================

    public Long getProductId() {
        return productId;
    }


    // =========================================================
    // SET PRODUCT ID
    // =========================================================

    public void setProductId(Long productId) {
        this.productId = productId;
    }


    // =========================================================
    // GET PRODUCT NAME
    // =========================================================

    public String getProductName() {
        return productName;
    }


    // =========================================================
    // SET PRODUCT NAME
    // =========================================================

    public void setProductName(
            String productName
    ) {

        this.productName = productName;
    }


    // =========================================================
    // GET CREATED AT
    // =========================================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    // =========================================================
    // SET CREATED AT
    // =========================================================

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {

        this.createdAt = createdAt;
    }


    // =========================================================
    // GET UPDATED AT
    // =========================================================

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }


    // =========================================================
    // SET UPDATED AT
    // =========================================================

    public void setUpdatedAt(
            LocalDateTime updatedAt
    ) {

        this.updatedAt = updatedAt;
    }
}