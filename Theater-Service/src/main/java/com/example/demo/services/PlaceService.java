package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Place;
import com.example.demo.repositories.PlaceRepository;

@Service
public class PlaceService {
	@Autowired
	PlaceRepository placeRepository;

    public Place addPlace(Place place) {
        return placeRepository.save(place);
    }
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }
    public Place getPlaceById(long pinCode) {
        return placeRepository.findById(pinCode).orElse(null);
    }
    public Place updatePlace(long pinCode, Place updatedPlace) {
        if (placeRepository.existsById(pinCode)) {
            updatedPlace.setPinCode(pinCode);
            return placeRepository.save(updatedPlace);
        }
        return null;
    }
    public boolean deletePlace(long pinCode) {
        if (placeRepository.existsById(pinCode)) {
            placeRepository.deleteById(pinCode);
            return true;
        }
        return false;
    }
}
