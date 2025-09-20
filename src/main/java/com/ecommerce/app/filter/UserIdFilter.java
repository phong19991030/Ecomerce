//// src/main/java/com/ecommerce/app/filter/UserIdFilter.java
//package com.ecommerce.app.filter;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//@Component
//@RequiredArgsConstructor
//public class UserIdFilter extends OncePerRequestFilter {
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//            throws ServletException, IOException {
//
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        if (authentication != null && authentication.isAuthenticated() &&
//                authentication.getPrincipal() instanceof UserDetails) {
//
//            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//
//            // Giả sử username là userId dạng String, bạn cần điều chỉnh theo thực tế
//            try {
//                Long userId = Long.parseLong(userDetails.getUsername());
//                request.setAttribute("userId", userId);
//            } catch (NumberFormatException e) {
//                // Xử lý nếu username không phải là số
//            }
//        }
//
//        filterChain.doFilter(request, response);
//    }
//}