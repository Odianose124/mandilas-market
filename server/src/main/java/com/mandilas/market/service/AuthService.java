package com.mandilas.market.service;

import com.mandilas.market.model.User;
import com.mandilas.market.repository.UserRepository;
import com.mandilas.market.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /*
     * REGISTER
     *
     * Creates a new BUYER or SELLER account.
     * After the account is created, a JWT is generated
     * so the user is authenticated immediately.
     */
    public RegistrationResult register(
            String firstName,
            String lastName,
            String email,
            String phone,
            String password,
            String role,
            String storeName
    ) {

        if (firstName == null || firstName.trim().isEmpty()) {
            throw new RuntimeException("First name is required.");
        }

        if (lastName == null || lastName.trim().isEmpty()) {
            throw new RuntimeException("Last name is required.");
        }

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required.");
        }

        if (phone == null || phone.trim().isEmpty()) {
            throw new RuntimeException("Phone number is required.");
        }

        if (password == null || password.length() < 8) {
            throw new RuntimeException(
                    "Password must be at least 8 characters."
            );
        }

        email = email.trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException(
                    "An account with this email already exists."
            );
        }

        User.Role userRole;

        try {

            userRole = User.Role.valueOf(
                    role == null
                            ? "BUYER"
                            : role.trim().toUpperCase()
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid account type. Choose BUYER or SELLER."
            );
        }

        /*
         * Sellers must provide a store name.
         */
        if (userRole == User.Role.SELLER &&
                (storeName == null ||
                        storeName.trim().isEmpty())) {

            throw new RuntimeException(
                    "Store name is required for seller accounts."
            );
        }

        User user = new User();

        user.setFirstName(firstName.trim());
        user.setLastName(lastName.trim());
        user.setEmail(email);
        user.setPhone(phone.trim());

        /*
         * NEVER save the plain password.
         */
        user.setPassword(
                passwordEncoder.encode(password)
        );

        user.setRole(userRole);

        /*
         * Seller-specific information.
         */
        if (userRole == User.Role.SELLER) {

            user.setStoreName(
                    storeName.trim()
            );

            /*
             * New sellers are not verified automatically.
             */
            user.setSellerVerified(false);

        } else {

            /*
             * Buyers don't need a store.
             */
            user.setStoreName(null);
            user.setSellerVerified(false);
        }

        /*
         * Save the user first so that the database
         * generates the real user ID.
         */
        User savedUser = userRepository.save(user);

        /*
         * Generate JWT using the REAL database ID.
         */
        String token = jwtService.generateToken(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        return new RegistrationResult(
                savedUser,
                token
        );
    }


    /*
     * LOGIN
     */
    public LoginResult login(
            String email,
            String password
    ) {

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException(
                    "Email is required."
            );
        }

        if (password == null || password.isEmpty()) {
            throw new RuntimeException(
                    "Password is required."
            );
        }

        email = email.trim().toLowerCase();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password."
                        )
                );

        /*
         * Compare the entered password with
         * the encrypted database password.
         */
        if (!passwordEncoder.matches(
                password,
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid email or password."
            );
        }

        /*
         * Generate JWT for the existing user.
         */
        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResult(
                user,
                token
        );
    }


    /*
     * Registration result.
     */
    public record RegistrationResult(
            User user,
            String token
    ) {
    }


    /*
     * Login result.
     */
    public record LoginResult(
            User user,
            String token
    ) {
    }
}