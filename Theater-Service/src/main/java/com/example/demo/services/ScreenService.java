package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.example.demo.models.Screen;
import com.example.demo.models.Theater;
import com.example.demo.repositories.ScreenRepository;

@Service
public class ScreenService {
	@Autowired
	ScreenRepository screenRepository;
	
    public Screen addScreen(Screen screen) {
        return screenRepository.save(screen);
    }
    public List<Screen> getAllScreens() {
        return screenRepository.findAll();
    }
    public Optional<Screen> getScreenById(int screenId) {
        return screenRepository.findById(screenId);
    }
    public List<Screen> getScreensByTheater(int theaterId) {
        return screenRepository.findByTheater_TheaterId(theaterId);
    }
    public Screen updateScreen(int screenId, Screen updatedScreen) {
        Optional<Screen> existingScreen = screenRepository.findById(screenId);
        if (existingScreen.isPresent()) {
            Screen screen = existingScreen.get();
            screen.setScreenNo(updatedScreen.getScreenNo());
         
            screen.setCapacity(updatedScreen.getCapacity());
            return screenRepository.save(screen);
        } else {
            throw new RuntimeException("Screen not found with ID: " + screenId);
        }
    }
    public void deleteScreen(int screenId) {
        screenRepository.deleteById(screenId);
    }
    
    public Theater getTheaterByScreenId(int screenId) {
        Optional<Screen> screenOptional = screenRepository.findById(screenId);
        return screenOptional.map(Screen::getTheater).orElse(null);
    }
    
    
    public List<Integer> getScreenNoByTheaterId(int theaterId) {
        return screenRepository.findScreenNoByTheaterId(theaterId);
    }
    
   public Integer getScreenId(int num,int theaterId)
   {
	   return  screenRepository.findScreenIdByTheaterIdAndScreenNo(num, theaterId);
   }


	
}
