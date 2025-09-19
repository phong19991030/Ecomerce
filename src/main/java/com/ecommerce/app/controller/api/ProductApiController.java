// src/main/java/com/ecommerce/app/controller/api/ProductApiController.java
package com.ecommerce.app.controller.api;

import com.ecommerce.app.dto.CategoryDTO;
import com.ecommerce.app.dto.ProductDTO;
import com.ecommerce.app.dto.ProductRequestDTO;
import com.ecommerce.app.entity.Category;
import com.ecommerce.app.entity.Product;
import com.ecommerce.app.service.FileStorageService;
import com.ecommerce.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductApiController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<?> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Boolean active) {

        try {
            Page<ProductDTO> products;

            if (name != null || description != null || minPrice != null || maxPrice != null ||
                    categoryId != null || brand != null || active != null) {

                products = productService.advancedSearch(
                        name, description, minPrice, maxPrice,
                        categoryId, brand, active, page, size, sortBy, sortDirection
                );

            } else if (keyword != null && !keyword.trim().isEmpty()) {
                products = productService.searchProducts(keyword, page, size);
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
            Product product = productService.getProductById(id);
            ProductDTO productDTO = convertToDTO(product);
            return ResponseEntity.ok(productDTO);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Product not found: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Thêm private method convertToDTO vào controller, hoặc di chuyển từ ProductServiceImpl sang đây nếu cần
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setImageUrl(product.getImageUrl());
        dto.setSku(product.getSku());
        dto.setBrand(product.getBrand());
        dto.setColor(product.getColor());
        dto.setActive(product.getActive());

        if (product.getCategory() != null) {
            dto.setCategory(new CategoryDTO(
                    product.getCategory().getId(),
                    product.getCategory().getName(),
                    product.getCategory().getDescription()
            ));
        }

        return dto;
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@ModelAttribute ProductRequestDTO productRequest) {
        try {
            // Validate required fields
            if (productRequest.getName() == null || productRequest.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("Product name is required");
            }
            if (productRequest.getPrice() == null || productRequest.getPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Valid price is required");
            }

            Product product = new Product();
            product.setName(productRequest.getName());
            product.setDescription(productRequest.getDescription());
            product.setPrice(productRequest.getPrice());
            product.setStock(productRequest.getStock() != null ? productRequest.getStock() : 0);
            product.setSku(productRequest.getSku());
            product.setBrand(productRequest.getBrand());
            product.setColor(productRequest.getColor());
            product.setActive(productRequest.getActive() != null ? productRequest.getActive() : true);

            // Set category if provided
            if (productRequest.getCategoryId() != null) {
                Category category = new Category();
                category.setId(productRequest.getCategoryId());
                product.setCategory(category);
            }

            // Handle image upload
            if (productRequest.getImageFile() != null && !productRequest.getImageFile().isEmpty()) {
                String imageUrl = fileStorageService.storeFile(productRequest.getImageFile());
                product.setImageUrl(imageUrl);
            } else {
                product.setImageUrl("/images/placeholder-product.png");
            }

            Product savedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create product: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @ModelAttribute ProductRequestDTO productRequest) {
        try {
            Product existingProduct = productService.getProductById(id);

            // Update fields - only update if provided
            if (productRequest.getName() != null) existingProduct.setName(productRequest.getName());
            if (productRequest.getDescription() != null)
                existingProduct.setDescription(productRequest.getDescription());
            if (productRequest.getPrice() != null) existingProduct.setPrice(productRequest.getPrice());
            if (productRequest.getStock() != null) existingProduct.setStock(productRequest.getStock());
            if (productRequest.getSku() != null) existingProduct.setSku(productRequest.getSku());
            if (productRequest.getBrand() != null) existingProduct.setBrand(productRequest.getBrand());
            if (productRequest.getColor() != null) existingProduct.setColor(productRequest.getColor());
            if (productRequest.getActive() != null) existingProduct.setActive(productRequest.getActive());

            // Update category
            if (productRequest.getCategoryId() != null) {
                Category category = new Category();
                category.setId(productRequest.getCategoryId());
                existingProduct.setCategory(category);
            } else if (productRequest.getCategoryId() == null && existingProduct.getCategory() != null) {
                // Remove category if categoryId is explicitly set to null
                existingProduct.setCategory(null);
            }

            // Handle image upload - only update if new file is provided
            if (productRequest.getImageFile() != null && !productRequest.getImageFile().isEmpty()) {
                String imageUrl = fileStorageService.storeFile(productRequest.getImageFile());
                existingProduct.setImageUrl(imageUrl);
            }

            Product updatedProduct = productService.saveProduct(existingProduct);
            return ResponseEntity.ok(updatedProduct);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update product: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Product deleted successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete product: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
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

    @GetMapping("/count")
    public ResponseEntity<?> getProductCount() {
        try {
            long count = productService.countProducts();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to count products: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
