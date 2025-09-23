// src/main/java/com/ecommerce/app/controller/client/CheckoutController.java
package com.ecommerce.app.controller.client;

import com.ecommerce.app.dto.CartDTO;
import com.ecommerce.app.entity.Cart;
import com.ecommerce.app.service.CartService;
import com.ecommerce.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CartService cartService;
    private final UserService userService;

    @GetMapping
    public String checkoutPage(Authentication authentication, Model model) {
        try {
            String username = authentication.getName();
            Long userId = userService.findUserIdByUserName(username);

            CartDTO cart = cartService.getCartByUserId(userId);

            if (cart == null || cart.getItems().isEmpty()) {
                return "redirect:/cart?error=empty";
            }

            model.addAttribute("username", username);
            model.addAttribute("cart", cart);
            return "client/checkout";

        } catch (Exception e) {
            model.addAttribute("error", "Failed to load checkout page: " + e.getMessage());
            return "redirect:/cart";
        }
    }
}