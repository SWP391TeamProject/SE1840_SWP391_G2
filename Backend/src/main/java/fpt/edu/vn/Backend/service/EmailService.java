package fpt.edu.vn.Backend.service;

import jakarta.mail.MessagingException;

public interface EmailService {
    void sendAuctionCancellationEmail(String to, String depositAmount) throws MessagingException;
}
