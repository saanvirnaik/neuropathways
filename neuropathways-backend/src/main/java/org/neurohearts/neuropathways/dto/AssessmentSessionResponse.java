package org.neurohearts.neuropathways.dto;

public class AssessmentSessionResponse {

    private final Long sessionId;
    private final String status;
    private final Integer currentQuestionNumber;
    private final Integer totalQuestions;

    public AssessmentSessionResponse(Long sessionId, String status, Integer currentQuestionNumber, Integer totalQuestions) {
        this.sessionId = sessionId;
        this.status = status;
        this.currentQuestionNumber = currentQuestionNumber;
        this.totalQuestions = totalQuestions;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public String getStatus() {
        return status;
    }

    public Integer getCurrentQuestionNumber() {
        return currentQuestionNumber;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }
}