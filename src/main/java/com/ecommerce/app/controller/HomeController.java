// src/main/java/com/ecommerce/app/controller/HomeController.java
package com.ecommerce.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "Home");
        model.addAttribute("content", "index :: content");
        return "layout";
    }

    @GetMapping("/products")
    public String products(Model model) {
        model.addAttribute("title", "Products");
        model.addAttribute("content", "products :: content");
        return "layout";
    }

    @GetMapping("/login")
    public String login() {
        return "login"; // Trả về trực tiếp login.html không dùng layout
    }
}