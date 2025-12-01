package com.ecommerce.app.service.impl;

import com.ecommerce.app.dto.SalesStatsDTO;
import com.ecommerce.app.dto.SalesStatsDTO.MonthlySalesData;
import com.ecommerce.app.repository.OrderRepository; // Cần phải được tạo
import com.ecommerce.app.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final OrderRepository orderRepository;
    // Dựa trên Order.java, giả định status hoàn thành là "DELIVERED"
    private final String COMPLETED_STATUS = "DELIVERED";

    @Override
    public SalesStatsDTO getSalesStatistics(LocalDate startDate, LocalDate endDate) {
        // Chuyển LocalDate sang LocalDateTime cho truy vấn
        LocalDateTime startDateTime = startDate.atStartOfDay();
        // Ngày kết thúc phải bao gồm đến cuối ngày hôm đó (23:59:59.999...)
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        // 1. Tổng số đơn hàng và Doanh thu
        Long totalOrders = orderRepository.countCompletedOrders(startDateTime, endDateTime, COMPLETED_STATUS);
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue(startDateTime, endDateTime, COMPLETED_STATUS);

        // 2. Giá trị đơn hàng trung bình
        BigDecimal averageOrderValue = BigDecimal.ZERO;
        if (totalOrders != null && totalOrders > 0) {
            // Chia và làm tròn 2 chữ số thập phân
            averageOrderValue = totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP);
        }

        // 3. Tổng sản phẩm đã bán
        Long totalProductsSold = orderRepository.sumTotalProductsSold(startDateTime, endDateTime, COMPLETED_STATUS);
        if (totalProductsSold == null) totalProductsSold = 0L;

        // 4. Doanh số theo tháng (Cần OrderRepository có method findMonthlySalesData)
        List<Object[]> monthlySalesDataRaw = orderRepository.findMonthlySalesData(startDateTime, endDateTime);
        List<MonthlySalesData> monthlySales = monthlySalesDataRaw.stream()
                .map(data -> MonthlySalesData.builder()
                        .monthYear((String) data[0])
                        .orders(((Number) data[1]).longValue())
                        .revenue((BigDecimal) data[2])
                        .build())
                .collect(Collectors.toList());


        return SalesStatsDTO.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .averageOrderValue(averageOrderValue)
                .totalProductsSold(totalProductsSold)
                .monthlySales(monthlySales)
                .build();
    }
}