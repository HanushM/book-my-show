package com.example.demo.services;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.models.Seat;
import com.example.demo.models.SeatStatus;
import com.example.demo.models.Status;
import com.example.demo.models.Tier;
import com.example.demo.repositories.SeatRepository;
import com.example.demo.repositories.StatusRepository;
import com.example.demo.repositories.TierRepository;

@Service
public class StatusService {
    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private TierRepository tierRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private StatusRepository statusRepository;

    private static final String SHOW_SERVICE_URL = "http://SHOW-SERVICE";

    public void initializeSeatsForShow(long showId) {
        String url = SHOW_SERVICE_URL + "/show/screenid/" + showId;
        ResponseEntity<Integer> response = restTemplate.getForEntity(url, Integer.class);
        
        Integer screenId = response.getBody();
        if (screenId == null) {
            throw new RuntimeException("Screen ID not found for showId: " + showId);
        }
        List<Tier> tiers = tierRepository.findByScreen_ScreenId(screenId);
        List<Integer> tierIds = tiers.stream().map(Tier::getTierId).collect(Collectors.toList());
        List<Seat> seats = seatRepository.findByTier_TierIdIn(tierIds);
        List<Status> statusList = seats.stream().map(seat -> {
            Status status = new Status();
            status.setShowId(showId);
            status.setSeat(seat);
            status.setStatus(SeatStatus.AVAILABLE);
            status.setLockedBy(null);
            status.setLockedUntil(null);
            return status;
        }).collect(Collectors.toList());
        statusRepository.saveAll(statusList);
    }
    
    public List<Status> lockSeats(long showId, List<Integer> seatIds, String userEmail) {
        List<Status> statuses = statusRepository.findByShowIdAndSeat_SeatIdIn(showId, seatIds);

        for (Status status : statuses) {
            if (status.getStatus() != SeatStatus.AVAILABLE) {
                throw new RuntimeException("Seat " + status.getSeat().getSeatNo() + " is not available");
            }
            status.setStatus(SeatStatus.LOCKED);
            status.setLockedBy(userEmail);
            status.setLockedUntil(LocalDateTime.now().plusMinutes(5)); 
        }

        return statusRepository.saveAll(statuses);
    }

    public boolean extendSeatLockIfPaymentInProgress(long showId, List<Long> seatIds, String userEmail) {
        List<Status> statuses = statusRepository.findByShowIdAndSeat_SeatIdInAndLockedBy(showId, seatIds, userEmail);
        boolean extended = false;

        for (Status status : statuses) {
            if (status.getLockedUntil() != null && status.getLockedUntil().isBefore(LocalDateTime.now().plusMinutes(1))) {
                status.setLockedUntil(LocalDateTime.now().plusMinutes(3));
                extended = true;
            }
        }

        if (extended) {
            statusRepository.saveAll(statuses);
        }
        return extended;
    }

    public void confirmSeats(long showId, List<Integer> seatIds) {
        List<Status> statuses = statusRepository.findByShowIdAndSeat_SeatIdIn(showId, seatIds);

        for (Status status : statuses) {
            if (status.getStatus() == SeatStatus.LOCKED) {
                status.setStatus(SeatStatus.BOOKED);
                status.setLockedBy(null);
                status.setLockedUntil(null);
            } else {
                throw new RuntimeException("Seat " + status.getSeat().getSeatNo() + " cannot be confirmed");
            }
        }

        statusRepository.saveAll(statuses);
    }

    public void releaseSeats(long showId, List<Integer> seatIds, String userEmail) {
        List<Status> statuses = statusRepository.findByShowIdAndSeat_SeatIdIn(showId, seatIds);

        for (Status status : statuses) {
            if (status.getStatus() == SeatStatus.LOCKED && status.getLockedBy().equals(userEmail)) {
                status.setStatus(SeatStatus.AVAILABLE);
                status.setLockedBy(null);
                status.setLockedUntil(null);
            }
        }

        statusRepository.saveAll(statuses);
    }

    public void unlockExpiredSeats() {
        List<Status> expiredLocks = statusRepository.findExpiredLockedSeats(LocalDateTime.now());

        for (Status status : expiredLocks) {
            status.setStatus(SeatStatus.AVAILABLE);
            status.setLockedBy(null);
            status.setLockedUntil(null);
        }

        statusRepository.saveAll(expiredLocks);
    }

    
    public List<Integer> getLockedSeats(long showId, String userEmail) {
        return statusRepository.findByShowIdAndLockedBy(showId, userEmail)
                .stream()
                .map(status -> status.getSeat().getSeatId())
                .collect(Collectors.toList());
    }

}