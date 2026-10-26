package org.neurohearts.neuropathways.dto;

import java.util.List;

public record LearningPathResponse(
        Long assessmentSessionId,
        int startingLevel,
        int overallScore,
        String recommendedFocus,
        List<LearningPathLevelResponse> levels
) {}