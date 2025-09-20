// src/main/java/com/ecommerce/app/controller/api/OrderApiController.java
package com.ecommerce.app.controller.api.client;

import com.ecommerce.app.dto.CreateOrderRequest;
import com.ecommerce.app.dto.OrderDTO;
import com.ecommerce.app.service.OrderService;
import com.ecommerce.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderApiController {

    private final OrderService orderService;
    private final UserService userService;

    private Long getUserIdFromAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() &&
                !authentication.getPrincipal().equals("anonymousUser")) {

            String username = authentication.getName();
            Long userId = userService.findUserIdByUserName(username);

            if (userId == null) {
                throw new SecurityException("User ID not found for username: " + username);
            }

            return userId;
        }
        throw new SecurityException("User not authenticated");
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            Long userId = getUserIdFromAuthentication();
            OrderDTO order = orderService.createOrderFromCart(userId, request);
            return ResponseEntity.ok(order);
        } catch (SecurityException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication required");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create order: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserOrders() {
        try {
            Long userId = getUserIdFromAuthentication();
            List<OrderDTO> orders = orderService.getUserOrders(userId);
            return ResponseEntity.ok(orders);
        } catch (SecurityException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication required");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch orders: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<?> getOrderByNumber(@PathVariable String orderNumber) {
        try {
            Long userId = getUserIdFromAuthentication();
            OrderDTO order = orderService.getOrderByNumber(orderNumber);

            // Verify order belongs to user
            if (!order.getUserId().equals(userId)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Access denied");
                return ResponseEntity.status(403).body(error);
            }

            return ResponseEntity.ok(order);
        } catch (SecurityException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication required");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Order not found: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getUserOrderCount() {
        try {
            Long userId = getUserIdFromAuthentication();
            Long count = orderService.countUserOrders(userId);
            return ResponseEntity.ok(count);
        } catch (SecurityException e) {
            return ResponseEntity.ok(0);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get order count: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PostMapping("/{orderNumber}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String orderNumber) {
        try {
            Long userId = getUserIdFromAuthentication();
            OrderDTO order = orderService.getOrderByNumber(orderNumber);

            // Verify order belongs to user
            if (!order.getUserId().equals(userId)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Access denied");
                return ResponseEntity.status(403).body(error);
            }

            orderService.cancelOrder(order.getId());
            return ResponseEntity.ok().build();

        } catch (SecurityException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication required");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to cancel order: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}