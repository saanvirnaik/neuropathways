package org.neurohearts.neuropathways.dto;

import org.neurohearts.neuropathways.entity.ReadingSkill;
import java.util.Map;

public record PracticeQuestionResponse(
        Long questionId,
        Integer questionNumber,
        Integer totalQuestions,
        ReadingSkill skill,
        Integer difficulty,
        String passage,
        String question,
        Map<String, String> options
) {}