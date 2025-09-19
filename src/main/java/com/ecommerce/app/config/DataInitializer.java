// src/main/java/com/ecommerce/app/config/DataInitializer.java
package com.ecommerce.app.config;

import com.ecommerce.app.entity.*;
import com.ecommerce.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UrlRepository urlRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;


    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            createDefaultData();
        }
    }

    private void createDefaultData() {
        System.out.println("Creating default data...");

        // Tạo URLs trước
        Url loginUrl = createUrl("/login", "GET", "Login page");
        Url loginPostUrl = createUrl("/login", "POST", "Login processing");
        Url logoutUrl = createUrl("/logout", "POST", "Logout");
        Url dashboardUrl = createUrl("/dashboard", "GET", "User Dashboard");
        Url productsUrl = createUrl("/products", "GET", "Products Page");
        Url homeUrl = createUrl("/", "GET", "Home Page");
        Url cssUrl = createUrl("/css/**", "GET", "CSS resources");
        Url jsUrl = createUrl("/js/**", "GET", "JavaScript resources");
        Url webjarsUrl = createUrl("/webjars/**", "GET", "WebJars resources");
        Url imagesUrl = createUrl("/images/**", "GET", "Image resources");
        Url adminDashboardUrl = createUrl("/admin/**", "GET", "Admin Dashboard");

        // Tạo Roles
        Role adminRole = createRole("ADMIN", "Administrator");
        Role userRole = createRole("USER", "Regular User");

        // Gán URLs cho Roles - cách đơn giản hơn
        adminRole.getUrls().addAll(Arrays.asList(
                loginUrl, loginPostUrl, logoutUrl, dashboardUrl, productsUrl,
                homeUrl, cssUrl, jsUrl, webjarsUrl, imagesUrl, adminDashboardUrl
        ));

        userRole.getUrls().addAll(Arrays.asList(
                loginUrl, loginPostUrl, logoutUrl, dashboardUrl, productsUrl,
                homeUrl, cssUrl, jsUrl, webjarsUrl, imagesUrl
        ));

        // Lưu roles
        roleRepository.save(adminRole);
        roleRepository.save(userRole);

        // Tạo users
        createUser("admin", "admin123", "admin@email.com", "Administrator", adminRole);
        createUser("user", "user123", "user@email.com", "Regular User", userRole);
        createSampleProducts();

        System.out.println("=== DEFAULT DATA INITIALIZED ===");
        System.out.println("Admin: admin / admin123");
        System.out.println("User: user / user123");
    }

    private Url createUrl(String pattern, String httpMethod, String description) {
        Url url = new Url();
        url.setPattern(pattern);
        url.setHttpMethod(httpMethod);
        url.setDescription(description);
        url.setRoles(new HashSet<>());
        return urlRepository.save(url);
    }

    private Role createRole(String name, String description) {
        Role role = new Role();
        role.setName(name);
        role.setDescription(description);
        role.setUrls(new HashSet<>());
        role.setUsers(new HashSet<>());
        return roleRepository.save(role);
    }

    private void createUser(String username, String password, String email, String fullName, Role role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setFullName(fullName);
        user.setEnabled(true);
        user.setRoles(new HashSet<>(Arrays.asList(role)));
        userRepository.save(user);
    }

    private void createSampleProducts() {
        if (productRepository.count() == 0) {
            System.out.println("Creating sample products...");

            // Lấy categories
            Category electronics = categoryRepository.findByName("Electronics")
                    .orElseGet(() -> createCategory("Electronics", "Electronic devices"));
            Category clothing = categoryRepository.findByName("Clothing")
                    .orElseGet(() -> createCategory("Clothing", "Clothing items"));
            Category books = categoryRepository.findByName("Books")
                    .orElseGet(() -> createCategory("Books", "Books and magazines"));

            // Tạo sản phẩm mẫu
            createProduct("iPhone 15 Pro", "Latest iPhone with advanced camera", 999.99, 50,
                    "APPLE123", "Apple", "Space Gray", electronics, true);
            createProduct("Samsung Galaxy S24", "Powerful Android smartphone", 899.99, 30,
                    "SAMSUNG456", "Samsung", "Phantom Black", electronics, true);
            createProduct("MacBook Air M2", "Lightweight laptop for professionals", 1299.99, 25,
                    "APPLE789", "Apple", "Silver", electronics, true);
            createProduct("Nike Air Max", "Comfortable running shoes", 129.99, 100,
                    "NIKE001", "Nike", "White", clothing, true);
            createProduct("Levi's Jeans", "Classic denim jeans", 89.99, 75,
                    "LEVI002", "Levi's", "Blue", clothing, true);
            createProduct("Spring Boot Guide", "Complete guide to Spring Boot", 39.99, 200,
                    "BOOK001", "Tech Publications", "N/A", books, true);
            createProduct("Wireless Headphones", "Noise cancelling headphones", 199.99, 40,
                    "SONY003", "Sony", "Black", electronics, true);

            System.out.println("Sample products created successfully");
        }
    }

    private void createProduct(String name, String description, double price, int stock,
                               String sku, String brand, String color, Category category, boolean active) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(BigDecimal.valueOf(price));
        product.setStock(stock);
        product.setSku(sku);
        product.setBrand(brand);
        product.setColor(color);
        product.setCategory(category);
        product.setActive(active);
        product.setImageUrl("/images/placeholder-product.png"); // Ảnh mặc định

        productRepository.save(product);
    }

    private Category createCategory(String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        return categoryRepository.save(category);
    }
}
