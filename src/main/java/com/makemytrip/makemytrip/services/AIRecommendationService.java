package com.makemytrip.makemytrip.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.HotelRepository;

@Service
public class AIRecommendationService {

    @Autowired
    private HotelRepository hotelRepository;

    // 🎯 Generate dummy user-based recommendations (can be improved with real booking data)
    public List<String> generateRecommendations(String userId) {
        List<String> recommendations = new ArrayList<>();

        // Example logic (replace with booking history or ML model if needed)
        if (userId.endsWith("1")) {
            recommendations.add("Bali Flight Deals – Because you searched for Beaches!");
            recommendations.add("Goa Hotels – 20% off on Beach Resorts");
        } else {
            recommendations.add("Manali Flights – You viewed Mountain destinations!");
            recommendations.add("Shimla Hotels – Recommended for your past hill-station stays.");
        }

        return recommendations;
    }

    // 🎯 New: Recommend Hotels by Location (MongoDB connected)
    public List<Hotel> recommendHotelsByLocation(String location) {
        // Find hotels in MongoDB that match the location (case insensitive), limit to 5
        return hotelRepository.findByLocationRegexIgnoreCase(location).stream()
                .limit(5)
                .toList();
    }
}


