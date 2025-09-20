// src/main/java/com/ecommerce/app/repository/OrderItemRepository.java
package com.ecommerce.app.repository;

import com.ecommerce.app.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}