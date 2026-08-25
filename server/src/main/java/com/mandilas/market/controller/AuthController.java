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

    public AuthController(
            AuthService authService
    ) {
        this.authService = authService;
    }


    /*
     * =========================================================
     * REGISTER
     * =========================================================
     *
     * NO JWT
     * NO TOKEN
     *
     * Login/session is handled by the frontend using
     * localStorage.
     *
     * Seller registration still automatically creates
     * the seller's store.
     *
     * =========================================================
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> request
    ) {

        try {

            String firstName =
                    request.get("firstName");

            String lastName =
                    request.get("lastName");

            String email =
                    request.get("email");

            String phone =
                    request.get("phone");

            String password =
                    request.get("password");

            String role =
                    request.get("role");

            String storeName =
                    request.get("storeName");


            /*
             * Required-field validation.
             */
            if (
                    firstName == null ||
                    firstName.trim().isEmpty() ||

                    lastName == null ||
                    lastName.trim().isEmpty() ||

                    email == null ||
                    email.trim().isEmpty() ||

                    phone == null ||
                    phone.trim().isEmpty() ||

                    password == null ||
                    password.isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "All required fields must be provided."
                                )
                        );
            }


            /*
             * Register user.
             *
             * NO JWT.
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


            User user =
                    result.user();


            /*
             * Return user information only.
             *
             * DO NOT return a token.
             */
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            Map.of(
                                    "message",
                                    "Account created successfully.",

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

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    "Registration failed: "
                                            + e.getMessage()
                            )
                    );
        }
    }


    /*
     * =========================================================
     * LOGIN
     * =========================================================
     *
     * NO JWT
     * NO TOKEN
     *
     * The frontend receives the authenticated user's
     * information and stores it in localStorage.
     *
     * =========================================================
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request
    ) {

        try {

            String email =
                    request.get("email");

            String password =
                    request.get("password");


            if (
                    email == null ||
                    email.trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Email is required."
                                )
                        );
            }


            if (
                    password == null ||
                    password.isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Password is required."
                                )
                        );
            }


            /*
             * Login user.
             *
             * NO JWT.
             */
            AuthService.LoginResult result =
                    authService.login(
                            email,
                            password
                    );


            User user =
                    result.user();


            /*
             * Return user information only.
             *
             * IMPORTANT:
             * There is NO result.token() here.
             */
            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Login successful.",

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

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    "Login failed: "
                                            + e.getMessage()
                            )
                    );
        }
    }


    /*
     * =========================================================
     * USER RESPONSE DATA
     * =========================================================
     *
     * Password is NEVER returned.
     *
     * JWT/token is NOT returned.
     *
     * =========================================================
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
                user.getRole() == null
                        ? ""
                        : user.getRole().name()
        );


        response.put(
                "sellerVerified",
                user.isSellerVerified()
        );


        /*
         * Always provide storeName.
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