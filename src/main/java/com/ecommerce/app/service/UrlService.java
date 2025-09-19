// src/main/java/com/ecommerce/app/service/UrlService.java
package com.ecommerce.app.service;

import com.ecommerce.app.entity.Url;
import java.util.List;

public interface UrlService {
    Url createUrl(Url url);
    Url getUrlById(Long id);
    List<Url> getAllUrls();
    Url updateUrl(Long id, Url url);
    void deleteUrl(Long id);
    List<Url> getUrlsByRoleNames(List<String> roleNames);

    // Thêm vào UrlService interface
    List<String> debugGetUrlsByRoleNames(List<String> roleNames);
}
