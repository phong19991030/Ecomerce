// src/main/java/com/ecommerce/app/repository/CategoryRepository.java
package com.ecommerce.app.repository;

import com.ecommerce.app.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
//     List<Category> findByActiveTrue();
    boolean existsByName(String name);

    Optional<Category> findByName(String electronics);
}
