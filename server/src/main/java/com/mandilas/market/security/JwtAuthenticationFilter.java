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


    /*
     * =========================================================
     * CONSTRUCTOR
     * =========================================================
     */
    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }


    /*
     * =========================================================
     * JWT FILTER
     * =========================================================
     *
     * Reads the JWT from:
     *
     * Authorization: Bearer <token>
     *
     * If the token is valid, the authenticated user is placed
     * inside the Spring Security context.
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        /*
         * =====================================================
         * GET AUTHORIZATION HEADER
         * =====================================================
         */
        String authorizationHeader =
                request.getHeader("Authorization");


        /*
         * =====================================================
         * NO JWT
         * =====================================================
         *
         * Continue as an unauthenticated request.
         *
         * Public endpoints can still work normally.
         */
        if (
                authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        /*
         * =====================================================
         * EXTRACT TOKEN
         * =====================================================
         *
         * Remove:
         *
         * Bearer
         *
         * and the following space.
         */
        String token =
                authorizationHeader.substring(7).trim();


        /*
         * Do not process an empty token.
         */
        if (token.isEmpty()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        try {

            /*
             * =================================================
             * VALIDATE JWT
             * =================================================
             */
            if (!jwtService.isValid(token)) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            /*
             * =================================================
             * EXTRACT EMAIL
             * =================================================
             *
             * The email is the JWT subject.
             */
            String email =
                    jwtService.extractEmail(token);


            /*
             * =================================================
             * EXTRACT USER ID
             * =================================================
             *
             * This is the real database ID stored inside
             * the JWT during registration/login.
             */
            Long userId =
                    jwtService.extractUserId(token);


            /*
             * =================================================
             * BASIC JWT DATA VALIDATION
             * =================================================
             */
            if (
                    email == null ||
                    email.trim().isEmpty() ||
                    userId == null
            ) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            /*
             * =================================================
             * FIND USER IN DATABASE
             * =================================================
             *
             * We do not trust the JWT alone.
             *
             * The user must still exist in the database.
             */
            User user =
                    userRepository
                            .findByEmail(
                                    email.trim().toLowerCase()
                            )
                            .orElse(null);


            /*
             * =================================================
             * USER MUST EXIST
             * =================================================
             */
            if (user == null) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            /*
             * =================================================
             * CHECK IF ALREADY AUTHENTICATED
             * =================================================
             */
            if (
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() != null
            ) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            /*
             * =================================================
             * VERIFY DATABASE USER ID
             * =================================================
             *
             * The ID inside the JWT must belong to the same
             * database user whose email was found.
             *
             * This prevents a mismatched JWT from being used
             * to access another user's store.
             */
            if (
                    user.getId() == null ||
                    !user.getId().equals(userId)
            ) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            /*
             * =================================================
             * GET USER ROLE
             * =================================================
             */
            String role =
                    "ROLE_" +
                    user.getRole().name();


            /*
             * =================================================
             * CREATE AUTHENTICATION
             * =================================================
             *
             * Principal:
             *
             *     email
             *
             * This keeps existing code that uses:
             *
             *     authentication.getName()
             *
             * working.
             */
            UsernamePasswordAuthenticationToken
                    authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            role
                                    )
                            )
                    );


            /*
             * =================================================
             * STORE USER ID IN AUTHENTICATION DETAILS
             * =================================================
             *
             * StoreController's /manage/me endpoints will use:
             *
             *     authentication.getDetails()
             *
             * to retrieve the authenticated user's database ID.
             */
            authentication.setDetails(
                    userId
            );


            /*
             * =================================================
             * SET SECURITY CONTEXT
             * =================================================
             */
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );


        } catch (Exception ignored) {

            /*
             * =================================================
             * INVALID JWT
             * =================================================
             *
             * Do not expose internal JWT errors to the client.
             *
             * The request simply remains unauthenticated.
             *
             * Spring Security will then determine whether
             * the requested endpoint is public or protected.
             */
        }


        /*
         * =====================================================
         * CONTINUE REQUEST
         * =====================================================
         */
        filterChain.doFilter(
                request,
                response
        );
    }
}