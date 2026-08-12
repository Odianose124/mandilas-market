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
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // JWT API does not use CSRF tokens
                .csrf(csrf -> csrf.disable())

                // Enable global CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // JWT authentication is stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // ==========================================
                        // PUBLIC BACKEND HEALTH CHECK
                        // ==========================================

                        .requestMatchers(
                                "/"
                        ).permitAll()

                        // ==========================================
                        // PUBLIC AUTHENTICATION
                        // ==========================================

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        ).permitAll()

                        // ==========================================
                        // SELLER PRODUCT MANAGEMENT
                        // ==========================================

                        .requestMatchers(
                                "/api/products/seller/**"
                        ).hasRole("SELLER")

                        // ==========================================
                        // PUBLIC PRODUCT BROWSING
                        // ==========================================

                        .requestMatchers(
                                "/api/products/**"
                        ).permitAll()

                        // ==========================================
                        // ORDERS
                        // ==========================================

                        .requestMatchers(
                                "/api/orders/**"
                        ).hasAnyRole("BUYER", "SELLER")

                        // ==========================================
                        // PAYSTACK
                        // ==========================================

                        .requestMatchers(
                                "/api/paystack/**"
                        ).authenticated()

                        // ==========================================
                        // EVERYTHING ELSE
                        // ==========================================

                        .anyRequest().authenticated()
                )

                // Disable default Spring Security login
                .formLogin(form -> form.disable())

                // Disable HTTP Basic
                .httpBasic(basic -> basic.disable())

                // Disable default logout
                .logout(logout -> logout.disable())

                // JWT authentication filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

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

        // Allow the live frontend and local development frontend
        configuration.setAllowedOriginPatterns(
                List.of(
                        "https://*.vercel.app",
                        "http://localhost:*",
                        "https://localhost:*"
                )
        );

        // HTTP methods used by the marketplace
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

        // Allow request headers including Authorization/JWT
        configuration.setAllowedHeaders(
                List.of("*")
        );

        // Allow Authorization credentials
        configuration.setAllowCredentials(true);

        // Cache browser CORS preflight results
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}