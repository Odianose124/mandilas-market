package com.mandilas.market.security;

import com.mandilas.market.model.User;
import com.mandilas.market.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        // =========================================================
        // NO AUTHORIZATION HEADER
        // =========================================================

        if (
                authorizationHeader == null ||
                authorizationHeader.isBlank()
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // =========================================================
        // INVALID AUTHORIZATION FORMAT
        // =========================================================

        if (!authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // =========================================================
        // EXTRACT TOKEN
        // =========================================================

        String token =
                authorizationHeader
                        .substring(7)
                        .trim();

        if (token.isEmpty()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        try {

            // =====================================================
            // VALIDATE TOKEN
            // =====================================================

            try {

    jwtService.extractEmail(token);

} catch (Exception e) {

    System.out.println(
            "JWT DEBUG: TOKEN VALIDATION ERROR"
    );

    System.out.println(
            "JWT DEBUG: "
                    + e.getClass().getName()
    );

    System.out.println(
            "JWT DEBUG: "
                    + e.getMessage()
    );

    e.printStackTrace();

    filterChain.doFilter(
            request,
            response
    );

    return;
}

            // =====================================================
            // EXTRACT JWT DATA
            // =====================================================

            String email =
                    jwtService.extractEmail(token);

            Long userId =
                    jwtService.extractUserId(token);

            String jwtRole =
                    jwtService.extractRole(token);

            System.out.println(
                    "JWT DEBUG: email = " + email
            );

            System.out.println(
                    "JWT DEBUG: userId = " + userId
            );

            System.out.println(
                    "JWT DEBUG: jwtRole = " + jwtRole
            );

            // =====================================================
            // BASIC VALIDATION
            // =====================================================

            if (
                    email == null ||
                    email.isBlank() ||
                    userId == null
            ) {

                System.out.println(
                        "JWT DEBUG: Missing email or userId"
                );

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            // =====================================================
            // FIND USER
            // =====================================================

            User user =
                    userRepository
                            .findByEmail(
                                    email.trim().toLowerCase()
                            )
                            .orElse(null);

            if (user == null) {

                System.out.println(
                        "JWT DEBUG: User not found: "
                                + email
                );

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            // =====================================================
            // VERIFY USER ID
            // =====================================================

            if (
                    user.getId() == null ||
                    !user.getId().equals(userId)
            ) {

                System.out.println(
                        "JWT DEBUG: User ID mismatch"
                );

                System.out.println(
                        "JWT userId = " + userId
                );

                System.out.println(
                        "Database userId = "
                                + user.getId()
                );

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            // =====================================================
            // DATABASE ROLE
            // =====================================================

            if (user.getRole() == null) {

                System.out.println(
                        "JWT DEBUG: Database user has no role"
                );

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            String databaseRole =
                    user.getRole().name();

            String authority =
                    "ROLE_" + databaseRole;

            System.out.println(
                    "JWT DEBUG: Database role = "
                            + databaseRole
            );

            System.out.println(
                    "JWT DEBUG: Spring authority = "
                            + authority
            );

            // =====================================================
            // CREATE AUTHENTICATION
            // =====================================================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            authority
                                    )
                            )
                    );

            // =====================================================
            // STORE USER ID
            // =====================================================

            authentication.setDetails(
                    userId
            );

            // =====================================================
            // SET SECURITY CONTEXT
            // =====================================================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );

            System.out.println(
                    "JWT DEBUG: Authentication successful"
            );

            System.out.println(
                    "JWT DEBUG: Principal = "
                            + email
            );

            System.out.println(
                    "JWT DEBUG: Authority = "
                            + authority
            );

        } catch (Exception e) {

            /*
             * IMPORTANT:
             *
             * Do NOT silently ignore this anymore.
             *
             * We need to see exactly why the JWT
             * authentication is failing.
             */

            System.out.println(
                    "JWT DEBUG: Authentication failed"
            );

            System.out.println(
                    "JWT DEBUG: "
                            + e.getClass().getName()
            );

            System.out.println(
                    "JWT DEBUG: "
                            + e.getMessage()
            );

            e.printStackTrace();

            /*
             * Clear any partially-created authentication.
             */

            SecurityContextHolder
                    .clearContext();
        }

        // =========================================================
        // CONTINUE REQUEST
        // =========================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}