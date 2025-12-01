package com.ecommerce.app.service.impl;

import com.ecommerce.app.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            logger.info("Attempting to send OTP email to: {}", toEmail);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Mã xác thực đăng ký tài khoản - Ecommerce App");
            message.setText("Xin chào!\n\n" +
                    "Mã xác thực OTP của bạn là: " + otp +
                    "\n\nMã có hiệu lực trong 10 phút." +
                    "\n\nNếu bạn không yêu cầu mã này, vui lòng bỏ qua email này." +
                    "\n\nTrân trọng,\nEcommerce Team");

            mailSender.send(message);
            logger.info("OTP email sent successfully to: {}", toEmail);

        } catch (Exception e) {
            logger.error("Failed to send OTP email to: {}. Error: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Không thể gửi email xác thực: " + e.getMessage(), e);
        }
    }
}