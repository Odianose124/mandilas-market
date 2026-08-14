package com.mandilas.market.repository;

import com.mandilas.market.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    // =========================================================
    // SELLER PRODUCTS
    // =========================================================

    List<Product> findBySellerEmail(
            String sellerEmail
    );

    List<Product> findBySellerEmailIgnoreCase(
            String sellerEmail
    );

    List<Product> findBySellerEmailIgnoreCaseOrderByCreatedAtDesc(
            String sellerEmail
    );

    List<Product> findBySellerEmailOrderByCreatedAtDesc(
            String sellerEmail
    );


    // =========================================================
    // CATEGORY
    // =========================================================

    List<Product> findByCategoryIgnoreCase(
            String category
    );

    List<Product> findByCategoryIgnoreCaseOrderByCreatedAtDesc(
            String category
    );


    // =========================================================
    // CATEGORY + SUBCATEGORY
    // =========================================================

    List<Product>
    findByCategoryIgnoreCaseAndSubcategoryIgnoreCase(
            String category,
            String subcategory
    );

    List<Product>
    findByCategoryIgnoreCaseAndSubcategoryIgnoreCaseOrderByCreatedAtDesc(
            String category,
            String subcategory
    );


    // =========================================================
    // SUBCATEGORY
    // =========================================================

    List<Product> findBySubcategoryIgnoreCase(
            String subcategory
    );

    List<Product>
    findBySubcategoryIgnoreCaseOrderByCreatedAtDesc(
            String subcategory
    );


    // =========================================================
    // BRAND
    // =========================================================

    List<Product> findByBrandIgnoreCase(
            String brand
    );

    List<Product>
    findByBrandIgnoreCaseOrderByCreatedAtDesc(
            String brand
    );


    // =========================================================
    // BASIC SEARCH
    // =========================================================

    List<Product> findByNameContainingIgnoreCase(
            String name
    );

    List<Product>
    findByNameContainingIgnoreCaseOrderByCreatedAtDesc(
            String name
    );


    // =========================================================
    // COMPATIBILITY SEARCH
    // =========================================================

    /*
     * Kept because ProductService currently uses this
     * four-field search method.
     *
     * Searches:
     * - Product name
     * - Category
     * - Subcategory
     * - Brand
     */
    List<Product>
    findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrSubcategoryContainingIgnoreCaseOrBrandContainingIgnoreCase(
            String name,
            String category,
            String subcategory,
            String brand
    );


    // =========================================================
    // ADVANCED MARKETPLACE SEARCH
    // =========================================================

    /*
     * Searches:
     * - Product name
     * - Category
     * - Subcategory
     * - Brand
     * - Description
     */
    List<Product>
    findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrSubcategoryContainingIgnoreCaseOrBrandContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name,
            String category,
            String subcategory,
            String brand,
            String description
    );


    /*
     * Advanced marketplace search,
     * newest products first.
     */
    List<Product>
    findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrSubcategoryContainingIgnoreCaseOrBrandContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrderByCreatedAtDesc(
            String name,
            String category,
            String subcategory,
            String brand,
            String description
    );


    // =========================================================
    // STOCK / AVAILABILITY
    // =========================================================

    List<Product> findByStatusIgnoreCase(
            String status
    );

    List<Product>
    findByCategoryIgnoreCaseAndStatusIgnoreCase(
            String category,
            String status
    );

    List<Product>
    findBySubcategoryIgnoreCaseAndStatusIgnoreCase(
            String subcategory,
            String status
    );


    // =========================================================
    // PRICE FILTERING
    // =========================================================

    List<Product> findByPriceBetween(
            double minimumPrice,
            double maximumPrice
    );

    List<Product>
    findByPriceBetweenOrderByCreatedAtDesc(
            double minimumPrice,
            double maximumPrice
    );


    // =========================================================
    // CATEGORY + PRICE
    // =========================================================

    List<Product>
    findByCategoryIgnoreCaseAndPriceBetween(
            String category,
            double minimumPrice,
            double maximumPrice
    );

    List<Product>
    findByCategoryIgnoreCaseAndPriceBetweenOrderByCreatedAtDesc(
            String category,
            double minimumPrice,
            double maximumPrice
    );


    // =========================================================
    // SELLER + CATEGORY
    // =========================================================

    List<Product>
    findBySellerEmailIgnoreCaseAndCategoryIgnoreCase(
            String sellerEmail,
            String category
    );

    List<Product>
    findBySellerEmailIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc(
            String sellerEmail,
            String category
    );

    List<Product>
    findBySellerEmailIgnoreCaseAndCategoryIgnoreCaseAndSubcategoryIgnoreCase(
            String sellerEmail,
            String category,
            String subcategory
    );

    List<Product>
    findBySellerEmailIgnoreCaseAndCategoryIgnoreCaseAndSubcategoryIgnoreCaseOrderByCreatedAtDesc(
            String sellerEmail,
            String category,
            String subcategory
    );


    // =========================================================
    // SKU
    // =========================================================

    Optional<Product> findBySkuIgnoreCase(
            String sku
    );

    boolean existsBySkuIgnoreCase(
            String sku
    );
}