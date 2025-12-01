package com.ecommerce.app.service;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otp);
}