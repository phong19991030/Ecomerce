// src/main/java/com/ecommerce/app/dto/UserProfileDTO.java
package com.ecommerce.app.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
}