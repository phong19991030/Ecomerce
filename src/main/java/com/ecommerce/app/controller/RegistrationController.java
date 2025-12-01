// src/main/java/com/ecommerce/app/controller/RegistrationController.java
package com.ecommerce.app.controller;

import com.ecommerce.app.dto.OtpVerificationDto;
import com.ecommerce.app.dto.UserRegistrationDto;
import com.ecommerce.app.entity.Role;
import com.ecommerce.app.entity.User;
import com.ecommerce.app.service.EmailService;
import com.ecommerce.app.service.RoleService;
import com.ecommerce.app.service.UserService;
import com.ecommerce.app.util.OtpUtil;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashSet;

@Controller
@RequiredArgsConstructor
public class RegistrationController {

    private final UserService userService;
    private final RoleService roleService;
    private final EmailService emailService;
    private final OtpUtil otpUtil;
    private final PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(RegistrationController.class);

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new UserRegistrationDto());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute("user") UserRegistrationDto registrationDto,
                               BindingResult result,
                               RedirectAttributes redirectAttributes,
                               HttpSession session) {

        logger.info("Starting registration process for user: {}", registrationDto.getUsername());

        // Validate passwords match
        if (!registrationDto.getPassword().equals(registrationDto.getConfirmPassword())) {
            result.rejectValue("confirmPassword", "error.user", "Mật khẩu không khớp");
        }

        // Check if username exists
        if (userService.usernameExists(registrationDto.getUsername())) {
            result.rejectValue("username", "error.user", "Tên đăng nhập đã tồn tại");
        }

        // Check if email exists
        if (userService.emailExists(registrationDto.getEmail())) {
            result.rejectValue("email", "error.user", "Email đã tồn tại");
        }

        // Validate password length
        if (registrationDto.getPassword().length() < 6) {
            result.rejectValue("password", "error.user", "Mật khẩu phải có ít nhất 6 ký tự");
        }

        if (result.hasErrors()) {
            logger.warn("Registration form has errors: {}", result.getAllErrors());
            return "register";
        }

        try {
            // Generate OTP
            String otp = otpUtil.generateOtp();
            logger.info("Generated OTP for {}: {}", registrationDto.getEmail(), otp);

            // Store registration data and OTP in session
            session.setAttribute("pendingUser", registrationDto);
            session.setAttribute("registrationOtp", otp);
            session.setAttribute("otpExpiryTime", System.currentTimeMillis() + (10 * 60 * 1000)); // 10 minutes

            // Send OTP via email
            emailService.sendOtpEmail(registrationDto.getEmail(), otp);

            redirectAttributes.addFlashAttribute("success",
                    "Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã để hoàn tất đăng ký.");
            return "redirect:/verify-otp";

        } catch (Exception e) {
            logger.error("Registration failed for user: {}", registrationDto.getUsername(), e);
            result.reject("error.global", "Đăng ký thất bại: " + e.getMessage());
            return "register";
        }
    }

    @GetMapping("/verify-otp")
    public String showOtpVerificationForm(Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        // Check if there's a pending registration
        UserRegistrationDto pendingUser = (UserRegistrationDto) session.getAttribute("pendingUser");
        if (pendingUser == null) {
            redirectAttributes.addFlashAttribute("error", "Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại.");
            return "redirect:/register";
        }

        model.addAttribute("otpVerification", new OtpVerificationDto());
        model.addAttribute("email", pendingUser.getEmail()); // Hiển thị email để user biết
        return "verify-otp";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@ModelAttribute("otpVerification") OtpVerificationDto otpVerification,
                            BindingResult result,
                            HttpSession session,
                            RedirectAttributes redirectAttributes) {

        String storedOtp = (String) session.getAttribute("registrationOtp");
        Long expiryTime = (Long) session.getAttribute("otpExpiryTime");
        UserRegistrationDto pendingUser = (UserRegistrationDto) session.getAttribute("pendingUser");

        logger.info("Verifying OTP for user: {}", pendingUser != null ? pendingUser.getUsername() : "unknown");

        // Check if OTP session exists
        if (storedOtp == null || pendingUser == null) {
            redirectAttributes.addFlashAttribute("error", "Phiên đăng ký đã hết hạn. Vui lòng đăng ký lại.");
            return "redirect:/register";
        }

        // Check if OTP is expired
        if (System.currentTimeMillis() > expiryTime) {
            session.removeAttribute("registrationOtp");
            session.removeAttribute("pendingUser");
            session.removeAttribute("otpExpiryTime");
            redirectAttributes.addFlashAttribute("error", "Mã xác thực đã hết hạn. Vui lòng đăng ký lại.");
            return "redirect:/register";
        }

        // Verify OTP
        if (!storedOtp.equals(otpVerification.getOtp())) {
            result.rejectValue("otp", "error.otp", "Mã xác thực không đúng");
            logger.warn("Invalid OTP entered: {}", otpVerification.getOtp());
            return "verify-otp";
        }

        try {
            // Create new user after OTP verification
            User user = new User();
            user.setUsername(pendingUser.getUsername());
            user.setPassword(passwordEncoder.encode(pendingUser.getPassword()));
            user.setEmail(pendingUser.getEmail());
            user.setFullName(pendingUser.getFullName());
            user.setEnabled(true);

            // Assign USER role
            Role userRole = roleService.getRoleByName("USER");
            user.setRoles(new HashSet<>());
            user.getRoles().add(userRole);

            userService.saveUser(user);
            logger.info("User registered successfully: {}", user.getUsername());

            // Clear session
            session.removeAttribute("registrationOtp");
            session.removeAttribute("pendingUser");
            session.removeAttribute("otpExpiryTime");

            redirectAttributes.addFlashAttribute("success",
                    "Đăng ký thành công! Bạn có thể đăng nhập với thông tin vừa tạo.");
            return "redirect:/login";

        } catch (Exception e) {
            logger.error("User creation failed after OTP verification", e);
            result.reject("error.global", "Đăng ký thất bại: " + e.getMessage());
            return "verify-otp";
        }
    }

    @PostMapping("/resend-otp")
    public String resendOtp(HttpSession session, RedirectAttributes redirectAttributes) {
        UserRegistrationDto pendingUser = (UserRegistrationDto) session.getAttribute("pendingUser");

        if (pendingUser == null) {
            redirectAttributes.addFlashAttribute("error", "Phiên đăng ký đã hết hạn.");
            return "redirect:/register";
        }

        try {
            String newOtp = otpUtil.generateOtp();
            session.setAttribute("registrationOtp", newOtp);
            session.setAttribute("otpExpiryTime", System.currentTimeMillis() + (10 * 60 * 1000));

            emailService.sendOtpEmail(pendingUser.getEmail(), newOtp);
            logger.info("Resent OTP to {}: {}", pendingUser.getEmail(), newOtp);

            redirectAttributes.addFlashAttribute("success", "Mã xác thực mới đã được gửi đến email của bạn.");
        } catch (Exception e) {
            logger.error("Failed to resend OTP", e);
            redirectAttributes.addFlashAttribute("error", "Gửi mã thất bại: " + e.getMessage());
        }

        return "redirect:/verify-otp";
    }
}