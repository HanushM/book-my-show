package com.example.demo.services;

import com.example.demo.entities.Payment;
import com.example.demo.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String SEAT_SERVICE_URL = "http://localhost:8081/seats";
    private final String BOOKING_SERVICE_URL = "http://localhost:8083/bookings";
    // Create Payment
    public  void createPayment(String emailId, String method) {
        // Get locked seats for the user
        List<Long> lockedSeats = restTemplate.getForObject(SEAT_SERVICE_URL + "/locked?userEmail=" + emailId, List.class);

        if (lockedSeats == null || lockedSeats.isEmpty()) {
            throw new RuntimeException("No locked seats found for user: " + emailId);
        }

        // Get seat prices
        Map<Integer, Integer> seatPrices = restTemplate.getForObject(SEAT_SERVICE_URL + "/prices?seatIds=" + lockedSeats, Map.class);

        if (seatPrices == null) {
            throw new RuntimeException("Failed to fetch seat prices");
        }

        // Calculate total amount
        double totalAmount = seatPrices.values().stream().mapToDouble(Integer::doubleValue).sum();

        // Create Payment object
        Payment payment = new Payment();
        payment.setEmailId(emailId);
        payment.setMethod(method);
        payment.setAmount(totalAmount);
        payment.setTimestamp(LocalDateTime.now());
        payment.setStatus("ACTIVE");
    }

    // Generate Payment Status
    public String generatePaymentStatus(Long paymentId) {
        Random random = new Random();
        boolean isSuccess = random.nextBoolean(); // Randomly decide success or failure

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        List<Long> lockedSeats = restTemplate.getForObject(SEAT_SERVICE_URL + "/locked?userEmail=" + payment.getEmailId(), List.class);
        if (isSuccess) {
            payment.setStatus("SUCCESS");

            if (lockedSeats != null && !lockedSeats.isEmpty()) {
                restTemplate.postForObject(
                    BOOKING_SERVICE_URL + "/create?paymentId=" + paymentId + "&emailId=" + payment.getEmailId(),
                    lockedSeats,  // Correctly passing seatIds as request body
                    Void.class  // No need to handle response
                );
            }
            paymentRepository.save(payment);
        }
 else {
            payment.setStatus("FAILURE");
            if (lockedSeats != null && !lockedSeats.isEmpty()) {
                restTemplate.put(SEAT_SERVICE_URL + "/release", lockedSeats);
            }
        }
        return payment.getStatus();
        
       
    }
}
