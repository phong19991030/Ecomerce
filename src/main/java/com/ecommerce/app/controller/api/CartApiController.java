// src/main/java/com/ecommerce/app/controller/api/CartApiController.java
package com.ecommerce.app.controller.api;

import com.ecommerce.app.dto.CartDTO;
import com.ecommerce.app.dto.AddToCartRequest;
import com.ecommerce.app.service.CartService;
import com.ecommerce.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartApiController {

    private final CartService cartService;
    private final UserService userService;

    // Helper method to get userId from authentication
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

    @GetMapping
    public ResponseEntity<?> getCart() {
        try {
            Long userId = getUserIdFromAuthentication();
            CartDTO cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch (SecurityException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication required");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch cart: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        try {
            Long userId = getUserIdFromAuthentication();
            CartDTO cart = cartService.addToCart(request, userId);
            return ResponseEntity.ok(cart);
        } catch (SecurityException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication required");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to add to cart: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/item/{itemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long itemId,
                                            @RequestParam int quantity) {
        try {
            Long userId = getUserIdFromAuthentication();
            CartDTO cart = cartService.updateCartItem(itemId, quantity, userId);
            return ResponseEntity.ok(cart);
        } catch (SecurityException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication required");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update cart item: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long itemId) {
        try {
            Long userId = getUserIdFromAuthentication();
            cartService.removeFromCart(itemId, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Item removed from cart successfully");
            return ResponseEntity.ok(response);
        } catch (SecurityException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication required");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to remove from cart: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        try {
            Long userId = getUserIdFromAuthentication();
            cartService.clearCart(userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cart cleared successfully");
            return ResponseEntity.ok(response);
        } catch (SecurityException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication required");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to clear cart: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCartItemCount() {
        try {
            Long userId = getUserIdFromAuthentication();
            int count = cartService.getCartItemCount(userId);
            return ResponseEntity.ok(count);
        } catch (SecurityException e) {
            // Trả về 0 nếu chưa đăng nhập thay vì lỗi
            return ResponseEntity.ok(0);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get cart count: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}