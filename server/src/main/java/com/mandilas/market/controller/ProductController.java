package com.mandilas.market.controller;

import com.mandilas.market.model.Product;
import com.mandilas.market.service.CloudinaryService;
import com.mandilas.market.service.ProductService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

        this.productService =
                productService;

        this.cloudinaryService =
                cloudinaryService;
    }

    // =========================================================
    // GET ALL PRODUCTS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Product>>
    getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }

    // =========================================================
    // GET PRODUCT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Product>
    getProductById(
            @PathVariable Long id
    ) {

        return productService
                .getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =========================================================
    // CREATE PRODUCT
    // =========================================================

    @PostMapping(
            consumes = "multipart/form-data"
    )
    public ResponseEntity<?> createProduct(

            @RequestParam("name")
            String name,

            @RequestParam("description")
            String description,

            @RequestParam("price")
            double price,

            @RequestParam("stock")
            int stock,

            // =================================================
            // DEPARTMENT
            // =================================================

            @RequestParam("department")
            String department,

            // =================================================
            // CATEGORY
            // =================================================

            @RequestParam("category")
            String category,

            // =================================================
            // SUBCATEGORY
            // =================================================

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
                    required = false
            )
            String status,

            @RequestParam(
                    value = "specifications",
                    required = false
            )
            String specifications,

            @RequestParam(
                    value = "images",
                    required = false
            )
            MultipartFile[] images,

            @RequestParam(
                    value = "video",
                    required = false
            )
            MultipartFile video,

            Authentication authentication
    ) {

        try {

            // =================================================
            // AUTHENTICATION
            // =================================================

            if (
                    authentication == null ||
                    authentication.getName() == null ||
                    authentication.getName().isBlank()
            ) {

                return ResponseEntity
                        .status(
                                HttpStatus.UNAUTHORIZED
                        )
                        .body(
                                "Authentication is required"
                        );
            }

            String authenticatedSellerEmail =
                    authentication.getName();

            Product product =
                    new Product();

            // =================================================
            // PRODUCT INFORMATION
            // =================================================

            product.setName(name);

            product.setDescription(
                    description
            );

            product.setPrice(price);

            product.setStock(stock);

            // =================================================
            // DEPARTMENT
            // =================================================

            product.setDepartment(
                    department
            );

            // =================================================
            // CATEGORY
            // =================================================

            product.setCategory(
                    category
            );

            // =================================================
            // SUBCATEGORY
            // =================================================

            product.setSubcategory(
                    subcategory
            );

            // =================================================
            // ADDITIONAL INFORMATION
            // =================================================

            product.setBrand(
                    brand
            );

            product.setSku(
                    sku
            );

            product.setDiscountPrice(
                    discountPrice
            );

            product.setWeight(
                    weight
            );

            product.setDeliveryTime(
                    deliveryTime
            );

            product.setStatus(
                    status
            );

            product.setSpecifications(
                    specifications
            );

            // =================================================
            // SELLER
            // =================================================

            product.setSellerEmail(
                    authenticatedSellerEmail
            );

            // =================================================
            // IMAGE
            // =================================================

            if (
                    images != null &&
                    images.length > 0
            ) {

                for (
                        MultipartFile image :
                        images
                ) {

                    if (
                            image != null &&
                            !image.isEmpty()
                    ) {

                        String imageUrl =
                                cloudinaryService
                                        .uploadImage(
                                                image
                                        );

                        product.setImageUrl(
                                imageUrl
                        );

                        break;
                    }
                }
            }

            // =================================================
            // VIDEO
            // =================================================

            if (
                    video != null &&
                    !video.isEmpty()
            ) {

                String videoUrl =
                        cloudinaryService
                                .uploadVideo(
                                        video
                                );

                product.setVideoUrl(
                        videoUrl
                );
            }

            // =================================================
            // SAVE
            // =================================================

            Product savedProduct =
                    productService
                            .createProduct(
                                    product
                            );

            return ResponseEntity
                    .status(
                            HttpStatus.CREATED
                    )
                    .body(
                            savedProduct
                    );

        } catch (
                RuntimeException e
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (
                Exception e
        ) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Product upload failed"
                    );
        }
    }

    // =========================================================
    // UPDATE PRODUCT
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(

            @PathVariable Long id,

            @RequestBody Product product,

            Authentication authentication
    ) {

        try {

            if (
                    authentication == null ||
                    authentication.getName() == null ||
                    authentication.getName().isBlank()
            ) {

                return ResponseEntity
                        .status(
                                HttpStatus.UNAUTHORIZED
                        )
                        .body(
                                "Authentication is required"
                        );
            }

            String authenticatedSellerEmail =
                    authentication.getName();

            Product updatedProduct =
                    productService.updateProduct(
                            id,
                            product,
                            authenticatedSellerEmail
                    );

            return ResponseEntity.ok(
                    updatedProduct
            );

        } catch (
                RuntimeException e
        ) {

            String message =
                    e.getMessage();

            if (
                    message != null &&
                    message
                            .toLowerCase()
                            .contains(
                                    "not authorized"
                            )
            ) {

                return ResponseEntity
                        .status(
                                HttpStatus.FORBIDDEN
                        )
                        .body(message);
            }

            if (
                    message != null &&
                    message
                            .toLowerCase()
                            .contains(
                                    "not found"
                            )
            ) {

                return ResponseEntity
                        .status(
                                HttpStatus.NOT_FOUND
                        )
                        .body(message);
            }

            return ResponseEntity
                    .badRequest()
                    .body(message);

        } catch (
                Exception e
        ) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to update product"
                    );
        }
    }

    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(

            @PathVariable Long id,

            Authentication authentication
    ) {

        try {

            if (
                    authentication == null ||
                    authentication.getName() == null ||
                    authentication.getName().isBlank()
            ) {

                return ResponseEntity
                        .status(
                                HttpStatus.UNAUTHORIZED
                        )
                        .body(
                                "Authentication is required"
                        );
            }

            String authenticatedSellerEmail =
                    authentication.getName();

            productService.deleteProduct(
                    id,
                    authenticatedSellerEmail
            );

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (
                RuntimeException e
        ) {

            String message =
                    e.getMessage();

            if (
                    message != null &&
                    message
                            .toLowerCase()
                            .contains(
                                    "not authorized"
                            )
            ) {

                return ResponseEntity
                        .status(
                                HttpStatus.FORBIDDEN
                        )
                        .body(message);
            }

            if (
                    message != null &&
                    message
                            .toLowerCase()
                            .contains(
                                    "not found"
                            )
            ) {

                return ResponseEntity
                        .status(
                                HttpStatus.NOT_FOUND
                        )
                        .body(message);
            }

            return ResponseEntity
                    .badRequest()
                    .body(message);

        } catch (
                Exception e
        ) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to delete product"
                    );
        }
    }

    // =========================================================
    // SELLER PRODUCTS
    // =========================================================

    @GetMapping("/seller")
    public ResponseEntity<?> getSellerProducts(
            Authentication authentication
    ) {

        if (
                authentication == null ||
                authentication.getName() == null ||
                authentication.getName().isBlank()
        ) {

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(
                            "Authentication is required"
                    );
        }

        return ResponseEntity.ok(
                productService
                        .getProductsBySeller(
                                authentication
                                        .getName()
                        )
        );
    }

    // =========================================================
    // PRODUCTS BY DEPARTMENT
    // =========================================================

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Product>>
    getProductsByDepartment(

            @PathVariable String department
    ) {

        return ResponseEntity.ok(
                productService
                        .getProductsByDepartment(
                                department
                        )
        );
    }

    // =========================================================
    // PRODUCTS BY DEPARTMENT + CATEGORY
    // =========================================================

    @GetMapping(
            "/department/{department}/category/{category}"
    )
    public ResponseEntity<List<Product>>
    getProductsByDepartmentAndCategory(

            @PathVariable String department,

            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                productService
                        .getProductsByDepartmentAndCategory(
                                department,
                                category
                        )
        );
    }

    // =========================================================
    // PRODUCTS BY DEPARTMENT + CATEGORY + SUBCATEGORY
    // =========================================================

    @GetMapping(
            "/department/{department}/category/{category}/subcategory/{subcategory}"
    )
    public ResponseEntity<List<Product>>
    getProductsByDepartmentAndCategoryAndSubcategory(

            @PathVariable String department,

            @PathVariable String category,

            @PathVariable String subcategory
    ) {

        return ResponseEntity.ok(
                productService
                        .getProductsByDepartmentAndCategoryAndSubcategory(
                                department,
                                category,
                                subcategory
                        )
        );
    }

    // =========================================================
    // PRODUCTS BY CATEGORY
    // =========================================================

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>>
    getProductsByCategory(

            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                productService
                        .getProductsByCategory(
                                category
                        )
        );
    }

    // =========================================================
    // PRODUCTS BY CATEGORY + SUBCATEGORY
    // =========================================================

    @GetMapping(
            "/category/{category}/subcategory/{subcategory}"
    )
    public ResponseEntity<List<Product>>
    getProductsByCategoryAndSubcategory(

            @PathVariable String category,

            @PathVariable String subcategory
    ) {

        return ResponseEntity.ok(
                productService
                        .getProductsByCategoryAndSubcategory(
                                category,
                                subcategory
                        )
        );
    }

    // =========================================================
    // PRODUCTS BY SUBCATEGORY
    // =========================================================

    @GetMapping(
            "/subcategory/{subcategory}"
    )
    public ResponseEntity<List<Product>>
    getProductsBySubcategory(

            @PathVariable String subcategory
    ) {

        return ResponseEntity.ok(
                productService
                        .getProductsBySubcategory(
                                subcategory
                        )
        );
    }

    // =========================================================
    // SEARCH PRODUCTS
    // =========================================================
    //
    // Example:
    //
    // GET /api/products/search?name=shirt
    //
    // Searches:
    // name
    // department
    // category
    // subcategory
    // brand
    // description
    //
    // =========================================================

    @GetMapping("/search")
    public ResponseEntity<List<Product>>
    searchProducts(

            @RequestParam String name
    ) {

        return ResponseEntity.ok(
                productService
                        .searchProducts(
                                name
                        )
        );
    }
}