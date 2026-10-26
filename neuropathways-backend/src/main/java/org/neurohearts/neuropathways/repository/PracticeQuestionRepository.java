package org.neurohearts.neuropathways.repository;

import org.neurohearts.neuropathways.entity.PracticeQuestion;
import org.neurohearts.neuropathways.entity.ReadingSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticeQuestionRepository
        extends JpaRepository<PracticeQuestion, Long> {

    List<PracticeQuestion> findBySkillAndDifficultyAndActiveTrue(
            ReadingSkill skill,
            Integer difficulty
    );
}