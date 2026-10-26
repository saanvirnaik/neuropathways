
package org.neurohearts.neuropathways.controller;

import org.neurohearts.neuropathways.dto.LearningPathResponse;
import org.neurohearts.neuropathways.service.LearningPathService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/learning-path")
public class LearningPathController {

    private final LearningPathService learningPathService;

    public LearningPathController(
            LearningPathService learningPathService
    ) {
        this.learningPathService = learningPathService;
    }

    @GetMapping
    public LearningPathResponse getLearningPath(
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = Long.valueOf(jwt.getSubject());

        return learningPathService.getLearningPath(userId);
    }
}
