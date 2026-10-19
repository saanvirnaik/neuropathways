package org.neurohearts.neuropathways.dto;

import java.util.Map;

public class AssessmentQuestionResponse {

    private Long questionId;

    private String skill;

    private Integer questionNumber;

    private Integer totalQuestions;

    private String passage;

    private String question;

    private Map<String, String> options;

    public AssessmentQuestionResponse(
            Long questionId,
            String skill,
            Integer questionNumber,
            Integer totalQuestions,
            String passage,
            String question,
            Map<String, String> options
    ) {
        this.questionId = questionId;
        this.skill = skill;
        this.questionNumber =
                questionNumber;
        this.totalQuestions =
                totalQuestions;
        this.passage = passage;
        this.question = question;
        this.options = options;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public String getSkill() {
        return skill;
    }

    public Integer getQuestionNumber() {
        return questionNumber;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public String getPassage() {
        return passage;
    }

    public String getQuestion() {
        return question;
    }

    public Map<String, String> getOptions() {
        return options;
    }
}