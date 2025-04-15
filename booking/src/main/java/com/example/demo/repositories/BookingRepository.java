package com.example.demo.repositories;

import com.example.demo.entities.Booking;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
	Optional<Booking> findByPaymentId(Long paymentId);
}
