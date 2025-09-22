// src/main/java/com/ecommerce/app/controller/HomeController.java
package com.ecommerce.app.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
//    @GetMapping("")
//    public String homes() {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//
//        // Kiểm tra nếu user đã đăng nhập thì chuyển đến dashboard
//        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
//            return "redirect:/dashboard";
//        }
//
//        // Nếu chưa đăng nhập thì chuyển đến trang login
//        return "redirect:/login";
//    }

    @GetMapping("/")
    public String home() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra nếu user đã đăng nhập thì chuyển đến dashboard
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            return "redirect:/dashboard";
        }

        // Nếu chưa đăng nhập thì chuyển đến trang login
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String login() {
        return "login"; // Trả về trực tiếp login.html không dùng layout
    }

    @GetMapping("/logout")
    public String logout() {
        return "login";
    }
}
