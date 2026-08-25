package com.mandilas.market.config;

import com.mandilas.market.model.Category;
import com.mandilas.market.model.Department;
import com.mandilas.market.model.Subcategory;
import com.mandilas.market.repository.CategoryRepository;
import com.mandilas.market.repository.DepartmentRepository;
import com.mandilas.market.repository.SubcategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MarketplaceDataSeeder implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;

    public MarketplaceDataSeeder(
            DepartmentRepository departmentRepository,
            CategoryRepository categoryRepository,
            SubcategoryRepository subcategoryRepository
    ) {
        this.departmentRepository = departmentRepository;
        this.categoryRepository = categoryRepository;
        this.subcategoryRepository = subcategoryRepository;
    }

    @Override
    public void run(String... args) {

        // =====================================================
        // DEPARTMENTS
        // =====================================================

        Department fashion =
                getOrCreateDepartment("Fashion");

        Department electronics =
                getOrCreateDepartment("Electronics & Phones");

        Department home =
                getOrCreateDepartment("Home & Living");

        Department beauty =
                getOrCreateDepartment("Beauty & Personal Care");


        // =====================================================
        // FASHION
        // =====================================================

        Category mensWear =
                getOrCreateCategory("Men's Wear", fashion);

        addSubcategories(
                mensWear,
                "Shirts",
                "Trousers",
                "Senator",
                "Native Wear",
                "Suits",
                "Jackets",
                "Shorts",
                "Underwear"
        );


        Category womensWear =
                getOrCreateCategory("Women's Wear", fashion);

        addSubcategories(
                womensWear,
                "Dresses",
                "Tops",
                "Skirts",
                "Trousers",
                "Jumpsuits",
                "Native Wear",
                "Hijabs",
                "Underwear"
        );


        Category shoes =
                getOrCreateCategory("Shoes", fashion);

        addSubcategories(
                shoes,
                "Sneakers",
                "Formal Shoes",
                "Sandals",
                "Slippers",
                "Boots",
                "Heels",
                "Flats"
        );


        Category bags =
                getOrCreateCategory("Bags", fashion);

        addSubcategories(
                bags,
                "Handbags",
                "Backpacks",
                "School Bags",
                "Travel Bags",
                "Laptop Bags",
                "Wallets"
        );


        Category watches =
                getOrCreateCategory("Watches", fashion);

        addSubcategories(
                watches,
                "Men's Watches",
                "Women's Watches",
                "Smart Watches",
                "Luxury Watches",
                "Sports Watches"
        );


        Category nativeWears =
                getOrCreateCategory("Native Wears", fashion);

        addSubcategories(
                nativeWears,
                "Agbada",
                "Senator",
                "Ankara",
                "Kaftan",
                "Traditional Dresses",
                "Native Accessories"
        );


        Category kidsFashion =
                getOrCreateCategory("Kids Fashion", fashion);

        addSubcategories(
                kidsFashion,
                "Boys Clothing",
                "Girls Clothing",
                "Kids Shoes",
                "Baby Clothing",
                "Baby Accessories",
                "Toys"
        );


        Category accessories =
                getOrCreateCategory("Accessories", fashion);

        addSubcategories(
                accessories,
                "Belts",
                "Caps",
                "Hats",
                "Sunglasses",
                "Jewelry",
                "Ties"
        );


        // =====================================================
        // ELECTRONICS & PHONES
        // =====================================================

        Category electronicsCategory =
                getOrCreateCategory("Electronics", electronics);

        addSubcategories(
                electronicsCategory,
                "TVs",
                "Laptops",
                "Computers",
                "Gaming",
                "Cameras",
                "Audio",
                "Electronics Accessories"
        );


        Category phones =
                getOrCreateCategory(
                        "Phones & Tablets",
                        electronics
                );

        addSubcategories(
                phones,
                "iPhones",
                "Android Phones",
                "Tablets",
                "iPads",
                "Phone Accessories",
                "Chargers",
                "Power Banks"
        );


        // =====================================================
        // BEAUTY
        // =====================================================

        Category beautyCategory =
                getOrCreateCategory(
                        "Beauty & Personal Care",
                        beauty
                );

        addSubcategories(
                beautyCategory,
                "Skincare",
                "Hair Care",
                "Makeup",
                "Perfumes",
                "Body Care",
                "Hair Accessories"
        );


        // =====================================================
        // HOME & LIVING
        // =====================================================

        Category homeCategory =
                getOrCreateCategory(
                        "Home & Living",
                        home
                );

        addSubcategories(
                homeCategory,
                "Furniture",
                "Kitchen",
                "Bedding",
                "Home Decor",
                "Lighting",
                "Storage"
        );


        System.out.println(
                "Mandilas Market taxonomy loaded successfully."
        );
    }


    // =========================================================
    // DEPARTMENT
    // =========================================================

    private Department getOrCreateDepartment(
            String name
    ) {

        return departmentRepository
                .findByNameIgnoreCase(name)
                .orElseGet(() ->
                        departmentRepository.save(
                                new Department(name)
                        )
                );
    }


    // =========================================================
    // CATEGORY
    // =========================================================

    private Category getOrCreateCategory(
            String name,
            Department department
    ) {

        return categoryRepository
                .findByNameIgnoreCase(name)
                .orElseGet(() ->
                        categoryRepository.save(
                                new Category(
                                        name,
                                        department
                                )
                        )
                );
    }


    // =========================================================
    // SUBCATEGORIES
    // =========================================================

    private void addSubcategories(
            Category category,
            String... names
    ) {

        for (String name : names) {

            if (
                    !subcategoryRepository
                            .existsByNameIgnoreCaseAndCategoryId(
                                    name,
                                    category.getId()
                            )
            ) {

                Subcategory subcategory =
                        new Subcategory();

                subcategory.setName(name);
                subcategory.setCategory(category);
                subcategory.setActive(true);

                subcategoryRepository.save(
                        subcategory
                );
            }
        }
    }
}