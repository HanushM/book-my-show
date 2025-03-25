package com.example.demo.controllers;

import com.example.demo.entities.Payment;
import com.example.demo.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // **Create a new payment**
    @PostMapping("/create")
    public Payment createPayment(
                                 @RequestParam double amount,
                                 @RequestParam String method) {
        return paymentService.createPayment(amount, method);
    }

    // **Check Payment Status**
    @GetMapping("/{bookingId}/status")
    public String getPaymentStatus(@PathVariable Long bookingId) {
        return paymentService.getPaymentStatus(bookingId);
    }

    // **Process Payment Status Randomly**
    @PutMapping("/{paymentId}/process")
    public void processRandomPayment(@PathVariable Long paymentId) {
        paymentService.setPaymentStatus(paymentId);
    }
}
