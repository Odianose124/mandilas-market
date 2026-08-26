package com.mandilas.market.controller;

import com.mandilas.market.model.Category;
import com.mandilas.market.model.Subcategory;
import com.mandilas.market.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(
            CategoryService categoryService
    ) {
        this.categoryService = categoryService;
    }


    // =========================================================
    // GET ALL ACTIVE CATEGORIES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {

        return ResponseEntity.ok(
                categoryService.getCategories()
        );
    }


    // =========================================================
    // GET SUBCATEGORIES BY CATEGORY
    // =========================================================

    @GetMapping("/{category}/subcategories")
    public ResponseEntity<List<Subcategory>> getSubcategories(
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                categoryService.getSubcategories(
                        category
                )
        );
    }


    // =========================================================
    // CREATE CATEGORY
    // =========================================================
    //
    // Expected request:
    //
    // {
    //     "name": "Men's Wear",
    //     "department": "Fashion"
    // }
    //
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createCategory(
            @RequestBody Map<String, String> body
    ) {

        try {

            String name =
                    body.get("name");

            String department =
                    body.get("department");


            Category category =
                    categoryService.createCategory(
                            name,
                            department
                    );


            return ResponseEntity.ok(
                    category
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // CREATE SUBCATEGORY
    // =========================================================
    //
    // Expected request:
    //
    // {
    //     "category": "Men's Wear",
    //     "name": "Shirts"
    // }
    //
    // =========================================================

    @PostMapping("/subcategory")
    public ResponseEntity<?> createSubcategory(
            @RequestBody Map<String, String> body
    ) {

        try {

            String category =
                    body.get("category");

            String name =
                    body.get("name");


            Subcategory subcategory =
                    categoryService.createSubcategory(
                            category,
                            name
                    );


            return ResponseEntity.ok(
                    subcategory
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }
}