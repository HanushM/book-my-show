package com.example.demo.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Seat;
import com.example.demo.services.SeatService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/seat")
public class SeatController {
    @Autowired
    private SeatService seatService;

    @PostMapping("/addSeat")
    public ResponseEntity<?> addSeat(@RequestBody Seat seat) {
    	if(seat.getTier()==null || seat.getTier().getTierId()==0) {
    		return new ResponseEntity<>("Tier is Required",HttpStatus.BAD_REQUEST);
    	}
        Seat newSeat = seatService.addSeat(seat);
        return new ResponseEntity<>(newSeat, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Seat>> getAllSeats() {
        List<Seat> seats = seatService.getAllSeats();
        return new ResponseEntity<>(seats, HttpStatus.OK);
    }

    @GetMapping("/{seatId}")
    public ResponseEntity<Seat> getSeatById(@PathVariable int seatId) {
        Optional<Seat> seat = seatService.getSeatById(seatId);
        return seat.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/tier/{tierId}")
    public ResponseEntity<List<Seat>> getSeatsByTier(@PathVariable int tierId) {
        List<Seat> seats = seatService.getSeatsByTier(tierId);
        return new ResponseEntity<>(seats, HttpStatus.OK);
    }

//    @PutMapping("/update/{seatId}")
//    public ResponseEntity<Seat> updateSeat(@PathVariable int seatId, @RequestBody Seat updatedSeat) {
//        try {
//            Seat seat = seatService.updateSeat(seatId, updatedSeat);
//            return new ResponseEntity<>(seat, HttpStatus.OK);
//        } catch (RuntimeException e) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }

    @DeleteMapping("/delete/{seatId}")
    public ResponseEntity<Void> deleteSeat(@PathVariable int seatId) {
        seatService.deleteSeat(seatId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/prices")
    public ResponseEntity<Map<Integer, Integer>> getSeatAmount(@RequestParam List<Integer> seatIds) {
        Map<Integer, Integer> seatPrices = seatService.getSeatAmount(seatIds);
        return ResponseEntity.ok(seatPrices);
    }
}
