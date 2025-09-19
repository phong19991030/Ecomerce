// src/main/java/com/ecommerce/app/repository/UrlRepository.java
package com.ecommerce.app.repository;

import com.ecommerce.app.entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
    Optional<Url> findByPatternAndHttpMethod(String pattern, String httpMethod);

    @Query("SELECT DISTINCT u FROM Url u JOIN u.roles r WHERE r.name IN :roleNames")
    List<Url> findUrlsByRoleNames(@Param("roleNames") List<String> roleNames);

    List<Url> findByPattern(String pattern);

    // Thêm method mới để debug
    @Query("SELECT u.pattern, u.httpMethod, r.name FROM Url u JOIN u.roles r")
    List<Object[]> findAllUrlsWithRoles();
}
