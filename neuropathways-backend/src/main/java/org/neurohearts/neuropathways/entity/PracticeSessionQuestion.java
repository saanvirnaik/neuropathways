package org.neurohearts.neuropathways.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "practice_session_questions",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_practice_session_position",
                        columnNames = {"session_id", "question_number"}
                ),
                @UniqueConstraint(
                        name = "uk_practice_session_question",
                        columnNames = {"session_id", "question_id"}
                )
        }
)
public class PracticeSessionQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private PracticeSession session;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private PracticeQuestion question;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    public PracticeSessionQuestion() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PracticeSession getSession() {
        return session;
    }

    public void setSession(PracticeSession session) {
        this.session = session;
    }

    public PracticeQuestion getQuestion() {
        return question;
    }

    public void setQuestion(PracticeQuestion question) {
        this.question = question;
    }

    public Integer getQuestionNumber() {
        return questionNumber;
    }

    public void setQuestionNumber(Integer questionNumber) {
        this.questionNumber = questionNumber;
    }
}
