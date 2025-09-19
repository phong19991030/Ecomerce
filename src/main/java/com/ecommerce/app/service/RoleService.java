// src/main/java/com/ecommerce/app/service/RoleService.java
package com.ecommerce.app.service;

import com.ecommerce.app.entity.Role;
import java.util.List;
import java.util.Set;

public interface RoleService {
    Role createRole(Role role);
    Role getRoleById(Long id);
    Role getRoleByName(String name);
    List<Role> getAllRoles();
    Role updateRole(Long id, Role role);
    void deleteRole(Long id);
    void assignUrlsToRole(Long roleId, Set<Long> urlIds);
}
