package com.example.demo.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.entity.Show;
import com.example.demo.repos.ShowtimeRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;
    @Autowired
    private RestTemplate restTemplate;
    
    private final static String STATUS_URL="http://THEATER-SERVICE/status";
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

    public Show saveShowtime(Show showTime) {
        // Send showId as a query parameter
        Show returnVal=showtimeRepository.save(showTime);
        restTemplate.postForObject(STATUS_URL + "/add?showId=" + showTime.getTimeId(), null, String.class);
        return returnVal;
        }
 

    public void deleteShowtime(Long id) {
        showtimeRepository.deleteById(id);
    }
    
    public List<Object[]> getScreenIdAndStartTimeByMovieAndDate(String movieName, LocalDate date) {
        return showtimeRepository.findScreenIdAndStartTimeByMovieNameAndDate(movieName, date);
    }
}

