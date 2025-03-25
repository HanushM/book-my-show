package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Screen;

public interface ScreenRepository extends JpaRepository<Screen, Integer> {
	List<Screen> findByTheater_TheaterId(int theaterId);
}
