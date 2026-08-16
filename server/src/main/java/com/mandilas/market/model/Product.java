package com.mandilas.market.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // PRODUCT INFORMATION
    // =========================================================

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int stock;


    // =========================================================
    // PRODUCT CLASSIFICATION
    // =========================================================

    /*
     * Top-level product department.
     *
     * Examples:
     *
     * Fashion
     * Electronics
     * Phones & Tablets
     * Home & Kitchen
     * Beauty & Personal Care
     */
    @Column(nullable = false, length = 255)
    private String department;


    /*
     * Main product category.
     *
     * Examples:
     *
     * Men's Wear
     * Women's Wear
     * Shoes
     * Electronics
     * Phones & Tablets
     */
    @Column(nullable = false, length = 255)
    private String category;


    /*
     * Product subcategory.
     *
     * Examples:
     *
     * Fashion
     *   -> Men's Wear
     *      -> Shirts
     *
     * Fashion
     *   -> Men's Wear
     *      -> Trousers
     *
     * Fashion
     *   -> Women's Wear
     *      -> Dresses
     *
     * Fashion
     *   -> Shoes
     *      -> Sneakers
     */
    @Column(length = 255)
    private String subcategory;


    // =========================================================
    // ADDITIONAL PRODUCT INFORMATION
    // =========================================================

    @Column(length = 255)
    private String brand;

    @Column(length = 255)
    private String sku;

    @Column(nullable = false)
    private double discountPrice;

    @Column(length = 255)
    private String weight;

    @Column(length = 255)
    private String deliveryTime;

    @Column(length = 50)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String specifications;


    // =========================================================
    // MEDIA
    // =========================================================

    /*
     * Main product image.
     */
    @Column(length = 2000)
    private String imageUrl;


    /*
     * Product video.
     */
    @Column(length = 2000)
    private String videoUrl;


    // =========================================================
    // SELLER INFORMATION
    // =========================================================

    /*
     * Seller identity comes from the authenticated JWT.
     */
    @Column(nullable = false)
    private String sellerEmail;


    @Column(length = 255)
    private String sellerName;


    // =========================================================
    // DATE
    // =========================================================

    @Column(nullable = false)
    private LocalDateTime createdAt;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public Product() {
    }


    // =========================================================
    // CREATE DATE
    // =========================================================

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();
    }


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }


    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }


    // =========================================================
    // DEPARTMENT
    // =========================================================

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }


    // =========================================================
    // CATEGORY
    // =========================================================

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    // =========================================================
    // SUBCATEGORY
    // =========================================================

    public String getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }


    // =========================================================
    // ADDITIONAL INFORMATION
    // =========================================================

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }


    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }


    public double getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(double discountPrice) {
        this.discountPrice = discountPrice;
    }


    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }


    public String getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(String deliveryTime) {
        this.deliveryTime = deliveryTime;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public String getSpecifications() {
        return specifications;
    }

    public void setSpecifications(String specifications) {
        this.specifications = specifications;
    }


    // =========================================================
    // MEDIA
    // =========================================================

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }


    // =========================================================
    // SELLER
    // =========================================================

    public String getSellerEmail() {
        return sellerEmail;
    }

    public void setSellerEmail(String sellerEmail) {
        this.sellerEmail = sellerEmail;
    }


    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }


    // =========================================================
    // CREATED AT
    // =========================================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}