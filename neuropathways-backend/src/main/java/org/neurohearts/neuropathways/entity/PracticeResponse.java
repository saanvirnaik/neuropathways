package org.neurohearts.neuropathways.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "practice_responses",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_practice_response_assignment",
                        columnNames = {"session_question_id"}
                )
        }
)
public class PracticeResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "session_question_id", nullable = false)
    private PracticeSessionQuestion sessionQuestion;

    @Column(nullable = false, length = 1)
    private String selectedOption;

    @Column(nullable = false)
    private Boolean correct;

    @Column(nullable = false)
    private Long responseTimeMs;

    @Column(nullable = false)
    private Boolean usedReadAloud = false;

    @Column(nullable = false)
    private LocalDateTime answeredAt;

    public PracticeResponse() {}

    @PrePersist
    public void onCreate() {
        if (answeredAt == null) {
            answeredAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PracticeSessionQuestion getSessionQuestion() {
        return sessionQuestion;
    }

    public void setSessionQuestion(PracticeSessionQuestion sessionQuestion) {
        this.sessionQuestion = sessionQuestion;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }

    public Boolean getCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
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

    public LocalDateTime getAnsweredAt() {
        return answeredAt;
    }

    public void setAnsweredAt(LocalDateTime answeredAt) {
        this.answeredAt = answeredAt;
    }
}
