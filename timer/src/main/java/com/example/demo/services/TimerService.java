package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.entities.Timer;
import com.example.demo.repositories.TimerRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TimerService {

    @Autowired
    private TimerRepository timerRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String SEAT_SERVICE_URL = "http://localhost:8081/seats";
    private final String PAYMENT_SERVICE_URL = "http://localhost:8082/payments";

    // **Start a timer when user selects a seat**
    public Timer startTimer(Long seatId, String emailId) {
        Timer timer = new Timer();
        timer.setSeatId(seatId);
        timer.setEmailId(emailId);
        timer.setStartTime(LocalDateTime.now());
        timer.setEndTime(timer.getStartTime().plusMinutes(5));
        timer.setExtended(false);
        return timerRepository.save(timer);
    }

 
    public void extendTimer(Long seatId) {
        Timer timer = timerRepository.findBySeatId(seatId)
                .orElseThrow(() -> new RuntimeException("Timer not found"));

        if (!timer.isExtended()) {
            timer.setEndTime(timer.getEndTime().plusMinutes(5));
            timer.setExtended(true);
            timerRepository.save(timer);
        }
    }

    public void removeTimer(Long seatId) {
        timerRepository.findBySeatId(seatId)
                .ifPresent(timerRepository::delete);
    }


    public void checkPaymentAndHandleSeat(Long seatId) {
        Optional<Timer> timerOpt = timerRepository.findBySeatId(seatId);
        if (timerOpt.isEmpty()) {
            return; 
        }

        Timer timer = timerOpt.get();
        LocalDateTime now = LocalDateTime.now();

        String paymentStatus = restTemplate.getForObject(
                PAYMENT_SERVICE_URL + "/status/" + seatId, String.class);

        if ("SUCCESS".equalsIgnoreCase(paymentStatus)) {
            removeTimer(seatId);
            restTemplate.put(SEAT_SERVICE_URL + "/book/" + seatId, null);
            return;         }

        if (now.isAfter(timer.getEndTime())) {
            if ("ACTIVE".equalsIgnoreCase(paymentStatus) && !timer.isExtended()) {
                extendTimer(seatId); // Extend timer once
            } else if ("ACTIVE".equalsIgnoreCase(paymentStatus) && timer.isExtended()) {
                removeTimer(seatId);
                restTemplate.put(SEAT_SERVICE_URL + "/unlock/" + seatId, null);
            } else { // Payment is pending or failed
                removeTimer(seatId);
                restTemplate.put(SEAT_SERVICE_URL + "/unlock/" + seatId, null);
            }
        }
    }

    // **Scheduled task runs every 1 minute to check expired timers**
    @Scheduled(fixedRate = 60000)
    public void handleExpiredTimers() {
        List<Timer> timers = timerRepository.findAll();
        for (Timer timer : timers) {
            checkPaymentAndHandleSeat(timer.getSeatId());
        }
    }
}
