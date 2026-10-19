package org.neurohearts.neuropathways.repository;

import org.neurohearts.neuropathways.entity.AssessmentSkillScore;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentSkillScoreRepository extends JpaRepository<AssessmentSkillScore, Long> {

    List<AssessmentSkillScore> findBySessionIdOrderBySkillAsc(Long sessionId);

    void deleteBySessionId(Long sessionId);
}