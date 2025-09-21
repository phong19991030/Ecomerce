package com.ecommerce.app.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private boolean enabled;
    private Set<Long> roleIds;
}
