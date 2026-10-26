package org.neurohearts.neuropathways.service;

import org.neurohearts.neuropathways.entity.AssessmentSession;
import org.neurohearts.neuropathways.entity.AssessmentStatus;
import org.neurohearts.neuropathways.entity.ReadingSkill;
import org.neurohearts.neuropathways.repository.AssessmentSessionRepository;
import org.neurohearts.neuropathways.repository.AssessmentSkillScoreRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;

@Service
public class PracticeDifficultyService {
    private final AssessmentSessionRepository assessmentSessionRepository;
    private final AssessmentSkillScoreRepository assessmentSkillScoreRepository;

    public PracticeDifficultyService(
            AssessmentSessionRepository assessmentSessionRepository,
            AssessmentSkillScoreRepository assessmentSkillScoreRepository
    ) {
        this.assessmentSessionRepository = assessmentSessionRepository;
        this.assessmentSkillScoreRepository = assessmentSkillScoreRepository;
    }

    public int determineStartingDifficulty(
            Long userId,
            ReadingSkill skill
    ) {
        // Find the student's most recent completed assessment.
        AssessmentSession assessment =
                assessmentSessionRepository
                        .findByUserIdOrderByStartedAtDesc(userId)
                        .stream()
                        .filter(session ->
                                session.getStatus() == AssessmentStatus.COMPLETED
                        )
                        .max(Comparator.comparing(
                                AssessmentSession::getStartedAt
                        ))
                        .orElse(null);

        if (assessment == null) {
            return 1;
        }

        return assessmentSkillScoreRepository
                .findBySessionIdAndSkill(assessment.getId(), skill)
                .map(score -> {
                    int percentage = score.getScorePercent();

                    if (percentage < 50) {
                        return 1;
                    }

                    if (percentage < 80) {
                        return 2;
                    }

                    return 3;
                })
                .orElse(1);
    }
}
