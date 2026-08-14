package com.mandilas.market.service;

import com.mandilas.market.model.User;
import com.mandilas.market.repository.UserRepository;
import com.mandilas.market.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StoreService storeService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            StoreService storeService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.storeService = storeService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // =========================================================
    // REGISTER
    // =========================================================

    /*
     * Creates a new BUYER or SELLER account.
     *
     * BUYER:
     * - Creates a normal marketplace account.
     * - Does not receive a store.
     *
     * SELLER:
     * - Creates the seller account.
     * - Automatically creates one real store.
     * - Generates a unique public store slug.
     *
     * No sellers, stores or products are hardcoded.
     *
     * The complete registration is transactional:
     *
     * User creation
     *       ↓
     * Seller store creation
     *       ↓
     * JWT generation
     *
     * If store creation fails, the user creation is
     * rolled back as well.
     */
    @Transactional
    public RegistrationResult register(
            String firstName,
            String lastName,
            String email,
            String phone,
            String password,
            String role,
            String storeName
    ) {

        // =====================================================
        // VALIDATION
        // =====================================================

        if (
                firstName == null ||
                firstName.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "First name is required."
            );
        }


        if (
                lastName == null ||
                lastName.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Last name is required."
            );
        }


        if (
                email == null ||
                email.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Email is required."
            );
        }


        if (
                phone == null ||
                phone.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Phone number is required."
            );
        }


        if (
                password == null ||
                password.length() < 8
        ) {

            throw new RuntimeException(
                    "Password must be at least 8 characters."
            );
        }


        // =====================================================
        // NORMALIZE EMAIL
        // =====================================================

        email =
                email
                        .trim()
                        .toLowerCase();


        // =====================================================
        // CHECK EXISTING ACCOUNT
        // =====================================================

        if (
                userRepository.existsByEmail(
                        email
                )
        ) {

            throw new RuntimeException(
                    "An account with this email already exists."
            );
        }


        // =====================================================
        // DETERMINE ACCOUNT TYPE
        // =====================================================

        User.Role userRole;

        try {

            userRole =
                    User.Role.valueOf(
                            role == null
                                    ? "BUYER"
                                    : role
                                            .trim()
                                            .toUpperCase()
                    );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid account type. Choose BUYER or SELLER."
            );
        }


        // =====================================================
        // SELLER STORE VALIDATION
        // =====================================================

        /*
         * Sellers must provide a store name.
         *
         * Buyers do not need one.
         */
        if (
                userRole == User.Role.SELLER &&
                (
                        storeName == null ||
                        storeName.trim().isEmpty()
                )
        ) {

            throw new RuntimeException(
                    "Store name is required for seller accounts."
            );
        }


        // =====================================================
        // CREATE USER
        // =====================================================

        User user =
                new User();


        user.setFirstName(
                firstName.trim()
        );


        user.setLastName(
                lastName.trim()
        );


        user.setEmail(
                email
        );


        user.setPhone(
                phone.trim()
        );


        /*
         * NEVER save the plain password.
         */
        user.setPassword(
                passwordEncoder.encode(
                        password
                )
        );


        user.setRole(
                userRole
        );


        // =====================================================
        // SELLER INFORMATION
        // =====================================================

        if (
                userRole == User.Role.SELLER
        ) {

            user.setStoreName(
                    storeName.trim()
            );


            /*
             * New sellers are not automatically verified.
             */
            user.setSellerVerified(
                    false
            );

        } else {

            /*
             * Buyers don't have stores.
             */
            user.setStoreName(
                    null
            );


            user.setSellerVerified(
                    false
            );
        }


        // =====================================================
        // SAVE USER
        // =====================================================

        /*
         * The database generates the real user ID.
         */
        User savedUser =
                userRepository.save(
                        user
                );


        // =====================================================
        // AUTOMATIC SELLER STORE CREATION
        // =====================================================

        /*
         * Every seller automatically receives
         * their own real marketplace store.
         *
         * StoreService handles:
         *
         * - seller validation
         * - duplicate-store protection
         * - slug generation
         * - duplicate slug protection
         * - database persistence
         */
        if (
                savedUser.getRole() ==
                        User.Role.SELLER
        ) {

            storeService.createStoreForSeller(
                    savedUser,
                    savedUser.getStoreName()
            );
        }


        // =====================================================
        // GENERATE JWT
        // =====================================================

        /*
         * JWT uses the REAL database ID.
         */
        String token =
                jwtService.generateToken(
                        savedUser.getId(),
                        savedUser.getEmail(),
                        savedUser.getRole().name()
                );


        // =====================================================
        // RETURN REGISTRATION RESULT
        // =====================================================

        return new RegistrationResult(
                savedUser,
                token
        );
    }


    // =========================================================
    // LOGIN
    // =========================================================

    public LoginResult login(
            String email,
            String password
    ) {

        // =====================================================
        // VALIDATION
        // =====================================================

        if (
                email == null ||
                email.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Email is required."
            );
        }


        if (
                password == null ||
                password.isEmpty()
        ) {

            throw new RuntimeException(
                    "Password is required."
            );
        }


        // =====================================================
        // NORMALIZE EMAIL
        // =====================================================

        email =
                email
                        .trim()
                        .toLowerCase();


        // =====================================================
        // FIND USER
        // =====================================================

        User user =
                userRepository
                        .findByEmail(
                                email
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password."
                                )
                        );


        // =====================================================
        // VERIFY PASSWORD
        // =====================================================

        if (
                !passwordEncoder.matches(
                        password,
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Invalid email or password."
            );
        }


        // =====================================================
        // GENERATE JWT
        // =====================================================

        String token =
                jwtService.generateToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole().name()
                );


        // =====================================================
        // RETURN LOGIN RESULT
        // =====================================================

        return new LoginResult(
                user,
                token
        );
    }


    // =========================================================
    // REGISTRATION RESULT
    // =========================================================

    public record RegistrationResult(
            User user,
            String token
    ) {
    }


    // =========================================================
    // LOGIN RESULT
    // =========================================================

    public record LoginResult(
            User user,
            String token
    ) {
    }
}