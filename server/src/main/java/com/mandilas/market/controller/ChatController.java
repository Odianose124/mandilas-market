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
    // Body:
    //
    // {
    //   "buyerId": 1,
    //   "sellerId": 2,
    //   "productId": 10,
    //   "productName": "T-shirt by ODIRA"
    // }
    //

    @PostMapping("/conversations")
    public ResponseEntity<?> createOrGetConversation(
            @RequestBody Map<String, Object> request
    ) {

        try {

            Long buyerId =
                    getLongValue(
                            request.get("buyerId")
                    );

            Long sellerId =
                    getLongValue(
                            request.get("sellerId")
                    );

            Long productId =
                    getLongValue(
                            request.get("productId")
                    );

            String productName =
                    request.get("productName") != null
                            ? request
                                .get("productName")
                                .toString()
                            : null;


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
    // Body:
    //
    // {
    //   "senderId": 1,
    //   "content": "Hello, is this available?"
    // }
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
    //
    // PUT
    // /api/chat/conversations/{conversationId}/read/{userId}
    //

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
    //
    // GET
    // /api/chat/conversations/{conversationId}/unread/{userId}
    //

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

        return Long.parseLong(
                value.toString()
        );
    }
}