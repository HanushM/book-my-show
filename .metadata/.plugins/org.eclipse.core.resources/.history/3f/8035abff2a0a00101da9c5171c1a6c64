package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Seat;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
	List<Seat> findByTier_TierId(int tierId);

	List<Seat> findByTierId(int tierId);
    
    Optional<Seat> findBySeatNoAndTierId(String seatNo, int tierId);

    List<Seat> findBySeatIdIn(List<Integer> seatIds);

    List<Seat> findByStatus(SeatStatus status);

    List<Seat> findByStatusAndLockedBy(SeatStatus status, String lockedBy);
}
