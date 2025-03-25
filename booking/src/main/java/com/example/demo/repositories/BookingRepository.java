package com.example.demo.repositories;


import com.example.demo.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByPaymentId(Long paymentId);
}

