package com.mandilas.market.controller;

import com.mandilas.market.model.Product;
import com.mandilas.market.service.CloudinaryService;
import com.mandilas.market.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
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

    // Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Get one product
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id
    ) {

        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create product with image and video upload
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

            @RequestParam(value = "brand", required = false)
            String brand,

            @RequestParam(value = "sku", required = false)
            String sku,

            @RequestParam(value = "discountPrice", required = false, defaultValue = "0")
            double discountPrice,

            @RequestParam(value = "weight", required = false)
            String weight,

            @RequestParam(value = "deliveryTime", required = false)
            String deliveryTime,

            @RequestParam(value = "status", required = false, defaultValue = "In Stock")
            String status,

            @RequestParam(value = "specifications", required = false)
            String specifications,

            @RequestParam("sellerEmail")
            String sellerEmail,

            @RequestParam(value = "sellerName", required = false)
            String sellerName,

            @RequestParam(value = "images", required = false)
            MultipartFile[] images,

            @RequestParam(value = "video", required = false)
            MultipartFile video
    ) {

        try {

            Product product = new Product();

            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStock(stock);
            product.setCategory(category);

            product.setBrand(brand);
            product.setSku(sku);
            product.setDiscountPrice(discountPrice);
            product.setWeight(weight);
            product.setDeliveryTime(deliveryTime);
            product.setStatus(status);
            product.setSpecifications(specifications);

            product.setSellerEmail(sellerEmail);
            product.setSellerName(sellerName);

            /*
             * Upload product images to Cloudinary.
             *
             * The Product entity currently has one imageUrl field,
             * so for now we store the first uploaded image there.
             */
            if (images != null && images.length > 0) {

                for (MultipartFile image : images) {

                    if (image != null && !image.isEmpty()) {

                        String imageUrl =
                                cloudinaryService.uploadImage(image);

                        product.setImageUrl(imageUrl);

                        // For now, use the first image as the main image.
                        break;
                    }
                }
            }

            // Upload product video to Cloudinary
            if (video != null && !video.isEmpty()) {

                String videoUrl =
                        cloudinaryService.uploadVideo(video);

                product.setVideoUrl(videoUrl);
            }

            Product savedProduct =
                    productService.createProduct(product);

            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Product upload failed: " + e.getMessage());
        }
    }

    // Update product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {

        try {

            Product updatedProduct =
                    productService.updateProduct(id, product);

            return ResponseEntity.ok(updatedProduct);

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id
    ) {

        try {

            productService.deleteProduct(id);

            return ResponseEntity.noContent().build();

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }

    // Get products belonging to a seller
    @GetMapping("/seller/{sellerEmail}")
    public ResponseEntity<List<Product>> getSellerProducts(
            @PathVariable String sellerEmail
    ) {

        return ResponseEntity.ok(
                productService.getProductsBySeller(sellerEmail)
        );
    }

    // Get products by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                productService.getProductsByCategory(category)
        );
    }

    // Search products
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam String name
    ) {

        return ResponseEntity.ok(
                productService.searchProducts(name)
        );
    }
}