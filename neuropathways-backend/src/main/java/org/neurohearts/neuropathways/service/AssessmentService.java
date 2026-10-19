package org.neurohearts.neuropathways.service;

import org.neurohearts.neuropathways.dto.*;
import org.neurohearts.neuropathways.entity.*;
import org.neurohearts.neuropathways.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private final AssessmentSessionRepository sessionRepository;

    private final AssessmentQuestionRepository questionRepository;

    private final AssessmentResponseRepository responseRepository;

    private final UserRepository userRepository;
    private final AssessmentSkillScoreRepository skillScoreRepository;

    public AssessmentService(AssessmentSessionRepository sessionRepository, AssessmentQuestionRepository questionRepository, AssessmentResponseRepository responseRepository, AssessmentSkillScoreRepository skillScoreRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;

        this.questionRepository = questionRepository;

        this.responseRepository = responseRepository;
        this.skillScoreRepository = skillScoreRepository;

        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public AssessmentResultResponse getResults(Long userId, Long sessionId) {

        AssessmentSession session = getOwnedSession(userId, sessionId);

        if (session.getStatus() != AssessmentStatus.COMPLETED) {
            throw new IllegalStateException("Assessment has not been completed.");
        }


        List<AssessmentSkillScore> skillScores = skillScoreRepository.findBySessionIdOrderBySkillAsc(sessionId);


        List<AssessmentSkillResultResponse> skillResults = skillScores.stream().map(score -> new AssessmentSkillResultResponse(score.getSkill().name(),

                score.getTotalQuestions(),

                score.getCorrectAnswers(),

                score.getScorePercent(),

                score.getStatus().name())).toList();


        return new AssessmentResultResponse(session.getId(), session.getOverallScore(), session.getCalculatedLevel(), skillResults);
    }

    @Transactional(readOnly = true)
    public AssessmentStatusResponse getStatus(Long userId) {

        var latestSession = sessionRepository.findFirstByUserIdOrderByStartedAtDesc(userId);

        if (latestSession.isEmpty()) {
            return new AssessmentStatusResponse("NOT_STARTED", null, 0, 0);
        }

        AssessmentSession session = latestSession.get();

        return new AssessmentStatusResponse(session.getStatus().name(), session.getId(), session.getCurrentQuestionNumber(), session.getTotalQuestions());
    }

    @Transactional
    public AssessmentSessionResponse startAssessment(Long userId) {

        /*
         * If the learner already has an assessment
         * in progress, resume that one.
         */
        var existingSession = sessionRepository.findFirstByUserIdAndStatusOrderByStartedAtDesc(userId, AssessmentStatus.IN_PROGRESS);

        if (existingSession.isPresent()) {

            AssessmentSession session = existingSession.get();

            return toSessionResponse(session);
        }


        /*
         * No active assessment exists.
         * Create a brand-new assessment session.
         *
         * Previous COMPLETED sessions remain untouched
         * so we preserve assessment history.
         */
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found."));


        List<AssessmentQuestion> questions = questionRepository.findByActiveTrueOrderByIdAsc();


        if (questions.isEmpty()) {
            throw new IllegalStateException("No assessment questions configured.");
        }


        AssessmentSession session = new AssessmentSession();

        session.setUser(user);

        session.setStatus(AssessmentStatus.IN_PROGRESS);

        session.setCurrentQuestionNumber(1);

        session.setTotalQuestions(questions.size());


        AssessmentSession savedSession = sessionRepository.save(session);


        return toSessionResponse(savedSession);
    }

    @Transactional(readOnly = true)
    public AssessmentQuestionResponse getCurrentQuestion(Long userId, Long sessionId) {

        AssessmentSession session = getOwnedSession(userId, sessionId);

        if (session.getStatus() != AssessmentStatus.IN_PROGRESS) {
            throw new IllegalStateException("Assessment is not in progress.");
        }

        List<AssessmentQuestion> questions = questionRepository.findByActiveTrueOrderByIdAsc();

        int index = session.getCurrentQuestionNumber() - 1;

        if (index < 0 || index >= questions.size()) {
            throw new IllegalStateException("No current question available.");
        }

        AssessmentQuestion question = questions.get(index);

        Map<String, String> options = new LinkedHashMap<>();

        options.put("A", question.getOptionA());

        options.put("B", question.getOptionB());

        options.put("C", question.getOptionC());

        options.put("D", question.getOptionD());

        return new AssessmentQuestionResponse(question.getId(), question.getSkill().name(), session.getCurrentQuestionNumber(), session.getTotalQuestions(), question.getPassage(), question.getQuestionText(), options);
    }

    @Transactional
    public AssessmentStatusResponse submitAnswer(Long userId, Long sessionId, SubmitAssessmentAnswerRequest request) {

        AssessmentSession session = getOwnedSession(userId, sessionId);

        if (session.getStatus() != AssessmentStatus.IN_PROGRESS) {
            throw new IllegalStateException("Assessment is not active. Current status: " + session.getStatus());
        }


        List<AssessmentQuestion> questions = questionRepository.findByActiveTrueOrderByIdAsc();


        int currentIndex = session.getCurrentQuestionNumber() - 1;


        if (currentIndex < 0 || currentIndex >= questions.size()) {
            throw new IllegalStateException("Current assessment question is invalid.");
        }


        AssessmentQuestion expectedQuestion = questions.get(currentIndex);


        if (!expectedQuestion.getId().equals(request.getQuestionId())) {

            throw new IllegalArgumentException("Submitted question does not match " + "the current assessment question.");
        }


        String selected = request.getSelectedOption().trim().toUpperCase();


        if (!selected.equals("A") && !selected.equals("B") && !selected.equals("C") && !selected.equals("D")) {
            throw new IllegalArgumentException("Invalid answer option.");
        }


        int attemptNumber = (int) responseRepository.countBySessionIdAndQuestionId(sessionId, expectedQuestion.getId()) + 1;


        boolean correct = expectedQuestion.getCorrectOption().equalsIgnoreCase(selected);


        AssessmentResponse response = new AssessmentResponse();

        response.setSession(session);

        response.setQuestion(expectedQuestion);

        response.setSelectedOption(selected);

        response.setCorrect(correct);

        response.setAttemptNumber(attemptNumber);

        response.setResponseTimeMs(request.getResponseTimeMs());

        response.setUsedReadAloud(request.getUsedReadAloud());


        responseRepository.save(response);


        int nextQuestionNumber = session.getCurrentQuestionNumber() + 1;


        if (nextQuestionNumber > session.getTotalQuestions()) {

            completeSession(session);

        } else {

            session.setCurrentQuestionNumber(nextQuestionNumber);

            sessionRepository.save(session);
        }


        return new AssessmentStatusResponse(session.getStatus().name(), session.getId(), session.getCurrentQuestionNumber(), session.getTotalQuestions());
    }


    private void completeSession(AssessmentSession session) {

        List<AssessmentResponse> allResponses = responseRepository.findBySessionIdOrderBySubmittedAtAsc(session.getId());

        /*
         * We preserve every response in the database,
         * but scoring uses only the latest response
         * submitted for each question.
         */
        Map<Long, AssessmentResponse> latestResponsesByQuestion = new LinkedHashMap<>();

        for (AssessmentResponse response : allResponses) {

            latestResponsesByQuestion.put(response.getQuestion().getId(), response);
        }

        List<AssessmentResponse> scoredResponses = latestResponsesByQuestion.values().stream().toList();


        /*
         * Calculate and save individual
         * skill scores.
         */
        calculateSkillScores(session, scoredResponses);


        /*
         * Overall score is still useful
         * for a summary indicator.
         */
        long correctAnswers = scoredResponses.stream().filter(AssessmentResponse::isCorrect).count();

        int totalAnswered = scoredResponses.size();

        int overallScore = totalAnswered == 0 ? 0 : (int) Math.round(correctAnswers * 100.0 / totalAnswered);

        session.setOverallScore(overallScore);


        /*
         * Keep a high-level reading level
         * for now.
         *
         * Later this can be replaced by
         * pathway-specific placement logic.
         */
        session.setCalculatedLevel(calculateLevel(overallScore));

        session.setStatus(AssessmentStatus.COMPLETED);

        session.setCompletedAt(LocalDateTime.now());

        sessionRepository.save(session);
    }


    private int calculateLevel(int score) {

        if (score < 30) {
            return 1;
        }

        if (score < 50) {
            return 2;
        }

        if (score < 70) {
            return 3;
        }

        if (score < 85) {
            return 4;
        }

        return 5;
    }


    private AssessmentSession getOwnedSession(Long userId, Long sessionId) {

        AssessmentSession session = sessionRepository.findById(sessionId).orElseThrow(() -> new IllegalArgumentException("Assessment session not found."));

        if (!session.getUser().getId().equals(userId)) {
            throw new SecurityException("You cannot access this assessment.");
        }

        return session;
    }


    private AssessmentSessionResponse toSessionResponse(AssessmentSession session) {

        return new AssessmentSessionResponse(session.getId(), session.getStatus().name(), session.getCurrentQuestionNumber(), session.getTotalQuestions());
    }

    private void calculateSkillScores(AssessmentSession session, List<AssessmentResponse> responses) {

        /*
         * Normally completion happens once,
         * but deleting existing scores makes
         * recalculation safe during development.
         */
        skillScoreRepository.deleteBySessionId(session.getId());


        Map<ReadingSkill, List<AssessmentResponse>> responsesBySkill = responses.stream().collect(Collectors.groupingBy(response -> response.getQuestion().getSkill()));


        for (Map.Entry<ReadingSkill, List<AssessmentResponse>> entry : responsesBySkill.entrySet()) {

            ReadingSkill skill = entry.getKey();

            List<AssessmentResponse> skillResponses = entry.getValue();


            int totalQuestions = skillResponses.size();


            long correct = skillResponses.stream().filter(AssessmentResponse::isCorrect).count();


            int scorePercent = totalQuestions == 0 ? 0 : (int) Math.round(correct * 100.0 / totalQuestions);


            AssessmentSkillScore skillScore = new AssessmentSkillScore();

            skillScore.setSession(session);

            skillScore.setSkill(skill);

            skillScore.setTotalQuestions(totalQuestions);

            skillScore.setCorrectAnswers((int) correct);

            skillScore.setScorePercent(scorePercent);

            skillScore.setStatus(determineSkillStatus(scorePercent));


            skillScoreRepository.save(skillScore);
        }
    }

    private SkillPerformanceStatus determineSkillStatus(int score) {

        if (score < 50) {
            return SkillPerformanceStatus.NEEDS_PRACTICE;
        }

        if (score < 70) {
            return SkillPerformanceStatus.DEVELOPING;
        }

        if (score < 85) {
            return SkillPerformanceStatus.PROFICIENT;
        }

        return SkillPerformanceStatus.STRONG;
    }
}