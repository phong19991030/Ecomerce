// src/main/java/com/ecommerce/app/service/RoleService.java
package com.ecommerce.app.service;

import com.ecommerce.app.entity.Role;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RoleService {
    Role createRole(Role role);
    Role getRoleById(Long id); // Trả về Role, throw exception nếu không tìm thấy
    Optional<Role> findRoleById(Long id); // Đổi tên phương thức này
    Role getRoleByName(String name);
    List<Role> getAllRoles();
    Role updateRole(Long id, Role role);
    void deleteRole(Long id);
    void assignUrlsToRole(Long roleId, Set<Long> urlIds);
    Role saveRole(Role role);
    boolean roleExists(String name);
}