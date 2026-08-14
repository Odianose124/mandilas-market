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

    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {

        return ResponseEntity.ok(
                categoryService.getCategories()
        );
    }

    @GetMapping("/{category}/subcategories")
    public ResponseEntity<List<Subcategory>>
    getSubcategories(
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                categoryService.getSubcategories(
                        category
                )
        );
    }

    @PostMapping
    public ResponseEntity<?> createCategory(
            @RequestBody Map<String, String> body
    ) {

        try {

            return ResponseEntity.ok(
                    categoryService.createCategory(
                            body.get("name")
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/subcategory")
    public ResponseEntity<?> createSubcategory(
            @RequestBody Map<String, String> body
    ) {

        try {

            return ResponseEntity.ok(
                    categoryService.createSubcategory(
                            body.get("category"),
                            body.get("name")
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}