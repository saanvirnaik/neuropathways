package org.neurohearts.neuropathways.service;


import org.neurohearts.neuropathways.dto.LearningPathLevelResponse;
import org.neurohearts.neuropathways.dto.LearningPathResponse;
import org.neurohearts.neuropathways.entity.AssessmentSession;
import org.neurohearts.neuropathways.entity.AssessmentSkillScore;
import org.neurohearts.neuropathways.entity.AssessmentStatus;
import org.neurohearts.neuropathways.repository.AssessmentSessionRepository;
import org.neurohearts.neuropathways.repository.AssessmentSkillScoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class LearningPathService {
    private final AssessmentSessionRepository sessionRepository;
    private final AssessmentSkillScoreRepository skillScoreRepository;

    public LearningPathService(
            AssessmentSessionRepository sessionRepository,
            AssessmentSkillScoreRepository skillScoreRepository
    ) {
        this.sessionRepository = sessionRepository;
        this.skillScoreRepository = skillScoreRepository;
    }

    @Transactional(readOnly = true)
    public LearningPathResponse getLearningPath(Long userId) {

        AssessmentSession session = sessionRepository
                .findFirstByUserIdAndStatusOrderByStartedAtDesc(
                        userId,
                        AssessmentStatus.COMPLETED
                )
                .orElseThrow(() -> new IllegalStateException(
                        "Complete an assessment to create your learning pathway."
                ));

        List<AssessmentSkillScore> scores =
                skillScoreRepository.findBySessionIdOrderBySkillAsc(
                        session.getId()
                );

        Map<String, AssessmentSkillScore> scoreMap =
                scores.stream().collect(Collectors.toMap(
                        score -> score.getSkill().name(),
                        Function.identity()
                ));

        // The current assessment level is provisional.
        int startingLevel = Math.max(
                1,
                Math.min(6, session.getCalculatedLevel())
        );

        List<LevelDefinition> definitions = List.of(
                new LevelDefinition(
                        1,
                        "Sound & Letter Patterns",
                        "Recognize sounds, letters, and common word patterns.",
                        "DECODING"
                ),
                new LevelDefinition(
                        2,
                        "Word Decoding",
                        "Break unfamiliar words into smaller parts.",
                        "DECODING"
                ),
                new LevelDefinition(
                        3,
                        "Vocabulary in Context",
                        "Use context clues to understand unfamiliar words.",
                        "VOCABULARY"
                ),
                new LevelDefinition(
                        4,
                        "Reading Fluency",
                        "Build smoother reading with pacing and accuracy.",
                        "FLUENCY"
                ),
                new LevelDefinition(
                        5,
                        "Reading Comprehension",
                        "Understand main ideas, details, and meaning.",
                        "COMPREHENSION"
                ),
                new LevelDefinition(
                        6,
                        "Inference & Deeper Meaning",
                        "Use evidence to understand ideas not directly stated.",
                        "INFERENCE"
                )
        );

        List<LearningPathLevelResponse> levels = new ArrayList<>();

        for (LevelDefinition definition : definitions) {

            AssessmentSkillScore score =
                    scoreMap.get(definition.skill());

            Integer assessmentScore =
                    score != null ? score.getScorePercent() : null;

            String assessmentStatus =
                    score != null
                            ? score.getStatus().name()
                            : "NOT_ASSESSED";

            String pathwayStatus;

            if (score != null &&
                    ("NEEDS_PRACTICE".equals(assessmentStatus) ||
                            "DEVELOPING".equals(assessmentStatus))) {

                pathwayStatus = "FOCUS";

            } else if (score != null &&
                    ("STRONG".equals(assessmentStatus) ||
                            "PROFICIENT".equals(assessmentStatus))) {

                pathwayStatus = "STRONG";

            } else if (definition.level() > startingLevel) {

                pathwayStatus = "UPCOMING";

            } else {

                pathwayStatus = "AVAILABLE";
            }

            levels.add(new LearningPathLevelResponse(
                    definition.level(),
                    definition.title(),
                    definition.description(),
                    definition.skill(),
                    assessmentScore,
                    assessmentStatus,
                    pathwayStatus
            ));
        }

        // Prioritize the lowest-scoring assessed skill.
        String recommendedFocus = scores.stream()
                .filter(score -> score.getTotalQuestions() > 0)
                .min(Comparator.comparingInt(
                        AssessmentSkillScore::getScorePercent
                ))
                .map(score -> score.getSkill().name())
                .orElse(null);

        return new LearningPathResponse(
                session.getId(),
                startingLevel,
                session.getOverallScore(),
                recommendedFocus,
                levels
        );
    }

    private record LevelDefinition(
            int level,
            String title,
            String description,
            String skill
    ) {
    }
}
