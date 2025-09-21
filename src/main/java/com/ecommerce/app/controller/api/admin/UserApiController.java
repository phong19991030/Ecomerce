// src/main/java/com/ecommerce/app/controller/admin/UserApiController.java
package com.ecommerce.app.controller.admin;

import com.ecommerce.app.dto.*;
import com.ecommerce.app.entity.Role;
import com.ecommerce.app.entity.User;
import com.ecommerce.app.service.RoleService;
import com.ecommerce.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/users/api")
public class UserApiController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder; // Thêm PasswordEncoder

    // API lấy danh sách users
    @GetMapping
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean enabled) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage;

        if (search != null && !search.trim().isEmpty()) {
            userPage = userService.searchUsers(search.trim(), pageable);
        } else {
            userPage = userService.getAllUsers(pageable);
        }

        // Lọc theo trạng thái nếu có - sửa lại phần này
        List<User> filteredUsers = userPage.getContent();
        if (enabled != null) {
            filteredUsers = filteredUsers.stream()
                    .filter(user -> user.isEnabled() == enabled)
                    .collect(Collectors.toList());
        }

        // Tạo Page mới từ danh sách đã lọc
        Page<User> finalPage = new org.springframework.data.domain.PageImpl<>(
                filteredUsers,
                pageable,
                enabled != null ? filteredUsers.size() : userPage.getTotalElements()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("users", finalPage.getContent().stream().map(this::convertToResponseDTO).collect(Collectors.toList()));
        response.put("currentPage", finalPage.getNumber());
        response.put("totalItems", finalPage.getTotalElements());
        response.put("totalPages", finalPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    // API lấy thông tin user
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(convertToDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    // API tạo user mới
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserCreateDTO userDTO) {
        try {
            if (userService.usernameExists(userDTO.getUsername())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }

            if (userService.emailExists(userDTO.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }

            User user = new User();
            user.setUsername(userDTO.getUsername());

            // MÃ HÓA PASSWORD TRƯỚC KHI LƯU
            String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
            user.setPassword(encodedPassword);

            user.setEmail(userDTO.getEmail());
            user.setFullName(userDTO.getFullName());
            user.setEnabled(true);

            // Set roles
            if (userDTO.getRoleIds() != null) {
                Set<Role> roles = userDTO.getRoleIds().stream()
                        .map(roleId -> roleService.findRoleById(roleId).orElse(null))
                        .filter(role -> role != null)
                        .collect(Collectors.toSet());
                user.setRoles(roles);
            }

            User savedUser = userService.saveUser(user);
            return ResponseEntity.ok(convertToResponseDTO(savedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // API cập nhật user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO userDTO) {
        try {
            return userService.getUserById(id).map(existingUser -> {
                if (userDTO.getUsername() != null) {
                    if (userService.usernameExistsExceptCurrent(userDTO.getUsername(), id)) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
                    }
                    existingUser.setUsername(userDTO.getUsername());
                }

                if (userDTO.getEmail() != null) {
                    if (userService.emailExistsExceptCurrent(userDTO.getEmail(), id)) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
                    }
                    existingUser.setEmail(userDTO.getEmail());
                }

                if (userDTO.getFullName() != null) {
                    existingUser.setFullName(userDTO.getFullName());
                }

                if (userDTO.getEnabled() != null) {
                    existingUser.setEnabled(userDTO.getEnabled());
                }

                // Update roles
                if (userDTO.getRoleIds() != null) {
                    Set<Role> roles = userDTO.getRoleIds().stream()
                            .map(roleId -> roleService.findRoleById(roleId).orElse(null))
                            .filter(role -> role != null)
                            .collect(Collectors.toSet());
                    existingUser.setRoles(roles);
                }

                User updatedUser = userService.saveUser(existingUser);
                return ResponseEntity.ok(convertToResponseDTO(updatedUser));
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // API xóa user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            if (userService.getUserById(id).isPresent()) {
                userService.deleteUser(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // API toggle trạng thái user
    @PostMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            boolean success = userService.toggleUserStatus(id);
            if (success) {
                return userService.getUserById(id)
                        .map(user -> ResponseEntity.ok(convertToResponseDTO(user)))
                        .orElse(ResponseEntity.notFound().build());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setEnabled(user.isEnabled());
        dto.setRoleIds(user.getRoles().stream().map(Role::getId).collect(Collectors.toSet()));
        return dto;
    }

    private UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setEnabled(user.isEnabled());
        dto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        return dto;
    }
}