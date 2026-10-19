package org.neurohearts.neuropathways.service;

import org.neurohearts.neuropathways.dto.DashboardResponse;
import org.neurohearts.neuropathways.entity.AssessmentSession;
import org.neurohearts.neuropathways.entity.AssessmentStatus;
import org.neurohearts.neuropathways.entity.User;
import org.neurohearts.neuropathways.repository.AssessmentSessionRepository;
import org.neurohearts.neuropathways.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final AssessmentSessionRepository assessmentSessionRepository;

    public DashboardService(UserRepository userRepository, AssessmentSessionRepository assessmentSessionRepository) {
        this.userRepository = userRepository;
        this.assessmentSessionRepository = assessmentSessionRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found."));

        DashboardResponse response = new DashboardResponse();

        response.setUserId(user.getId());
        response.setFirstName(user.getFirstName());

        var latestSession = assessmentSessionRepository.findFirstByUserIdOrderByStartedAtDesc(userId);

        if (latestSession.isEmpty()) {

            response.setAssessmentStatus("NOT_STARTED");
            return response;

        }

        AssessmentSession session = latestSession.get();

        response.setAssessmentStatus(session.getStatus().name());
        /*
         * Useful for resuming an unfinished assessment.
         */
        response.setAssessmentSessionId(session.getId());

        response.setAssessmentCurrentQuestion(session.getCurrentQuestionNumber());

        response.setAssessmentTotalQuestions(session.getTotalQuestions());

        /*
         * If assessment is not completed,
         * don't populate learning-path fields yet.
         */
        if (session.getStatus() != AssessmentStatus.COMPLETED) {
            return response;
        }


        /*
         * Assessment completed.
         *
         * We can now populate result-related
         * dashboard information.
         */
        response.setCurrentLevel(session.getCalculatedLevel());

        response.setProgressPercent(session.getOverallScore());

        /*
         * Later:
         *
         * currentSkill should come from
         * PersonalizedLearningPathService
         * rather than being hard-coded.
         */

        return response;

    }
}