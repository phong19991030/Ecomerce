// src/main/java/com/ecommerce/app/controller/DashboardController.java
package com.ecommerce.app.controller;

import com.ecommerce.app.service.OrderService;
import com.ecommerce.app.service.CartService;
import com.ecommerce.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class DashboardController {

    private final OrderService orderService;
    private final CartService cartService;
    private final UserService userService;

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ADMIN"));

        model.addAttribute("username", username);
        model.addAttribute("isAdmin", isAdmin);

        if (isAdmin) {
            // Dữ liệu cho Admin Dashboard
            addAdminDashboardData(model);
            return "dashboard/admin-dashboard";
        } else {
            // Dữ liệu cho User Dashboard - chỉ truyền username, dữ liệu sẽ được load bằng JavaScript
            addUserDashboardData(model);
            return "dashboard/user-dashboard";
        }
    }

    private void addAdminDashboardData(Model model) {
        // Chỉ truyền giá trị mặc định, dữ liệu thực sẽ được load bằng JavaScript
        model.addAttribute("totalUsers", 0);
        model.addAttribute("totalProducts", 0);
        model.addAttribute("totalOrders", 0);
        model.addAttribute("totalRevenue", 0.00);

        // Không truyền dữ liệu mẫu nữa
        model.addAttribute("recentOrders", null);
        model.addAttribute("topProducts", null);
    }

    private void addUserDashboardData(Model model) {
        // Chỉ truyền các giá trị mặc định, dữ liệu thực sẽ được load bằng JavaScript
        model.addAttribute("totalOrders", 0);
        model.addAttribute("cartItems", 0);
        model.addAttribute("wishlistItems", 0);
        model.addAttribute("loyaltyPoints", 0);

        // Không truyền dữ liệu mẫu nữa
        model.addAttribute("recentOrders", null);
        model.addAttribute("recommendedProducts", null);
    }
}