package org.neurohearts.neuropathways.dto;

public record SubmitPracticeAnswerRequest(
        Long questionId,
        String selectedOption,
        Long responseTimeMs,
        Boolean usedReadAloud
) {}