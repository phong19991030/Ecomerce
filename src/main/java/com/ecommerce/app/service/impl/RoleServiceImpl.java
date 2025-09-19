// src/main/java/com/ecommerce/app/service/impl/RoleServiceImpl.java
package com.ecommerce.app.service.impl;

import com.ecommerce.app.entity.Role;
import com.ecommerce.app.entity.Url;
import com.ecommerce.app.repository.RoleRepository;
import com.ecommerce.app.repository.UrlRepository;
import com.ecommerce.app.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final UrlRepository urlRepository;

    @Override
    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
    }

    @Override
    public Role getRoleByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Role not found with name: " + name));
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role updateRole(Long id, Role role) {
        Role existingRole = getRoleById(id);
        existingRole.setName(role.getName());
        existingRole.setDescription(role.getDescription());
        return roleRepository.save(existingRole);
    }

    @Override
    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }

    @Override
    public void assignUrlsToRole(Long roleId, Set<Long> urlIds) {
        Role role = getRoleById(roleId);
        Set<Url> urls = urlIds.stream()
                .map(urlId -> urlRepository.findById(urlId)
                        .orElseThrow(() -> new RuntimeException("URL not found with id: " + urlId)))
                .collect(Collectors.toSet());

        role.setUrls(urls);
        roleRepository.save(role);
    }
}
