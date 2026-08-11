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

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setCategory(updatedProduct.getCategory());

        existingProduct.setBrand(updatedProduct.getBrand());
        existingProduct.setSku(updatedProduct.getSku());
        existingProduct.setDiscountPrice(updatedProduct.getDiscountPrice());
        existingProduct.setWeight(updatedProduct.getWeight());
        existingProduct.setDeliveryTime(updatedProduct.getDeliveryTime());
        existingProduct.setStatus(updatedProduct.getStatus());
        existingProduct.setSpecifications(updatedProduct.getSpecifications());

        existingProduct.setImageUrl(updatedProduct.getImageUrl());
        existingProduct.setVideoUrl(updatedProduct.getVideoUrl());

        existingProduct.setSellerEmail(updatedProduct.getSellerEmail());
        existingProduct.setSellerName(updatedProduct.getSellerName());

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }

        productRepository.deleteById(id);
    }

    public List<Product> getProductsBySeller(String sellerEmail) {
        return productRepository.findBySellerEmail(sellerEmail);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
}