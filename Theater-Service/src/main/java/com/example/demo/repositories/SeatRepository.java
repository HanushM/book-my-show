package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Seat;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
	List<Seat> findByTier_TierId(int tierId);
}
