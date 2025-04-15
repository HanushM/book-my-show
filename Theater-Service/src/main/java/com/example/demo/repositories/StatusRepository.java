package com.example.demo.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.models.Status;

public interface StatusRepository extends JpaRepository<Status, Long> {

    List<Status> findByShowIdAndSeat_SeatIdIn(long showId, List<Long> seatIds);

    List<Status> findByShowIdAndSeat_SeatIdInAndLockedBy(long showId, List<Long> seatIds, String userEmail);

    List<Status> findByShowIdAndLockedBy(long showId, String userEmail);
    List<Status> findByShowId(long showId);
    
    @Query("SELECT s FROM Status s WHERE s.status = 'LOCKED' AND s.lockedUntil < ?1")
    List<Status> findExpiredLockedSeats(LocalDateTime now);
}
