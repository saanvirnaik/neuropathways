-- VOCABULARY: 15 reviewed starter questions (5 per difficulty).
-- Inserts are idempotent against existing manually entered questions with identical skill, difficulty, and question text.

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 1, 'WORD_MEANING', NULL, 'Which word means very happy?', 'Joyful', 'Tired', 'Angry', 'A', 'Joyful means full of happiness.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 1 AND question_text = 'Which word means very happy?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 1, 'WORD_MEANING', NULL, 'Which word means tiny?', 'Huge', 'Small', 'Loud', 'B', 'Tiny means very small.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 1 AND question_text = 'Which word means tiny?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 1, 'WORD_MEANING', NULL, 'Which word means to begin?', 'Finish', 'Pause', 'Start', 'C', 'Begin and start mean the same thing.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 1 AND question_text = 'Which word means to begin?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 1, 'WORD_MEANING', NULL, 'Which word means quiet?', 'Silent', 'Noisy', 'Bright', 'A', 'Silent means making little or no sound.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 1 AND question_text = 'Which word means quiet?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 1, 'WORD_MEANING', NULL, 'Which word means quick?', 'Slow', 'Fast', 'Late', 'B', 'Quick means fast.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 1 AND question_text = 'Which word means quick?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 2, 'CONTEXT_CLUES', NULL, 'Mia was exhausted after the long hike. What does exhausted mean?', 'Hungry', 'Very tired', 'Excited', 'B', 'A long hike can make someone very tired.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 2 AND question_text = 'Mia was exhausted after the long hike. What does exhausted mean?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 2, 'CONTEXT_CLUES', NULL, 'The glass was fragile, so Ben carried it carefully. What does fragile mean?', 'Easy to break', 'Very heavy', 'Colorful', 'A', 'Careful handling suggests the glass can break easily.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 2 AND question_text = 'The glass was fragile, so Ben carried it carefully. What does fragile mean?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 2, 'CONTEXT_CLUES', NULL, 'The room was dim, so she turned on a lamp. What does dim mean?', 'Crowded', 'Noisy', 'Not bright', 'C', 'Turning on a lamp helps when a room is not bright.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 2 AND question_text = 'The room was dim, so she turned on a lamp. What does dim mean?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 2, 'CONTEXT_CLUES', NULL, 'The path was narrow; only one person could walk on it at a time. What does narrow mean?', 'Not wide', 'Very long', 'Very steep', 'A', 'Room for only one person suggests a path that is not wide.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 2 AND question_text = 'The path was narrow; only one person could walk on it at a time. What does narrow mean?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 2, 'CONTEXT_CLUES', NULL, 'The instructions were brief and took only a minute to read. What does brief mean?', 'Confusing', 'Short', 'Detailed', 'B', 'Brief means short in length or time.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 2 AND question_text = 'The instructions were brief and took only a minute to read. What does brief mean?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 3, 'WORD_PARTS', NULL, 'What does the prefix pre- mean in preview?', 'After', 'Before', 'Against', 'B', 'Pre- often means before; preview means see beforehand.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 3 AND question_text = 'What does the prefix pre- mean in preview?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 3, 'WORD_PARTS', NULL, 'What does the suffix -less mean in fearless?', 'Without', 'Full of', 'Able to', 'A', '-less means without; fearless means without fear.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 3 AND question_text = 'What does the suffix -less mean in fearless?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 3, 'WORD_PARTS', NULL, 'What does the root bio mean in biology?', 'Earth', 'Sound', 'Life', 'C', 'Bio refers to life.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 3 AND question_text = 'What does the root bio mean in biology?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 3, 'WORD_PARTS', NULL, 'What does the prefix inter- mean in international?', 'Between or among', 'Under', 'Against', 'A', 'Inter- means between or among nations.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 3 AND question_text = 'What does the prefix inter- mean in international?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'VOCABULARY', 3, 'WORD_PARTS', NULL, 'What does the suffix -able mean in washable?', 'Washed yesterday', 'Can be washed', 'Without washing', 'B', '-able means capable of being.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'VOCABULARY' AND difficulty = 3 AND question_text = 'What does the suffix -able mean in washable?');
