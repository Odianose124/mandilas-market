package com.mandilas.market.service;

import com.mandilas.market.model.Product;
import com.mandilas.market.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /*
     * Get all products.
     */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /*
     * Get one product by ID.
     */
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    /*
     * Create a new product.
     */
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    /*
     * Update an existing product.
     */
    public Product updateProduct(
            Long id,
            Product updatedProduct
    ) {

        Product existingProduct =
                productRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Product not found"
                                )
                        );

        // =========================
        // PRODUCT INFORMATION
        // =========================

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

        // =========================
        // CATEGORY INFORMATION
        // =========================

        existingProduct.setCategory(
                updatedProduct.getCategory()
        );

        existingProduct.setSubcategory(
                updatedProduct.getSubcategory()
        );

        // =========================
        // ADDITIONAL PRODUCT INFORMATION
        // =========================

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

        // =========================
        // MEDIA
        // =========================

        existingProduct.setImageUrl(
                updatedProduct.getImageUrl()
        );

        existingProduct.setVideoUrl(
                updatedProduct.getVideoUrl()
        );

        // =========================
        // SELLER INFORMATION
        // =========================

        existingProduct.setSellerEmail(
                updatedProduct.getSellerEmail()
        );

        existingProduct.setSellerName(
                updatedProduct.getSellerName()
        );

        return productRepository.save(existingProduct);
    }

    /*
     * Delete product.
     */
    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {

            throw new RuntimeException(
                    "Product not found"
            );
        }

        productRepository.deleteById(id);
    }

    /*
     * Get products belonging to a seller.
     */
    public List<Product> getProductsBySeller(
            String sellerEmail
    ) {

        return productRepository.findBySellerEmail(
                sellerEmail
        );
    }

    /*
     * Get products by main category.
     */
    public List<Product> getProductsByCategory(
            String category
    ) {

        return productRepository.findByCategoryIgnoreCase(
                category
        );
    }

    /*
     * Get products by category AND subcategory.
     */
    public List<Product> getProductsByCategoryAndSubcategory(
            String category,
            String subcategory
    ) {

        return productRepository
                .findByCategoryIgnoreCaseAndSubcategoryIgnoreCase(
                        category,
                        subcategory
                );
    }

    /*
     * Get products by subcategory.
     */
    public List<Product> getProductsBySubcategory(
            String subcategory
    ) {

        return productRepository
                .findBySubcategoryIgnoreCase(
                        subcategory
                );
    }

    /*
     * Search products.
     *
     * Searches through:
     * - Product name
     * - Category
     * - Subcategory
     * - Brand
     */
    public List<Product> searchProducts(
            String searchTerm
    ) {

        if (searchTerm == null ||
                searchTerm.trim().isEmpty()) {

            return productRepository.findAll();
        }

        String term = searchTerm.trim();

        return productRepository
                .findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrSubcategoryContainingIgnoreCaseOrBrandContainingIgnoreCase(
                        term,
                        term,
                        term,
                        term
                );
    }
}