// src/main/java/com/ecommerce/app/repository/ProductRepository.java
package com.ecommerce.app.repository;

import com.ecommerce.app.dto.ProductDTO;
import com.ecommerce.app.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT new com.ecommerce.app.dto.ProductDTO(" +
            "p.id, p.name, p.description, p.price, p.stock, p.imageUrl, " +
            "p.sku, p.brand, p.color, p.active, " +
            "p.category.id, p.category.name, p.category.description) " +
            "FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.sku) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ProductDTO> search(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT new com.ecommerce.app.dto.ProductDTO(" +
            "p.id, p.name, p.description, p.price, p.stock, p.imageUrl, " +
            "p.sku, p.brand, p.color, p.active, " +
            "p.category.id, p.category.name, p.category.description) " +
            "FROM Product p WHERE p.category.id = :categoryId")
    Page<ProductDTO> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    @Query("SELECT new com.ecommerce.app.dto.ProductDTO(" +
            "p.id, p.name, p.description, p.price, p.stock, p.imageUrl, " +
            "p.sku, p.brand, p.color, p.active, " +
            "p.category.id, p.category.name, p.category.description) " +
            "FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    Page<ProductDTO> findByPriceBetween(@Param("minPrice") BigDecimal minPrice,
                                        @Param("maxPrice") BigDecimal maxPrice,
                                        Pageable pageable);

    @Query("SELECT new com.ecommerce.app.dto.ProductDTO(" +
            "p.id, p.name, p.description, p.price, p.stock, p.imageUrl, " +
            "p.sku, p.brand, p.color, p.active, " +
            "p.category.id, p.category.name, p.category.description) " +
            "FROM Product p WHERE p.brand = :brand")
    Page<ProductDTO> findByBrand(@Param("brand") String brand, Pageable pageable);

    @Query("SELECT new com.ecommerce.app.dto.ProductDTO(" +
            "p.id, p.name, p.description, p.price, p.stock, p.imageUrl, " +
            "p.sku, p.brand, p.color, p.active, " +
            "p.category.id, p.category.name, p.category.description) " +
            "FROM Product p WHERE p.active = :active")
    Page<ProductDTO> findByActive(@Param("active") Boolean active, Pageable pageable);

    @Query("SELECT new com.ecommerce.app.dto.ProductDTO(" +
            "p.id, p.name, p.description, p.price, p.stock, p.imageUrl, " +
            "p.sku, p.brand, p.color, p.active, " +
            "p.category.id, p.category.name, p.category.description) " +
            "FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:description IS NULL OR LOWER(p.description) LIKE LOWER(CONCAT('%', :description, '%'))) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:brand IS NULL OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
            "(:active IS NULL OR p.active = :active)")
    Page<ProductDTO> advancedSearch(
            @Param("name") String name,
            @Param("description") String description,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("categoryId") Long categoryId,
            @Param("brand") String brand,
            @Param("active") Boolean active,
            Pageable pageable);

    long countByCategoryId(Long categoryId);

    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL")
    List<String> findAllBrands();

    boolean existsById(Long id);
}
