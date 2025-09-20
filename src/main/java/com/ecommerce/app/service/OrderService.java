// src/main/java/com/ecommerce/app/service/OrderService.java
package com.ecommerce.app.service;

import com.ecommerce.app.dto.CreateOrderRequest;
import com.ecommerce.app.dto.OrderDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    OrderDTO createOrderFromCart(Long userId, CreateOrderRequest request);

    OrderDTO getOrderById(Long orderId);

    OrderDTO getOrderByNumber(String orderNumber);

    List<OrderDTO> getUserOrders(Long userId);

    OrderDTO updateOrderStatus(Long orderId, String status);

    OrderDTO updatePaymentStatus(Long orderId, String paymentStatus);

    OrderDTO updateOrderNotes(Long orderId, String notes);

    void cancelOrder(Long orderId);

    Long countUserOrders(Long userId);

    Page<OrderDTO> getAllOrders(Pageable pageable);

    List<OrderDTO> getOrdersByStatus(String status);

    List<OrderDTO> getOrdersByPaymentStatus(String paymentStatus);

    Page<OrderDTO> searchOrders(String search, String status, String paymentStatus, Pageable pageable);

    Page<OrderDTO> filterOrders(String status, String paymentStatus, Pageable pageable);
}