package com.example.demo.controllers;

import com.example.demo.entities.Payment;
import com.example.demo.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Create Payment
    @PostMapping("/create")
    public ResponseEntity<Long> createPayment(
            @RequestParam String emailId, 
            @RequestParam String method) {
        
        Long paymentId = paymentService.createPayment(emailId, method);
        return ResponseEntity.ok(paymentId);
    }

    // Generate Payment Status
    @PostMapping("/status/{paymentId}")
    public ResponseEntity<Payment> generatePaymentStatus(@PathVariable Long paymentId) {
        Payment payment = paymentService.generatePaymentStatus(paymentId);
        return ResponseEntity.status(HttpStatus.OK).body(payment);
    }
}
