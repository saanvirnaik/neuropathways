package org.neurohearts.neuropathways.service;

import org.neurohearts.neuropathways.dto.LearnerPreferenceResponse;
import org.neurohearts.neuropathways.entity.LearnerPreference;
import org.neurohearts.neuropathways.entity.User;
import org.neurohearts.neuropathways.repository.LearnerPreferenceRepository;
import org.neurohearts.neuropathways.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PreferenceService {

    private final LearnerPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    public PreferenceService(
            LearnerPreferenceRepository preferenceRepository,
            UserRepository userRepository
    ) {
        this.preferenceRepository = preferenceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public LearnerPreferenceResponse getPreferences(Long userId) {

        LearnerPreference preference =
                preferenceRepository
                        .findByUserId(userId)
                        .orElseGet(() ->
                                createDefaultPreferences(userId)
                        );

        return toResponse(preference);
    }

    @Transactional
    public LearnerPreferenceResponse updatePreferences(
            Long userId,
            LearnerPreferenceResponse request
    ) {

        LearnerPreference preference =
                preferenceRepository
                        .findByUserId(userId)
                        .orElseGet(() ->
                                createDefaultPreferences(userId)
                        );

        if (request.getFontSize() != null) {
            int size = Math.max(
                    14,
                    Math.min(30, request.getFontSize())
            );

            preference.setFontSize(size);
        }

        if (request.getFontFamily() != null) {
            preference.setFontFamily(
                    request.getFontFamily()
            );
        }

        if (request.getBackgroundTheme() != null) {
            preference.setBackgroundTheme(
                    request.getBackgroundTheme()
            );
        }

        if (request.getTextToSpeech() != null) {
            preference.setTextToSpeech(
                    request.getTextToSpeech()
            );
        }

        if (request.getFocusMode() != null) {
            preference.setFocusMode(
                    request.getFocusMode()
            );
        }

        if (request.getReadingGuide() != null) {
            preference.setReadingGuide(
                    request.getReadingGuide()
            );
        }

        if (request.getIncreasedSpacing() != null) {
            preference.setIncreasedSpacing(
                    request.getIncreasedSpacing()
            );
        }

        if (request.getFlexiblePace() != null) {
            preference.setFlexiblePace(
                    request.getFlexiblePace()
            );
        }

        return toResponse(
                preferenceRepository.save(preference)
        );
    }

    private LearnerPreference createDefaultPreferences(
            Long userId
    ) {

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found."
                                )
                        );

        LearnerPreference preference =
                new LearnerPreference();

        preference.setUser(user);

        return preferenceRepository.save(
                preference
        );
    }

    private LearnerPreferenceResponse toResponse(
            LearnerPreference preference
    ) {

        LearnerPreferenceResponse response =
                new LearnerPreferenceResponse();

        response.setFontSize(
                preference.getFontSize()
        );

        response.setFontFamily(
                preference.getFontFamily()
        );

        response.setBackgroundTheme(
                preference.getBackgroundTheme()
        );

        response.setTextToSpeech(
                preference.getTextToSpeech()
        );

        response.setFocusMode(
                preference.getFocusMode()
        );

        response.setReadingGuide(
                preference.getReadingGuide()
        );

        response.setIncreasedSpacing(
                preference.getIncreasedSpacing()
        );

        response.setFlexiblePace(
                preference.getFlexiblePace()
        );

        return response;
    }
}