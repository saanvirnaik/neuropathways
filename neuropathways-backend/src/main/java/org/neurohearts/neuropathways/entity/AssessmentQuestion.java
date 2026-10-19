package org.neurohearts.neuropathways.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "assessment_questions")
public class AssessmentQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ReadingSkill skill;

    @Column(nullable = false)
    private Integer difficultyLevel;

    @Column(nullable = false, length = 2000)
    private String questionText;

    @Column(length = 4000)
    private String passage;

    @Column(nullable = false, length = 1000)
    private String optionA;

    @Column(nullable = false, length = 1000)
    private String optionB;

    @Column(nullable = false, length = 1000)
    private String optionC;

    @Column(nullable = false, length = 1000)
    private String optionD;

    @Column(nullable = false, length = 1)
    private String correctOption;

    @Column(nullable = false)
    private boolean active = true;

    public AssessmentQuestion() {
    }

    public Long getId() {
        return id;
    }

    public ReadingSkill getSkill() {
        return skill;
    }

    public void setSkill(ReadingSkill skill) {
        this.skill = skill;
    }

    public Integer getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(Integer difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getPassage() {
        return passage;
    }

    public void setPassage(String passage) {
        this.passage = passage;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public String getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(String correctOption) {
        this.correctOption = correctOption;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}