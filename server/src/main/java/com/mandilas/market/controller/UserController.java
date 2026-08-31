package com.mandilas.market.controller;

import com.mandilas.market.model.User;
import com.mandilas.market.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET USER BY EMAIL
    // =========================================================
    //
    // GET /api/users/email/{email}
    //
    // Used by the frontend to find the seller's database ID
    // using the seller email stored on the product.
    //

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(
            @PathVariable String email
    ) {

        try {

            if (email == null || email.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Email is required."
                                )
                        );
            }

            User user =
                    userRepository
                            .findByEmail(email.trim())
                            .orElse(null);

            if (user == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "User not found."
                                )
                        );
            }

            // Return only the information the frontend needs.
            // Password is already WRITE_ONLY in User.java,
            // but we deliberately return a small response anyway.
            return ResponseEntity.ok(
                    Map.of(
                            "id", user.getId(),
                            "firstName", user.getFirstName(),
                            "lastName", user.getLastName(),
                            "email", user.getEmail(),
                            "role", user.getRole().name(),
                            "storeName",
                            user.getStoreName() != null
                                    ? user.getStoreName()
                                    : ""
                    )
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to find user."
                            )
                    );
        }
    }
}