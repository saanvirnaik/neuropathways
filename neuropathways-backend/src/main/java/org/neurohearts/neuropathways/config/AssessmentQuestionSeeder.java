package org.neurohearts.neuropathways.config;

import org.neurohearts.neuropathways.entity.AssessmentQuestion;
import org.neurohearts.neuropathways.entity.ReadingSkill;
import org.neurohearts.neuropathways.repository.AssessmentQuestionRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AssessmentQuestionSeeder {

    @Bean
    CommandLineRunner seedAssessmentQuestions(AssessmentQuestionRepository questionRepository) {

        return args -> {

            if (questionRepository.count() > 0) {
                return;
            }

            // =====================================================
            // DECODING
            // =====================================================

            questionRepository.save(createQuestion(ReadingSkill.DECODING, 1, null, "Which word rhymes with 'cat'?", "Hat", "Cup", "Bed", "Dog", "A"));

            questionRepository.save(createQuestion(ReadingSkill.DECODING, 2, null, "Which word begins with the same sound as 'ship'?", "Shop", "Chip", "Sit", "Top", "A"));

            questionRepository.save(createQuestion(ReadingSkill.DECODING, 3, null, "Break the word 'sunset' into two smaller words.", "Sun + set", "Su + nset", "Suns + et", "Sunse + t", "A"));


            // =====================================================
            // VOCABULARY
            // =====================================================

            questionRepository.save(createQuestion(ReadingSkill.VOCABULARY, 1, "Lena was delighted when she saw the surprise waiting for her.", "What does 'delighted' most likely mean?", "Very happy", "Very tired", "Very angry", "Very confused", "A"));

            questionRepository.save(createQuestion(ReadingSkill.VOCABULARY, 2, "The path was narrow, so only one person could walk on it at a time.", "What does 'narrow' mean?", "Not very wide", "Very long", "Very dark", "Very steep", "A"));

            questionRepository.save(createQuestion(ReadingSkill.VOCABULARY, 3, "Marcus hesitated before answering the difficult question.", "What does 'hesitated' most likely mean?", "Paused because he was unsure", "Answered immediately", "Forgot the question", "Walked away", "A"));


            // =====================================================
            // FLUENCY
            // =====================================================

            questionRepository.save(createQuestion(ReadingSkill.FLUENCY, 1, "The small dog ran quickly across the yard.", "Which word best describes how the dog ran?", "Quickly", "Small", "Yard", "Dog", "A"));

            questionRepository.save(createQuestion(ReadingSkill.FLUENCY, 2, "After dinner, Maya quietly finished her homework before going outside.", "Which phrase would be read together as one meaningful group?", "After dinner", "Maya quietly finished", "her homework before", "going outside", "A"));

            questionRepository.save(createQuestion(ReadingSkill.FLUENCY, 3, "The rain stopped, and the children hurried outside to play.", "Where is the most natural pause when reading this sentence aloud?", "After 'stopped'", "After 'children'", "After 'outside'", "No pause is needed", "A"));


            // =====================================================
            // COMPREHENSION
            // =====================================================

            questionRepository.save(createQuestion(ReadingSkill.COMPREHENSION, 1, "Emma packed her lunch, put on her backpack, and walked to the bus stop.", "Where is Emma most likely going?", "School", "The beach", "A restaurant", "A movie theater", "A"));

            questionRepository.save(createQuestion(ReadingSkill.COMPREHENSION, 2, "The class planted seeds in small pots. Every day, they watered them and placed them near the window. After a week, tiny green shoots appeared.", "What happened after the students watered the seeds for several days?", "Green shoots appeared", "The pots disappeared", "The seeds turned blue", "The students stopped watering them", "A"));

            questionRepository.save(createQuestion(ReadingSkill.COMPREHENSION, 3, "Jayden practiced the piano every evening for two weeks. At the recital, he played the entire song without stopping.", "What helped Jayden perform well at the recital?", "He practiced regularly", "He bought a new piano", "He skipped practice", "He changed the song", "A"));


            // =====================================================
            // INFERENCE
            // =====================================================

            questionRepository.save(createQuestion(ReadingSkill.INFERENCE, 1, "Mia looked out the window and saw people carrying umbrellas. She grabbed her raincoat before leaving the house.", "What can you infer about the weather?", "It is probably raining", "It is probably snowing", "It is very hot", "It is very windy", "A"));

            questionRepository.save(createQuestion(ReadingSkill.INFERENCE, 2, "Noah opened the refrigerator, frowned, and then picked up his phone to order food.", "What can you infer?", "There was probably nothing he wanted to eat", "He was not hungry", "The refrigerator was new", "His phone was broken", "A"));

            questionRepository.save(createQuestion(ReadingSkill.INFERENCE, 3, "Ava entered the room holding a wrapped box. Everyone smiled and began singing.", "What is most likely happening?", "A birthday celebration", "A math lesson", "A soccer game", "A fire drill", "A"));


            System.out.println("Seeded " + questionRepository.count() + " assessment questions.");
        };
    }


    private AssessmentQuestion createQuestion(ReadingSkill skill, int difficultyLevel, String passage, String questionText, String optionA, String optionB, String optionC, String optionD, String correctOption) {

        AssessmentQuestion question = new AssessmentQuestion();

        question.setSkill(skill);
        question.setDifficultyLevel(difficultyLevel);
        question.setPassage(passage);
        question.setQuestionText(questionText);
        question.setOptionA(optionA);
        question.setOptionB(optionB);
        question.setOptionC(optionC);
        question.setOptionD(optionD);
        question.setCorrectOption(correctOption);
        question.setActive(true);

        return question;
    }
}