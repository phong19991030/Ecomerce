package com.ecommerce.app.repository;

import com.ecommerce.app.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Trạng thái đơn hàng được tính là hoàn thành để báo cáo
    String COMPLETED_STATUS = "DELIVERED";

    // === PHẦN TRUY VẤN BÁO CÁO (Đã sửa findMonthlySalesData) ===

    /**
     * Đếm tổng số đơn hàng đã hoàn thành trong khoảng thời gian.
     */
    @Query("SELECT COUNT(o.id) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate AND o.status = :status")
    Long countCompletedOrders(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") String status
    );

    /**
     * Tính tổng doanh thu của các đơn hàng đã hoàn thành trong khoảng thời gian.
     */
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate AND o.status = :status")
    BigDecimal sumTotalRevenue(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") String status
    );

    /**
     * Tính tổng số lượng sản phẩm đã bán trong các đơn hàng đã hoàn thành.
     */
    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi " +
            "JOIN oi.order o " +
            "WHERE o.orderDate BETWEEN :startDate AND :endDate AND o.status = :status")
    Long sumTotalProductsSold(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") String status
    );

    /**
     * Lấy dữ liệu doanh số, số lượng đơn hàng theo tháng.
     * Đã sửa: Sử dụng hàm DATE_FORMAT thuần túy (Native SQL).
     */
    @Query(value = "SELECT DATE_FORMAT(o.order_date, '%Y-%m') as monthYear, " + // SỬA TẠI ĐÂY!
            "    COUNT(o.id) as orders, " +
            "    SUM(o.total_amount) as revenue " +
            "FROM orders o " +
            "WHERE o.order_date BETWEEN :startDate AND :endDate AND o.status = 'DELIVERED' " +
            "GROUP BY monthYear " +
            "ORDER BY monthYear", nativeQuery = true)
    List<Object[]> findMonthlySalesData(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // === PHẦN TRUY VẤN CŨ (GIỮ NGUYÊN) ===
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product WHERE o.user.id = :userId ORDER BY o.orderDate DESC")
    List<Order> findByUserIdWithItems(@Param("userId") Long userId);
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product WHERE o.orderNumber = :orderNumber")
    Optional<Order> findByOrderNumberWithItems(@Param("orderNumber") String orderNumber);
    Long countByUserId(Long userId);
    Page<Order> findAll(Pageable pageable);
    List<Order> findByStatus(String status);
    List<Order> findByPaymentStatus(String paymentStatus);
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product ORDER BY o.orderDate DESC")
    Page<Order> findAllWithItems(Pageable pageable);
    @Query("SELECT o FROM Order o WHERE " +
            "(:search IS NULL OR " +
            "o.orderNumber LIKE %:search% OR " +
            "o.customerName LIKE %:search% OR " +
            "o.customerEmail LIKE %:search%) AND " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus) " +
            "ORDER BY o.orderDate DESC")
    Page<Order> searchOrders(@Param("search") String search,
                             @Param("status") String status,
                             @Param("paymentStatus") String paymentStatus,
                             Pageable pageable);
    @Query("SELECT o FROM Order o WHERE " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus) " +
            "ORDER BY o.orderDate DESC")
    Page<Order> filterOrders(@Param("status") String status,
                             @Param("paymentStatus") String paymentStatus,
                             Pageable pageable);
}