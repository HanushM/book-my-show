package com.example.demo.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Show;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Show, Long> {
    List<Show> findByDate(LocalDate date);
    
    @Query("SELECT s.timeId,s.screenId, s.startTime FROM Show s WHERE s.movieName = :movieName AND s.date = :date")
    List<Object[]> findScreenIdAndStartTimeByMovieNameAndDate(@Param("movieName") String movieName, @Param("date") LocalDate date);

    
}
