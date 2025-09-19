// src/main/java/com/ecommerce/app/security/CustomAuthorizationManager.java
package com.ecommerce.app.security;

import com.ecommerce.app.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CustomAuthorizationManager implements AuthorizationManager<RequestAuthorizationContext> {

    private static final Logger logger = LoggerFactory.getLogger(CustomAuthorizationManager.class);
    private final UrlService urlService;

    @Override
    public AuthorizationDecision check(Supplier<Authentication> authentication,
                                       RequestAuthorizationContext context) {

        try {
            Authentication auth = authentication.get();
            if (auth == null || !auth.isAuthenticated()) {
                logger.debug("User not authenticated, denying access");
                return new AuthorizationDecision(false);
            }

            // Lấy roles của user và LOẠI BỎ tiền tố "ROLE_" nếu có
            List<String> roleNames = auth.getAuthorities().stream()
                    .map(grantedAuthority -> {
                        String authority = grantedAuthority.getAuthority();
                        // Loại bỏ "ROLE_" nếu có
                        if (authority.startsWith("ROLE_")) {
                            return authority.substring(5); // Bỏ "ROLE_"
                        }
                        return authority;
                    })
                    .collect(Collectors.toList());

            logger.debug("User roles (after processing): {}", roleNames);

            // Lấy URL pattern và HTTP method từ request
            String requestUri = context.getRequest().getRequestURI();
            String httpMethod = context.getRequest().getMethod();
            String contextPath = context.getRequest().getContextPath();

            // Remove context path if exists
            if (contextPath != null && !contextPath.isEmpty() && requestUri.startsWith(contextPath)) {
                requestUri = requestUri.substring(contextPath.length());
            }

            logger.debug("Checking access for URI: {} {}", httpMethod, requestUri);

            // Kiểm tra public URLs first
            if (isPublicUrl(requestUri, httpMethod)) {
                logger.debug("Public URL access granted: {} {}", httpMethod, requestUri);
                return new AuthorizationDecision(true);
            }

            // Lấy tất cả URLs mà user có quyền truy cập
            List<com.ecommerce.app.entity.Url> userUrls = urlService.getUrlsByRoleNames(roleNames);

            logger.debug("User has access to {} URLs", userUrls.size());
            userUrls.forEach(url ->
                    logger.debug("Allowed URL: {} {}", url.getHttpMethod(), url.getPattern())
            );

            // Kiểm tra xem user có quyền truy cập URL này không
            String finalRequestUri = requestUri;
            boolean hasAccess = userUrls.stream()
                    .anyMatch(url ->
                            matchesPattern(finalRequestUri, url.getPattern()) &&
                                    url.getHttpMethod().equalsIgnoreCase(httpMethod)
                    );

            logger.debug("Access {} for {} {}", hasAccess ? "granted" : "denied", httpMethod, requestUri);
            return new AuthorizationDecision(hasAccess);

        } catch (Exception e) {
            logger.error("Error in authorization check: {}", e.getMessage(), e);
            return new AuthorizationDecision(false);
        }
    }

    private boolean isPublicUrl(String requestUri, String httpMethod) {
        // Danh sách các URL public
        List<String> publicUrls = List.of(
                "/login", "/error", "/css/", "/js/", "/webjars/", "/images/", "/favicon.ico"
        );

        return publicUrls.stream().anyMatch(publicUrl ->
                requestUri.startsWith(publicUrl) &&
                        ("GET".equalsIgnoreCase(httpMethod) || "/login".equals(requestUri) && "POST".equalsIgnoreCase(httpMethod))
        );
    }

    private boolean matchesPattern(String requestUri, String pattern) {
        try {
            // Simple pattern matching
            if (pattern.endsWith("/**")) {
                String basePattern = pattern.substring(0, pattern.length() - 3);
                return requestUri.startsWith(basePattern);
            } else if (pattern.endsWith("/*")) {
                String basePattern = pattern.substring(0, pattern.length() - 2);
                return requestUri.startsWith(basePattern);
            }
            return requestUri.equals(pattern);
        } catch (Exception e) {
            logger.warn("Pattern matching error for URI: {}, Pattern: {}", requestUri, pattern);
            return false;
        }
    }
}
