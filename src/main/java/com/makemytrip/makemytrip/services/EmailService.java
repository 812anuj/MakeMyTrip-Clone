package com.makemytrip.makemytrip.services;

import java.io.ByteArrayOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.makemytrip.makemytrip.models.Users.Booking;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Send Email with PDF Attachment
    public void sendEmailWithAttachment(String toEmail, String subject, String htmlContent, byte[] pdfData) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // HTML content

        // Attach the PDF
        helper.addAttachment("e-ticket.pdf", new ByteArrayResource(pdfData));

        mailSender.send(message);
    }

    // Generate PDF E-Ticket using iText 5.5.13.3
    public byte[] generateETicketPdf(Booking booking) {
        try {
            Document document = new Document();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            document.add(new Paragraph("MakeMyTrip E-Ticket", titleFont));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Booking ID: " + booking.getBookingId(), normalFont));
            document.add(new Paragraph("Booking Type: " + booking.getType(), normalFont));
            document.add(new Paragraph("Booking Date: " + booking.getDate(), normalFont));
            document.add(new Paragraph("Quantity: " + booking.getQuantity(), normalFont));
            document.add(new Paragraph("Total Price: ₹" + booking.getTotalPrice(), normalFont));

            // Additional details based on booking type
            if ("Flight".equalsIgnoreCase(booking.getType())) {
                document.add(new Paragraph("Flight Name: " + booking.getFlightName(), normalFont));
                document.add(new Paragraph("Departure: " + booking.getDeparture(), normalFont));
                document.add(new Paragraph("Destination: " + booking.getDestination(), normalFont));
            } else if ("Hotel".equalsIgnoreCase(booking.getType())) {
                document.add(new Paragraph("Hotel Name: " + booking.getHotelName(), normalFont));
                document.add(new Paragraph("Hotel Location: " + booking.getHotelLocation(), normalFont));
            }

            document.add(new Paragraph("Cancellation Policy: 50% refund if cancelled 24 hrs before.", normalFont));

            document.close();
            return baos.toByteArray();
        } catch (DocumentException e) {
            return null;
        }
    }

    // Generate HTML Email Content
    public String generateEmailContent(Booking booking) {
        String additionalInfo = "";

        if ("Flight".equalsIgnoreCase(booking.getType())) {
            additionalInfo = String.format("""
                <tr><td><strong>Flight Name:</strong></td><td>%s</td></tr>
                <tr><td><strong>Departure:</strong></td><td>%s</td></tr>
                <tr><td><strong>Destination:</strong></td><td>%s</td></tr>
                """, booking.getFlightName(), booking.getDeparture(), booking.getDestination());
        } else if ("Hotel".equalsIgnoreCase(booking.getType())) {
            additionalInfo = String.format("""
                <tr><td><strong>Hotel Name:</strong></td><td>%s</td></tr>
                <tr><td><strong>Hotel Location:</strong></td><td>%s</td></tr>
                """, booking.getHotelName(), booking.getHotelLocation());
        }

        return String.format("""
        <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
          <table style="width:100%%; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
            <tr style="background-color:#4CAF50;">
              <td style="padding:20px; color:white; text-align:center;">
                <h2 style="margin:0;">Booking Confirmation</h2>
              </td>
            </tr>
            <tr>
              <td style="padding:20px;">
                <p>Dear Customer,</p>
                <p>Thank you for your booking. Here are your details:</p>
                <table style="width:100%%;">
                  <tr><td><strong>Booking ID:</strong></td><td>%s</td></tr>
                  <tr><td><strong>Booking Type:</strong></td><td>%s</td></tr>
                  <tr><td><strong>Date:</strong></td><td>%s</td></tr>
                  <tr><td><strong>Quantity:</strong></td><td>%d</td></tr>
                  <tr><td><strong>Total Price:</strong></td><td>₹%.2f</td></tr>
                  %s
                  <tr><td><strong>Cancellation Policy:</strong></td><td>50%% refund if cancelled 24 hours before travel date.</td></tr>
                </table>
                <p>For any queries, contact us at: <a href="mailto:contact.ra0info@gmail.com">contact.ra0info@gmail.com</a></p>
                <p>Happy Travels!</p>
              </td>
            </tr>
            <tr style="background-color:#f2f2f2;">
              <td style="padding:10px; text-align:center;">
                <small>&copy; 2025 MakeMyTrip. All rights reserved.</small>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """,
        booking.getBookingId(),
        booking.getType(),
        booking.getDate(),
        booking.getQuantity(),
        booking.getTotalPrice(),
        additionalInfo
        );
    }
}
