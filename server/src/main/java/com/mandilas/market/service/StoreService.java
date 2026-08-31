package com.mandilas.market.service;

import com.mandilas.market.model.Product;
import com.mandilas.market.model.Store;
import com.mandilas.market.model.User;
import com.mandilas.market.repository.ProductRepository;
import com.mandilas.market.repository.StoreRepository;
import com.mandilas.market.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@Service
public class StoreService {

    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public StoreService(
            StoreRepository storeRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.storeRepository = storeRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }


    // =========================================================
    // CREATE STORE FOR SELLER
    // =========================================================

    /*
     * Creates the seller's store automatically during
     * seller registration.
     *
     * Flow:
     *
     * AuthService
     *      ↓
     * savedUser
     *      ↓
     * StoreService
     *      ↓
     * StoreRepository
     *
     * Nothing is hardcoded.
     *
     * Every seller gets one store belonging to their
     * actual database user ID.
     */
    @Transactional
    public Store createStoreForSeller(
            User seller,
            String storeName
    ) {

        // =====================================================
        // VALIDATE SELLER
        // =====================================================

        if (seller == null) {

            throw new RuntimeException(
                    "Seller account is required."
            );
        }


        if (seller.getId() == null) {

            throw new RuntimeException(
                    "Seller ID is required before creating a store."
            );
        }


        // =====================================================
        // VERIFY SELLER ROLE
        // =====================================================

        if (seller.getRole() != User.Role.SELLER) {

            throw new RuntimeException(
                    "Only sellers can have a store."
            );
        }


        // =====================================================
        // VALIDATE STORE NAME
        // =====================================================

        if (
                storeName == null ||
                storeName.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Store name is required."
            );
        }


        String cleanStoreName =
                storeName.trim();


        // =====================================================
        // PREVENT DUPLICATE SELLER STORE
        // =====================================================

        if (
                storeRepository.existsBySellerId(
                        seller.getId()
                )
        ) {

            throw new RuntimeException(
                    "This seller already has a store."
            );
        }


        // =====================================================
        // GENERATE UNIQUE STORE SLUG
        // =====================================================

        String slug =
                generateUniqueSlug(
                        cleanStoreName
                );


        // =====================================================
        // CREATE STORE
        // =====================================================

        Store store =
                new Store();


        /*
         * Connect this store to the actual seller.
         *
         * No hardcoded seller.
         */
        store.setSeller(
                seller
        );


        store.setStoreName(
                cleanStoreName
        );


        store.setSlug(
                slug
        );


        /*
         * New stores are active by default.
         */
        store.setActive(
                true
        );


        // =====================================================
        // SAVE STORE
        // =====================================================

        return storeRepository.save(
                store
        );
    }


    // =========================================================
    // GENERATE UNIQUE STORE SLUG
    // =========================================================

    /*
     * Example:
     *
     * "Emmanuel Fashion"
     *       ↓
     * emmanuel-fashion
     *
     * If it already exists:
     *
     * emmanuel-fashion-2
     *
     * If that exists:
     *
     * emmanuel-fashion-3
     *
     * This is completely dynamic.
     */
    private String generateUniqueSlug(
            String storeName
    ) {

        String baseSlug =
                Normalizer
                        .normalize(
                                storeName,
                                Normalizer.Form.NFD
                        )
                        .replaceAll(
                                "\\p{M}",
                                ""
                        )
                        .toLowerCase(
                                Locale.ROOT
                        )
                        .replaceAll(
                                "[^a-z0-9]+",
                                "-"
                        )
                        .replaceAll(
                                "^-+|-+$",
                                ""
                        );


        /*
         * Extremely unusual case where the store name
         * contains no usable characters.
         */
        if (baseSlug.isEmpty()) {

            baseSlug = "store";
        }


        String slug =
                baseSlug;

        int counter =
                2;


        while (
                storeRepository.existsBySlugIgnoreCase(
                        slug
                )
        ) {

            slug =
                    baseSlug +
                    "-" +
                    counter;

            counter++;
        }


        return slug;
    }


    // =========================================================
    // GET STORE BY SLUG
    // =========================================================

    /*
     * Public store lookup.
     *
     * Example:
     *
     * GET /api/stores/emmanuel-fashion
     */
    public Store getStoreBySlug(
            String slug
    ) {

        if (
                slug == null ||
                slug.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Store slug is required."
            );
        }


        return storeRepository
                .findBySlugIgnoreCase(
                        slug.trim()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Store not found."
                        )
                );
    }


    // =========================================================
    // GET STORE BY SELLER EMAIL
    // =========================================================

    /*
     * Compatibility method.
     *
     * This remains available for existing functionality.
     *
     * Authenticated seller management should use
     * seller ID instead.
     */
    // =========================================================
