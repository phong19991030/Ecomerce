package com.ecommerce.app.controller.admin;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class OrderAdminController {

    @GetMapping
    public String ordersPage() {
        return "admin/orders";
    }

    @GetMapping("/{orderNumber}")
    public String orderDetailPage() {
        return "admin/order-detail";
    }
}