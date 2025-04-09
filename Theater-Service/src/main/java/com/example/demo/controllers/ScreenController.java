package com.example.demo.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Screen;
import com.example.demo.models.Theater;
import com.example.demo.services.ScreenService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/screen")
public class ScreenController {
	@Autowired
	ScreenService screenService;
	
    @PostMapping("/addScreen")
    public ResponseEntity<?> addScreen(@RequestBody Screen screen) {
        if (screen.getTheater() == null || screen.getTheater().getTheaterId() == 0) {
            return new ResponseEntity<>("Theater is required", HttpStatus.BAD_REQUEST);
        }
        Screen newScreen = screenService.addScreen(screen);
        return new ResponseEntity<>(newScreen, HttpStatus.CREATED);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Screen>> getAllScreens() {
        List<Screen> screens = screenService.getAllScreens();
        return new ResponseEntity<>(screens, HttpStatus.OK);
    }
    
    @GetMapping("/{screenId}")
    public ResponseEntity<Screen> getScreenById(@PathVariable int screenId) {
        Optional<Screen> screen = screenService.getScreenById(screenId);
        return screen.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }	
    
    @GetMapping("/theater/{theaterId}")
    public ResponseEntity<List<Screen>> getScreensByTheater(@PathVariable int theaterId) {
        List<Screen> screens = screenService.getScreensByTheater(theaterId);
        return new ResponseEntity<>(screens, HttpStatus.OK);
    }
    
    @PutMapping("/update/{screenId}")
    public ResponseEntity<Screen> updateScreen(@PathVariable int screenId, @RequestBody Screen updatedScreen) {
        try {
            Screen screen = screenService.updateScreen(screenId, updatedScreen);
            return new ResponseEntity<>(screen, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @DeleteMapping("/delete/{screenId}")
    public ResponseEntity<Void> deleteScreen(@PathVariable int screenId) {
        screenService.deleteScreen(screenId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/theater-id/{screenId}")
    public Theater getTheaterByScreen(@PathVariable int screenId) {
        return screenService.getTheaterByScreenId(screenId);
    }
    
    @GetMapping("/screenList/{theaterId}")
    public ResponseEntity<List<Integer>> getScreenNoByTheaterId(@PathVariable int theaterId) {
        List<Integer> screenNumbers = screenService.getScreenNoByTheaterId(theaterId);
        if (screenNumbers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Return 404 if no screens are found
        }
        return new ResponseEntity<>(screenNumbers, HttpStatus.OK);  // Return 200 OK with the list
    }
    
    @GetMapping("/screenId")
    public Integer getScreenId(@RequestParam int num,@RequestParam int theaterId)
    {
 	   return  screenService.getScreenId(num, theaterId);
    }

}
