package com.mandilas.market.controller;

import org.springframework.security.core.Authentication;

import com.mandilas.market.model.Order;
import com.mandilas.market.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /*
     * Create a new order
     */
    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody Order order
    ) {

        try {

            Order savedOrder =
                    orderService.createOrder(order);

            return ResponseEntity.ok(savedOrder);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to create order: "
                                    + e.getMessage()
                    );
        }
    }

    /*
     * Get all orders
     */
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    /*
     * Get one order
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id
    ) {

        try {

            return ResponseEntity.ok(
                    orderService.getOrderById(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    /*
     * Get orders belonging to a customer
     */
    @GetMapping("/customer/{email}")
    public ResponseEntity<List<Order>> getOrdersByEmail(
            @PathVariable String email
    ) {

        return ResponseEntity.ok(
                orderService.getOrdersByEmail(email)
        );
    }

    /*
     * Get orders belonging to a seller.
     *
     * The seller is identified by seller email.
     */
    @GetMapping("/seller") public ResponseEntity<?> getOrdersBySellerEmail(Authentication authentication) { String email = authentication != null ? authentication.getName() : null;

        try {

            if (email == null || email.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Seller email is required");
            }

            return ResponseEntity.ok(
                    orderService.getOrdersBySellerEmail(email)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to fetch seller orders: "
                                    + e.getMessage()
                    );
        }
    }

    /*
     * Get orders by order status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(
            @PathVariable String status
    ) {

        return ResponseEntity.ok(
                orderService.getOrdersByStatus(status)
        );
    }

    /*
     * Get orders by payment status
     */
    @GetMapping("/payment-status/{status}")
    public ResponseEntity<List<Order>> getOrdersByPaymentStatus(
            @PathVariable String status
    ) {

        return ResponseEntity.ok(
                orderService.getOrdersByPaymentStatus(status)
        );
    }

    /*
     * Update order status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {

        try {

            return ResponseEntity.ok(
                    orderService.updateOrderStatus(
                            id,
                            status
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    /*
     * Update payment status
     */
    @PutMapping("/{id}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {

        try {

            return ResponseEntity.ok(
                    orderService.updatePaymentStatus(
                            id,
                            status
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    /*
     * Delete order
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(
            @PathVariable Long id
    ) {

        try {

            orderService.deleteOrder(id);

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }
}

