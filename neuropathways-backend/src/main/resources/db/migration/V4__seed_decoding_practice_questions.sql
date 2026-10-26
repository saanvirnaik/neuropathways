-- DECODING: 15 reviewed starter questions (5 per difficulty).
-- Inserts are idempotent against existing manually entered questions with identical skill, difficulty, and question text.

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 1, 'INITIAL_SOUNDS', NULL, 'Which word starts with the same sound as sun?', 'Sock', 'Moon', 'Cat', 'A', 'Sun and sock both start with /s/.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 1 AND question_text = 'Which word starts with the same sound as sun?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 1, 'INITIAL_SOUNDS', NULL, 'Which word starts with the same sound as fish?', 'Van', 'Fan', 'Ship', 'B', 'Fish and fan both start with /f/.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 1 AND question_text = 'Which word starts with the same sound as fish?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 1, 'INITIAL_SOUNDS', NULL, 'Which word starts with the same sound as map?', 'Dog', 'Tap', 'Moon', 'C', 'Map and moon both start with /m/.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 1 AND question_text = 'Which word starts with the same sound as map?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 1, 'INITIAL_SOUNDS', NULL, 'Which word starts with the same sound as ball?', 'Bat', 'Tall', 'Fall', 'A', 'Ball and bat both start with /b/.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 1 AND question_text = 'Which word starts with the same sound as ball?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 1, 'INITIAL_SOUNDS', NULL, 'Which word starts with the same sound as kite?', 'Time', 'Cup', 'Bike', 'B', 'Kite and cup both start with the /k/ sound.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 1 AND question_text = 'Which word starts with the same sound as kite?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 2, 'VOWEL_PATTERNS', NULL, 'Which word has the same long-a sound as rain?', 'Train', 'Ran', 'Run', 'A', 'Rain and train both have the long-a sound.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 2 AND question_text = 'Which word has the same long-a sound as rain?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 2, 'VOWEL_PATTERNS', NULL, 'Which word has the same long-e sound as seed?', 'Bed', 'Red', 'Need', 'C', 'Seed and need share the long-e sound.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 2 AND question_text = 'Which word has the same long-e sound as seed?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 2, 'VOWEL_PATTERNS', NULL, 'Which word has the same long-o sound as boat?', 'Hot', 'Coat', 'Boot', 'B', 'Boat and coat share the long-o sound.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 2 AND question_text = 'Which word has the same long-o sound as boat?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 2, 'VOWEL_PATTERNS', NULL, 'Which word has the same long-i sound as light?', 'Night', 'Lit', 'Let', 'A', 'Light and night share the long-i sound.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 2 AND question_text = 'Which word has the same long-i sound as light?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 2, 'VOWEL_PATTERNS', NULL, 'Which word has the same vowel sound as food?', 'Good', 'Mood', 'Flood', 'B', 'Food and mood share the /oo/ sound.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 2 AND question_text = 'Which word has the same vowel sound as food?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 3, 'MULTISYLLABIC_WORDS', NULL, 'Which is the correct division of fantastic into syllables?', 'fant-astic', 'fan-tas-tic', 'fanta-stic', 'B', 'Fantastic has three syllables: fan-tas-tic.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 3 AND question_text = 'Which is the correct division of fantastic into syllables?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 3, 'MULTISYLLABIC_WORDS', NULL, 'Which word contains the prefix re- meaning again?', 'Return', 'Reason', 'Ready', 'A', 'Return uses re- to mean back; reread would more directly mean read again.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 3 AND question_text = 'Which word contains the prefix re- meaning again?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 3, 'MULTISYLLABIC_WORDS', NULL, 'Which word has four syllables?', 'Beautiful', 'Elephant', 'Information', 'C', 'Information is commonly divided in-for-ma-tion.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 3 AND question_text = 'Which word has four syllables?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 3, 'MULTISYLLABIC_WORDS', NULL, 'Which word has the same final sound as photograph?', 'Laugh', 'Graphite', 'Phone', 'A', 'Photograph and laugh end with the /f/ sound.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 3 AND question_text = 'Which word has the same final sound as photograph?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'DECODING', 3, 'MULTISYLLABIC_WORDS', NULL, 'Which word contains the suffix -tion pronounced /shun/?', 'Action', 'Active', 'Actor', 'A', 'Action ends in -tion, pronounced /shun/.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'DECODING' AND difficulty = 3 AND question_text = 'Which word contains the suffix -tion pronounced /shun/?');
