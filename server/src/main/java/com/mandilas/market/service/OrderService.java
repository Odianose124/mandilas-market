package com.mandilas.market.service;

import com.mandilas.market.model.Order;
import com.mandilas.market.model.OrderItem;
import com.mandilas.market.repository.OrderRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }


    /*
     * =========================================================
     * CREATE A NEW ORDER
     * =========================================================
     */
    public Order createOrder(Order order) {

        if (
                order.getItems() == null ||
                order.getItems().isEmpty()
        ) {

            throw new RuntimeException(
                    "Order must contain at least one product"
            );
        }


        /*
         * Make sure every OrderItem points back to
         * this Order.
         */
        for (OrderItem item : order.getItems()) {

            item.setOrder(order);
        }


        /*
         * Calculate each item's total.
         */
        for (OrderItem item : order.getItems()) {

            double itemTotal =
                    item.getPrice()
                            * item.getQuantity();

            item.setTotal(itemTotal);
        }


        /*
         * Calculate subtotal.
         */
        double subtotal =
                order.getItems()
                        .stream()
                        .mapToDouble(
                                OrderItem::getTotal
                        )
                        .sum();

        order.setSubtotal(subtotal);


        /*
         * Calculate final order total.
         */
        double total =
                order.getSubtotal()
                        + order.getDeliveryFee();

        order.setTotal(total);


        /*
         * Default payment status.
         */
        if (
                order.getPaymentStatus() == null ||
                order.getPaymentStatus().isBlank()
        ) {

            order.setPaymentStatus("Pending");
        }


        /*
         * Default order status.
         */
        if (
                order.getOrderStatus() == null ||
                order.getOrderStatus().isBlank()
        ) {

            order.setOrderStatus("Pending");
        }


        return orderRepository.save(order);
    }


    /*
     * =========================================================
     * GET ALL ORDERS
     * =========================================================
     */
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }


    /*
     * =========================================================
     * GET ONE ORDER
     * =========================================================
     */
    public Order getOrderById(Long id) {

        return orderRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Order not found"
                        )
                );
    }


    /*
     * =========================================================
     * GET CUSTOMER ORDERS
     * =========================================================
     */
    public List<Order> getOrdersByEmail(
            String email
    ) {

        return orderRepository.findByEmail(email);
    }


    /*
     * =========================================================
     * GET SELLER ORDERS
     *
     * Seller orders are found through
     * OrderItem.sellerEmail.
     * =========================================================
     */
    public List<Order> getOrdersBySellerEmail(
            String sellerEmail
    ) {

        if (
                sellerEmail == null ||
                sellerEmail.isBlank()
        ) {

            throw new RuntimeException(
                    "Seller email is required"
            );
        }

        return orderRepository
                .findDistinctByItemsSellerEmail(
                        sellerEmail
                );
    }


    /*
     * =========================================================
     * GET ORDERS BY ORDER STATUS
     * =========================================================
     */
    public List<Order> getOrdersByStatus(
            String orderStatus
    ) {

        return orderRepository
                .findByOrderStatus(
                        orderStatus
                );
    }


    /*
     * =========================================================
     * GET ORDERS BY PAYMENT STATUS
     * =========================================================
     */
    public List<Order> getOrdersByPaymentStatus(
            String paymentStatus
    ) {

        return orderRepository
                .findByPaymentStatus(
                        paymentStatus
                );
    }


    /*
     * =========================================================
     * UPDATE ORDER STATUS
     * =========================================================
     */
    public Order updateOrderStatus(
            Long id,
            String orderStatus
    ) {

        Order order =
                getOrderById(id);

        order.setOrderStatus(
                orderStatus
        );

        return orderRepository.save(order);
    }


    /*
     * =========================================================
     * UPDATE PAYMENT STATUS
     * =========================================================
     */
    public Order updatePaymentStatus(
            Long id,
            String paymentStatus
    ) {

        Order order =
                getOrderById(id);

        order.setPaymentStatus(
                paymentStatus
        );

        return orderRepository.save(order);
    }


    /*
     * =========================================================
     * DELETE ORDER
     * =========================================================
     */
    public void deleteOrder(Long id) {

        if (
                !orderRepository.existsById(id)
        ) {

            throw new RuntimeException(
                    "Order not found"
            );
        }

        orderRepository.deleteById(id);
    }
}