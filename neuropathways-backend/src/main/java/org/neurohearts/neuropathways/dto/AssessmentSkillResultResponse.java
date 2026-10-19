package org.neurohearts.neuropathways.dto;

public class AssessmentSkillResultResponse {

    private final String skill;

    private final Integer totalQuestions;

    private final Integer correctAnswers;

    private final Integer scorePercent;

    private final String status;

    public AssessmentSkillResultResponse(String skill, Integer totalQuestions, Integer correctAnswers, Integer scorePercent, String status) {

        this.skill = skill;
        this.totalQuestions = totalQuestions;

        this.correctAnswers = correctAnswers;

        this.scorePercent = scorePercent;

        this.status = status;
    }

    public String getSkill() {
        return skill;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public Integer getScorePercent() {
        return scorePercent;
    }

    public String getStatus() {
        return status;
    }
}