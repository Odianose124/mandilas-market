package com.mandilas.market.controller;

import com.mandilas.market.model.Product;
import com.mandilas.market.model.Store;
import com.mandilas.market.service.StoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://mandilas-market.vercel.app"
})
public class StoreController {

    private final StoreService storeService;

    public StoreController(
            StoreService storeService
    ) {
        this.storeService = storeService;
    }


    // =========================================================
    // PUBLIC STORE
    // =========================================================

    @GetMapping("/{slug}")
    public ResponseEntity<?> getStore(
            @PathVariable String slug
    ) {

        try {

            Store store =
                    storeService.getStoreBySlug(slug);

            return ResponseEntity.ok(store);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // PUBLIC STORE PRODUCTS
    // =========================================================

    @GetMapping("/{slug}/products")
    public ResponseEntity<?> getStoreProducts(
            @PathVariable String slug
    ) {

        try {

            List<Product> products =
                    storeService.getStoreProducts(
                            slug
                    );

            return ResponseEntity.ok(products);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // PUBLIC STORE PRODUCTS - NEWEST FIRST
    // =========================================================

    @GetMapping("/{slug}/products/newest")
    public ResponseEntity<?> getStoreProductsNewest(
            @PathVariable String slug
    ) {

        try {

            List<Product> products =
                    storeService.getStoreProductsNewestFirst(
                            slug
                    );

            return ResponseEntity.ok(products);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // STORE PRODUCTS BY CATEGORY
    // =========================================================

    @GetMapping("/{slug}/products/category/{category}")
    public ResponseEntity<?> getStoreProductsByCategory(
            @PathVariable String slug,
            @PathVariable String category
    ) {

        try {

            List<Product> products =
                    storeService.getStoreProductsByCategory(
                            slug,
                            category
                    );

            return ResponseEntity.ok(products);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // STORE PRODUCTS BY CATEGORY + SUBCATEGORY
    // =========================================================

    @GetMapping(
            "/{slug}/products/category/{category}/subcategory/{subcategory}"
    )
    public ResponseEntity<?> getStoreProductsByCategoryAndSubcategory(
            @PathVariable String slug,
            @PathVariable String category,
            @PathVariable String subcategory
    ) {

        try {

            List<Product> products =
                    storeService
                            .getStoreProductsByCategoryAndSubcategory(
                                    slug,
                                    category,
                                    subcategory
                            );

            return ResponseEntity.ok(products);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // GET STORE BY SELLER EMAIL
    // =========================================================

    @GetMapping("/seller/{email}")
    public ResponseEntity<?> getSellerStore(
            @PathVariable String email
    ) {

        try {

            Store store =
                    storeService.getStoreBySellerEmail(
                            email
                    );

            return ResponseEntity.ok(store);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // GET STORE BY SELLER ID
    // =========================================================

    @GetMapping("/seller/id/{sellerId}")
    public ResponseEntity<?> getSellerStoreById(
            @PathVariable Long sellerId
    ) {

        try {

            Store store =
                    storeService.getStoreBySellerId(
                            sellerId
                    );

            return ResponseEntity.ok(store);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // SELLER STORE MANAGEMENT - CURRENT AUTHENTICATED USER
    // =========================================================

    /*
     * GET /api/stores/manage/me
     *
     * The seller is identified ONLY from the JWT.
     */
    @GetMapping("/manage/me")
    public ResponseEntity<?> getOwnStore(
            Authentication authentication
    ) {

        try {

            Long sellerId =
                    getAuthenticatedUserId(
                            authentication
                    );

            Store store =
                    storeService.getStoreBySellerId(
                            sellerId
                    );

            return ResponseEntity.ok(
                    store
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // SELLER UPDATE STORE - CURRENT AUTHENTICATED USER
    // =========================================================

    /*
     * PUT /api/stores/manage/me
     */
    @PutMapping("/manage/me")
    public ResponseEntity<?> updateStore(
            Authentication authentication,
            @RequestBody Map<String, String> request
    ) {

        try {

            Long sellerId =
                    getAuthenticatedUserId(
                            authentication
                    );

            Store store =
                    storeService.updateStoreBySellerId(
                            sellerId,
                            request.get("storeName"),
                            request.get("description"),
                            request.get("location"),
                            request.get("logoUrl"),
                            request.get("bannerUrl")
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Store updated successfully.",
                            "store",
                            store
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // SELLER ACTIVATE STORE - CURRENT AUTHENTICATED USER
    // =========================================================

    /*
     * PUT /api/stores/manage/me/activate
     */
    @PutMapping("/manage/me/activate")
    public ResponseEntity<?> activateStore(
            Authentication authentication
    ) {

        try {

            Long sellerId =
                    getAuthenticatedUserId(
                            authentication
                    );

            Store store =
                    storeService.activateStoreBySellerId(
                            sellerId
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Store activated successfully.",
                            "store",
                            store
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // SELLER DEACTIVATE STORE - CURRENT AUTHENTICATED USER
    // =========================================================

    /*
     * PUT /api/stores/manage/me/deactivate
     */
    @PutMapping("/manage/me/deactivate")
    public ResponseEntity<?> deactivateStore(
            Authentication authentication
    ) {

        try {

            Long sellerId =
                    getAuthenticatedUserId(
                            authentication
                    );

            Store store =
                    storeService.deactivateStoreBySellerId(
                            sellerId
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Store deactivated successfully.",
                            "store",
                            store
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // GET AUTHENTICATED USER ID
    // =========================================================

    /*
     * The JwtAuthenticationFilter places the verified
     * database user ID into Authentication details.
     *
     * Therefore the seller ID is NEVER supplied by the
     * frontend for /manage/me.
     */
    private Long getAuthenticatedUserId(
            Authentication authentication
    ) {

        if (
                authentication == null ||
                !authentication.isAuthenticated()
        ) {

            throw new RuntimeException(
                    "Authentication is required."
            );
        }

        Object details =
                authentication.getDetails();

        if (!(details instanceof Long)) {

            throw new RuntimeException(
                    "Authenticated user ID is unavailable."
            );
        }

        return (Long) details;
    }
}