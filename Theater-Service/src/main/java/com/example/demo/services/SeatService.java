package com.example.demo.services;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.models.Seat;
import com.example.demo.models.SeatStatus;
import com.example.demo.models.Tier;
import com.example.demo.repositories.SeatRepository;
import com.example.demo.repositories.TierRepository;

@Service
public class SeatService {
    @Autowired
    private SeatRepository seatRepository;
    
    @Autowired
    private TierRepository tierRepository;
    @Autowired
    private RestTemplate restTemplate;
 
    private final String SHOW_SERVICE_URL = "http://SHOWS/shows";
    
    
    public Seat addSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public Optional<Seat> getSeatById(int seatId) {
        return seatRepository.findById(seatId);
    }

    public List<Seat> getSeatsByTier(int tierId) {
        return seatRepository.findByTier_TierId(tierId);
    }

    public Seat updateSeat(int seatId, Seat updatedSeat) {
        Optional<Seat> existingSeat = seatRepository.findById(seatId);
        if (existingSeat.isPresent()) {
            Seat seat = existingSeat.get();
            seat.setSeatNo(updatedSeat.getSeatNo());
            seat.setStatus(updatedSeat.getStatus());
            return seatRepository.save(seat);
        } else {
            throw new RuntimeException("Seat not found with ID: " + seatId);
        }
    }

    public void deleteSeat(int seatId) {
        seatRepository.deleteById(seatId);
    }

    public List<Seat> lockSeats(List<Integer> seatIds, String userEmail) {
        List<Seat> seats = seatRepository.findBySeatIdIn(seatIds);

        for (Seat seat : seats) {
            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new RuntimeException("Seat " + seat.getSeatNo() + " is not available");
            }
            seat.setStatus(SeatStatus.LOCKED);
            seat.setLockedBy(userEmail);
            seat.setLockedUntil(LocalDateTime.now().plusMinutes(5)); // Initial Lock - 5 minutes
        }

        return seatRepository.saveAll(seats);
    }

    public boolean extendSeatLockIfPaymentInProgress(List<Integer> seatIds, String userEmail) {
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

    public void confirmSeats(List<Integer> seatIds) {
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

    public void releaseSeats(List<Integer> seatIds) {
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

    public List<Integer> getLockedSeats(String userEmail) {
        return seatRepository.findSeatIdsByStatusAndLockedBy(SeatStatus.LOCKED, userEmail);
    }

    public Map<Integer, Integer> getSeatAmount(List<Integer> seatIds) {
        List<Seat> seats = seatRepository.findBySeatIdIn(seatIds);
        Map<Integer, Integer> seatAmounts = new HashMap<>();

        for (Seat seat : seats) {
            seatAmounts.put(seat.getSeatId(), seat.getTier().getAmount());
        }

        return seatAmounts;
    }
    
    public List<Seat> getSeatsByShowId(Long showId) {	
        int screenId = restTemplate.getForObject("http://SHOWS/shows"+ "/screenid/" + showId, Integer.class);
        System.out.print(screenId);
     	List<Tier> tiers = tierRepository.findByScreen_ScreenId(screenId);
     	System.out.print(tiers);
         List<Integer> tierIds = tiers.stream().map(Tier::getTierId).toList();
         System.out.println("Tier IDs: "+tierIds);
         return seatRepository.findByTier_TierIdIn(tierIds);
       }
}
