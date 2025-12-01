package com.ecommerce.app.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.authentication.event.LogoutSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AuthenticationDebugListener {

    @EventListener
    public void handleAuthenticationSuccess(AuthenticationSuccessEvent event) {
        Authentication auth = event.getAuthentication();
        log.info("=== AUTHENTICATION SUCCESS ===");
        log.info("Username: {}", auth.getName());
        log.info("Authorities: {}", auth.getAuthorities());
        log.info("Credentials: {}", auth.getCredentials());
        log.info("Details: {}", auth.getDetails());
        log.info("==============================");
    }

    @EventListener
    public void handleLogoutSuccess(LogoutSuccessEvent event) {
        Authentication auth = event.getAuthentication();
        log.info("=== LOGOUT SUCCESS ===");
        log.info("Username: {}", auth != null ? auth.getName() : "null");
        log.info("==============================");
    }
}