package com.example.demo.controllers;

import com.example.demo.entities.Booking;
import com.example.demo.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create Booking
    
    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(@RequestParam Long paymentId,
                                                 @RequestParam String emailId,
                                                 @RequestParam String seatIds) {
    	List<Long> seatIdList = Arrays.stream(seatIds.split(","))
                .map(Long::parseLong)
                .collect(Collectors.toList());
        Booking booking = bookingService.createBooking(paymentId, emailId, seatIdList);
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/byPayment")
    public Booking getBookingByPaymentId(@RequestParam Long paymentId) {
    	return bookingService.getBookingByPaymentId(paymentId);
    }

    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok("Booking deleted successfully.");
    }
}
