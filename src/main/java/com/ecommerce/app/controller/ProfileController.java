// src/main/java/com/ecommerce/app/controller/ProfileController.java
package com.ecommerce.app.controller;

import com.ecommerce.app.dto.AddressDTO;
import com.ecommerce.app.dto.UserProfileDTO;
import com.ecommerce.app.service.AddressService;
import com.ecommerce.app.service.ProfileService;
import com.ecommerce.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

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
}