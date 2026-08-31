package com.mandilas.market.controller;

import com.mandilas.market.model.Conversation;
import com.mandilas.market.model.Message;
import com.mandilas.market.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }


    // =========================================================
    // CREATE OR GET CONVERSATION
    // =========================================================
    //
    // POST /api/chat/conversations
    //
    // The request can contain either:
    //
    // sellerId
    //
    // OR
    //
    // sellerEmail
    //
    // sellerEmail is used when sellerId is not provided.
    //
    // Example:
    //
    // {
    //   "buyerId": 1,
    //   "sellerEmail": "seller@example.com",
    //   "productId": 10,
    //   "productName": "T-shirt by ODIRA"
    // }
    //

    @PostMapping("/conversations")
    public ResponseEntity<?> createOrGetConversation(
            @RequestBody Map<String, Object> request
    ) {

        try {

            // =====================================================
            // BUYER ID
            // =====================================================

            Long buyerId =
                    getLongValue(
                            request.get("buyerId")
                    );

            if (buyerId == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Buyer ID is required."
                                )
                        );
            }


            // =====================================================
            // PRODUCT ID
            // =====================================================

            Long productId =
                    getLongValue(
                            request.get("productId")
                    );

            if (productId == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Product ID is required."
                                )
                        );
            }


            // =====================================================
            // PRODUCT NAME
            // =====================================================

            String productName =
                    request.get("productName") != null
                            ? request
                                .get("productName")
                                .toString()
                            : null;


            // =====================================================
            // SELLER ID
            // =====================================================
            //
            // First check whether the frontend already supplied
            // the seller's database ID.
            //

            Long sellerId =
                    getLongValue(
                            request.get("sellerId")
                    );


            // =====================================================
            // SELLER EMAIL FALLBACK
            // =====================================================
            //
            // If sellerId is not available, use sellerEmail to
            // find the seller's actual database ID.
            //

            if (sellerId == null) {

                String sellerEmail = null;

                if (request.get("sellerEmail") != null) {

                    sellerEmail =
                            request
                                .get("sellerEmail")
                                .toString()
                                .trim();
                }

                if (
                        sellerEmail == null ||
                        sellerEmail.isEmpty()
                ) {

                    return ResponseEntity
                            .badRequest()
                            .body(
                                    Map.of(
                                            "message",
                                            "Seller ID or seller email is required."
                                    )
                            );
                }


                sellerId =
                        chatService.findUserIdByEmail(
                                sellerEmail
                        );
            }


            // =====================================================
            // SELLER NOT FOUND
            // =====================================================

            if (sellerId == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "Seller account could not be found."
                                )
                        );
            }


            // =====================================================
            // PREVENT SELLER FROM CHATTING WITH THEMSELVES
            // =====================================================

            if (buyerId.equals(sellerId)) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "You cannot chat with yourself."
                                )
                        );
            }


            // =====================================================
            // CREATE OR GET CONVERSATION
            // =====================================================

            Conversation conversation =
                    chatService.getOrCreateConversation(
                            buyerId,
                            sellerId,
                            productId,
                            productName
                    );


            return ResponseEntity.ok(
                    conversation
            );


        } catch (NumberFormatException error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid buyer, seller, or product ID."
                            )
                    );


        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );


        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to create conversation."
                            )
                    );
        }
    }


    // =========================================================
    // GET USER CONVERSATIONS
    // =========================================================
    //
    // GET /api/chat/conversations/user/{userId}
    //

    @GetMapping("/conversations/user/{userId}")
    public ResponseEntity<?> getUserConversations(
            @PathVariable Long userId
    ) {

        try {

            List<Conversation> conversations =
                    chatService.getUserConversations(
                            userId
                    );

            return ResponseEntity.ok(
                    conversations
            );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to load conversations."
                            )
                    );
        }
    }


    // =========================================================
    // GET SINGLE CONVERSATION
    // =========================================================
    //
    // GET /api/chat/conversations/{conversationId}
    //

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<?> getConversation(
            @PathVariable Long conversationId
    ) {

        try {

            Conversation conversation =
                    chatService.getConversation(
                            conversationId
                    );

            return ResponseEntity.ok(
                    conversation
            );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to load conversation."
                            )
                    );
        }
    }


    // =========================================================
    // GET MESSAGES
    // =========================================================
    //
    // GET /api/chat/conversations/{conversationId}/messages
    //

    @GetMapping(
            "/conversations/{conversationId}/messages"
    )
    public ResponseEntity<?> getMessages(
            @PathVariable Long conversationId
    ) {

        try {

            List<Message> messages =
                    chatService.getMessages(
                            conversationId
                    );

            return ResponseEntity.ok(
                    messages
            );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to load messages."
                            )
                    );
        }
    }


    // =========================================================
    // SEND MESSAGE
    // =========================================================
    //
    // POST
    // /api/chat/conversations/{conversationId}/messages
    //

    @PostMapping(
            "/conversations/{conversationId}/messages"
    )
    public ResponseEntity<?> sendMessage(
            @PathVariable Long conversationId,
            @RequestBody Map<String, Object> request
    ) {

        try {

            Long senderId =
                    getLongValue(
                            request.get("senderId")
                    );

            String content =
                    request.get("content") != null
                            ? request
                                .get("content")
                                .toString()
                            : null;


            Message message =
                    chatService.sendMessage(
                            conversationId,
                            senderId,
                            content
                    );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(message);

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to send message."
                            )
                    );
        }
    }


    // =========================================================
    // MARK MESSAGES AS READ
    // =========================================================

    @PutMapping(
            "/conversations/{conversationId}/read/{userId}"
    )
    public ResponseEntity<?> markMessagesAsRead(
            @PathVariable Long conversationId,
            @PathVariable Long userId
    ) {

        try {

            chatService.markMessagesAsRead(
                    conversationId,
                    userId
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Messages marked as read."
                    )
            );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to mark messages as read."
                            )
                    );
        }
    }


    // =========================================================
    // UNREAD COUNT
    // =========================================================

    @GetMapping(
            "/conversations/{conversationId}/unread/{userId}"
    )
    public ResponseEntity<?> getUnreadCount(
            @PathVariable Long conversationId,
            @PathVariable Long userId
    ) {

        try {

            long count =
                    chatService.getUnreadCount(
                            conversationId,
                            userId
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "count",
                            count
                    )
            );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to get unread count."
                            )
                    );
        }
    }


    // =========================================================
    // HELPER — CONVERT REQUEST VALUE TO LONG
    // =========================================================

    private Long getLongValue(
            Object value
    ) {

        if (value == null) {
            return null;
        }

        if (value instanceof Number) {
            return ((Number) value).longValue();
        }

        String stringValue =
                value.toString().trim();

        if (stringValue.isEmpty()) {
            return null;
        }

        return Long.parseLong(
                stringValue
        );
    }
}