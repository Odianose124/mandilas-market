package com.mandilas.market.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

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

                .csrf(csrf ->
                        csrf.disable()
                )

                // =================================================
                // CORS
                // =================================================

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // =================================================
                // AUTHORIZE REQUESTS
                // =================================================

                .authorizeHttpRequests(auth ->
                        auth

                                // -------------------------------------------------
                                // CORS PREFLIGHT
                                // -------------------------------------------------

                                .requestMatchers(
                                        HttpMethod.OPTIONS,
                                        "/**"
                                )
                                .permitAll()


                                // -------------------------------------------------
                                // SELLER ORDERS
                                // -------------------------------------------------
                                //
                                // Seller dashboard uses:
                                //
                                // GET /api/orders/seller?email=seller@email.com
                                //
                                // NO JWT
                                // NO Authentication object
                                // NO ROLE CHECK
                                //
                                // Seller email is supplied by the frontend
                                // localStorage session.
                                //

                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/orders/seller"
                                )
                                .permitAll()

                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/orders/seller/**"
                                )
                                .permitAll()


                                // -------------------------------------------------
                                // ALL OTHER REQUESTS
                                // -------------------------------------------------
                                //
                                // Current application configuration allows
                                // requests without Spring Security authentication.
                                //

                                .anyRequest()
                                .permitAll()
                )

                // =================================================
                // DISABLE DEFAULT LOGIN
                // =================================================

                .formLogin(form ->
                        form.disable()
                )

                // =================================================
                // DISABLE HTTP BASIC
                // =================================================

                .httpBasic(basic ->
                        basic.disable()
                )

                // =================================================
                // DISABLE LOGOUT
                // =================================================

                .logout(logout ->
                        logout.disable()
                );

        return http.build();
    }


    // =========================================================
    // CORS
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        // =========================================================
        // ALLOWED ORIGINS
        // =========================================================

        configuration.setAllowedOriginPatterns(
                List.of(
                        "https://*.vercel.app",
                        "http://localhost:*",
                        "https://localhost:*"
                )
        );


        // =========================================================
        // ALLOWED METHODS
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

        configuration.setAllowedHeaders(
                List.of("*")
        );


        // =========================================================
        // CREDENTIALS
        // =========================================================

        configuration.setAllowCredentials(true);


        // =========================================================
        // CACHE PREFLIGHT
        // =========================================================

        configuration.setMaxAge(3600L);


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