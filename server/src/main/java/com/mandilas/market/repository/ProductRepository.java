package com.mandilas.market.repository;

import com.mandilas.market.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySellerEmail(String sellerEmail);

    List<Product> findByCategory(String category);

    List<Product> findByNameContainingIgnoreCase(String name);
}