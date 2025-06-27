package com.makemytrip.makemytrip.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.makemytrip.makemytrip.models.Hotel;

public interface HotelRepository extends MongoRepository<Hotel, String> {
    
    // 🔍 Custom query to find hotels by location (case insensitive search using regex)
    List<Hotel> findByLocationRegexIgnoreCase(String location);
    List<Hotel> findByLocation(String location); // 🆕 Mongo query
}
