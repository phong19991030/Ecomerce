package com.ecommerce.app.service.impl;

import com.ecommerce.app.entity.User;
import com.ecommerce.app.repository.UserRepository;
import com.ecommerce.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public Long findUserIdByUserName(String userName) {
        Optional<User> optionalUser = userRepository.findByUsername(userName);
        if (optionalUser.isPresent()) {
            return optionalUser.get().getId();
        }
        return null;
    }
}
