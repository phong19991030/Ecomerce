package com.ecommerce.app.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UserUpdateDTO {
    private String username;
    private String email;
    private String fullName;
    private Boolean enabled;
    private Set<Long> roleIds;
}
