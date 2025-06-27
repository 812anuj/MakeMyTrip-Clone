package com.makemytrip.makemytrip.models;

import java.time.LocalDate; // ✅ Required for date

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "hotels")
public class Hotel {
    @Id
    private String _id;

    private String hotelName;
    private String location;
    private double pricePerNight;
    private int availableRooms;
    private String amenities;

    private LocalDate checkInDate; // ✅ Newly added: for booking & refund policy

    // 🔍 Getters and Setters

    public String getId() {
        return _id;
    }

    public void setId(String id) {
        this._id = id;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public int getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(int availableRooms) {
        this.availableRooms = availableRooms;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public LocalDate getCheckInDate() { // ✅ Getter for check-in date
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) { // ✅ Setter for check-in date
        this.checkInDate = checkInDate;
    }
}
