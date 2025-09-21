// src/main/java/com/ecommerce/app/dto/AddressDTO.java
package com.ecommerce.app.dto;

import lombok.Data;

@Data
public class AddressDTO {
    private Long id;
    private String fullName;
    private String phone;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private boolean isDefault;
    private String addressType;
}