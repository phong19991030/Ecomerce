package com.ecommerce.app.service;

import com.ecommerce.app.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface UserService {
    Long findUserIdByUserName(String userName);

    Page<User> getAllUsers(Pageable pageable);

    Page<User> searchUsers(String keyword, Pageable pageable);

    Optional<User> getUserById(Long id);

    User saveUser(User user);

    void deleteUser(Long id);

    boolean toggleUserStatus(Long id);

    Long countActiveUsers();

    boolean usernameExists(String username);

    boolean emailExists(String email);

    boolean usernameExistsExceptCurrent(String username, Long currentUserId);

    boolean emailExistsExceptCurrent(String email, Long currentUserId);
}
