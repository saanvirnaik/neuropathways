package org.neurohearts.neuropathways.dto;

import java.util.List;

public class AssessmentResultResponse {

    private final Long sessionId;

    private final Integer overallScore;

    private final Integer calculatedLevel;

    private final List<AssessmentSkillResultResponse> skills;


    public AssessmentResultResponse(Long sessionId, Integer overallScore, Integer calculatedLevel, List<AssessmentSkillResultResponse> skills) {

        this.sessionId = sessionId;

        this.overallScore = overallScore;

        this.calculatedLevel = calculatedLevel;

        this.skills = skills;
    }


    public Long getSessionId() {
        return sessionId;
    }

    public Integer getOverallScore() {
        return overallScore;
    }

    public Integer getCalculatedLevel() {
        return calculatedLevel;
    }

    public List<AssessmentSkillResultResponse> getSkills() {
        return skills;
    }
}