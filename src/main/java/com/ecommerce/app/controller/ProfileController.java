// src/main/java/com/ecommerce/app/controller/ProfileController.java
package com.ecommerce.app.controller;

import com.ecommerce.app.dto.AddressDTO;
import com.ecommerce.app.dto.UserProfileDTO;
import com.ecommerce.app.service.AddressService;
import com.ecommerce.app.service.ProfileService;
import com.ecommerce.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final AddressService addressService;
    private final UserService userService;

    @GetMapping("/profile")
    public String profilePage(Authentication authentication, Model model) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);

        UserProfileDTO profile = profileService.getUserProfile(username);
        List<AddressDTO> addresses = addressService.getUserAddresses(userId);
        AddressDTO defaultAddress = addressService.getDefaultAddress(userId);

        model.addAttribute("profile", profile);
        model.addAttribute("addresses", addresses);
        model.addAttribute("defaultAddress", defaultAddress);
        model.addAttribute("username", username);

        return "profile/profile";
    }

    @GetMapping("/addresses")
    public String addressesPage(Authentication authentication, Model model) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);

        List<AddressDTO> addresses = addressService.getUserAddresses(userId);
        AddressDTO defaultAddress = addressService.getDefaultAddress(userId);

        model.addAttribute("addresses", addresses);
        model.addAttribute("defaultAddress", defaultAddress);
        model.addAttribute("username", username);

        return "profile/addresses";
    }

    // REST API endpoints for AJAX calls
    @GetMapping("/api/profile")
    @ResponseBody
    public ResponseEntity<UserProfileDTO> getProfile(Authentication authentication) {
        String username = authentication.getName();
        UserProfileDTO profile = profileService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/api/profile")
    @ResponseBody
    public ResponseEntity<UserProfileDTO> updateProfile(@RequestBody UserProfileDTO profileDTO,
                                                        Authentication authentication) {
        String username = authentication.getName();
        UserProfileDTO updatedProfile = profileService.updateUserProfile(username, profileDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/api/profile/change-password")
    @ResponseBody
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

    @GetMapping("/api/addresses")
    @ResponseBody
    public ResponseEntity<List<AddressDTO>> getAddresses(Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);
        List<AddressDTO> addresses = addressService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/api/addresses/{id}")
    @ResponseBody
    public ResponseEntity<AddressDTO> getAddress(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);
        AddressDTO address = addressService.getAddressById(id, userId);
        return ResponseEntity.ok(address);
    }

    @PostMapping("/api/addresses")
    @ResponseBody
    public ResponseEntity<AddressDTO> createAddress(@RequestBody AddressDTO addressDTO,
                                                    Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);
        AddressDTO createdAddress = addressService.createAddress(addressDTO, userId);
        return ResponseEntity.ok(createdAddress);
    }

    @PutMapping("/api/addresses/{id}")
    @ResponseBody
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Long id,
                                                    @RequestBody AddressDTO addressDTO,
                                                    Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findUserIdByUserName(username);
        addressDTO.setId(id);
        AddressDTO updatedAddress = addressService.updateAddress(addressDTO, userId);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/api/addresses/{id}")
    @ResponseBody
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

    @PostMapping("/api/addresses/{id}/set-default")
    @ResponseBody
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