package com.example.demo.controllers;

import com.example.demo.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Create Payment
    @PostMapping("/create")
    public ResponseEntity<Void> createPayment(@RequestParam String emailId, @RequestParam String method) {
        paymentService.createPayment(emailId, method);
        return ResponseEntity.ok().build();
    }

    // Generate Payment Status
    @PostMapping("/status/{paymentId}")
    public ResponseEntity<String> generatePaymentStatus(@PathVariable Long paymentId) {
        String status = paymentService.generatePaymentStatus(paymentId);
        return ResponseEntity.ok("Payment Status: " + status);
    }
}
