package com.mandilas.market.service;

import com.mandilas.market.model.User;
import com.mandilas.market.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(
            String firstName,
            String lastName,
            String email,
            String phone,
            String password,
            String role
    ) {

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("An account with this email already exists.");
        }

        User user = new User();

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPhone(phone);

        // Never store the raw password
        user.setPassword(passwordEncoder.encode(password));

        User.Role userRole;

        try {
            userRole = User.Role.valueOf(role.toUpperCase());
        } catch (Exception e) {
            userRole = User.Role.BUYER;
        }

        user.setRole(userRole);

        if (userRole == User.Role.SELLER) {
            user.setSellerVerified(false);
        }

        return userRepository.save(user);
    }
}