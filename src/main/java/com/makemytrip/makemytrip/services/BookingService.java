package com.makemytrip.makemytrip.services;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;

@Service
public class BookingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public Booking bookFlight(String userId, String flightId, int seats, double price) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        Optional<Flight> flightOptional = flightRepository.findById(flightId);

        if (usersOptional.isPresent() && flightOptional.isPresent()) {
            Users user = usersOptional.get();
            Flight flight = flightOptional.get();

            if (flight.getAvailableSeats() >= seats) {
                flight.setAvailableSeats(flight.getAvailableSeats() - seats);
                flightRepository.save(flight);

                Booking booking = new Booking();
                booking.setType("Flight");
                booking.setBookingId(flightId);
                booking.setDate(LocalDate.now().toString());
                booking.setQuantity(seats);
                booking.setTotalPrice(price);
                booking.setUserEmail(user.getEmail());  
                booking.setFlightName(flight.getFlightName());
                booking.setDeparture(flight.getFrom());        
                booking.setDestination(flight.getTo());        

                user.getBookings().add(booking);
                userRepository.save(user);

                return booking;
            } else {
                throw new RuntimeException("Not enough seats available");
            }
        }
        throw new RuntimeException("User or flight not found");
    }

    public Booking bookhotel(String userId, String hotelId, int rooms, double price) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);

        if (usersOptional.isPresent() && hotelOptional.isPresent()) {
            Users user = usersOptional.get();
            Hotel hotel = hotelOptional.get();

            if (hotel.getAvailableRooms() >= rooms) {
                hotel.setAvailableRooms(hotel.getAvailableRooms() - rooms);
                hotelRepository.save(hotel);

                Booking booking = new Booking();
                booking.setType("Hotel");
                booking.setBookingId(hotelId);
                booking.setDate(LocalDate.now().toString());
                booking.setQuantity(rooms);
                booking.setTotalPrice(price);
                booking.setUserEmail(user.getEmail());
                booking.setHotelName(hotel.getHotelName());   
                booking.setHotelLocation(hotel.getLocation());

                user.getBookings().add(booking);
                userRepository.save(user);

                return booking;
            } else {
                throw new RuntimeException("Not enough rooms available");
            }
        }
        throw new RuntimeException("User or hotel not found");
    }

    // Updated cancelBooking method to REMOVE booking from MongoDB instead of marking as cancelled
    public Users.Booking cancelBooking(String userId, String bookingId, String reason) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the booking to cancel
        Users.Booking booking = user.getBookings().stream()
                .filter(b -> b.getBookingId().equals(bookingId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.isCancelled()) {
            throw new RuntimeException("Booking already cancelled");
        }

        double refundAmount = 0.0;

        if ("Flight".equals(booking.getType())) {
            Flight flight = flightRepository.findById(booking.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Flight not found"));
try {
    LocalDateTime departureTime = LocalDateTime.parse(
        flight.getDepartureTime(),
        DateTimeFormatter.ISO_LOCAL_DATE_TIME
    );

    LocalDateTime now = LocalDateTime.now();
    long hoursBetween = Duration.between(now, departureTime).toHours();

     if (hoursBetween >= 24) {
        refundAmount = booking.getTotalPrice() * 0.5;
    } else {
        refundAmount = 0.0;
    }

} catch (Exception e) {
    throw new RuntimeException("Error parsing departure time: " + e.getMessage());
}


            flight.setAvailableSeats(flight.getAvailableSeats() + booking.getQuantity());
            flightRepository.save(flight);

        } else if ("Hotel".equals(booking.getType())) {
            Hotel hotel = hotelRepository.findById(booking.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));

            hotel.setAvailableRooms(hotel.getAvailableRooms() + booking.getQuantity());
            hotelRepository.save(hotel);

            refundAmount = booking.getTotalPrice() * 0.5;
        }

        // Remove the booking from user's bookings list (MongoDB clean removal)
        user.getBookings().remove(booking);
        userRepository.save(user);

        // Return booking info to the frontend for confirmation (but this booking no longer exists in DB)
        booking.setCancelled(true);
        booking.setCancellationReason(reason);
        booking.setRefundAmount(refundAmount);
        booking.setRefundStatus(refundAmount > 0 ? "Processed" : "No Refund");

        return booking;
    }
}







