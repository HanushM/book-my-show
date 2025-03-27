package com.example.demo.controllers;

import com.example.demo.entities.Booking;
import com.example.demo.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create Booking
    
    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(@RequestParam Long paymentId,
                                                 @RequestParam String emailId,
                                                 @RequestBody List<Long> seatIds) {
        Booking booking = bookingService.createBooking(paymentId, emailId, seatIds);
        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok("Booking deleted successfully.");
    }
}
