// src/main/java/com/ecommerce/app/service/impl/ProductServiceImpl.java
package com.ecommerce.app.service.impl;

import com.ecommerce.app.dto.CategoryDTO;
import com.ecommerce.app.dto.ProductDTO;
import com.ecommerce.app.entity.Product;
import com.ecommerce.app.repository.ProductRepository;
import com.ecommerce.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Page<ProductDTO> getAllProducts(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection), sortBy));
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(this::convertToDTO);
    }

    @Override
    public Page<ProductDTO> searchProducts(String keyword, int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            return productRepository.search("%" + keyword + "%", pageRequest);
        } catch (Exception e) {
            throw new RuntimeException("Failed to search products: " + e.getMessage(), e);
        }
    }

    @Override
    public Page<ProductDTO> getProductsByCategory(Long categoryId, int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            return productRepository.findByCategoryId(categoryId, pageRequest);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get products by category: " + e.getMessage(), e);
        }
    }

    @Override
    public Page<ProductDTO> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            return productRepository.findByPriceBetween(minPrice, maxPrice, pageRequest);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get products by price range: " + e.getMessage(), e);
        }
    }

    @Override
    public Page<ProductDTO> advancedSearch(String name, String description, BigDecimal minPrice,
                                           BigDecimal maxPrice, Long categoryId, String brand,
                                           Boolean active, int page, int size, String sortBy, String sortDirection) {
        try {
            Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
            PageRequest pageRequest = PageRequest.of(page, size, sort);

            return productRepository.advancedSearch(
                    name, description, minPrice, maxPrice,
                    categoryId, brand, active, pageRequest
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to advanced search: " + e.getMessage(), e);
        }
    }

    // Các phương thức khác giữ nguyên...
    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Override
    public Product saveProduct(Product product) {
        try {
            return productRepository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save product: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteProduct(Long id) {
        try {
            if (!productRepository.existsById(id)) {
                throw new RuntimeException("Product not found with id: " + id);
            }
            productRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete product: " + e.getMessage(), e);
        }
    }

    @Override
    public long countProducts() {
        try {
            return productRepository.count();
        } catch (Exception e) {
            throw new RuntimeException("Failed to count products: " + e.getMessage(), e);
        }
    }

    @Override
    public long countProductsByCategory(Long categoryId) {
        try {
            return productRepository.countByCategoryId(categoryId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to count products by category: " + e.getMessage(), e);
        }
    }

    @Override
    public List<String> getAllBrands() {
        try {
            return productRepository.findAllBrands();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get brands: " + e.getMessage(), e);
        }
    }

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
}
