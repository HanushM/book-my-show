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

    public Optional<Seat> getSeatById(Long seatId) {
        return seatRepository.findById(seatId);
    }

    public List<Seat> getSeatsByIds(List<Long> seatIds) {
        return seatRepository.findAllById(seatIds);
    }
    
    public List<Seat> getSeatsByTier(int tierId) {
        return seatRepository.findByTier_TierId(tierId);
    }

//    public Seat updateSeat(int seatId, Seat updatedSeat) {
//        Optional<Seat> existingSeat = seatRepository.findById(seatId);
//        if (existingSeat.isPresent()) {
//            Seat seat = existingSeat.get();
//            seat.setSeatNo(updatedSeat.getSeatNo());
//            seat.setStatus(updatedSeat.getStatus());
//            return seatRepository.save(seat);
//        } else {
//            throw new RuntimeException("Seat not found with ID: " + seatId);
//        }
//    }

    public void deleteSeat(Long seatId) {
        seatRepository.deleteById(seatId);
    }

  

    public Map<Long, Integer> getSeatAmount(List<Long> seatIds) {
        List<Seat> seats = seatRepository.findBySeatIdIn(seatIds);
        Map<Long, Integer> seatAmounts = new HashMap<>();

        for (Seat seat : seats) {
            seatAmounts.put(seat.getSeatId(), seat.getTier().getAmount());
        }

        return seatAmounts;
    }
    
}
