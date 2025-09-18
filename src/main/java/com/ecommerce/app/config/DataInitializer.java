// src/main/java/com/ecommerce/app/config/DataInitializer.java
package com.ecommerce.app.config;

import com.ecommerce.app.entity.Role;
import com.ecommerce.app.entity.User;
import com.ecommerce.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Tạo user admin nếu chưa tồn tại
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@email.com");
            admin.setFullName("Administrator");
            admin.setRole(Role.ROLE_ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);

            System.out.println("=== ADMIN ACCOUNT ===");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("=====================");
        }

        // Tạo user thường nếu chưa tồn tại
        if (userRepository.findByUsername("user").isEmpty()) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setEmail("user@email.com");
            user.setFullName("Regular User");
            user.setRole(Role.ROLE_USER);
            user.setEnabled(true);
            userRepository.save(user);

            System.out.println("=== USER ACCOUNT ===");
            System.out.println("Username: user");
            System.out.println("Password: user123");
            System.out.println("====================");
        }
    }
}