// src/main/java/com/ecommerce/app/entity/CartItem.java
package com.ecommerce.app.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    @Column(name = "added_date")
    private LocalDateTime addedDate;

    @PrePersist
    public void prePersist() {
        if (addedDate == null) {
            addedDate = LocalDateTime.now();
        }
    }
}