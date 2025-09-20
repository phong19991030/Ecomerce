package com.ecommerce.app.controller.client;

import com.ecommerce.app.dto.CartDTO;
import com.ecommerce.app.service.CartService;
import com.ecommerce.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/client/cart")
@RequiredArgsConstructor
public class CartClientController {

    private final CartService cartService;
    private final UserService userService;

    @GetMapping
    public String viewCart(Model model, Authentication authentication) {
        try {
            String username = authentication.getName();
            Long userId = userService.findUserIdByUserName(username);

            CartDTO cart = cartService.getCartWithDetails(userId);
            model.addAttribute("cart", cart);
            model.addAttribute("totalItems", cart.getTotalItems());
            model.addAttribute("totalPrice", cart.getTotalPrice());

            return "client/cart-client";
        } catch (Exception e) {
            model.addAttribute("error", "Không thể tải giỏ hàng: " + e.getMessage());
            return "client/cart-client";
        }
    }
}