package com.mandilas.market.controller;

import com.mandilas.market.model.Order;
import com.mandilas.market.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    /*
     * =========================================================
     * CREATE A NEW ORDER
     * =========================================================
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
     * =========================================================
     * GET ALL ORDERS
     * =========================================================
     */
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }


    /*
     * =========================================================
     * GET ONE ORDER
     * =========================================================
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
     * =========================================================
     * GET CUSTOMER ORDERS
     * =========================================================
     *
     * No JWT.
     * No Authentication object.
     *
     * Request:
     *
     * GET /api/orders/customer/{email}
     *
     * =========================================================
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
     * =========================================================
     * GET SELLER ORDERS
     * =========================================================
     *
     * NO JWT.
     * NO Authentication object.
     *
     * Seller identity comes from the simple frontend
     * localStorage session.
     *
     * Frontend request:
     *
     * GET /api/orders/seller?email=seller@email.com
     *
     * =========================================================
     */
    @GetMapping("/seller")
    public ResponseEntity<?> getOrdersBySeller(
            @RequestParam String email
    ) {

        try {

            if (
                    email == null ||
                    email.trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Seller email is required."
                        );
            }

            String sellerEmail =
                    email
                            .trim()
                            .toLowerCase();

            return ResponseEntity.ok(
                    orderService.getOrdersBySellerEmail(
                            sellerEmail
                    )
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
     * =========================================================
     * SELLER ORDERS COMPATIBILITY ROUTE
     * =========================================================
     *
     * NO JWT.
     * NO Authentication.
     *
     * Kept so older frontend code can still work.
     *
     * Request:
     *
     * GET /api/orders/seller/{email}
     *
     * =========================================================
     */
    @GetMapping("/seller/{email}")
    public ResponseEntity<?> getOrdersBySellerEmail(
            @PathVariable String email
    ) {

        try {

            if (
                    email == null ||
                    email.trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Seller email is required."
                        );
            }

            String sellerEmail =
                    email
                            .trim()
                            .toLowerCase();

            return ResponseEntity.ok(
                    orderService.getOrdersBySellerEmail(
                            sellerEmail
                    )
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
     * =========================================================
     * GET ORDERS BY ORDER STATUS
     * =========================================================
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
     * =========================================================
     * GET ORDERS BY PAYMENT STATUS
     * =========================================================
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
     * =========================================================
     * UPDATE ORDER STATUS
     * =========================================================
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
     * =========================================================
     * UPDATE PAYMENT STATUS
     * =========================================================
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
     * =========================================================
     * DELETE ORDER
     * =========================================================
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