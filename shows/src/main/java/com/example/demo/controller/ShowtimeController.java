package com.example.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Show;
import com.example.demo.service.ShowtimeService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/shows")
public class ShowtimeController {

    @Autowired
    private ShowtimeService showtimeService;

    @GetMapping
    public List<Show> getAllShowtimes() {
        return showtimeService.getAllShowtimes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Show> getShowtimeById(@PathVariable Long id) {
        Optional<Show> showtime = showtimeService.getShowtimeById(id);
        return showtime.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/screenid/{showId}")
    public ResponseEntity<Integer> getScreenIdByShowId(@PathVariable Long showId) {
        Integer screenId = showtimeService.getScreenIdByShowId(showId);
        return (screenId != null) ? ResponseEntity.ok(screenId) : ResponseEntity.notFound().build();
    }

    @GetMapping("/date/{date}")
    public List<Show> getShowtimesByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return showtimeService.getShowtimesByDate(date);
    }
    
    @GetMapping("/screen-times")
    public List<Map<String, Object>> getScreenIdAndStartTime(
            @RequestParam String movieName,
            @RequestParam String date
    ) {
        LocalDate localDate = LocalDate.parse(date);
        List<Object[]> results = showtimeService.getScreenIdAndStartTimeByMovieAndDate(movieName, localDate);

        return results.stream().map(obj -> Map.of(
        		
        		"timeId", obj[0],
                "screenId", obj[1],
                "startTime", obj[2]
        )).collect(Collectors.toList());
    }


    @PostMapping("/add")
    public Show createShowtime(@RequestBody Show showtime) {
        return showtimeService.saveShowtime(showtime);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }
}

