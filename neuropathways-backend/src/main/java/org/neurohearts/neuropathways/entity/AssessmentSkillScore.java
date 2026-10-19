package org.neurohearts.neuropathways.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "assessment_skill_scores", uniqueConstraints = {@UniqueConstraint(name = "uk_session_skill", columnNames = {"session_id", "skill"})})
public class AssessmentSkillScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private AssessmentSession session;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ReadingSkill skill;

    @Column(nullable = false)
    private Integer totalQuestions;

    @Column(nullable = false)
    private Integer correctAnswers;

    @Column(nullable = false)
    private Integer scorePercent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SkillPerformanceStatus status;

    public AssessmentSkillScore() {
    }

    public Long getId() {
        return id;
    }

    public AssessmentSession getSession() {
        return session;
    }

    public void setSession(AssessmentSession session) {
        this.session = session;
    }

    public ReadingSkill getSkill() {
        return skill;
    }

    public void setSkill(ReadingSkill skill) {
        this.skill = skill;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getScorePercent() {
        return scorePercent;
    }

    public void setScorePercent(Integer scorePercent) {
        this.scorePercent = scorePercent;
    }

    public SkillPerformanceStatus getStatus() {
        return status;
    }

    public void setStatus(SkillPerformanceStatus status) {
        this.status = status;
    }
}