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

    public List<Seat> lockSeats(List<Long> seatIds, String userEmail) {
        List<Seat> seats = seatRepository.findBySeatIdIn(seatIds);

        for (Seat seat : seats) {
            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new RuntimeException("Seat " + seat.getSeatNo() + " is not available");
            }
            seat.setStatus(SeatStatus.LOCKED);
            seat.setLockedBy(userEmail);
            seat.setLockedUntil(LocalDateTime.now().plusMinutes(5)); // Lock for 5 minutes
        }

        return seatRepository.saveAll(seats);
    }

    public void confirmSeats(List<Long> seatIds) {
        List<Seat> seats = seatRepository.findBySeatIdIn(seatIds);

        for (Seat seat : seats) {
            if (seat.getStatus() == SeatStatus.LOCKED) {
                seat.setStatus(SeatStatus.BOOKED);
                seat.setLockedBy(null);
                seat.setLockedUntil(null);
            }
        }

        seatRepository.saveAll(seats);
    }

    public void releaseSeats(List<Long> seatIds) {
        List<Seat> seats = seatRepository.findBySeatIdIn(seatIds);

        for (Seat seat : seats) {
            if (seat.getStatus() == SeatStatus.LOCKED) {
                seat.setStatus(SeatStatus.AVAILABLE);
                seat.setLockedBy(null);
                seat.setLockedUntil(null);
            }
        }

        seatRepository.saveAll(seats);
    }

    public void unlockExpiredSeats() {
        List<Seat> lockedSeats = seatRepository.findByStatus(SeatStatus.LOCKED);

        for (Seat seat : lockedSeats) {
            if (seat.getLockedUntil() != null && seat.getLockedUntil().isBefore(LocalDateTime.now())) {
                seat.setStatus(SeatStatus.AVAILABLE);
                seat.setLockedBy(null);
                seat.setLockedUntil(null);
            }
        }

        seatRepository.saveAll(lockedSeats);
    }

    public boolean extendSeatLockIfPaymentInProgress(List<Long> seatIds, String userEmail) {
        List<Seat> seats = seatRepository.findBySeatIdIn(seatIds);
        boolean extended = false;

        for (Seat seat : seats) {
            if (seat.getStatus() == SeatStatus.LOCKED && 
                seat.getLockedBy().equals(userEmail) && 
                seat.getLockedUntil().isBefore(LocalDateTime.now().plusMinutes(1))) {
                seat.setLockedUntil(LocalDateTime.now().plusMinutes(3)); 
                extended = true;
            }
        }

        seatRepository.saveAll(seats);
        return extended;
    }
}

