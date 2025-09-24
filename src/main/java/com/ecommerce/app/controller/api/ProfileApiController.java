package com.ecommerce.app.controller.api;

import com.ecommerce.app.dto.AddressDTO;
import com.ecommerce.app.dto.UserProfileDTO;
import com.ecommerce.app.service.AddressService;
import com.ecommerce.app.service.ProfileService;
import com.ecommerce.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfileApiController {

    private final ProfileService profileService;
    private final AddressService addressService;
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(Authentication authentication) {
        String username = authentication.getName();
        UserProfileDTO profile = profileService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@RequestBody UserProfileDTO profileDTO,
                                                        Authentication authentication) {
        String username = authentication.getName();
        UserProfileDTO updatedProfile = profileService.updateUserProfile(username, profileDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/profile/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> request,
                                                              Authentication authentication) {
        String username = authentication.getName();
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        boolean success = profileService.changePassword(username, currentPassword, newPassword);

        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", success ? "Password changed successfully" : "Current password is incorrect");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDTO>> getAddresses(Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);
        List<AddressDTO> addresses = addressService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/addresses/{id}")
    public ResponseEntity<AddressDTO> getAddress(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);
        AddressDTO address = addressService.getAddressById(id, userId);
        return ResponseEntity.ok(address);
    }

    @GetMapping("/addresses/default")
    public ResponseEntity<AddressDTO> getDefaultAddress(Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);
        AddressDTO defaultAddress = addressService.getDefaultAddress(userId);
        return ResponseEntity.ok(defaultAddress);
    }

    @PostMapping("/addresses")
    public ResponseEntity<AddressDTO> createAddress(@RequestBody AddressDTO addressDTO,
                                                    Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);
        AddressDTO createdAddress = addressService.createAddress(addressDTO, userId);
        return ResponseEntity.ok(createdAddress);
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Long id,
                                                    @RequestBody AddressDTO addressDTO,
                                                    Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);
        addressDTO.setId(id);
        AddressDTO updatedAddress = addressService.updateAddress(addressDTO, userId);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Map<String, Object>> deleteAddress(@PathVariable Long id,
                                                             Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);

        boolean success = addressService.deleteAddress(id, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", success ? "Address deleted successfully" : "Address not found");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/addresses/{id}/set-default")
    public ResponseEntity<Map<String, Object>> setDefaultAddress(@PathVariable Long id,
                                                                 Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);

        boolean success = addressService.setDefaultAddress(id, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", success ? "Default address set successfully" : "Address not found");

        return ResponseEntity.ok(response);
    }
}