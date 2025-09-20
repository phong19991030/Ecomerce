// src/main/java/com/ecommerce/app/dto/CreateOrderRequest.java
package com.ecommerce.app.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateOrderRequest {
    private String shippingAddress;
    private String paymentMethod;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}