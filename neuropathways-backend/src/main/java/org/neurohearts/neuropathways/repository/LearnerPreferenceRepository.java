package org.neurohearts.neuropathways.repository;

import org.neurohearts.neuropathways.entity.LearnerPreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LearnerPreferenceRepository
        extends JpaRepository<LearnerPreference, Long> {

    Optional<LearnerPreference> findByUserId(Long userId);
}