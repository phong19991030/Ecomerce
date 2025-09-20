// src/main/java/com/ecommerce/app/service/CartService.java
package com.ecommerce.app.service;

import com.ecommerce.app.dto.CartDTO;
import com.ecommerce.app.dto.AddToCartRequest;
import com.ecommerce.app.entity.User;

public interface CartService {
    CartDTO getCartByUserId(Long userId);
    CartDTO addToCart(AddToCartRequest request, Long userId);
    CartDTO updateCartItem(Long itemId, int quantity, Long userId);
    void removeFromCart(Long itemId, Long userId);
    void clearCart(Long userId);
    int getCartItemCount(Long userId);
    CartDTO getCartWithDetails(Long userId);
}