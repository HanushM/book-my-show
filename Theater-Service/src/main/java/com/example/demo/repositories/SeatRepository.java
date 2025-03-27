package com.example.demo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Seat;
import com.example.demo.models.SeatStatus;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
	List<Seat> findByTier_TierId(int tierId);
    
    Optional<Seat> findBySeatNoAndTier_TierId(int seatNo, int tierId);

    List<Seat> findBySeatIdIn(List<Integer> seatIds);

    List<Seat> findByStatus(SeatStatus status);

    List<Seat> findByStatusAndLockedBy(SeatStatus status, String lockedBy);
}
