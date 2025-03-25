package com.example.demo.services;

import com.example.demo.entities.Payment;
import com.example.demo.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // **Create a new payment**
    public Payment createPayment(double amount, String method) {
        Payment payment = new Payment();
        
        payment.setAmount(amount);
        payment.setMethod(method);
        payment.setTimestamp(LocalDateTime.now());
        payment.setStatus("ACTIVE");    
        return paymentRepository.save(payment);
    }

    // **Get payment status**
    public String getPaymentStatus(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .map(Payment::getStatus)
                .orElse("NOT_FOUND");
    }

    // **Randomly Set Payment Status & Perform Actions**
    public void setPaymentStatus(Long paymentId) {
        Optional<Payment> optionalPayment = paymentRepository.findById(paymentId);

        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();

            // Randomly assign SUCCESS or FAILURE
            String newStatus = new Random().nextBoolean() ? "SUCCESS" : "FAILURE";
            payment.setStatus(newStatus);
            paymentRepository.save(payment);

            
           
        }
    }

  
}
