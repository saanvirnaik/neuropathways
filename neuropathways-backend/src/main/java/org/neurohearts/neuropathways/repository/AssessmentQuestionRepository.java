package org.neurohearts.neuropathways.repository;

import org.neurohearts.neuropathways.entity.AssessmentQuestion;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, Long> {

    List<AssessmentQuestion> findByActiveTrueOrderByIdAsc();
}