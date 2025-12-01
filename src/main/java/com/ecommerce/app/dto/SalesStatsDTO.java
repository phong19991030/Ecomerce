package com.ecommerce.app.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class SalesStatsDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long totalOrders; // Tổng số đơn hàng đã hoàn thành
    private BigDecimal totalRevenue; // Tổng doanh thu
    private BigDecimal averageOrderValue; // Giá trị đơn hàng trung bình
    private Long totalProductsSold; // Tổng số sản phẩm đã bán
    private List<MonthlySalesData> monthlySales; // Doanh số theo tháng

    @Data
    @Builder
    public static class MonthlySalesData {
        private String monthYear; // Ví dụ: 2024-05
        private Long orders;
        private BigDecimal revenue;
    }
}