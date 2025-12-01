// src/main/java/com/ecommerce/app/controller/HomeController.java
package com.ecommerce.app.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Collection;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra kỹ hơn để đảm bảo user thực sự đã đăng nhập
        if (isFullyAuthenticated(auth)) {
            return "redirect:/dashboard";
        }

        // Nếu chưa đăng nhập thì chuyển đến trang login
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String login() {
        // Nếu đã đăng nhập thì chuyển hướng đến dashboard
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (isFullyAuthenticated(auth)) {
            return "redirect:/dashboard";
        }
        return "login";
    }

    @GetMapping("/logout")
    public String logout() {
        return "redirect:/login?logout=true";
    }

    /**
     * Kiểm tra xem user có thực sự đã đăng nhập hay không
     * Phương thức này kiểm tra kỹ hơn để tránh nhầm lẫn với anonymous user
     */
    private boolean isFullyAuthenticated(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        // Kiểm tra tên user
        if (auth.getName() == null ||
                auth.getName().equals("anonymousUser") ||
                auth.getName().isEmpty()) {
            return false;
        }

        // Kiểm tra authorities
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        if (authorities == null || authorities.isEmpty()) {
            return false;
        }

        // Kiểm tra xem có authority của anonymous user không
        boolean hasAnonymousAuthority = authorities.stream()
                .anyMatch(grantedAuthority ->
                        grantedAuthority.getAuthority().equals("ROLE_ANONYMOUS") ||
                                grantedAuthority.getAuthority().contains("ANONYMOUS"));

        return !hasAnonymousAuthority;
    }
}