// src/main/java/com/ecommerce/app/controller/DebugController.java
package com.ecommerce.app.controller;

import com.ecommerce.app.entity.Url;
import com.ecommerce.app.repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class DebugController {

    private final UrlRepository urlRepository;

    @GetMapping("/debug/urls")
    public String debugUrls(Model model) {
        List<Url> allUrls = urlRepository.findAll();
        List<Object[]> urlsWithRoles = urlRepository.findAllUrlsWithRoles();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<String> roles = auth.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(java.util.stream.Collectors.toList());

        model.addAttribute("allUrls", allUrls);
        model.addAttribute("urlsWithRoles", urlsWithRoles);
        model.addAttribute("userRoles", roles);
        model.addAttribute("username", auth.getName());

        return "debug/urls";
    }
}
