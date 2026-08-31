package com.mandilas.market.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;


/**
 * =========================================================
 * CHAT MESSAGE
 * =========================================================
 *
 * Represents one message inside a Conversation.
 *
 * Example:
 *
 * Buyer:
 * "Hello, is this T-shirt still available?"
 *
 * Seller:
 * "Yes, it is available."
 *
 * Every message belongs to one conversation and records
 * who sent it.
 */
@Entity
@Table(
        name = "messages",
        indexes = {
                @Index(
                        name = "idx_message_conversation",
                        columnList = "conversation_id"
                ),
                @Index(
                        name = "idx_message_sender",
                        columnList = "sender_id"
                )
        }
)
public class Message {


    // =========================================================
    // PRIMARY KEY
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // CONVERSATION ID
    // =========================================================
    //
    // The conversation this message belongs to.
    //
    // We use the ID rather than a direct @ManyToOne relationship
    // to keep this compatible with the Conversation entity we
    // just created.
    //

    @Column(
            name = "conversation_id",
            nullable = false
    )
    private Long conversationId;


    // =========================================================
    // SENDER ID
    // =========================================================
    //
    // This is the User ID of the person who sent the message.
    //
    // It can be either:
    //
    //      Buyer
    //
    // or:
    //
    //      Seller
    //

    @Column(
            name = "sender_id",
            nullable = false
    )
    private Long senderId;


    // =========================================================
    // MESSAGE CONTENT
    // =========================================================

    @Column(
            name = "content",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String content;


    // =========================================================
    // CREATED AT
    // =========================================================

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;


    // =========================================================
    // READ STATUS
    // =========================================================
    //
    // false = recipient has not read the message
    //
    // true = recipient has read the message
    //
    // This will allow us to add unread message counts later.
    //

    @Column(
            name = "is_read",
            nullable = false
    )
    private boolean read = false;


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public Message() {
    }


    // =========================================================
    // PRE-PERSIST
    // =========================================================

    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt =
                    LocalDateTime.now();
        }
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
    // GET CONVERSATION ID
    // =========================================================

    public Long getConversationId() {
        return conversationId;
    }


    // =========================================================
    // SET CONVERSATION ID
    // =========================================================

    public void setConversationId(
            Long conversationId
    ) {

        this.conversationId =
                conversationId;
    }


    // =========================================================
    // GET SENDER ID
    // =========================================================

    public Long getSenderId() {
        return senderId;
    }


    // =========================================================
    // SET SENDER ID
    // =========================================================

    public void setSenderId(
            Long senderId
    ) {

        this.senderId =
                senderId;
    }


    // =========================================================
    // GET CONTENT
    // =========================================================

    public String getContent() {
        return content;
    }


    // =========================================================
    // SET CONTENT
    // =========================================================

    public void setContent(
            String content
    ) {

        this.content =
                content;
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

        this.createdAt =
                createdAt;
    }


    // =========================================================
    // IS READ
    // =========================================================

    public boolean isRead() {
        return read;
    }


    // =========================================================
    // SET READ
    // =========================================================

    public void setRead(
            boolean read
    ) {

        this.read =
                read;
    }
}