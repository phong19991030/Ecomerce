// src/main/java/com/ecommerce/app/repository/CartRepository.java
package com.ecommerce.app.repository;

import com.ecommerce.app.entity.Cart;
import com.ecommerce.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserId(Long userId);
}