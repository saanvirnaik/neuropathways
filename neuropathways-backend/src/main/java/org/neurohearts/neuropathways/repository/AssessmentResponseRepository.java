package org.neurohearts.neuropathways.repository;

import org.neurohearts.neuropathways.entity.AssessmentResponse;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentResponseRepository
        extends JpaRepository<
        AssessmentResponse,
        Long
        > {

    List<AssessmentResponse>
    findBySessionIdOrderBySubmittedAtAsc(
            Long sessionId
    );

    long countBySessionIdAndQuestionId(
            Long sessionId,
            Long questionId
    );
}