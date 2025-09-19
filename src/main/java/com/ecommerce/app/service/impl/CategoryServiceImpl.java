// src/main/java/com/ecommerce/app/service/impl/CategoryServiceImpl.java
package com.ecommerce.app.service.impl;

import com.ecommerce.app.entity.Category;
import com.ecommerce.app.repository.CategoryRepository;
import com.ecommerce.app.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        try {
            return categoryRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get categories: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Category> getActiveCategories() {
        try {
            // Nếu bạn có trường active trong Category, thêm điều kiện where
            // return categoryRepository.findByActiveTrue();
            return categoryRepository.findAll(); // Tạm thời trả về tất cả
        } catch (Exception e) {
            throw new RuntimeException("Failed to get active categories: " + e.getMessage(), e);
        }
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    public Category saveCategory(Category category) {
        try {
            return categoryRepository.save(category);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save category: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteCategory(Long id) {
        try {
            if (!categoryRepository.existsById(id)) {
                throw new RuntimeException("Category not found with id: " + id);
            }
            categoryRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete category: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }
}
