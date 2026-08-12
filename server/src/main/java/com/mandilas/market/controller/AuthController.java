package com.mandilas.market.controller;

import com.mandilas.market.model.User;
import com.mandilas.market.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    /*
     * =========================
     * REGISTER
     * =========================
     */
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


            /*
             * Basic required-field validation.
             */
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


            /*
             * Register user and receive:
             *
             * - saved user
             * - JWT token
             */
            AuthService.RegistrationResult result =
                    authService.register(
                            firstName,
                            lastName,
                            email,
                            phone,
                            password,
                            role,
                            storeName
                    );


            User user = result.user();


            /*
             * Return the same authentication
             * structure used by login.
             */
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            Map.of(
                                    "message",
                                    "Account created successfully.",

                                    "token",
                                    result.token(),

                                    "user",
                                    userResponseData(user)
                            )
                    );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    /*
     * =========================
     * LOGIN
     * =========================
     */
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
                        .body(
                                Map.of(
                                        "message",
                                        "Email and password are required."
                                )
                        );
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
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    /*
     * =========================
     * USER RESPONSE
     * =========================
     *
     * We don't send the password back
     * to the frontend.
     */
    private Map<String, Object> userResponseData(
            User user
    ) {

        Map<String, Object> response =
                new HashMap<>();


        response.put(
                "id",
                user.getId()
        );

        response.put(
                "firstName",
                user.getFirstName()
        );

        response.put(
                "lastName",
                user.getLastName()
        );

        response.put(
                "email",
                user.getEmail()
        );

        response.put(
                "phone",
                user.getPhone()
        );

        response.put(
                "role",
                user.getRole().name()
        );

        response.put(
                "sellerVerified",
                user.isSellerVerified()
        );


        /*
         * Always provide storeName.
         *
         * This makes the frontend response
         * consistent for buyers and sellers.
         */
        response.put(
                "storeName",
                user.getStoreName() == null
                        ? ""
                        : user.getStoreName()
        );


        return response;
    }
}