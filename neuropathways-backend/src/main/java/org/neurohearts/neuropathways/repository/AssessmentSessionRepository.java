package org.neurohearts.neuropathways.repository;

import org.neurohearts.neuropathways.entity.AssessmentSession;
import org.neurohearts.neuropathways.entity.AssessmentStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentSessionRepository extends JpaRepository<AssessmentSession, Long> {

    Optional<AssessmentSession> findFirstByUserIdAndStatusOrderByStartedAtDesc(Long userId, AssessmentStatus status);

    Optional<AssessmentSession> findFirstByUserIdOrderByStartedAtDesc(Long userId);

    List<AssessmentSession> findByUserIdOrderByStartedAtDesc(Long userId);

}