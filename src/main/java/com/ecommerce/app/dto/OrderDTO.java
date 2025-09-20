// src/main/java/com/ecommerce/app/dto/OrderDTO.java
package com.ecommerce.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private Long userId;
    private List<OrderItemDTO> items;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime orderDate;
    private LocalDateTime updatedDate;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String notes;
}