// GET OR CREATE STORE BY SELLER EMAIL
// =========================================================

/*
 * Public compatibility method.
 *
 * Used by the marketplace when a buyer clicks
 * "Visit Store" from a product.
 *
 * Flow:
 *
 * Product
 *    ↓
 * sellerEmail
 *    ↓
 * User
 *    ↓
 * Store
 *
 * If the seller already has a store:
 *
 *     return existing store
 *
 * If the seller is an older seller and does not
 * have a store yet:
 *
 *     automatically create the store
 *
 * This guarantees that existing sellers can also
 * have working marketplace stores.
 */

@Transactional
public Store getStoreBySellerEmail(
        String email
) {

    // =====================================================
    // VALIDATE EMAIL
    // =====================================================

    if (
            email == null ||
            email.trim().isEmpty()
    ) {

        throw new RuntimeException(
                "Seller email is required."
        );
    }


    String normalizedEmail =
            email
                    .trim()
                    .toLowerCase();


    // =====================================================
    // FIND SELLER ACCOUNT
    // =====================================================

    User seller =
            userRepository
                    .findByEmail(
                            normalizedEmail
                    )
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Seller account not found."
                            )
                    );


    // =====================================================
    // VERIFY SELLER ROLE
    // =====================================================

    if (
            seller.getRole() !=
                    User.Role.SELLER
    ) {

        throw new RuntimeException(
                "This account does not belong to a seller."
        );
    }


    // =====================================================
    // FIND EXISTING STORE
    // =====================================================

    Store existingStore =
            storeRepository
                    .findBySellerId(
                            seller.getId()
                    )
                    .orElse(null);


    // =====================================================
    // STORE ALREADY EXISTS
    // =====================================================

    if (existingStore != null) {

        return existingStore;
    }


    // =====================================================
    // STORE DOES NOT EXIST
    // =====================================================

    /*
     * This handles sellers who registered before
     * automatic store creation was introduced.
     */

    String storeName =
            seller.getStoreName();


    // =====================================================
    // FALLBACK STORE NAME
    // =====================================================

    if (
            storeName == null ||
            storeName.trim().isEmpty()
    ) {

        String firstName =
                seller.getFirstName() != null
                        ? seller.getFirstName().trim()
                        : "";

        String lastName =
                seller.getLastName() != null
                        ? seller.getLastName().trim()
                        : "";


        storeName =
                (firstName + " " + lastName)
                        .trim();
    }


    // =====================================================
    // FINAL FALLBACK
    // =====================================================

    if (
            storeName == null ||
            storeName.trim().isEmpty()
    ) {

        storeName = "Mandilas Seller";
    }


    // =====================================================
    // CREATE STORE
    // =====================================================

    return createStoreForSeller(
            seller,
            storeName
    );
}


    // =========================================================
    // GET STORE BY SELLER ID
    // =========================================================

    /*
     * PREFERRED AUTHENTICATED METHOD.
     *
     * Flow:
     *
     * JWT
     *   ↓
     * userId
     *   ↓
     * StoreService
     *   ↓
     * StoreRepository.findBySellerId(userId)
     */
    public Store getStoreBySellerId(
            Long sellerId
    ) {

        if (sellerId == null) {

            throw new RuntimeException(
                    "Seller ID is required."
            );
        }


        return storeRepository
                .findBySellerId(
                        sellerId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Seller store not found."
                        )
                );
    }


    // =========================================================
    // UPDATE SELLER STORE BY EMAIL
    // =========================================================

    /*
     * Compatibility method.
     *
     * Existing functionality can still use this.
     *
     * Internally redirects to the seller-ID implementation.
     */
    public Store updateStore(
            String sellerEmail,
            String storeName,
            String description,
            String location,
            String logoUrl,
            String bannerUrl
    ) {

        if (
                sellerEmail == null ||
                sellerEmail.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Seller email is required."
            );
        }


        User seller =
                userRepository
                        .findByEmail(
                                sellerEmail
                                        .trim()
                                        .toLowerCase()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Seller account not found."
                                )
                        );


        return updateStoreBySellerId(
                seller.getId(),
                storeName,
                description,
                location,
                logoUrl,
                bannerUrl
        );
    }


    // =========================================================
    // UPDATE SELLER STORE BY SELLER ID
    // =========================================================

    /*
     * Preferred authenticated implementation.
     *
     * The seller ID must come from the verified JWT.
     *
     * The frontend does NOT choose which seller's store
     * to update.
     */
    @Transactional
    public Store updateStoreBySellerId(
            Long sellerId,
            String storeName,
            String description,
            String location,
            String logoUrl,
            String bannerUrl
    ) {

        if (sellerId == null) {

            throw new RuntimeException(
                    "Seller ID is required."
            );
        }


        User seller =
                userRepository
                        .findById(
                                sellerId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Seller account not found."
                                )
                        );


        if (
                seller.getRole() !=
                        User.Role.SELLER
        ) {

            throw new RuntimeException(
                    "Only sellers can manage a store."
            );
        }


        Store store =
                storeRepository
                        .findBySellerId(
                                sellerId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Seller store not found."
                                )
                        );


        // =====================================================
        // STORE NAME
        // =====================================================

        if (
                storeName != null &&
                !storeName.trim().isEmpty()
        ) {

            String newStoreName =
                    storeName.trim();


            seller.setStoreName(
                    newStoreName
            );


            store.setStoreName(
                    newStoreName
            );
        }


        // =====================================================
        // DESCRIPTION
        // =====================================================

        if (description != null) {

            store.setDescription(
                    description.trim()
            );
        }


        // =====================================================
        // LOCATION
        // =====================================================

        if (location != null) {

            store.setLocation(
                    location.trim()
            );
        }


        // =====================================================
        // LOGO
        // =====================================================

        if (logoUrl != null) {

            store.setLogoUrl(
                    logoUrl.trim()
            );
        }


        // =====================================================
        // BANNER
        // =====================================================

        if (bannerUrl != null) {

            store.setBannerUrl(
                    bannerUrl.trim()
            );
        }


        // =====================================================
        // SAVE
        // =====================================================

        userRepository.save(
                seller
        );


        return storeRepository.save(
                store
        );
    }


    // =========================================================
    // ACTIVATE STORE BY EMAIL
    // =========================================================

    /*
     * Compatibility method.
     */
    public Store activateStore(
            String sellerEmail
    ) {

        Store store =
                getStoreBySellerEmail(
                        sellerEmail
                );


        return activateStoreBySellerId(
                store.getSeller().getId()
        );
    }


    // =========================================================
    // ACTIVATE STORE BY SELLER ID
    // =========================================================

    @Transactional
    public Store activateStoreBySellerId(
            Long sellerId
    ) {

        if (sellerId == null) {

            throw new RuntimeException(
                    "Seller ID is required."
            );
        }


        User seller =
                userRepository
                        .findById(
                                sellerId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Seller account not found."
                                )
                        );


        if (
                seller.getRole() !=
                        User.Role.SELLER
        ) {

            throw new RuntimeException(
                    "Only sellers can manage a store."
            );
        }


        Store store =
                storeRepository
                        .findBySellerId(
                                sellerId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Seller store not found."
                                )
                        );


        store.setActive(
                true
        );


        return storeRepository.save(
                store
        );
    }


    // =========================================================
    // DEACTIVATE STORE BY EMAIL
    // =========================================================

    /*
     * Compatibility method.
     */
    public Store deactivateStore(
            String sellerEmail
    ) {

        Store store =
                getStoreBySellerEmail(
                        sellerEmail
                );


        return deactivateStoreBySellerId(
                store.getSeller().getId()
        );
    }


    // =========================================================
    // DEACTIVATE STORE BY SELLER ID
    // =========================================================

    @Transactional
    public Store deactivateStoreBySellerId(
            Long sellerId
    ) {

        if (sellerId == null) {

            throw new RuntimeException(
                    "Seller ID is required."
            );
        }


        User seller =
                userRepository
                        .findById(
                                sellerId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Seller account not found."
                                )
                        );


        if (
                seller.getRole() !=
                        User.Role.SELLER
        ) {

            throw new RuntimeException(
                    "Only sellers can manage a store."
            );
        }


        Store store =
                storeRepository
                        .findBySellerId(
                                sellerId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Seller store not found."
                                )
                        );


        store.setActive(
                false
        );


        return storeRepository.save(
                store
        );
    }


    // =========================================================
    // GET STORE PRODUCTS
    // =========================================================

    /*
     * Public store products.
     */
    public List<Product> getStoreProducts(
            String slug
    ) {

        Store store =
                getStoreBySlug(
                        slug
                );


        if (!store.isActive()) {

            throw new RuntimeException(
                    "This store is currently unavailable."
            );
        }


        String sellerEmail =
                store
                        .getSeller()
                        .getEmail();


        return productRepository
                .findBySellerEmailIgnoreCase(
                        sellerEmail
                );
    }


    // =========================================================
    // GET STORE PRODUCTS - NEWEST FIRST
    // =========================================================

    public List<Product> getStoreProductsNewestFirst(
            String slug
    ) {

        Store store =
                getStoreBySlug(
                        slug
                );


        if (!store.isActive()) {

            throw new RuntimeException(
                    "This store is currently unavailable."
            );
        }


        String sellerEmail =
                store
                        .getSeller()
                        .getEmail();


        return productRepository
                .findBySellerEmailIgnoreCaseOrderByCreatedAtDesc(
                        sellerEmail
                );
    }


    // =========================================================
    // GET STORE PRODUCTS BY CATEGORY
    // =========================================================

    public List<Product> getStoreProductsByCategory(
            String slug,
            String category
    ) {

        Store store =
                getStoreBySlug(
                        slug
                );


        if (!store.isActive()) {

            throw new RuntimeException(
                    "This store is currently unavailable."
            );
        }


        if (
                category == null ||
                category.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Category is required."
            );
        }


        String sellerEmail =
                store
                        .getSeller()
                        .getEmail();


        return productRepository
                .findBySellerEmailIgnoreCaseAndCategoryIgnoreCase(
                        sellerEmail,
                        category.trim()
                );
    }


    // =========================================================
    // GET STORE PRODUCTS BY CATEGORY + SUBCATEGORY
    // =========================================================

    public List<Product>
    getStoreProductsByCategoryAndSubcategory(
            String slug,
            String category,
            String subcategory
    ) {

        Store store =
                getStoreBySlug(
                        slug
                );


        if (!store.isActive()) {

            throw new RuntimeException(
                    "This store is currently unavailable."
            );
        }


        if (
                category == null ||
                category.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Category is required."
            );
        }


        if (
                subcategory == null ||
                subcategory.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Subcategory is required."
            );
        }


        String sellerEmail =
                store
                        .getSeller()
                        .getEmail();


        return productRepository
                .findBySellerEmailIgnoreCaseAndCategoryIgnoreCaseAndSubcategoryIgnoreCase(
                        sellerEmail,
                        category.trim(),
                        subcategory.trim()
                );
    }
}