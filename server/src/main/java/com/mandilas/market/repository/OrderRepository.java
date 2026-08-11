package com.mandilas.market.repository;

import com.mandilas.market.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByEmail(String email);

    List<Order> findByOrderStatus(String orderStatus);

    List<Order> findByPaymentStatus(String paymentStatus);

    /*
     * Find all orders that contain at least one
     * OrderItem belonging to the specified seller.
     *
     * DISTINCT prevents the same order from appearing
     * multiple times when the seller has multiple products
     * in one order.
     */
    List<Order> findDistinctByItemsSellerEmail(String sellerEmail);
}