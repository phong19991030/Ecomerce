// src/main/java/com/ecommerce/app/controller/DashboardController.java
package com.ecommerce.app.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Arrays;
import java.util.List;

@Controller
public class DashboardController {

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
            // Dữ liệu cho User Dashboard
            addUserDashboardData(model);
            return "dashboard/user-dashboard";
        }
    }

    private void addAdminDashboardData(Model model) {
        // Thống kê cho Admin
        model.addAttribute("totalUsers", 150);
        model.addAttribute("totalProducts", 456);
        model.addAttribute("totalOrders", 89);
        model.addAttribute("totalRevenue", 12500.00);

        // Doanh thu theo tháng
        List<Double> monthlyRevenue = Arrays.asList(8500.00, 9200.00, 7800.00, 10500.00, 12500.00);
        model.addAttribute("monthlyRevenue", monthlyRevenue);

        // Đơn hàng mới nhất
        model.addAttribute("recentOrders", Arrays.asList(
                new OrderSummary("ORD-001", "John Doe", 250.00, "Pending"),
                new OrderSummary("ORD-002", "Jane Smith", 450.00, "Processing"),
                new OrderSummary("ORD-003", "Bob Johnson", 120.00, "Completed")
        ));

        // Sản phẩm bán chạy
        model.addAttribute("topProducts", Arrays.asList(
                new ProductSummary("Laptop Gaming", 45, 22500.00),
                new ProductSummary("Smartphone", 78, 23400.00),
                new ProductSummary("Headphones", 120, 6000.00)
        ));
    }

    private void addUserDashboardData(Model model) {
        // Thống kê cho User
        model.addAttribute("totalOrders", 5);
        model.addAttribute("cartItems", 3);
        model.addAttribute("wishlistItems", 7);
        model.addAttribute("loyaltyPoints", 1250);

        // Đơn hàng gần đây
        model.addAttribute("recentOrders", Arrays.asList(
                new OrderSummary("ORD-001", "Laptop Gaming", 250.00, "Delivered"),
                new OrderSummary("ORD-002", "Smartphone", 450.00, "Processing"),
                new OrderSummary("ORD-003", "Headphones", 120.00, "Shipped")
        ));

        // Sản phẩm đề xuất
        model.addAttribute("recommendedProducts", Arrays.asList(
                "Wireless Mouse", "Keyboard", "Monitor", "Webcam"
        ));
    }

    // Inner classes for data transfer
    public static class OrderSummary {
        private String orderId;
        private String name;
        private double amount;
        private String status;

        public OrderSummary(String orderId, String name, double amount, String status) {
            this.orderId = orderId;
            this.name = name;
            this.amount = amount;
            this.status = status;
        }

        // Getters
        public String getOrderId() { return orderId; }
        public String getName() { return name; }
        public double getAmount() { return amount; }
        public String getStatus() { return status; }
    }

    public static class ProductSummary {
        private String name;
        private int sold;
        private double revenue;

        public ProductSummary(String name, int sold, double revenue) {
            this.name = name;
            this.sold = sold;
            this.revenue = revenue;
        }

        // Getters
        public String getName() { return name; }
        public int getSold() { return sold; }
        public double getRevenue() { return revenue; }
    }
}
