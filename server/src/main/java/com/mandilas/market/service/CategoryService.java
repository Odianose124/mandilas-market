package com.mandilas.market.service;

import com.mandilas.market.model.Category;
import com.mandilas.market.model.Subcategory;
import com.mandilas.market.repository.CategoryRepository;
import com.mandilas.market.repository.SubcategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            SubcategoryRepository subcategoryRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.subcategoryRepository = subcategoryRepository;
    }

    public List<Category> getCategories() {
        return categoryRepository
                .findByActiveTrueOrderByNameAsc();
    }

    public List<Subcategory> getSubcategories(
            String category
    ) {
        return subcategoryRepository
                .findByCategoryNameIgnoreCaseAndActiveTrueOrderByNameAsc(
                        category
                );
    }

    public Category createCategory(
            String name
    ) {

        if (name == null || name.isBlank()) {
            throw new RuntimeException(
                    "Category name is required"
            );
        }

        String cleanName = name.trim();

        if (categoryRepository
                .existsByNameIgnoreCase(cleanName)) {

            throw new RuntimeException(
                    "Category already exists"
            );
        }

        return categoryRepository.save(
                new Category(cleanName)
        );
    }

    public Subcategory createSubcategory(
            String categoryName,
            String subcategoryName
    ) {

        Category category =
                categoryRepository
                        .findByNameIgnoreCase(
                                categoryName
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found"
                                )
                        );

        String cleanName =
                subcategoryName.trim();

        if (subcategoryRepository
                .existsByNameIgnoreCaseAndCategoryId(
                        cleanName,
                        category.getId()
                )) {

            throw new RuntimeException(
                    "Subcategory already exists"
            );
        }

        Subcategory subcategory =
                new Subcategory();

        subcategory.setName(cleanName);
        subcategory.setCategory(category);

        return subcategoryRepository.save(
                subcategory
        );
    }
}