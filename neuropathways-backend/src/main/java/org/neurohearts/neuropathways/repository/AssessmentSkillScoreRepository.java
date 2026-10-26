package org.neurohearts.neuropathways.repository;

import org.neurohearts.neuropathways.entity.AssessmentSkillScore;

import org.neurohearts.neuropathways.entity.ReadingSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentSkillScoreRepository extends JpaRepository<AssessmentSkillScore, Long> {

    List<AssessmentSkillScore> findBySessionIdOrderBySkillAsc(Long sessionId);

    void deleteBySessionId(Long sessionId);

    Optional<AssessmentSkillScore> findBySessionIdAndSkill(
            Long sessionId,
            ReadingSkill skill
    );
}