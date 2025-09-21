// src/main/java/com/ecommerce/app/controller/admin/UserViewController.java
package com.ecommerce.app.controller.admin;

import com.ecommerce.app.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/users")
public class UserViewController {

    @Autowired
    private RoleService roleService;

    // Hiển thị trang quản lý users
    @GetMapping
    public String usersPage(Model model) {
        model.addAttribute("roles", roleService.getAllRoles());
        return "admin/users";
    }
}