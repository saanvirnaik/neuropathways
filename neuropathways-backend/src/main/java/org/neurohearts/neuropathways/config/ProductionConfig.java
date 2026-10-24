package org.neurohearts.neuropathways.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import java.nio.charset.StandardCharsets;
import java.net.URI;

@Configuration
@Profile("prod")
public class ProductionConfig {
    public ProductionConfig(@Value("${app.jwt.secret}") String secret,
                            @Value("${app.cors.allowed-origins}") String origins) {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32 || secret.contains("LocalDevelopment")) {
            throw new IllegalArgumentException("Production requires a unique JWT secret of at least 32 bytes.");
        }
        for (String origin : origins.split(",", -1)) {
            URI uri = URI.create(origin.trim());
            if (!"https".equals(uri.getScheme()) || uri.getHost() == null || uri.getUserInfo() != null
                    || (uri.getPath() != null && !uri.getPath().isEmpty()) || uri.getQuery() != null || uri.getFragment() != null) {
                throw new IllegalArgumentException("Production CORS origins must be exact HTTPS origins without paths.");
            }
        }
    }
}
