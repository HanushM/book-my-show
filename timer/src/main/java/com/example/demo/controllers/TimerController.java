package com.example.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Timer;
import com.example.demo.services.TimerService;

@RestController
@RequestMapping("/timers")
public class TimerController {

    @Autowired
    private TimerService timerService;

    // **Start a timer when user selects a seat**
    @PostMapping("/start")
    public ResponseEntity<Timer> startTimer(@RequestParam Long seatId, 
                                            @RequestParam String emailId) {
        Timer timer = timerService.startTimer(seatId, emailId);
        return ResponseEntity.ok(timer);
    }

    // **Extend the timer if payment is active**
    @PutMapping("/extend/{seatId}")
    public ResponseEntity<String> extendTimer(@PathVariable Long seatId) {
        timerService.extendTimer(seatId);
        return ResponseEntity.ok("Timer extended.");
    }

    // **Remove the timer when seat is unlocked**
    @DeleteMapping("/remove/{seatId}")
    public ResponseEntity<String> removeTimer(@PathVariable Long seatId) {
        timerService.removeTimer(seatId);
        return ResponseEntity.ok("Timer removed.");
    }

    // **Manually check and handle seat based on payment status**
    @GetMapping("/check/{seatId}")
    public ResponseEntity<String> checkAndHandleSeat(@PathVariable Long seatId) {
        timerService.checkPaymentAndHandleSeat(seatId);
        return ResponseEntity.ok("Checked payment status and handled seat accordingly.");
    }
}
