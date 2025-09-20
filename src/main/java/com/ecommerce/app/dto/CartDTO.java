// src/main/java/com/ecommerce/app/dto/CartDTO.java
package com.ecommerce.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

// src/main/java/com/ecommerce/app/dto/CartDTO.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Long id;
    private Long userId;
    private List<CartItemDTO> items;
    private BigDecimal totalPrice;
    private String createdDate;
    private String updatedDate;

    public int getTotalItems() {
        return items.stream().mapToInt(CartItemDTO::getQuantity).sum();
    }
}