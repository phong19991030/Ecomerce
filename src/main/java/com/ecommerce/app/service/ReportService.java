package com.ecommerce.app.service;

import com.ecommerce.app.dto.SalesStatsDTO;
import java.time.LocalDate;

public interface ReportService {
    /**
     * Lấy thống kê bán hàng trong khoảng thời gian được chỉ định.
     * @param startDate Ngày bắt đầu (bao gồm)
     * @param endDate Ngày kết thúc (bao gồm)
     * @return SalesStatsDTO
     */
    SalesStatsDTO getSalesStatistics(LocalDate startDate, LocalDate endDate);
}