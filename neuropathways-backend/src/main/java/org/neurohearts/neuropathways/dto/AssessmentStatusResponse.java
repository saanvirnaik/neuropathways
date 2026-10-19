package org.neurohearts.neuropathways.dto;

public class AssessmentStatusResponse {

    private String status;

    private Long sessionId;

    private Integer currentQuestionNumber;

    private Integer totalQuestions;

    public AssessmentStatusResponse(
            String status,
            Long sessionId,
            Integer currentQuestionNumber,
            Integer totalQuestions
    ) {
        this.status = status;
        this.sessionId = sessionId;
        this.currentQuestionNumber =
                currentQuestionNumber;
        this.totalQuestions =
                totalQuestions;
    }

    public String getStatus() {
        return status;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public Integer getCurrentQuestionNumber() {
        return currentQuestionNumber;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }
}