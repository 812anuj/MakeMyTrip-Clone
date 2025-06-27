package com.makemytrip.makemytrip.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.services.BookingService;
import com.makemytrip.makemytrip.services.EmailService;

import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/flight")
    public Users.Booking bookFlight(
            @RequestParam String userId,
            @RequestParam String flightId,
            @RequestParam int seats,
            @RequestParam double price) {

        // 1. Process booking
        Users.Booking booking = bookingService.bookFlight(userId, flightId, seats, price);

        try {
            // 2. Generate PDF E-ticket
            byte[] pdfData = emailService.generateETicketPdf(booking);

            // 3. Generate beautiful HTML email content
            String emailContent = emailService.generateEmailContent(booking);

            // 4. Send confirmation email with PDF E-ticket attached
            emailService.sendEmailWithAttachment(
                    booking.getUserEmail(), // get user's email from booking object
                    "Your Flight Booking Confirmation #" + booking.getBookingId(),
                    emailContent,
                    pdfData
            );
        } catch (MessagingException e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }

        return booking;
    }

    @PostMapping("/hotel")
    public Users.Booking bookHotel(
            @RequestParam String userId,
            @RequestParam String hotelId,
            @RequestParam int rooms,
            @RequestParam double price) {

        // 1. Process booking
        Users.Booking booking = bookingService.bookhotel(userId, hotelId, rooms, price);

        try {
            // 2. Generate PDF E-ticket
            byte[] pdfData = emailService.generateETicketPdf(booking);

            // 3. Generate beautiful HTML email content
            String emailContent = emailService.generateEmailContent(booking);

            // 4. Send confirmation email with PDF E-ticket attached
            emailService.sendEmailWithAttachment(
                    booking.getUserEmail(),
                    "Your Hotel Booking Confirmation #" + booking.getBookingId(),
                    emailContent,
                    pdfData
            );
        } catch (MessagingException e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }

        return booking;
    }



@PostMapping("/cancel")
public ResponseEntity<Users.Booking> cancelBooking(
    @RequestParam String userId,
    @RequestParam String bookingId,
    @RequestParam String reason) {

    Users.Booking cancelledBooking = bookingService.cancelBooking(userId, bookingId, reason);
    return ResponseEntity.ok(cancelledBooking); // ✅ return full Booking object
}





}

