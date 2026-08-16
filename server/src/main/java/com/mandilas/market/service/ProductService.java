package com.mandilas.market.service;

import com.mandilas.market.model.Product;
import com.mandilas.market.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(
            ProductRepository productRepository
    ) {
        this.productRepository = productRepository;
    }

    // =========================================================
    // GET ALL PRODUCTS
    // =========================================================

    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    // =========================================================
    // GET PRODUCT BY ID
    // =========================================================

    public Optional<Product> getProductById(
            Long id
    ) {

        return productRepository.findById(id);
    }

    // =========================================================
    // CREATE PRODUCT
    // =========================================================

    public Product createProduct(
            Product product
    ) {

        if (product == null) {

            throw new RuntimeException(
                    "Product data is required"
            );
        }

        if (
                product.getSellerEmail() == null ||
                product.getSellerEmail().isBlank()
        ) {

            throw new RuntimeException(
                    "Authenticated seller is required"
            );
        }

        if (
                product.getDepartment() == null ||
                product.getDepartment().isBlank()
        ) {

            throw new RuntimeException(
                    "Department is required"
            );
        }

        if (
                product.getCategory() == null ||
                product.getCategory().isBlank()
        ) {

            throw new RuntimeException(
                    "Category is required"
            );
        }

        return productRepository.save(product);
    }

    // =========================================================
    // UPDATE PRODUCT
    // =========================================================

    public Product updateProduct(
            Long id,
            Product updatedProduct,
            String authenticatedSellerEmail
    ) {

        if (
                authenticatedSellerEmail == null ||
                authenticatedSellerEmail.isBlank()
        ) {

            throw new RuntimeException(
                    "Authenticated seller is required"
            );
        }

        Product existingProduct =
                productRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Product not found"
                                        )
                        );

        // =====================================================
        // OWNERSHIP CHECK
        // =====================================================

        if (
                existingProduct.getSellerEmail() == null ||
                !existingProduct
                        .getSellerEmail()
                        .equalsIgnoreCase(
                                authenticatedSellerEmail
                        )
        ) {

            throw new RuntimeException(
                    "You are not authorized to update this product"
            );
        }

        if (updatedProduct == null) {

            throw new RuntimeException(
                    "Updated product data is required"
            );
        }

        // =====================================================
        // PRODUCT INFORMATION
        // =====================================================

        existingProduct.setName(
                updatedProduct.getName()
        );

        existingProduct.setDescription(
                updatedProduct.getDescription()
        );

        existingProduct.setPrice(
                updatedProduct.getPrice()
        );

        existingProduct.setStock(
                updatedProduct.getStock()
        );

        // =====================================================
        // DEPARTMENT
        // =====================================================

        existingProduct.setDepartment(
                updatedProduct.getDepartment()
        );

        // =====================================================
        // CATEGORY
        // =====================================================

        existingProduct.setCategory(
                updatedProduct.getCategory()
        );

        // =====================================================
        // SUBCATEGORY
        // =====================================================

        existingProduct.setSubcategory(
                updatedProduct.getSubcategory()
        );

        // =====================================================
        // ADDITIONAL INFORMATION
        // =====================================================

        existingProduct.setBrand(
                updatedProduct.getBrand()
        );

        existingProduct.setSku(
                updatedProduct.getSku()
        );

        existingProduct.setDiscountPrice(
                updatedProduct.getDiscountPrice()
        );

        existingProduct.setWeight(
                updatedProduct.getWeight()
        );

        existingProduct.setDeliveryTime(
                updatedProduct.getDeliveryTime()
        );

        existingProduct.setStatus(
                updatedProduct.getStatus()
        );

        existingProduct.setSpecifications(
                updatedProduct.getSpecifications()
        );

        // =====================================================
        // MEDIA
        // =====================================================

        /*
         * Only replace the image URL if the frontend actually
         * provides a new value.
         */

        if (
                updatedProduct.getImageUrl() != null &&
                !updatedProduct.getImageUrl().isBlank()
        ) {

            existingProduct.setImageUrl(
                    updatedProduct.getImageUrl()
            );
        }

        /*
         * Only replace the video URL if the frontend actually
         * provides a new value.
         */

        if (
                updatedProduct.getVideoUrl() != null &&
                !updatedProduct.getVideoUrl().isBlank()
        ) {

            existingProduct.setVideoUrl(
                    updatedProduct.getVideoUrl()
            );
        }

        /*
         * DO NOT copy:
         *
         * sellerEmail
         * sellerName
         * id
         * createdAt
         *
         * from the frontend.
         *
         * Product ownership remains unchanged.
         */

        return productRepository.save(
                existingProduct
        );
    }

    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    public void deleteProduct(
            Long id,
            String authenticatedSellerEmail
    ) {

        if (
                authenticatedSellerEmail == null ||
                authenticatedSellerEmail.isBlank()
        ) {

            throw new RuntimeException(
                    "Authenticated seller is required"
            );
        }

        Product existingProduct =
                productRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Product not found"
                                        )
                        );

        // =====================================================
        // OWNERSHIP CHECK
        // =====================================================

        if (
                existingProduct.getSellerEmail() == null ||
                !existingProduct
                        .getSellerEmail()
                        .equalsIgnoreCase(
                                authenticatedSellerEmail
                        )
        ) {

            throw new RuntimeException(
                    "You are not authorized to delete this product"
            );
        }

        productRepository.delete(
                existingProduct
        );
    }

    // =========================================================
    // GET SELLER PRODUCTS
    // =========================================================

    public List<Product> getProductsBySeller(
            String sellerEmail
    ) {

        if (
                sellerEmail == null ||
                sellerEmail.isBlank()
        ) {

            throw new RuntimeException(
                    "Authenticated seller is required"
            );
        }

        return productRepository
                .findBySellerEmailIgnoreCaseOrderByCreatedAtDesc(
                        sellerEmail
                );
    }

    // =========================================================
    // GET PRODUCTS BY DEPARTMENT
    // =========================================================

    public List<Product> getProductsByDepartment(
            String department
    ) {

        return productRepository
                .findByDepartmentIgnoreCaseOrderByCreatedAtDesc(
                        department
                );
    }

    // =========================================================
    // GET PRODUCTS BY DEPARTMENT + CATEGORY
    // =========================================================

    public List<Product>
    getProductsByDepartmentAndCategory(
            String department,
            String category
    ) {

        return productRepository
                .findByDepartmentIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc(
                        department,
                        category
                );
    }

    // =========================================================
    // GET PRODUCTS BY DEPARTMENT + CATEGORY + SUBCATEGORY
    // =========================================================

    public List<Product>
    getProductsByDepartmentAndCategoryAndSubcategory(
            String department,
            String category,
            String subcategory
    ) {

        return productRepository
                .findByDepartmentIgnoreCaseAndCategoryIgnoreCaseAndSubcategoryIgnoreCaseOrderByCreatedAtDesc(
                        department,
                        category,
                        subcategory
                );
    }

    // =========================================================
    // GET PRODUCTS BY CATEGORY
    // =========================================================

    public List<Product> getProductsByCategory(
            String category
    ) {

        return productRepository
                .findByCategoryIgnoreCaseOrderByCreatedAtDesc(
                        category
                );
    }

    // =========================================================
    // GET PRODUCTS BY CATEGORY + SUBCATEGORY
    // =========================================================

    public List<Product>
    getProductsByCategoryAndSubcategory(
            String category,
            String subcategory
    ) {

        return productRepository
                .findByCategoryIgnoreCaseAndSubcategoryIgnoreCaseOrderByCreatedAtDesc(
                        category,
                        subcategory
                );
    }

    // =========================================================
    // GET PRODUCTS BY SUBCATEGORY
    // =========================================================

    public List<Product> getProductsBySubcategory(
            String subcategory
    ) {

        return productRepository
                .findBySubcategoryIgnoreCaseOrderByCreatedAtDesc(
                        subcategory
                );
    }

    // =========================================================
    // SEARCH PRODUCTS
    // =========================================================
    //
    // Searches:
    //
    // Product name
    // Department
    // Category
    // Subcategory
    // Brand
    // Description
    //
    // =========================================================

    public List<Product> searchProducts(
            String searchTerm
    ) {

        if (
                searchTerm == null ||
                searchTerm.trim().isEmpty()
        ) {

            return productRepository
                    .findAll();
        }

        String term =
                searchTerm.trim();

        return productRepository
                .findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrSubcategoryContainingIgnoreCaseOrBrandContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrderByCreatedAtDesc(
                        term,
                        term,
                        term,
                        term,
                        term,
                        term
                );
    }
}