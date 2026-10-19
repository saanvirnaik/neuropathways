package org.neurohearts.neuropathways.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_responses", indexes = {@Index(name = "idx_response_session", columnList = "session_id"), @Index(name = "idx_response_question", columnList = "question_id")})
public class AssessmentResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private AssessmentSession session;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private AssessmentQuestion question;

    @Column(nullable = false, length = 1)
    private String selectedOption;

    @Column(nullable = false)
    private boolean correct;

    @Column(nullable = false)
    private Integer attemptNumber;

    private Long responseTimeMs;

    private Boolean usedReadAloud;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    public AssessmentResponse() {
    }

    @PrePersist
    public void onCreate() {
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
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

    public AssessmentQuestion getQuestion() {
        return question;
    }

    public void setQuestion(AssessmentQuestion question) {
        this.question = question;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public Integer getAttemptNumber() {
        return attemptNumber;
    }

    public void setAttemptNumber(Integer attemptNumber) {
        this.attemptNumber = attemptNumber;
    }

    public Long getResponseTimeMs() {
        return responseTimeMs;
    }

    public void setResponseTimeMs(Long responseTimeMs) {
        this.responseTimeMs = responseTimeMs;
    }

    public Boolean getUsedReadAloud() {
        return usedReadAloud;
    }

    public void setUsedReadAloud(Boolean usedReadAloud) {
        this.usedReadAloud = usedReadAloud;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
}