package org.neurohearts.neuropathways.repository;

import org.neurohearts.neuropathways.entity.PracticeSession;
import org.neurohearts.neuropathways.entity.PracticeSessionStatus;
import org.neurohearts.neuropathways.entity.PracticeSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PracticeSessionRepository
        extends JpaRepository<PracticeSession, Long> {

    Optional<PracticeSession>
    findFirstByUserIdAndStatusOrderByStartedAtDesc(
            Long userId,
            PracticeSessionStatus status
    );

    List<PracticeSession>
    findByUserIdOrderByStartedAtDesc(Long userId);

    List<PracticeSession>
    findByUserIdAndSkillAndStatusOrderByStartedAtDesc(
            Long userId,
            PracticeSkill skill,
            PracticeSessionStatus status
    );
}
