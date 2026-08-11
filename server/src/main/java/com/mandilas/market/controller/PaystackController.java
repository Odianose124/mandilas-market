package com.mandilas.market.controller;

import com.mandilas.market.service.PaystackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/paystack")
@CrossOrigin(origins = "http://localhost:5173")
public class PaystackController {

    private final PaystackService paystackService;

    public PaystackController(PaystackService paystackService) {
        this.paystackService = paystackService;
    }

    /*
     * Initialize Paystack payment
     */
    @PostMapping("/initialize")
    public ResponseEntity<?> initializePayment(
            @RequestBody Map<String, Object> request
    ) {

        try {

            String email = String.valueOf(
                    request.get("email")
            );

            double amount = Double.parseDouble(
                    String.valueOf(request.get("amount"))
            );

            if (email == null || email.isBlank()
                    || email.equals("null")) {

                return ResponseEntity
                        .badRequest()
                        .body("Customer email is required");
            }

            if (amount <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Payment amount must be greater than zero"
                        );
            }

            Map<String, Object> result =
                    paystackService.initializeTransaction(
                            email,
                            amount
                    );

            return ResponseEntity.ok(result);

        } catch (NumberFormatException e) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid payment amount");

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Payment initialization failed: "
                                    + e.getMessage()
                    );
        }
    }

    /*
     * Verify Paystack payment
     */
    @GetMapping("/verify/{reference}")
    public ResponseEntity<?> verifyPayment(
            @PathVariable String reference
    ) {

        try {

            if (reference == null
                    || reference.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Payment reference is required"
                        );
            }

            Map<String, Object> result =
                    paystackService.verifyTransaction(
                            reference
                    );

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Payment verification failed: "
                                    + e.getMessage()
                    );
        }
    }
}