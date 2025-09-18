// src/main/java/com/ecommerce/app/service/ProductService.java
package com.ecommerce.app.service;

import com.ecommerce.app.entity.Product;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;

public interface ProductService {
    Page<Product> searchProducts(String keyword, Long categoryId,
                                 BigDecimal minPrice, BigDecimal maxPrice,
                                 int page, int size, String sortBy, String sortDirection);
    Product getProductById(Long id);
    Product saveProduct(Product product);
    void deleteProduct(Long id);
}