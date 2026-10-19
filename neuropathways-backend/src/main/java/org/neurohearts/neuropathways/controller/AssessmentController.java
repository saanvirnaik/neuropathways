package org.neurohearts.neuropathways.controller;

import jakarta.validation.Valid;
import org.neurohearts.neuropathways.dto.*;
import org.neurohearts.neuropathways.service.AssessmentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assessment-sessions")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping("/status")
    public AssessmentStatusResponse getStatus(@AuthenticationPrincipal Jwt jwt) {

        return assessmentService.getStatus(getUserId(jwt));
    }


    @PostMapping
    public AssessmentSessionResponse startAssessment(@AuthenticationPrincipal Jwt jwt) {

        return assessmentService.startAssessment(getUserId(jwt));
    }


    @GetMapping("/{sessionId}/current-question")
    public AssessmentQuestionResponse getCurrentQuestion(@AuthenticationPrincipal Jwt jwt, @PathVariable Long sessionId) {

        return assessmentService.getCurrentQuestion(getUserId(jwt), sessionId);
    }


    @PostMapping("/{sessionId}/answers")
    public AssessmentStatusResponse submitAnswer(@AuthenticationPrincipal Jwt jwt, @PathVariable Long sessionId, @Valid @RequestBody SubmitAssessmentAnswerRequest request) {
        return assessmentService.submitAnswer(getUserId(jwt), sessionId, request);
    }

    @GetMapping("/{sessionId}/results")
    public AssessmentResultResponse getResults(@AuthenticationPrincipal Jwt jwt, @PathVariable Long sessionId) {
        return assessmentService.getResults(getUserId(jwt), sessionId);
    }


    private Long getUserId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }
}