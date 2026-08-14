package com.mandilas.market.controller;

import org.springframework.security.core.Authentication;

import com.mandilas.market.model.Product;
import com.mandilas.market.service.CloudinaryService;
import com.mandilas.market.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://mandilas-market.vercel.app"
})
public class ProductController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;

    public ProductController(
            ProductService productService,
            CloudinaryService cloudinaryService
    ) {
        this.productService = productService;
        this.cloudinaryService = cloudinaryService;
    }

    // =========================
    // GET ALL PRODUCTS
    // =========================

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }

    // =========================
    // GET PRODUCT BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id
    ) {

        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // CREATE PRODUCT
    // =========================

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createProduct(

            @RequestParam("name")
            String name,

            @RequestParam("description")
            String description,

            @RequestParam("price")
            double price,

            @RequestParam("stock")
            int stock,

            @RequestParam("category")
            String category,

            @RequestParam(
                    value = "subcategory",
                    required = false
            )
            String subcategory,

            @RequestParam(
                    value = "brand",
                    required = false
            )
            String brand,

            @RequestParam(
                    value = "sku",
                    required = false
            )
            String sku,

            @RequestParam(
                    value = "discountPrice",
                    required = false,
                    defaultValue = "0"
            )
            double discountPrice,

            @RequestParam(
                    value = "weight",
                    required = false
            )
            String weight,

            @RequestParam(
                    value = "deliveryTime",
                    required = false
            )
            String deliveryTime,

            @RequestParam(
                    value = "status",
                    required = false,
                    defaultValue = "In Stock"
            )
            String status,

            @RequestParam(
                    value = "specifications",
                    required = false
            )
            String specifications,

            @RequestParam("sellerEmail")
            String sellerEmail,

            @RequestParam(
                    value = "sellerName",
                    required = false
            )
            String sellerName,

            @RequestParam(
                    value = "images",
                    required = false
            )
            MultipartFile[] images,

            @RequestParam(
                    value = "video",
                    required = false
            )
            MultipartFile video
    ) {

        try {

            Product product = new Product();

            // Product information
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStock(stock);

            // Category
            product.setCategory(category);
            product.setSubcategory(subcategory);

            // Other product information
            product.setBrand(brand);
            product.setSku(sku);
            product.setDiscountPrice(discountPrice);
            product.setWeight(weight);
            product.setDeliveryTime(deliveryTime);
            product.setStatus(status);
            product.setSpecifications(specifications);

            // Seller information
            product.setSellerEmail(sellerEmail);
            product.setSellerName(sellerName);

            // =========================
            // UPLOAD PRODUCT IMAGE
            // =========================

            if (images != null && images.length > 0) {

                for (MultipartFile image : images) {

                    if (image != null && !image.isEmpty()) {

                        String imageUrl =
                                cloudinaryService.uploadImage(image);

                        product.setImageUrl(imageUrl);

                        /*
                         * Product currently stores
                         * one main image.
                         */
                        break;
                    }
                }
            }

            // =========================
            // UPLOAD PRODUCT VIDEO
            // =========================

            if (video != null && !video.isEmpty()) {

                String videoUrl =
                        cloudinaryService.uploadVideo(video);

                product.setVideoUrl(videoUrl);
            }

            // =========================
            // SAVE PRODUCT
            // =========================

            Product savedProduct =
                    productService.createProduct(product);

            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Product upload failed: "
                                    + e.getMessage()
                    );
        }
    }

    // =========================
    // UPDATE PRODUCT
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {

        try {

            Product updatedProduct =
                    productService.updateProduct(
                            id,
                            product
                    );

            return ResponseEntity.ok(updatedProduct);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // =========================
    // DELETE PRODUCT
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id
    ) {

        try {

            productService.deleteProduct(id);

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // =========================
    // SELLER PRODUCTS
    // =========================

    @GetMapping("/seller") public ResponseEntity<List<Product>> getSellerProducts(Authentication authentication) { if (authentication == null || authentication.getName() == null) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); } return ResponseEntity.ok(productService.getProductsBySeller(authentication.getName())); }

    // =========================
    // PRODUCTS BY CATEGORY
    // =========================

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                productService.getProductsByCategory(
                        category
                )
        );
    }

    // =========================
    // PRODUCTS BY CATEGORY
    // AND SUBCATEGORY
    // =========================

    @GetMapping(
            "/category/{category}/subcategory/{subcategory}"
    )
    public ResponseEntity<List<Product>> getProductsByCategoryAndSubcategory(

            @PathVariable String category,

            @PathVariable String subcategory

    ) {

        return ResponseEntity.ok(
                productService.getProductsByCategoryAndSubcategory(
                        category,
                        subcategory
                )
        );
    }

    // =========================
    // PRODUCTS BY SUBCATEGORY
    // =========================

    @GetMapping("/subcategory/{subcategory}")
    public ResponseEntity<List<Product>> getProductsBySubcategory(
            @PathVariable String subcategory
    ) {

        return ResponseEntity.ok(
                productService.getProductsBySubcategory(
                        subcategory
                )
        );
    }

    // =========================
    // SEARCH PRODUCTS
    // =========================

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam String name
    ) {

        return ResponseEntity.ok(
                productService.searchProducts(name)
        );
    }
}

