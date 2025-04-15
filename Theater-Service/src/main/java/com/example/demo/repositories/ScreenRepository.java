package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.models.Screen;

public interface ScreenRepository extends JpaRepository<Screen, Integer> {
	List<Screen> findByTheater_TheaterId(int theaterId);
	
	@Query("select s.screenNo from Screen s where s.theater.theaterId = :theaterId")
	List<Integer> findScreenNoByTheaterId(@Param("theaterId") Integer theaterId);
	
	@Query("SELECT s.screenId FROM Screen s WHERE s.screenNo = :num AND s.theater.theaterId = :theaterId")
    Integer findScreenIdByTheaterIdAndScreenNo(@Param("num") int num, @Param("theaterId") Integer theaterId  );
}
