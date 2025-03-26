package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Seat;
import com.example.demo.services.SeatService;

@RestController
@RequestMapping("/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    // Lock a seat
    @PostMapping("/lock")
    public ResponseEntity<Seat> lockSeat(@RequestParam Long tierId, 
                                         @RequestParam String seatNo, 
                                         @RequestParam String userEmail) {
        Seat lockedSeat = seatService.lockSeat(tierId, seatNo, userEmail);
        return ResponseEntity.ok(lockedSeat);
    }

    // Unlock a seat (for payment failure or timeout)
    @PutMapping("/unlock/{seatId}")
    public ResponseEntity<String> unlockSeat(@PathVariable Long seatId) {
        seatService.unlockSeat(seatId);
        return ResponseEntity.ok("Seat unlocked successfully.");
    }

    // Book a seat when payment succeeds
    @PutMapping("/book/{seatId}")
    public ResponseEntity<String> bookSeat(@PathVariable Long seatId) {
        seatService.bookSeat(seatId);
        return ResponseEntity.ok("Seat booked successfully.");
    }
}

