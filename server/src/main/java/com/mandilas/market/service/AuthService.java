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

    public User register(
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

        // NEVER store the plain password.
        user.setPassword(
                passwordEncoder.encode(password)
        );

        user.setRole(userRole);

        if (userRole == User.Role.SELLER) {
            user.setStoreName(storeName.trim());
            user.setSellerVerified(false);
        }

        return userRepository.save(user);
    }

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

        if (!passwordEncoder.matches(
                password,
                user.getPassword()
        )) {
            throw new RuntimeException(
                    "Invalid email or password."
            );
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResult(user, token);
    }

    public record LoginResult(
            User user,
            String token
    ) {
    }
}