// src/main/java/com/ecommerce/app/dto/PageRequestDTO.java
package com.ecommerce.app.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PageRequestDTO {
    private int page = 0;
    private int size = 12;
    private String sortBy = "id";
    private String sortDirection = "asc";
    private String keyword;
    private Long categoryId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}