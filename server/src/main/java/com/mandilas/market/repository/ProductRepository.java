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
    // DEPARTMENT
    // =========================================================

    List<Product> findByDepartmentIgnoreCase(
            String department
    );

    List<Product> findByDepartmentIgnoreCaseOrderByCreatedAtDesc(
            String department
    );

    // =========================================================
    // DEPARTMENT + CATEGORY
    // =========================================================

    List<Product>
    findByDepartmentIgnoreCaseAndCategoryIgnoreCase(
            String department,
            String category
    );

    List<Product>
    findByDepartmentIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc(
            String department,
            String category
    );

    // =========================================================
    // DEPARTMENT + CATEGORY + SUBCATEGORY
    // =========================================================

    List<Product>
    findByDepartmentIgnoreCaseAndCategoryIgnoreCaseAndSubcategoryIgnoreCase(
            String department,
            String category,
            String subcategory
    );

    List<Product>
    findByDepartmentIgnoreCaseAndCategoryIgnoreCaseAndSubcategoryIgnoreCaseOrderByCreatedAtDesc(
            String department,
            String category,
            String subcategory
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
    // SEARCH
    // =========================================================
    //
    // Searches:
    //
    // name
    // department
    // category
    // subcategory
    // brand
    // description
    //
    // =========================================================

    List<Product>
    findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrSubcategoryContainingIgnoreCaseOrBrandContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name,
            String department,
            String category,
            String subcategory,
            String brand,
            String description
    );

    List<Product>
    findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrSubcategoryContainingIgnoreCaseOrBrandContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrderByCreatedAtDesc(
            String name,
            String department,
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
    findByDepartmentIgnoreCaseAndStatusIgnoreCase(
            String department,
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
    // DEPARTMENT + PRICE
    // =========================================================

    List<Product>
    findByDepartmentIgnoreCaseAndPriceBetween(
            String department,
            double minimumPrice,
            double maximumPrice
    );

    List<Product>
    findByDepartmentIgnoreCaseAndPriceBetweenOrderByCreatedAtDesc(
            String department,
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
    // SELLER + DEPARTMENT
    // =========================================================

    List<Product>
    findBySellerEmailIgnoreCaseAndDepartmentIgnoreCase(
            String sellerEmail,
            String department
    );

    List<Product>
    findBySellerEmailIgnoreCaseAndDepartmentIgnoreCaseOrderByCreatedAtDesc(
            String sellerEmail,
            String department
    );

    // =========================================================
    // SELLER + DEPARTMENT + CATEGORY
    // =========================================================

    List<Product>
    findBySellerEmailIgnoreCaseAndDepartmentIgnoreCaseAndCategoryIgnoreCase(
            String sellerEmail,
            String department,
            String category
    );

    List<Product>
    findBySellerEmailIgnoreCaseAndDepartmentIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc(
            String sellerEmail,
            String department,
            String category
    );

    // =========================================================
    // SELLER + DEPARTMENT + CATEGORY + SUBCATEGORY
    // =========================================================

    List<Product>
    findBySellerEmailIgnoreCaseAndDepartmentIgnoreCaseAndCategoryIgnoreCaseAndSubcategoryIgnoreCase(
            String sellerEmail,
            String department,
            String category,
            String subcategory
    );

    List<Product>
    findBySellerEmailIgnoreCaseAndDepartmentIgnoreCaseAndCategoryIgnoreCaseAndSubcategoryIgnoreCaseOrderByCreatedAtDesc(
            String sellerEmail,
            String department,
            String category,
            String subcategory
    );

    // =========================================================
    // EXISTING SELLER + CATEGORY
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