package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Theater;

public interface TheaterRepository extends JpaRepository<Theater, Integer> {
	List<Theater> findByPlace_PinCode(long pinCode);
}
