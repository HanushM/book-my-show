package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Tier;
import com.example.demo.repositories.TierRepository;

@Service
public class TierService {
	@Autowired
    private TierRepository tierRepository;

    public Tier addTier(Tier tier) {
        return tierRepository.save(tier);
    }

    public List<Tier> getAllTiers() {
        return tierRepository.findAll();
    }

    public Optional<Tier> getTierById(int tierId) {
        return tierRepository.findById(tierId);
    }

    public List<Tier> getTiersByScreen(int screenId) {
        return tierRepository.findByScreen_ScreenId(screenId);
    }

    public Tier updateTier(int tierId, Tier updatedTier) {
        Optional<Tier> existingTier = tierRepository.findById(tierId);
        if (existingTier.isPresent()) {
            Tier tier = existingTier.get();
            tier.setTierName(updatedTier.getTierName());
            tier.setSeatCount(updatedTier.getSeatCount());
            return tierRepository.save(tier);
        } else {
            throw new RuntimeException("Tier not found with ID: " + tierId);
        }
    }

    public void deleteTier(int tierId) {
        tierRepository.deleteById(tierId);
    }

}
