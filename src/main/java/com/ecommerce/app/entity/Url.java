// src/main/java/com/ecommerce/app/entity/Url.java
package com.ecommerce.app.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "urls")
public class Url {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String pattern;

    private String description;

    @Column(nullable = false)
    private String httpMethod;

    @ManyToMany(mappedBy = "urls", fetch = FetchType.LAZY)
    private Set<Role> roles = new HashSet<>();

    // Custom equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Url url = (Url) o;
        return id != null && id.equals(url.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
