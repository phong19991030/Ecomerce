// src/main/java/com/ecommerce/app/service/impl/UrlServiceImpl.java
package com.ecommerce.app.service.impl;

import com.ecommerce.app.entity.Url;
import com.ecommerce.app.repository.UrlRepository;
import com.ecommerce.app.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrlServiceImpl implements UrlService {

    private final UrlRepository urlRepository;

    @Override
    public Url createUrl(Url url) {
        return urlRepository.save(url);
    }

    @Override
    public Url getUrlById(Long id) {
        return urlRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("URL not found with id: " + id));
    }

    @Override
    public List<Url> getAllUrls() {
        return urlRepository.findAll();
    }

    @Override
    public Url updateUrl(Long id, Url url) {
        Url existingUrl = getUrlById(id);
        existingUrl.setPattern(url.getPattern());
        existingUrl.setHttpMethod(url.getHttpMethod());
        existingUrl.setDescription(url.getDescription());
        return urlRepository.save(existingUrl);
    }

    @Override
    public void deleteUrl(Long id) {
        urlRepository.deleteById(id);
    }

    @Override
    public List<Url> getUrlsByRoleNames(List<String> roleNames) {
        return urlRepository.findUrlsByRoleNames(roleNames);
    }

    // Thêm vào UrlServiceImpl
    @Override
    public List<String> debugGetUrlsByRoleNames(List<String> roleNames) {
        List<Url> urls = urlRepository.findUrlsByRoleNames(roleNames);
        return urls.stream()
                .map(url -> url.getHttpMethod() + " " + url.getPattern())
                .collect(Collectors.toList());
    }
}
