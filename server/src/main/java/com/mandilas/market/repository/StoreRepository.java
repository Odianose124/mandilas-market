package com.mandilas.market.repository;

import com.mandilas.market.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StoreRepository
        extends JpaRepository<Store, Long> {

    /*
     * Find a public store by its unique slug.
     *
     * Example:
     * /api/stores/emmanuel-fashion
     */
    Optional<Store> findBySlugIgnoreCase(
            String slug
    );


    /*
     * Find a store using the seller's database ID.
     */
    Optional<Store> findBySellerId(
            Long sellerId
    );


    /*
     * Find a store using the seller's email.
     */
    Optional<Store> findBySellerEmailIgnoreCase(
            String email
    );


    /*
     * Check whether a store slug already exists.
     */
    boolean existsBySlugIgnoreCase(
            String slug
    );


    /*
     * Check whether a seller already has a store.
     */
    boolean existsBySellerId(
            Long sellerId
    );
}