package com.ecommerce.app.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UserCreateDTO {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private Set<Long> roleIds;
}