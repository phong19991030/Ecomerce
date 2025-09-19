// src/main/java/com/ecommerce/app/dto/ProductDTO.java
package com.ecommerce.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String imageUrl;
    private String sku;
    private String brand;
    private String color;
    private Boolean active;
    private CategoryDTO category;

    // Constructor cho JPQL query
    public ProductDTO(Long id, String name, String description, BigDecimal price,
                      Integer stock, String imageUrl, String sku, String brand,
                      String color, Boolean active, Long categoryId,
                      String categoryName, String categoryDescription) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.sku = sku;
        this.brand = brand;
        this.color = color;
        this.active = active;

        if (categoryId != null) {
            this.category = new CategoryDTO(categoryId, categoryName, categoryDescription);
        }
    }
}
