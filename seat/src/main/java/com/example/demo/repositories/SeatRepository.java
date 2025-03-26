package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entities.Seat;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    
    List<Seat> findByTierId(Long tierId);
    
    Optional<Seat> findBySeatNoAndTierId(String seatNo, Long tierId);

    List<Seat> findBySeatIdIn(List<Long> seatIds);

    List<Seat> findByStatus(SeatStatus status);
}

