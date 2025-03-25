package com.example.demo.controllers;

import com.example.demo.entities.Booking;
import com.example.demo.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // **Create Booking**
    @PostMapping("/create")
    public Booking createBooking(@RequestParam Long paymentId,
                                 @RequestParam String emailId,
                                 @RequestBody List<Long> seatIds) {
        return bookingService.createBooking(paymentId, emailId, seatIds);
    }

    // **Delete Booking**
    @DeleteMapping("/{bookingId}")
    public void deleteBooking(@PathVariable Long bookingId) {
        bookingService.deleteBooking(bookingId);
    }

}
