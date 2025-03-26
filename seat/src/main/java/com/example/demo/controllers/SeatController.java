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


    @PostMapping("/lock")
    public List<Seat> lockSeats(@RequestParam List<Long> seatIds, @RequestParam String userEmail) {
        return seatService.lockSeats(seatIds, userEmail);
    }

    @PutMapping("/confirm")
    public void confirmSeats(@RequestBody List<Long> seatIds) {
        seatService.confirmSeats(seatIds);
    }

    @PutMapping("/release")
    public void releaseSeats(@RequestBody List<Long> seatIds) {
        seatService.releaseSeats(seatIds);
    }

    @PutMapping("/unlockExpired")
    public void unlockExpiredSeats() {
        seatService.unlockExpiredSeats();
    }

    @PutMapping("/extend-lock")
    public boolean extendSeatLockIfPaymentInProgress(@RequestParam List<Long> seatIds, @RequestParam String userEmail) {
        return seatService.extendSeatLockIfPaymentInProgress(seatIds, userEmail);}
    
}

