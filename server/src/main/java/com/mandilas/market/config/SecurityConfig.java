package com.mandilas.market.config;

import com.mandilas.market.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // =================================================
                // CSRF
                // =================================================
                //
                // JWT API does not use CSRF tokens.
                //
                .csrf(csrf ->
                        csrf.disable()
                )


                // =================================================
                // CORS
                // =================================================
                //
                // Enable global CORS configuration.
                //
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )


                // =================================================
                // SESSION MANAGEMENT
                // =================================================
                //
                // JWT authentication is stateless.
                //
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =================================================
                // AUTHORIZATION RULES
                // =================================================

                .authorizeHttpRequests(auth -> auth

                        // =================================================
                        // PUBLIC BACKEND HEALTH CHECK
                        // =================================================

                        .requestMatchers(
                                "/"
                        )
                        .permitAll()


                        // =================================================
                        // PUBLIC AUTHENTICATION
                        // =================================================

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        )
                        .permitAll()


                        // =================================================
                        // SELLER STORE MANAGEMENT
                        // =================================================
                        //
                        // /manage/me does NOT contain:
                        //
                        // - seller ID
                        // - seller email
                        //
                        // The authenticated seller is identified
                        // from the verified JWT.
                        //
                        // JWT
                        //   ↓
                        // userId
                        //   ↓
                        // JwtAuthenticationFilter
                        //   ↓
                        // Authentication details
                        //   ↓
                        // StoreController
                        //   ↓
                        // StoreService
                        //   ↓
                        // StoreRepository.findBySellerId()
                        //
                        // Only SELLER users can access these endpoints.
                        //

                        .requestMatchers(
                                "/api/stores/manage/**"
                        )
                        .hasRole("SELLER")


                        // =================================================
                        // SELLER PRODUCT MANAGEMENT
                        // =================================================

                        .requestMatchers(
                                "/api/products/seller/**"
                        )
                        .hasRole("SELLER")


                        // =================================================
                        // PUBLIC STORE BROWSING
                        // =================================================
                        //
                        // Public store pages do not require
                        // authentication.
                        //

                        .requestMatchers(
                                "/api/stores/**"
                        )
                        .permitAll()


                        // =================================================
                        // PUBLIC PRODUCT BROWSING
                        // =================================================

                        .requestMatchers(
                                "/api/products/**"
                        )
                        .permitAll()


                        // =================================================
                        // ORDERS
                        // =================================================
                        //
                        // Both buyers and sellers may access
                        // order endpoints according to their role.
                        //

                        .requestMatchers(
                                "/api/orders/**"
                        )
                        .hasAnyRole(
                                "BUYER",
                                "SELLER"
                        )


                        // =================================================
                        // PAYSTACK
                        // =================================================

                        .requestMatchers(
                                "/api/paystack/**"
                        )
                        .authenticated()


                        // =================================================
                        // EVERYTHING ELSE
                        // =================================================
                        //
                        // Any endpoint not explicitly public
                        // requires authentication.
                        //

                        .anyRequest()
                        .authenticated()
                )


                // =========================================================
                // DISABLE DEFAULT LOGIN
                // =========================================================

                .formLogin(form ->
                        form.disable()
                )


                // =========================================================
                // DISABLE HTTP BASIC
                // =========================================================

                .httpBasic(basic ->
                        basic.disable()
                )


                // =========================================================
                // DISABLE DEFAULT LOGOUT
                // =========================================================

                .logout(logout ->
                        logout.disable()
                )


                // =========================================================
                // JWT AUTHENTICATION FILTER
                // =========================================================
                //
                // Run our JWT filter before Spring's normal
                // username/password authentication filter.
                //

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =========================================================
    // GLOBAL CORS CONFIGURATION
    // =========================================================

    /**
     * Global CORS configuration.
     *
     * This allows the React frontend to communicate
     * with the Spring Boot backend.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        // =========================================================
        // ALLOWED ORIGINS
        // =========================================================
        //
        // Supports:
        // - Vercel deployments
        // - Local React development
        //

        configuration.setAllowedOriginPatterns(
                List.of(
                        "https://*.vercel.app",
                        "http://localhost:*",
                        "https://localhost:*"
                )
        );


        // =========================================================
        // ALLOWED HTTP METHODS
        // =========================================================

        configuration.setAllowedMethods(
                List.of(
                        HttpMethod.GET.name(),
                        HttpMethod.POST.name(),
                        HttpMethod.PUT.name(),
                        HttpMethod.PATCH.name(),
                        HttpMethod.DELETE.name(),
                        HttpMethod.OPTIONS.name()
                )
        );


        // =========================================================
        // ALLOWED HEADERS
        // =========================================================
        //
        // Includes:
        // - Authorization
        // - Content-Type
        // - Other frontend request headers
        //

        configuration.setAllowedHeaders(
                List.of("*")
        );


        // =========================================================
        // CREDENTIALS
        // =========================================================

        configuration.setAllowCredentials(
                true
        );


        // =========================================================
        // CORS CACHE
        // =========================================================
        //
        // Browser caches successful preflight requests
        // for one hour.
        //

        configuration.setMaxAge(
                3600L
        );


        // =========================================================
        // REGISTER CORS CONFIGURATION
        // =========================================================

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}