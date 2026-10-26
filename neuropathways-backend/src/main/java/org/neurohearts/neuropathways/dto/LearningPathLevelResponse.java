package org.neurohearts.neuropathways.dto;

public record LearningPathLevelResponse(
        int level,
        String title,
        String description,
        String skill,
        Integer assessmentScore,
        String assessmentStatus,
        String pathwayStatus
) {}