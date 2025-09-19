// src/main/java/com/ecommerce/app/service/CategoryService.java
package com.ecommerce.app.service;

import com.ecommerce.app.entity.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    List<Category> getActiveCategories();
    Category getCategoryById(Long id);
    Category saveCategory(Category category);
    void deleteCategory(Long id);
    boolean existsById(Long id);
}
