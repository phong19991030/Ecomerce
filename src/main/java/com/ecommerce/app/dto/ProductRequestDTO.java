// src/main/java/com/ecommerce/app/dto/ProductRequestDTO.java
package com.ecommerce.app.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class ProductRequestDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String sku;
    private String brand;
    private String color;
    private Boolean active = true;
    private Long categoryId;
    private MultipartFile imageFile; // Có thể thêm trực tiếp file vào DTO
}
