package com.mandilas.market.service;

import com.mandilas.market.model.Category;
import com.mandilas.market.model.Department;
import com.mandilas.market.model.Subcategory;
import com.mandilas.market.repository.CategoryRepository;
import com.mandilas.market.repository.DepartmentRepository;
import com.mandilas.market.repository.SubcategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final DepartmentRepository departmentRepository;
    private final SubcategoryRepository subcategoryRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            DepartmentRepository departmentRepository,
            SubcategoryRepository subcategoryRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.departmentRepository = departmentRepository;
        this.subcategoryRepository = subcategoryRepository;
    }


    // =========================================================
    // GET ALL ACTIVE CATEGORIES
    // =========================================================

    public List<Category> getCategories() {

        return categoryRepository
                .findByActiveTrueOrderByNameAsc();
    }


    // =========================================================
    // GET SUBCATEGORIES BY CATEGORY
    // =========================================================

    public List<Subcategory> getSubcategories(
            String category
    ) {

        if (category == null || category.isBlank()) {
            throw new RuntimeException(
                    "Category name is required"
            );
        }

        return subcategoryRepository
                .findByCategoryNameIgnoreCaseAndActiveTrueOrderByNameAsc(
                        category.trim()
                );
    }


    // =========================================================
    // GET SUBCATEGORIES BY CATEGORY ID
    // =========================================================

    public List<Subcategory> getSubcategoriesByCategoryId(
            Long categoryId
    ) {

        if (categoryId == null) {
            throw new RuntimeException(
                    "Category ID is required"
            );
        }

        return subcategoryRepository
                .findByCategoryIdAndActiveTrueOrderByNameAsc(
                        categoryId
                );
    }


    // =========================================================
    // CREATE CATEGORY
    // DEPARTMENT → CATEGORY
    // =========================================================

    public Category createCategory(
            String name,
            String departmentName
    ) {

        if (name == null || name.isBlank()) {

            throw new RuntimeException(
                    "Category name is required"
            );
        }

        if (
                departmentName == null ||
                departmentName.isBlank()
        ) {

            throw new RuntimeException(
                    "Department is required"
            );
        }

        String cleanName =
                name.trim();

        String cleanDepartment =
                departmentName.trim();


        // -----------------------------------------------------
        // CHECK IF CATEGORY ALREADY EXISTS
        // -----------------------------------------------------

        if (
                categoryRepository
                        .existsByNameIgnoreCase(cleanName)
        ) {

            throw new RuntimeException(
                    "Category already exists"
            );
        }


        // -----------------------------------------------------
        // FIND DEPARTMENT
        // -----------------------------------------------------

        Department department =
                departmentRepository
                        .findByNameIgnoreCase(
                                cleanDepartment
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Department not found: "
                                                + cleanDepartment
                                )
                        );


        // -----------------------------------------------------
        // CREATE CATEGORY
        // -----------------------------------------------------

        Category category =
                new Category(
                        cleanName,
                        department
                );


        category.setActive(true);


        return categoryRepository.save(
                category
        );
    }


    // =========================================================
    // CREATE SUBCATEGORY
    // CATEGORY → SUBCATEGORY
    // =========================================================

    public Subcategory createSubcategory(
            String categoryName,
            String subcategoryName
    ) {

        if (
                categoryName == null ||
                categoryName.isBlank()
        ) {

            throw new RuntimeException(
                    "Category name is required"
            );
        }

        if (
                subcategoryName == null ||
                subcategoryName.isBlank()
        ) {

            throw new RuntimeException(
                    "Subcategory name is required"
            );
        }


        String cleanCategoryName =
                categoryName.trim();

        String cleanSubcategoryName =
                subcategoryName.trim();


        // -----------------------------------------------------
        // FIND CATEGORY
        // -----------------------------------------------------

        Category category =
                categoryRepository
                        .findByNameIgnoreCase(
                                cleanCategoryName
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found: "
                                                + cleanCategoryName
                                )
                        );


        // -----------------------------------------------------
        // CHECK DUPLICATE SUBCATEGORY
        // -----------------------------------------------------

        if (
                subcategoryRepository
                        .existsByNameIgnoreCaseAndCategoryId(
                                cleanSubcategoryName,
                                category.getId()
                        )
        ) {

            throw new RuntimeException(
                    "Subcategory already exists"
            );
        }


        // -----------------------------------------------------
        // CREATE SUBCATEGORY
        // -----------------------------------------------------

        Subcategory subcategory =
                new Subcategory();

        subcategory.setName(
                cleanSubcategoryName
        );

        subcategory.setCategory(
                category
        );

        subcategory.setActive(true);


        return subcategoryRepository.save(
                subcategory
        );
    }
}