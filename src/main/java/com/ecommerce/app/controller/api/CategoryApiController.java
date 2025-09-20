// src/main/java/com/ecommerce/app/controller/api/CategoryApiController.java
package com.ecommerce.app.controller.api;

import com.ecommerce.app.dto.CategoryDTO;
import com.ecommerce.app.entity.Category;
import com.ecommerce.app.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/categories")
@RequiredArgsConstructor
public class CategoryApiController {

    private final CategoryService categoryService;

    @GetMapping("/find_all")
    public ResponseEntity<?> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            List<CategoryDTO> dtos = categories.stream()
                    .map(cat -> new CategoryDTO(cat.getId(), cat.getName(), cat.getDescription()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch categories: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveCategories() {
        try {
            List<Category> categories = categoryService.getActiveCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch active categories: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
