package org.neurohearts.neuropathways.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class VersionController {
    @Value("${app.release}")
    private String release;

    @GetMapping("/api/version")
    public Map<String, String> version() { return Map.of("commit", release); }
}
