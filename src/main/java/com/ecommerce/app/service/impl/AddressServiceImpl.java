// src/main/java/com/ecommerce/app/service/impl/AddressServiceImpl.java
package com.ecommerce.app.service.impl;

import com.ecommerce.app.dto.AddressDTO;
import com.ecommerce.app.entity.Address;
import com.ecommerce.app.entity.User;
import com.ecommerce.app.repository.AddressRepository;
import com.ecommerce.app.repository.UserRepository;
import com.ecommerce.app.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public List<AddressDTO> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AddressDTO getAddressById(Long id, Long userId) {
        Address address = addressRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        return convertToDTO(address);
    }

    @Override
    @Transactional
    public AddressDTO createAddress(AddressDTO addressDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = convertToEntity(addressDTO);
        address.setUser(user);

        if (addressDTO.isDefault()) {
            addressRepository.clearDefaultAddresses(userId);
        }

        Address savedAddress = addressRepository.save(address);
        return convertToDTO(savedAddress);
    }

    @Override
    @Transactional
    public AddressDTO updateAddress(AddressDTO addressDTO, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressDTO.getId(), userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setFullName(addressDTO.getFullName());
        address.setPhone(addressDTO.getPhone());
        address.setStreet(addressDTO.getStreet());
        address.setCity(addressDTO.getCity());
        address.setState(addressDTO.getState());
        address.setZipCode(addressDTO.getZipCode());
        address.setCountry(addressDTO.getCountry());
        address.setAddressType(addressDTO.getAddressType());

        if (addressDTO.isDefault()) {
            addressRepository.clearDefaultAddresses(userId);
            address.setDefault(true);
        } else {
            address.setDefault(false);
        }

        Address updatedAddress = addressRepository.save(address);
        return convertToDTO(updatedAddress);
    }

    @Override
    @Transactional
    public boolean deleteAddress(Long id, Long userId) {
        if (!addressRepository.existsByIdAndUserId(id, userId)) {
            return false;
        }
        addressRepository.deleteById(id);
        return true;
    }

    @Override
    @Transactional
    public boolean setDefaultAddress(Long id, Long userId) {
        Address address = addressRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        addressRepository.clearDefaultAddresses(userId);
        addressRepository.setDefaultAddress(id, userId);
        return true;
    }

    @Override
    public AddressDTO getDefaultAddress(Long userId) {
        Address address = addressRepository.findDefaultAddressByUserId(userId)
                .orElse(null);
        return address != null ? convertToDTO(address) : null;
    }

    private AddressDTO convertToDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setFullName(address.getFullName());
        dto.setPhone(address.getPhone());
        dto.setStreet(address.getStreet());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setZipCode(address.getZipCode());
        dto.setCountry(address.getCountry());
        // THÊM: Cập nhật trường tọa độ mới
        dto.setLatitude(address.getLatitude());
        dto.setLongitude(address.getLongitude());
        // END: Cập nhật trường tọa độ mới
        dto.setDefault(address.isDefault());
        dto.setAddressType(address.getAddressType());
        return dto;
    }

    // Cập nhật phương thức chuyển đổi từ DTO sang Entity
    private Address convertToEntity(AddressDTO dto) {
        Address address = new Address();
        address.setId(dto.getId());
        address.setFullName(dto.getFullName());
        address.setPhone(dto.getPhone());
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setZipCode(dto.getZipCode());
        address.setCountry(dto.getCountry());
        // THÊM: Cập nhật trường tọa độ mới
        address.setLatitude(dto.getLatitude());
        address.setLongitude(dto.getLongitude());
        // END: Cập nhật trường tọa độ mới
        address.setDefault(dto.isDefault());
        address.setAddressType(dto.getAddressType());
        // User sẽ được set trong phương thức createAddress/updateAddress
        return address;
    }
}