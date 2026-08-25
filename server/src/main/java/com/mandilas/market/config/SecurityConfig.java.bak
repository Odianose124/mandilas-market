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
                // SESSION
                // =================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth

                        // =================================================
                        // PUBLIC ROOT
                        // =================================================

                        .requestMatchers("/")
                        .permitAll()


                        // =================================================
                        // PUBLIC AUTH
                        // =================================================

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        )
                        .permitAll()


                        // =================================================
                        // SELLER PRODUCT CREATION
                        // =================================================
                        //
                        // IMPORTANT:
                        // Must be authenticated as SELLER.
                        //

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products"
                        )
                        .hasRole("SELLER")


                        // =================================================
                        // SELLER PRODUCT UPDATE
                        // =================================================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/*"
                        )
                        .hasRole("SELLER")


                        // =================================================
                        // SELLER PRODUCT DELETE
                        // =================================================

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/*"
                        )
                        .hasRole("SELLER")


                        // =================================================
                        // SELLER PRODUCT MANAGEMENT
                        // =================================================
                        //
                        // Explicitly allow:
                        //
                        // GET /api/products/seller
                        //

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/seller"
                        )
                        .hasRole("SELLER")


                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/seller/**"
                        )
                        .hasRole("SELLER")


                        // =================================================
                        // PUBLIC PRODUCT GET REQUESTS
                        // =================================================
                        //
                        // Buyers and guests can browse products.
                        //

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products",
                                "/api/products/*",
                                "/api/products/search",
                                "/api/products/category/**",
                                "/api/products/subcategory/**"
                        )
                        .permitAll()


                        // =================================================
                        // SELLER STORE MANAGEMENT
                        // =================================================

                        .requestMatchers(
                                "/api/stores/manage/**"
                        )
                        .hasRole("SELLER")


                        // =================================================
                        // PUBLIC STORE BROWSING
                        // =================================================

                        .requestMatchers(
                                "/api/stores/**"
                        )
                        .permitAll()


                        // =================================================
                        // ORDERS
                        // =================================================

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

                        .anyRequest()
                        .authenticated()
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
                )


                // =================================================
                // JWT FILTER
                // =================================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
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

        configuration.setAllowedOriginPatterns(
                List.of(
                        "https://*.vercel.app",
                        "http://localhost:*",
                        "https://localhost:*"
                )
        );

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

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

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