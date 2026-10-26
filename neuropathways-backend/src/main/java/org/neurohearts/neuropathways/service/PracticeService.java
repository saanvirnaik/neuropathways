package org.neurohearts.neuropathways.service;

import org.neurohearts.neuropathways.dto.*;
import org.neurohearts.neuropathways.entity.*;
import org.neurohearts.neuropathways.repository.*;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PracticeService {

    private static final int QUESTIONS_PER_SESSION = 5;

    private final PracticeSessionRepository sessionRepository;
    private final PracticeQuestionRepository questionRepository;
    private final PracticeSessionQuestionRepository assignmentRepository;
    private final PracticeResponseRepository responseRepository;
    private final UserRepository userRepository;
    private final PracticeDifficultyService difficultyService;

    public PracticeService(
            PracticeSessionRepository sessionRepository,
            PracticeQuestionRepository questionRepository,
            PracticeSessionQuestionRepository assignmentRepository,
            PracticeResponseRepository responseRepository,
            UserRepository userRepository,
            PracticeDifficultyService difficultyService
    ) {
        this.sessionRepository = sessionRepository;
        this.questionRepository = questionRepository;
        this.assignmentRepository = assignmentRepository;
        this.responseRepository = responseRepository;
        this.userRepository = userRepository;
        this.difficultyService = difficultyService;
    }

    @Transactional
    public PracticeSessionResponse startPractice(
            Long userId,
            StartPracticeRequest request
    ) {
        if (request == null || request.skill() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Practice skill is required."
            );
        }

        ReadingSkill skill = request.skill();

        int difficulty = difficultyService
                .determineStartingDifficulty(userId, skill);

        List<PracticeQuestion> available = new ArrayList<>(
                questionRepository
                        .findBySkillAndDifficultyAndActiveTrue(
                                skill,
                                difficulty
                        )
        );

        if (available.size() < QUESTIONS_PER_SESSION) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Not enough questions available for this skill and difficulty."
            );
        }

        Collections.shuffle(available);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found."
                ));

        PracticeSession session = new PracticeSession();
        session.setUser(user);
        session.setSkill(skill);
        session.setDifficulty(difficulty);
        session.setStatus(PracticeSessionStatus.IN_PROGRESS);
        session.setCurrentQuestionNumber(1);
        session.setTotalQuestions(QUESTIONS_PER_SESSION);
        session.setCorrectAnswers(0);

        session = sessionRepository.save(session);

        for (int i = 0; i < QUESTIONS_PER_SESSION; i++) {
            PracticeSessionQuestion assignment =
                    new PracticeSessionQuestion();

            assignment.setSession(session);
            assignment.setQuestion(available.get(i));
            assignment.setQuestionNumber(i + 1);

            assignmentRepository.save(assignment);
        }

        return new PracticeSessionResponse(
                session.getId(),
                skill,
                difficulty,
                session.getStatus(),
                session.getTotalQuestions()
        );
    }

    @Transactional(readOnly = true)
    public PracticeQuestionResponse getCurrentQuestion(
            Long userId,
            Long sessionId
    ) {
        PracticeSession session = getOwnedSession(userId, sessionId);

        if (session.getStatus() != PracticeSessionStatus.IN_PROGRESS) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Practice session is already completed."
            );
        }

        PracticeSessionQuestion assignment =
                assignmentRepository
                        .findBySessionIdAndQuestionNumber(
                                sessionId,
                                session.getCurrentQuestionNumber()
                        )
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Current practice question not found."
                        ));

        PracticeQuestion question = assignment.getQuestion();

        Map<String, String> options = new LinkedHashMap<>();
        options.put("A", question.getOptionA());
        options.put("B", question.getOptionB());
        options.put("C", question.getOptionC());

        return new PracticeQuestionResponse(
                question.getId(),
                assignment.getQuestionNumber(),
                session.getTotalQuestions(),
                question.getSkill(),
                question.getDifficulty(),
                question.getPassage(),
                question.getQuestionText(),
                options
        );
    }

    @Transactional
    public PracticeAnswerFeedback submitAnswer(
            Long userId,
            Long sessionId,
            SubmitPracticeAnswerRequest request
    ) {
        PracticeSession session = getOwnedSession(userId, sessionId);

        if (session.getStatus() != PracticeSessionStatus.IN_PROGRESS) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Practice session is already completed."
            );
        }

        if (request == null ||
                request.questionId() == null ||
                request.selectedOption() == null ||
                request.responseTimeMs() == null ||
                request.responseTimeMs() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid practice answer."
            );
        }

        String selected = request.selectedOption()
                .trim()
                .toUpperCase(Locale.ROOT);

        if (!Set.of("A", "B", "C").contains(selected)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selected option must be A, B, or C."
            );
        }

        PracticeSessionQuestion assignment =
                assignmentRepository
                        .findBySessionIdAndQuestionNumber(
                                sessionId,
                                session.getCurrentQuestionNumber()
                        )
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Practice question not found."
                        ));

        PracticeQuestion question = assignment.getQuestion();

        if (!question.getId().equals(request.questionId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Answer does not match the current question."
            );
        }

        if (responseRepository.existsBySessionQuestionId(
                assignment.getId()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This question has already been answered."
            );
        }

        boolean correct = selected.equals(question.getCorrectOption());

        PracticeResponse response = new PracticeResponse();
        response.setSessionQuestion(assignment);
        response.setSelectedOption(selected);
        response.setCorrect(correct);
        response.setResponseTimeMs(request.responseTimeMs());
        response.setUsedReadAloud(
                Boolean.TRUE.equals(request.usedReadAloud())
        );

        responseRepository.save(response);

        if (correct) {
            session.setCorrectAnswers(session.getCorrectAnswers() + 1);
        }

        boolean completed =
                session.getCurrentQuestionNumber()
                        >= session.getTotalQuestions();

        if (completed) {
            session.setStatus(PracticeSessionStatus.COMPLETED);
            session.setCompletedAt(LocalDateTime.now());
        } else {
            session.setCurrentQuestionNumber(
                    session.getCurrentQuestionNumber() + 1
            );
        }

        sessionRepository.save(session);

        return new PracticeAnswerFeedback(
                correct,
                question.getCorrectOption(),
                question.getExplanation(),
                completed,
                completed ? null : session.getCurrentQuestionNumber()
        );
    }

    @Transactional(readOnly = true)
    public PracticeResultsResponse getResults(
            Long userId,
            Long sessionId
    ) {
        PracticeSession session = getOwnedSession(userId, sessionId);

        if (session.getStatus() != PracticeSessionStatus.COMPLETED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Practice session is not completed."
            );
        }

        int percentage = (int) Math.round(
                session.getCorrectAnswers() * 100.0
                        / session.getTotalQuestions()
        );

        return new PracticeResultsResponse(
                session.getId(),
                session.getSkill(),
                session.getDifficulty(),
                session.getTotalQuestions(),
                session.getCorrectAnswers(),
                percentage
        );
    }

    private PracticeSession getOwnedSession(
            Long userId,
            Long sessionId
    ) {
        PracticeSession session = sessionRepository
                .findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Practice session not found."
                ));

        if (!session.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Practice session not found."
            );
        }

        return session;
    }
}