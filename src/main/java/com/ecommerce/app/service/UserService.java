package com.ecommerce.app.service;

import com.ecommerce.app.entity.User;

public interface UserService {
    Long findUserIdByUserName(String userName);
}
