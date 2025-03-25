package com.example.demo.services;



import com.example.demo.entities.Booking;
import com.example.demo.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    

    @Autowired
    private RestTemplate restTemplate; // To call Seat and Payment services

    private final String SEAT_SERVICE_URL = "http://localhost:8081/seats"; // Seat Service API

    // **Create Booking**
    public Booking createBooking(Long paymentId, String emailId, List<Long> seatIds) {
        Booking booking = new Booking();
        booking.setPaymentId(paymentId);
        booking.setEmailId(emailId);
        booking.setSeatIds(seatIds);
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    // **Delete Booking**
    public void deleteBooking(Long bookingId) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);

        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            bookingRepository.deleteById(bookingId);

            // Call Seat Service to unlock seats
            unlockSeats(booking.getSeatIds());
        }
    }



    // **Unlock Seats**
    private void unlockSeats(List<Long> seatIds) {
        String url = SEAT_SERVICE_URL + "/unlock";
        restTemplate.postForObject(url, seatIds, Void.class);
    }
}
