package com.example.demo.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Show;
import com.example.demo.repos.ShowtimeRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;
    
    public Integer getScreenIdByShowId(Long showId) {
        return showtimeRepository.findById(showId)
                .map(Show::getScreenId)
                .orElse(null); 
    }

    public List<Show> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    public Optional<Show> getShowtimeById(Long id) {
        return showtimeRepository.findById(id);
    }

    public List<Show> getShowtimesByDate(LocalDate date) {
        return showtimeRepository.findByDate(date);
    }

    public Show saveShowtime(Show showtime) {
        return showtimeRepository.save(showtime);
    }

    public void deleteShowtime(Long id) {
        showtimeRepository.deleteById(id);
    }
}

