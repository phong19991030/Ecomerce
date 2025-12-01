package com.ecommerce.app.controller.api.admin;

import com.ecommerce.app.dto.SalesStatsDTO;
import com.ecommerce.app.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/admin/api/reports")
@RequiredArgsConstructor
// Không dùng @PreAuthorize. CustomAuthorizationManager sẽ kiểm tra quyền qua URL /admin/api/reports/**
public class ReportApiController {

    private final ReportService reportService;

    @GetMapping("/sales-stats")
    public ResponseEntity<SalesStatsDTO> getSalesStatistics(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        // Thiết lập ngày mặc định nếu không có: 6 tháng gần nhất
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        if (startDate == null) {
            // Ngày bắt đầu là ngày 1 của tháng 6 tháng trước
            startDate = endDate.minusMonths(6).withDayOfMonth(1);
        }

        SalesStatsDTO stats = reportService.getSalesStatistics(startDate, endDate);
        return ResponseEntity.ok(stats);
    }
}