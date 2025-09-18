// src/main/java/com/ecommerce/app/controller/api/ProductApiController.java
package com.ecommerce.app.controller.api;

import com.ecommerce.app.dto.PageRequestDTO;
import com.ecommerce.app.dto.PageResponseDTO;
import com.ecommerce.app.entity.Product;
import com.ecommerce.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductApiController {

    private final ProductService productService;

    @PostMapping("/search")
    public ResponseEntity<PageResponseDTO<Product>> searchProducts(
            @RequestBody PageRequestDTO pageRequest) {

        Page<Product> productsPage = productService.searchProducts(
                pageRequest.getKeyword(),
                pageRequest.getCategoryId(),
                pageRequest.getMinPrice(),
                pageRequest.getMaxPrice(),
                pageRequest.getPage(),
                pageRequest.getSize(),
                pageRequest.getSortBy(),
                pageRequest.getSortDirection()
        );

        return ResponseEntity.ok(new PageResponseDTO<>(productsPage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
}