package com.example.demo.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.entities.Seat;
import com.example.demo.entities.SeatStatus;
import com.example.demo.repositories.SeatRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;
    
    @Autowired
    private RestTemplate restTemplate; // To call Booking Service

    private final String BOOKING_SERVICE_URL = "http://localhost:8082/bookings/create"; // Booking Service URL

    // Lock seat for a user
    public Seat lockSeat(Long tierId, String seatNo, String userEmail) {
        Optional<Seat> seatOpt = seatRepository.findBySeatNoAndTierId(seatNo, tierId);

        if (seatOpt.isEmpty() || seatOpt.get().getStatus() != SeatStatus.AVAILABLE) {
            throw new RuntimeException("Seat not available");
        }

        Seat seat = seatOpt.get();
        seat.setStatus(SeatStatus.LOCKED);
        seat.setLockedBy(userEmail);
        seat.setLockedUntil(LocalDateTime.now().plusMinutes(5));

        return seatRepository.save(seat);
    }

    // Unlock seat when payment fails or timer expires
    public void unlockSeat(Long seatId) {
        Optional<Seat> seatOpt = seatRepository.findById(seatId);

        if (seatOpt.isPresent() && seatOpt.get().getStatus() == SeatStatus.LOCKED) {
            Seat seat = seatOpt.get();
            seat.setStatus(SeatStatus.AVAILABLE);
            seat.setLockedBy(null);
            seat.setLockedUntil(null);
            seatRepository.save(seat);
        }
    }

    // Book seat when payment is successful
    public void bookSeat(Long seatId) {
        Optional<Seat> seatOpt = seatRepository.findById(seatId);

        if (seatOpt.isPresent() && seatOpt.get().getStatus() == SeatStatus.LOCKED) {
            Seat seat = seatOpt.get();
            seat.setStatus(SeatStatus.BOOKED);
            seat.setLockedBy(null);
            seat.setLockedUntil(null);
            seatRepository.save(seat);
        }
    }
}

