package org.neurohearts.neuropathways;

import org.junit.jupiter.api.Test;
import org.neurohearts.neuropathways.config.ProductionConfig;
import static org.junit.jupiter.api.Assertions.*;

class ProductionConfigTests {
    private final String secret = "TestOnlyRandomSecret012345678901234567890123456789";
    @Test void rejectsDevelopmentSecretAndWildcardOrigins() {
        assertThrows(IllegalArgumentException.class, () -> new ProductionConfig("NeuroPathwaysLocalDevelopmentSecretKey2026", "https://example.com"));
        assertThrows(IllegalArgumentException.class, () -> new ProductionConfig("short", "https://example.com"));
        assertThrows(IllegalArgumentException.class, () -> new ProductionConfig(secret, "*"));
        assertThrows(IllegalArgumentException.class, () -> new ProductionConfig(secret, "http://localhost:5173"));
        assertThrows(IllegalArgumentException.class, () -> new ProductionConfig(secret, "https://example.com/path"));
        assertDoesNotThrow(() -> new ProductionConfig(secret, "https://staging.example.com,https://example.com"));
    }
}
