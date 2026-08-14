package com.mandilas.market.repository;

import com.mandilas.market.model.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubcategoryRepository
        extends JpaRepository<Subcategory, Long> {

    List<Subcategory>
    findByCategoryIdAndActiveTrueOrderByNameAsc(
            Long categoryId
    );

    List<Subcategory>
    findByCategoryNameIgnoreCaseAndActiveTrueOrderByNameAsc(
            String categoryName
    );

    boolean existsByNameIgnoreCaseAndCategoryId(
            String name,
            Long categoryId
    );
}