package org.neurohearts.neuropathways.repository;

import org.neurohearts.neuropathways.entity.PracticeResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticeResponseRepository
        extends JpaRepository<PracticeResponse, Long> {

    boolean existsBySessionQuestionId(Long sessionQuestionId);

    List<PracticeResponse>
    findBySessionQuestionSessionId(Long sessionId);
}