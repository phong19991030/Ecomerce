// src/main/java/com/ecommerce/app/repository/RoleRepository.java
package com.ecommerce.app.repository;

import com.ecommerce.app.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
    boolean existsByName(String name);
}
