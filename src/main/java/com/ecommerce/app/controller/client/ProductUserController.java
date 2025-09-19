package com.ecommerce.app.controller.client;// src/main/java/com/ecommerce/app/controller/ProductUserController.java

import com.ecommerce.app.dto.ProductDTO;
import com.ecommerce.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/client/products")
public class ProductUserController {

    private final ProductService productService;

    @GetMapping("")
    public String productsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Model model) {

        try {
            // Lấy danh sách sản phẩm
            Page<ProductDTO> products;

            if (keyword != null && !keyword.trim().isEmpty()) {
                products = productService.searchProducts(keyword, page, size);
            } else if (category != null || brand != null || minPrice != null || maxPrice != null) {
                products = productService.advancedSearch(
                        null, null, minPrice, maxPrice,
                        null, brand, true, page, size, sortBy, sortDirection
                );
            } else {
                products = productService.getAllProducts(page, size, sortBy, sortDirection);
            }

            // Lấy các brand và categories cho filter
            Map<String, Object> filters = new HashMap<>();
            filters.put("brands", productService.getAllBrands());
            // Thêm categories nếu có service

            model.addAttribute("products", products);
            model.addAttribute("filters", filters);
            model.addAttribute("currentPage", page);
            model.addAttribute("totalPages", products.getTotalPages());
            model.addAttribute("searchKeyword", keyword);

            return "/client/products-user";

        } catch (Exception e) {
            model.addAttribute("error", "Failed to load products: " + e.getMessage());
            return "/dashboard/user-dashboard";
        }
    }

    @GetMapping("/products/{id}")
    public String productDetail(@PathVariable Long id, Model model) {
        try {
            ProductDTO product = productService.getProductDTOById(id);
            model.addAttribute("product", product);
            return "/client/product-detail";
        } catch (Exception e) {
            model.addAttribute("error", "Product not found: " + e.getMessage());
            return "redirect:/client/products-user";
        }
    }
}