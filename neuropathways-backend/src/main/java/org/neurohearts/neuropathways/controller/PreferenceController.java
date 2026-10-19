package org.neurohearts.neuropathways.controller;

import org.neurohearts.neuropathways.dto.LearnerPreferenceResponse;
import org.neurohearts.neuropathways.service.PreferenceService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
public class PreferenceController {

    private final PreferenceService preferenceService;

    public PreferenceController(PreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @GetMapping("/me")
    public LearnerPreferenceResponse getPreferences(@AuthenticationPrincipal Jwt jwt) {

        return preferenceService.getPreferences(Long.valueOf(jwt.getSubject()));
    }

    @PutMapping("/me")
    public LearnerPreferenceResponse updatePreferences(@AuthenticationPrincipal Jwt jwt, @RequestBody LearnerPreferenceResponse request) {

        return preferenceService.updatePreferences(Long.valueOf(jwt.getSubject()), request);
    }
}