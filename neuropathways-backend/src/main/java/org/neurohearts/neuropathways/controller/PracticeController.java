package org.neurohearts.neuropathways.controller;

import org.neurohearts.neuropathways.dto.*;
import org.neurohearts.neuropathways.service.PracticeService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/practice-sessions")
public class PracticeController {

    private final PracticeService practiceService;

    public PracticeController(PracticeService practiceService) {
        this.practiceService = practiceService;
    }

    private Long getUserId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PracticeSessionResponse startPractice(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody StartPracticeRequest request
    ) {
        return practiceService.startPractice(getUserId(jwt), request);
    }

    @GetMapping("/{sessionId}/current-question")
    public PracticeQuestionResponse getCurrentQuestion(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long sessionId
    ) {
        return practiceService.getCurrentQuestion(
                getUserId(jwt),
                sessionId
        );
    }

    @PostMapping("/{sessionId}/answers")
    public PracticeAnswerFeedback submitAnswer(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long sessionId,
            @RequestBody SubmitPracticeAnswerRequest request
    ) {
        return practiceService.submitAnswer(
                getUserId(jwt),
                sessionId,
                request
        );
    }

    @GetMapping("/{sessionId}/results")
    public PracticeResultsResponse getResults(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long sessionId
    ) {
        return practiceService.getResults(
                getUserId(jwt),
                sessionId
        );
    }
}