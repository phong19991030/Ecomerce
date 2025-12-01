package com.ecommerce.app.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.Authentication;

@Controller
@RequestMapping("/admin/reports")
// Không dùng @PreAuthorize. CustomAuthorizationManager sẽ kiểm tra quyền qua URL /admin/reports
public class AdminReportController {

    @GetMapping
    public String reportsPage(Authentication authentication, Model model) {
        // Lấy thông tin user để hiển thị trên navbar/dashboard
        String username = authentication != null ? authentication.getName() : "Guest";

        model.addAttribute("pageTitle", "Báo cáo thống kê");
        model.addAttribute("username", username);
        // Trả về file admin-reports.html
        return "admin/admin-reports";
    }
}