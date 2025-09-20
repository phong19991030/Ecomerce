// src/main/java/com/ecommerce/app/dto/AddToCartRequest.java
package com.ecommerce.app.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Long productId;
    private int quantity;
}