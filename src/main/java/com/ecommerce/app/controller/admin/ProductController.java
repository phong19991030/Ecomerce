// src/main/java/com/ecommerce/app/controller/ProductController.java
package com.ecommerce.app.controller.admin;

import com.ecommerce.app.dto.ProductDTO;
import com.ecommerce.app.entity.Product;
import com.ecommerce.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public String productsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Boolean active,
            Model model) {

        try {
            List<String> brands = productService.getAllBrands();
            long totalProducts = productService.countProducts();

            model.addAttribute("brands", brands);
            model.addAttribute("totalProducts", totalProducts);
//            model.addAttribute("currentPage", page);
//            model.addAttribute("pageSize", size);
//            model.addAttribute("sortBy", sortBy);
//            model.addAttribute("sortDirection", sortDirection);
//            model.addAttribute("keyword", keyword);
//            model.addAttribute("searchName", name);
//            model.addAttribute("searchDescription", description);
//            model.addAttribute("searchMinPrice", minPrice);
//            model.addAttribute("searchMaxPrice", maxPrice);
//            model.addAttribute("searchBrand", brand);
//            model.addAttribute("searchActive", active);

            return "admin/products";

        } catch (Exception e) {
            model.addAttribute("error", "Failed to load products: " + e.getMessage());
            return "admin/products";
        }
    }

    @GetMapping("/new")
    public String newProductForm(Model model) {
        List<String> brands = productService.getAllBrands();
        model.addAttribute("product", new Product());
        model.addAttribute("brands", brands);
        model.addAttribute("isEdit", false);
        return "admin/product-form";
    }

    @GetMapping("/edit/{id}")
    public String editProductForm(@PathVariable Long id, Model model) {
        try {
            List<String> brands = productService.getAllBrands();
            model.addAttribute("productId", id);
            model.addAttribute("brands", brands);
            model.addAttribute("isEdit", true);
            return "admin/product-form";
        } catch (Exception e) {
            model.addAttribute("error", "Product not found: " + e.getMessage());
            return "redirect:/admin/products";
        }
    }
}
