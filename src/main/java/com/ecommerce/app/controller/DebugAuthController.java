// src/main/java/com/ecommerce/app/controller/DebugAuthController.java
package com.ecommerce.app.controller;

import com.ecommerce.app.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class DebugAuthController {

    private final UrlService urlService;

    @GetMapping("/debug/auth")
    public String debugAuth(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<String> authorities = auth.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.toList());

        // Lấy role names không có ROLE_ prefix
        List<String> roleNames = authorities.stream()
                .map(authority -> {
                    if (authority.startsWith("ROLE_")) {
                        return authority.substring(5);
                    }
                    return authority;
                })
                .collect(Collectors.toList());

        // Lấy URLs mà user có quyền truy cập
        List<String> accessibleUrls = urlService.debugGetUrlsByRoleNames(roleNames);

        model.addAttribute("username", auth.getName());
        model.addAttribute("isAuthenticated", auth.isAuthenticated());
        model.addAttribute("authorities", authorities);
        model.addAttribute("roleNames", roleNames);
        model.addAttribute("accessibleUrls", accessibleUrls);

        return "debug/auth";
    }
}
