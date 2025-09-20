// src/main/java/com/ecommerce/app/dto/OrderItemDTO.java
package com.ecommerce.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long id;
    private ProductDTO product;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}