package org.neurohearts.neuropathways.dto;

import org.neurohearts.neuropathways.entity.ReadingSkill;

public record PracticeResultsResponse(
        Long sessionId,
        ReadingSkill skill,
        Integer difficulty,
        Integer totalQuestions,
        Integer correctAnswers,
        Integer scorePercent
) {}