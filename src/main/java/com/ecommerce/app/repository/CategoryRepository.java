// src/main/java/com/ecommerce/app/repository/CategoryRepository.java
package com.ecommerce.app.repository;

import com.ecommerce.app.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
}