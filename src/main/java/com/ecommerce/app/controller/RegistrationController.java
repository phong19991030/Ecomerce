// src/main/java/com/ecommerce/app/controller/RegistrationController.java
package com.ecommerce.app.controller;

import com.ecommerce.app.dto.UserRegistrationDto;
import com.ecommerce.app.entity.Role;
import com.ecommerce.app.entity.User;
import com.ecommerce.app.service.RoleService;
import com.ecommerce.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashSet;

@Controller
@RequiredArgsConstructor
public class RegistrationController {

    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new UserRegistrationDto());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser( @ModelAttribute("user") UserRegistrationDto registrationDto,
                               BindingResult result,
                               RedirectAttributes redirectAttributes) {

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
            return "register";
        }

        try {
            // Create new user
            User user = new User();
            user.setUsername(registrationDto.getUsername());
            user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
            user.setEmail(registrationDto.getEmail());
            user.setFullName(registrationDto.getFullName());
            user.setEnabled(true);

            // Assign USER role
            Role userRole = roleService.getRoleByName("USER");
            user.setRoles(new HashSet<>());
            user.getRoles().add(userRole);

            userService.saveUser(user);

            redirectAttributes.addFlashAttribute("success",
                    "Đăng ký thành công! Bạn có thể đăng nhập với thông tin vừa tạo.");
            return "redirect:/register";

        } catch (Exception e) {
            result.reject("error.global", "Đăng ký thất bại: " + e.getMessage());
            return "register";
        }
    }
}