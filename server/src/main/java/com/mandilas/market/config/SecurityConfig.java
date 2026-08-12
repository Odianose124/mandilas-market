package com.mandilas.market.config;

import com.mandilas.market.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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

                // Disable CSRF because we are using JWT
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors -> {})

                // JWT authentication is stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // ==========================================
                        // PUBLIC AUTHENTICATION
                        // ==========================================

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        ).permitAll()


                        // ==========================================
                        // SELLER PRODUCT MANAGEMENT
                        // MUST COME BEFORE PUBLIC PRODUCTS
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

                // Disable HTTP Basic authentication
                .httpBasic(basic -> basic.disable())

                // JWT handles authentication
                .logout(logout -> logout.disable())

                // Run JWT filter before Spring's username/password filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}