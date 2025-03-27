package com.example.demo.services;

import com.example.demo.entities.Booking;
import com.example.demo.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    private RestTemplate restTemplate;

    private final String SEAT_SERVICE_URL = "http://localhost:8181/seat";

    
    public Booking createBooking(Long paymentId, String emailId, List<Long> seatIds) {
        Booking booking = new Booking();
        booking.setPaymentId(paymentId);
        booking.setEmailId(emailId);
        booking.setSeatIds(seatIds);
        booking.setStatus("CONFIRMED");
        return bookingRepository.save(booking);
    }

    // Cancel Booking
    public void cancelBooking(Long bookingId) {
    	Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        
        List<Long> seatIds = booking.getSeatIds(); // Assuming seatIds are stored in booking
        restTemplate.put(SEAT_SERVICE_URL + "/release", seatIds);

       
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }
}
