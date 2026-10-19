package org.neurohearts.neuropathways.dto;

import java.util.List;

public class DashboardResponse {

    private Long userId;
    private String firstName;
    private String assessmentStatus;

    private Integer currentLevel;
    private String currentSkill;
    private Integer progressPercent;

    private Integer streakDays;
    private Integer activitiesThisWeek;
    private Integer minutesThisWeek;
    private Integer skillsImproved;

    private Long assessmentSessionId;

    private Integer assessmentCurrentQuestion;

    private Integer assessmentTotalQuestions;
    private NextActivityResponse nextActivity;

    private List<SkillProgressResponse> skills;

    public DashboardResponse() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getAssessmentStatus() {
        return assessmentStatus;
    }

    public void setAssessmentStatus(String assessmentStatus) {
        this.assessmentStatus = assessmentStatus;
    }

    public Integer getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(Integer currentLevel) {
        this.currentLevel = currentLevel;
    }

    public String getCurrentSkill() {
        return currentSkill;
    }

    public void setCurrentSkill(String currentSkill) {
        this.currentSkill = currentSkill;
    }

    public Integer getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(Integer progressPercent) {
        this.progressPercent = progressPercent;
    }

    public Integer getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(Integer streakDays) {
        this.streakDays = streakDays;
    }

    public Integer getActivitiesThisWeek() {
        return activitiesThisWeek;
    }

    public void setActivitiesThisWeek(Integer activitiesThisWeek) {
        this.activitiesThisWeek = activitiesThisWeek;
    }

    public Integer getMinutesThisWeek() {
        return minutesThisWeek;
    }

    public void setMinutesThisWeek(Integer minutesThisWeek) {
        this.minutesThisWeek = minutesThisWeek;
    }

    public Integer getSkillsImproved() {
        return skillsImproved;
    }

    public void setSkillsImproved(Integer skillsImproved) {
        this.skillsImproved = skillsImproved;
    }

    public NextActivityResponse getNextActivity() {
        return nextActivity;
    }

    public void setNextActivity(NextActivityResponse nextActivity) {
        this.nextActivity = nextActivity;
    }

    public List<SkillProgressResponse> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillProgressResponse> skills) {
        this.skills = skills;
    }

    public Long getAssessmentSessionId() {
        return assessmentSessionId;
    }

    public void setAssessmentSessionId(Long assessmentSessionId) {
        this.assessmentSessionId = assessmentSessionId;
    }

    public Integer getAssessmentCurrentQuestion() {
        return assessmentCurrentQuestion;
    }

    public void setAssessmentCurrentQuestion(Integer assessmentCurrentQuestion) {
        this.assessmentCurrentQuestion = assessmentCurrentQuestion;
    }

    public Integer getAssessmentTotalQuestions() {
        return assessmentTotalQuestions;
    }

    public void setAssessmentTotalQuestions(Integer assessmentTotalQuestions) {
        this.assessmentTotalQuestions = assessmentTotalQuestions;
    }
}