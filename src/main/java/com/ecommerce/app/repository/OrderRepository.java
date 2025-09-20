// src/main/java/com/ecommerce/app/repository/OrderRepository.java
package com.ecommerce.app.repository;

import com.ecommerce.app.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
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

    // Thêm query để lấy orders với items
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

    // Thêm method lọc
    @Query("SELECT o FROM Order o WHERE " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus) " +
            "ORDER BY o.orderDate DESC")
    Page<Order> filterOrders(@Param("status") String status,
                             @Param("paymentStatus") String paymentStatus,
                             Pageable pageable);
}