package com.example.demo.services;

import com.example.demo.entities.Booking;
import com.example.demo.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    
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
        if (!bookingRepository.existsById(bookingId)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(bookingId);
    }
}
