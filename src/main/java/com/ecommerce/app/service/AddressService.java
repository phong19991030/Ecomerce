// src/main/java/com/ecommerce/app/service/AddressService.java
package com.ecommerce.app.service;

import com.ecommerce.app.dto.AddressDTO;
import com.ecommerce.app.entity.Address;

import java.util.List;

public interface AddressService {
    List<AddressDTO> getUserAddresses(Long userId);
    AddressDTO getAddressById(Long id, Long userId);
    AddressDTO createAddress(AddressDTO addressDTO, Long userId);
    AddressDTO updateAddress(AddressDTO addressDTO, Long userId);
    boolean deleteAddress(Long id, Long userId);
    boolean setDefaultAddress(Long id, Long userId);
    AddressDTO getDefaultAddress(Long userId);
}