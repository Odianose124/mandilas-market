package com.mandilas.market.controller;

import com.mandilas.market.model.Department;
import com.mandilas.market.repository.DepartmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    public DepartmentController(
            DepartmentRepository departmentRepository
    ) {
        this.departmentRepository =
                departmentRepository;
    }

    @GetMapping
    public ResponseEntity<List<Department>> getDepartments() {

        return ResponseEntity.ok(
                departmentRepository
                        .findByActiveTrueOrderByNameAsc()
        );
    }
}