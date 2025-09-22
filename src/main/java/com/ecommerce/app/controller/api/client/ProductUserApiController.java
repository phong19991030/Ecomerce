// src/main/java/com/ecommerce/app/controller/api/ProductUserApiController.java
package com.ecommerce.app.controller.api.client;

import com.ecommerce.app.dto.ProductDTO;
import com.ecommerce.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/public/products")
@RequiredArgsConstructor
public class ProductUserApiController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<?> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {

        try {
            Page<ProductDTO> products;

            if (keyword != null && !keyword.trim().isEmpty()) {
                products = productService.searchProducts(keyword, page, size);
            } else if (category != null || brand != null || minPrice != null || maxPrice != null) {
                products = productService.advancedSearch(
                        null, null, minPrice, maxPrice,
                        category, brand, true, page, size, sortBy, sortDirection
                );
            } else {
                products = productService.getAllProducts(page, size, sortBy, sortDirection);
            }

            return ResponseEntity.ok(products);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch products: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            ProductDTO product = productService.getProductDTOById(id);
            if (Objects.isNull(product)) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Product not found: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/brands")
    public ResponseEntity<?> getAllBrands() {
        try {
            List<String> brands = productService.getAllBrands();
            return ResponseEntity.ok(brands);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch brands: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedProducts() {
        try {
            Page<ProductDTO> featuredProducts = productService.getFeaturedProducts(0, 8);
            return ResponseEntity.ok(featuredProducts.getContent());
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch featured products: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}