// src/main/java/com/ecommerce/app/dto/UserRegistrationDto.java
package com.ecommerce.app.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDto {
    private String username;
    private String password;
    private String confirmPassword;
    private String email;
    private String fullName;
}