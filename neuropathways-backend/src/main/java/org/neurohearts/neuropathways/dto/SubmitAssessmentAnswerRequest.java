package org.neurohearts.neuropathways.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SubmitAssessmentAnswerRequest {

    @NotNull
    private Long questionId;

    @NotBlank
    private String selectedOption;

    private Long responseTimeMs;

    private Boolean usedReadAloud;

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(
            Long questionId
    ) {
        this.questionId = questionId;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(
            String selectedOption
    ) {
        this.selectedOption =
                selectedOption;
    }

    public Long getResponseTimeMs() {
        return responseTimeMs;
    }

    public void setResponseTimeMs(
            Long responseTimeMs
    ) {
        this.responseTimeMs =
                responseTimeMs;
    }

    public Boolean getUsedReadAloud() {
        return usedReadAloud;
    }

    public void setUsedReadAloud(
            Boolean usedReadAloud
    ) {
        this.usedReadAloud =
                usedReadAloud;
    }
}