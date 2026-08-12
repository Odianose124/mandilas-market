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
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> request
    ) {

        try {

            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            String email = request.get("email");
            String phone = request.get("phone");
            String password = request.get("password");
            String role = request.get("role");
            String storeName = request.get("storeName");

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
                    role,
                    storeName
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(userResponse(
                            user,
                            "Account created successfully."
                    ));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request
    ) {

        try {

            String email = request.get("email");
            String password = request.get("password");

            if (email == null || password == null) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Email and password are required."
                        ));
            }

            AuthService.LoginResult result =
                    authService.login(
                            email,
                            password
                    );

            User user = result.user();

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Login successful.",

                            "token",
                            result.token(),

                            "user",
                            userResponseData(user)
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }

    private Map<String, Object> userResponse(
            User user,
            String message
    ) {

        return Map.of(
                "message",
                message,

                "user",
                userResponseData(user)
        );
    }

    private Map<String, Object> userResponseData(
            User user
    ) {

        Map<String, Object> response =
                new java.util.HashMap<>();

        response.put("id", user.getId());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("role", user.getRole().name());
        response.put(
                "sellerVerified",
                user.isSellerVerified()
        );

        if (user.getStoreName() != null) {
            response.put(
                    "storeName",
                    user.getStoreName()
            );
        }

        return response;
    }
}