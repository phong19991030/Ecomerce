// src/main/java/com/ecommerce/app/controller/client/OrderController.java
package com.ecommerce.app.controller.client;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    @GetMapping
    public String ordersPage() {
        return "client/orders";
    }

    @GetMapping("/{orderNumber}")
    public String orderDetail(@PathVariable String orderNumber) {
        return "client/order-detail";
    }

    @GetMapping("/success/{orderNumber}")
    public String orderSuccess(@PathVariable String orderNumber) {
        return "client/order-success";
    }
}