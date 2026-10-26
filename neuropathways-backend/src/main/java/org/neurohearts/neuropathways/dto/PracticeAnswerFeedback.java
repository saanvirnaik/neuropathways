package org.neurohearts.neuropathways.dto;

public record PracticeAnswerFeedback(
        boolean correct,
        String correctOption,
        String explanation,
        boolean completed,
        Integer nextQuestionNumber
) {}