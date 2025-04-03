package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.models.Status;
import com.example.demo.services.StatusService;

@RestController
@RequestMapping("/status")
public class StatusController {
    @Autowired
    private StatusService statusService;

    @PostMapping("/initialize/{showId}")
    public ResponseEntity<String> initializeSeats(@PathVariable long showId) {
        statusService.initializeSeatsForShow(showId);
        return ResponseEntity.ok("Seats initialized for showId: " + showId);
    }
    
    @PostMapping("/lock")
    public List<Status> lockSeats(@RequestParam long showId, @RequestParam List<Integer> seatIds, @RequestParam String userEmail) {
        return statusService.lockSeats(showId, seatIds, userEmail);
    }

    @PutMapping("/extend-lock")
    public boolean extendSeatLockIfPaymentInProgress(@RequestParam long showId, @RequestParam List<Long> seatIds, @RequestParam String userEmail) {
        return statusService.extendSeatLockIfPaymentInProgress(showId, seatIds, userEmail);
    }

    @PutMapping("/confirm")
    public ResponseEntity<String> confirmSeats(@RequestParam long showId, @RequestBody List<Integer> seatIds) {
        statusService.confirmSeats(showId, seatIds);
        return ResponseEntity.ok("Seats confirmed successfully");
    }

    @PutMapping("/release")
    public ResponseEntity<String> releaseSeats(@RequestParam long showId, @RequestParam List<Integer> seatIds, @RequestParam String userEmail) {
        statusService.releaseSeats(showId, seatIds, userEmail);
        return ResponseEntity.ok("Seats released successfully");
    }

    @PutMapping("/unlockExpired")
    public ResponseEntity<String> unlockExpiredSeats() {
        statusService.unlockExpiredSeats();
        return ResponseEntity.ok("Expired seats unlocked successfully");
    }

    @GetMapping("/locked")
    public List<Integer> getLockedSeats(@RequestParam long showId, @RequestParam String userEmail) {
        return statusService.getLockedSeats(showId, userEmail);
    }
    
    @GetMapping("/seats/{showId}")
    public List<Status> getSeatsByShowId(@PathVariable long showId) {
        return statusService.getSeatsByShowId(showId);
    }
}
