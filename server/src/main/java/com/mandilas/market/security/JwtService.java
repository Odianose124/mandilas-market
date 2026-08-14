package com.mandilas.market.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;

    /*
     * JWT expires after 24 hours.
     */
    private final long expirationTime =
            1000L * 60 * 60 * 24;


    /*
     * =========================================================
     * CONSTRUCTOR
     * =========================================================
     */
    public JwtService(
            @Value("${jwt.secret}") String secret
    ) {

        if (secret == null ||
                secret.length() < 32) {

            throw new IllegalArgumentException(
                    "JWT secret must be at least 32 characters long."
            );
        }

        this.secretKey =
                Keys.hmacShaKeyFor(
                        secret.getBytes(
                                StandardCharsets.UTF_8
                        )
                );
    }


    /*
     * =========================================================
     * GENERATE TOKEN
     * =========================================================
     *
     * Token contains:
     *
     * - email
     * - userId
     * - role
     *
     * Example payload:
     *
     * {
     *     "sub": "seller@example.com",
     *     "userId": 15,
     *     "role": "SELLER"
     * }
     */
    public String generateToken(
            Long userId,
            String email,
            String role
    ) {

        Date now =
                new Date();

        Date expiration =
                new Date(
                        now.getTime()
                                + expirationTime
                );

        return Jwts.builder()

                /*
                 * Subject = user's email.
                 */
                .subject(email)

                /*
                 * Real database user ID.
                 */
                .claim(
                        "userId",
                        userId
                )

                /*
                 * BUYER or SELLER.
                 */
                .claim(
                        "role",
                        role
                )

                .issuedAt(now)

                .expiration(expiration)

                .signWith(secretKey)

                .compact();
    }


    /*
     * =========================================================
     * EXTRACT EMAIL
     * =========================================================
     */
    public String extractEmail(
            String token
    ) {

        return getClaims(token)
                .getSubject();
    }


    /*
     * =========================================================
     * EXTRACT USER ID
     * =========================================================
     *
     * This reads the actual database user ID
     * stored inside the JWT.
     */
    public Long extractUserId(
            String token
    ) {

        Number userId =
                getClaims(token)
                        .get("userId", Number.class);

        if (userId == null) {

            throw new RuntimeException(
                    "User ID is missing from JWT."
            );
        }

        return userId.longValue();
    }


    /*
     * =========================================================
     * EXTRACT ROLE
     * =========================================================
     */
    public String extractRole(
            String token
    ) {

        return getClaims(token)
                .get("role", String.class);
    }


    /*
     * =========================================================
     * VALIDATE TOKEN
     * =========================================================
     */
    public boolean isValid(
            String token
    ) {

        try {

            getClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }


    /*
     * =========================================================
     * GET CLAIMS
     * =========================================================
     *
     * This verifies the JWT signature and expiration.
     */
    private Claims getClaims(
            String token
    ) {

        return Jwts.parser()

                .verifyWith(secretKey)

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }
}