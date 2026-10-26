package org.neurohearts.neuropathways.repository;

import org.neurohearts.neuropathways.entity.PracticeSessionQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PracticeSessionQuestionRepository
        extends JpaRepository<PracticeSessionQuestion, Long> {

    List<PracticeSessionQuestion>
    findBySessionIdOrderByQuestionNumberAsc(Long sessionId);

    Optional<PracticeSessionQuestion>
    findBySessionIdAndQuestionNumber(
            Long sessionId,
            Integer questionNumber
    );
}