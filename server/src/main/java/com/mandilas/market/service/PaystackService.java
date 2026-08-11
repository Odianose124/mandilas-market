package com.mandilas.market.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaystackService {

    private static final String PAYSTACK_INITIALIZE_URL =
            "https://api.paystack.co/transaction/initialize";

    private static final String PAYSTACK_VERIFY_URL =
            "https://api.paystack.co/transaction/verify/";

    @Value("${paystack.secret-key}")
    private String secretKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public PaystackService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Initialize a Paystack transaction.
     *
     * @param email customer email
     * @param amount amount in Naira
     * @return Paystack authorization URL and reference
     */
    public Map<String, Object> initializeTransaction(
            String email,
            double amount
    ) {

        try {

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);

            headers.set(
                    "Authorization",
                    "Bearer " + secretKey
            );

            /*
             * Paystack expects the amount in kobo.
             *
             * Example:
             *
             * ₦10,000 = 1,000,000 kobo
             */
            long amountInKobo =
                    Math.round(amount * 100);

            Map<String, Object> requestBody =
                    new HashMap<>();

            requestBody.put(
                    "email",
                    email
            );

            requestBody.put(
                    "amount",
                    amountInKobo
            );

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(
                            requestBody,
                            headers
                    );

            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            PAYSTACK_INITIALIZE_URL,
                            request,
                            String.class
                    );

            if (!response.getStatusCode().is2xxSuccessful()) {

                throw new RuntimeException(
                        "Paystack transaction initialization failed"
                );
            }

            JsonNode json =
                    objectMapper.readTree(
                            response.getBody()
                    );

            if (!json.path("status").asBoolean()) {

                String message =
                        json.path("message")
                                .asText(
                                        "Unable to initialize Paystack transaction"
                                );

                throw new RuntimeException(message);
            }

            JsonNode data =
                    json.path("data");

            Map<String, Object> result =
                    new HashMap<>();

            result.put(
                    "authorization_url",
                    data.path("authorization_url").asText()
            );

            result.put(
                    "access_code",
                    data.path("access_code").asText()
            );

            result.put(
                    "reference",
                    data.path("reference").asText()
            );

            return result;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Paystack initialization failed: "
                            + e.getMessage(),
                    e
            );
        }
    }

    /**
     * Verify a Paystack transaction.
     *
     * @param reference Paystack transaction reference
     * @return Paystack verification response
     */
    public Map<String, Object> verifyTransaction(
            String reference
    ) {

        try {

            HttpHeaders headers =
                    new HttpHeaders();

            headers.set(
                    "Authorization",
                    "Bearer " + secretKey
            );

            headers.setContentType(
                    MediaType.APPLICATION_JSON
            );

            HttpEntity<Void> request =
                    new HttpEntity<>(headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            PAYSTACK_VERIFY_URL + reference,
                            HttpMethod.GET,
                            request,
                            String.class
                    );

            if (!response.getStatusCode().is2xxSuccessful()) {

                throw new RuntimeException(
                        "Paystack verification failed"
                );
            }

            JsonNode json =
                    objectMapper.readTree(
                            response.getBody()
                    );

            if (!json.path("status").asBoolean()) {

                String message =
                        json.path("message")
                                .asText(
                                        "Payment verification failed"
                                );

                throw new RuntimeException(message);
            }

            JsonNode data =
                    json.path("data");

            Map<String, Object> result =
                    new HashMap<>();

            result.put(
                    "status",
                    data.path("status").asText()
            );

            result.put(
                    "reference",
                    data.path("reference").asText()
            );

            result.put(
                    "amount",
                    data.path("amount").asLong()
            );

            result.put(
                    "currency",
                    data.path("currency").asText()
            );

            result.put(
                    "email",
                    data.path("customer")
                            .path("email")
                            .asText()
            );

            result.put(
                    "paid",
                    "success".equalsIgnoreCase(
                            data.path("status").asText()
                    )
            );

            return result;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Paystack verification failed: "
                            + e.getMessage(),
                    e
            );
        }
    }
}