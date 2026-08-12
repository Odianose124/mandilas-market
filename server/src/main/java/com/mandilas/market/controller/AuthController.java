package com.mandilas.market.controller;

import com.mandilas.market.model.User;
import com.mandilas.market.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {

        try {

            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            String email = request.get("email");
            String phone = request.get("phone");
            String password = request.get("password");
            String role = request.get("role");

            if (firstName == null ||
                lastName == null ||
                email == null ||
                phone == null ||
                password == null) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "All required fields must be provided."
                        ));
            }

            User user = authService.register(
                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                    role
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Account created successfully.",
                            "id", user.getId(),
                            "firstName", user.getFirstName(),
                            "lastName", user.getLastName(),
                            "email", user.getEmail(),
                            "phone", user.getPhone(),
                            "role", user.getRole().name(),
                            "sellerVerified", user.isSellerVerified()
                    ));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message", e.getMessage()
                    ));
        }
    }
}