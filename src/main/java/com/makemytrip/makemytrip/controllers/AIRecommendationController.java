package com.makemytrip.makemytrip.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.services.AIRecommendationService;

@RestController
@RequestMapping("/recommendation")
public class AIRecommendationController {

    @Autowired
    private AIRecommendationService recommendationService;

    // 🎯 User-specific recommendation endpoint
    @GetMapping("/user/{userId}")
    public List<String> getRecommendations(@PathVariable String userId) {
        return recommendationService.generateRecommendations(userId);
    }

    // 🎯 Location-based Hotel Recommendation endpoint
    @GetMapping("/hotels")
    public List<Hotel> recommendHotelsByLocation(@RequestParam String location) {
        return recommendationService.recommendHotelsByLocation(location);
    }
}

