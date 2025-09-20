// src/main/java/com/ecommerce/app/controller/api/admin/OrderAdminApiController.java
package com.ecommerce.app.controller.api.admin;

import com.ecommerce.app.dto.OrderDTO;
import com.ecommerce.app.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class OrderAdminApiController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) String search) {

        try {
            Pageable pageable = PageRequest.of(page, size,
                    Sort.by(Sort.Direction.fromString(sortDirection), sortBy));

            Page<OrderDTO> orders;

            // Xử lý tìm kiếm và lọc
            if (search != null && !search.trim().isEmpty()) {
                // Tìm kiếm theo mã đơn hàng, tên khách hàng, email
                orders = orderService.searchOrders(search, status, paymentStatus, pageable);
            } else if (status != null || paymentStatus != null) {
                // Lọc theo trạng thái và thanh toán
                orders = orderService.filterOrders(status, paymentStatus, pageable);
            } else {
                // Lấy tất cả orders
                orders = orderService.getAllOrders(pageable);
            }

            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch orders: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<?> getOrderByNumber(@PathVariable String orderNumber) {
        try {
            OrderDTO order = orderService.getOrderByNumber(orderNumber);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Order not found: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{orderNumber}/update")
    public ResponseEntity<?> updateOrder(
            @PathVariable String orderNumber,
            @RequestBody Map<String, String> request) {

        try {
            String status = request.get("status");
            String paymentStatus = request.get("paymentStatus");
            String notes = request.get("notes");

            OrderDTO order = orderService.getOrderByNumber(orderNumber);

            OrderDTO updatedOrder = order;

            // Cập nhật trạng thái đơn hàng nếu có
            if (status != null && !status.trim().isEmpty()) {
                updatedOrder = orderService.updateOrderStatus(order.getId(), status);
            }

            // Cập nhật trạng thái thanh toán nếu có
            if (paymentStatus != null && !paymentStatus.trim().isEmpty()) {
                updatedOrder = orderService.updatePaymentStatus(order.getId(), paymentStatus);
            }

            if (notes != null) {
                updatedOrder = orderService.updateOrderNotes(order.getId(), notes);
            }

            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update order: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{orderNumber}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String orderNumber,
            @RequestBody Map<String, String> request) {

        try {
            String status = request.get("status");
            OrderDTO order = orderService.getOrderByNumber(orderNumber);
            OrderDTO updatedOrder = orderService.updateOrderStatus(order.getId(), status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update order status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{orderNumber}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable String orderNumber,
            @RequestBody Map<String, String> request) {

        try {
            String paymentStatus = request.get("paymentStatus");
            OrderDTO order = orderService.getOrderByNumber(orderNumber);
            OrderDTO updatedOrder = orderService.updatePaymentStatus(order.getId(), paymentStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update payment status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getOrderStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            // You can implement order statistics here
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get order stats: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}