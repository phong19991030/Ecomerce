// src/main/java/com/ecommerce/app/service/ProfileService.java
package com.ecommerce.app.service;

import com.ecommerce.app.dto.UserProfileDTO;
import com.ecommerce.app.entity.User;

public interface ProfileService {
    UserProfileDTO getUserProfile(String username);
    UserProfileDTO updateUserProfile(String username, UserProfileDTO profileDTO);
    boolean changePassword(String username, String currentPassword, String newPassword);
}