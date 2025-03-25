package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.models.Theater;
import com.example.demo.services.TheaterService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/theater")
public class TheaterController {
	@Autowired
	TheaterService theaterService;
	
    @PostMapping("/add")
    public ResponseEntity<Theater> addTheater(@RequestBody Theater theater) {
        Theater savedTheater = theaterService.addTheater(theater);
        return new ResponseEntity<>(savedTheater, HttpStatus.CREATED);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Theater>> getAllTheaters() {
        List<Theater> theaters = theaterService.getAllTheaters();
        return new ResponseEntity<>(theaters, HttpStatus.OK);
    }
    
    @GetMapping("/{theaterId}")
    public ResponseEntity<Theater> getTheaterById(@PathVariable int theaterId) {
        Theater theater = theaterService.getTheaterById(theaterId);
        return theater != null ? new ResponseEntity<>(theater, HttpStatus.OK)
                               : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/update/{theaterId}")
    public ResponseEntity<Theater> updateTheater(@PathVariable int theaterId, @RequestBody Theater updatedTheater) {
        Theater theater = theaterService.updateTheater(theaterId, updatedTheater);
        return theater != null ? new ResponseEntity<>(theater, HttpStatus.OK)
                               : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/delete/{theaterId}")
    public ResponseEntity<Void> deleteTheater(@PathVariable int theaterId) {
        boolean deleted = theaterService.deleteTheater(theaterId);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                       : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
	
}
