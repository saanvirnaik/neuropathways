package org.neurohearts.neuropathways.dto;

import org.neurohearts.neuropathways.entity.ReadingSkill;
import org.neurohearts.neuropathways.entity.PracticeSessionStatus;

public record PracticeSessionResponse(
        Long sessionId,
        ReadingSkill skill,
        Integer difficulty,
        PracticeSessionStatus status,
        Integer totalQuestions
) {}