// src/main/java/com/ecommerce/app/service/ProductService.java
package com.ecommerce.app.service;

import com.ecommerce.app.dto.ProductDTO;
import com.ecommerce.app.entity.Product;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    Page<ProductDTO> getAllProducts(int page, int size, String sortBy, String sortDirection);
    Product getProductById(Long id);
    Product saveProduct(Product product);
    void deleteProduct(Long id);
    Page<ProductDTO> searchProducts(String keyword, int page, int size);
    Page<ProductDTO> getProductsByCategory(Long categoryId, int page, int size);
    Page<ProductDTO> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, int page, int size);
    Page<ProductDTO> advancedSearch(String name, String description, BigDecimal minPrice,
                                    BigDecimal maxPrice, Long categoryId, String brand,
                                    Boolean active, int page, int size, String sortBy, String sortDirection);
    long countProducts();
    long countProductsByCategory(Long categoryId);
    List<String> getAllBrands();
    ProductDTO getProductDTOById(Long id);
    Page<ProductDTO> getFeaturedProducts(int page, int size);
}
