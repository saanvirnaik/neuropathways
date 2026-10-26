-- FLUENCY: 15 reviewed starter questions (5 per difficulty).
-- Inserts are idempotent against existing manually entered questions with identical skill, difficulty, and question text.

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 1, 'PUNCTUATION_EXPRESSION', NULL, 'Which punctuation mark ends a question?', '?', '.', ',', 'A', 'A question mark shows a question.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 1 AND question_text = 'Which punctuation mark ends a question?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 1, 'PUNCTUATION_EXPRESSION', NULL, 'Which punctuation mark usually signals strong excitement?', '.', ',', '!', 'C', 'An exclamation mark can signal excitement.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 1 AND question_text = 'Which punctuation mark usually signals strong excitement?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 1, 'PUNCTUATION_EXPRESSION', NULL, 'Which sentence is a question?', 'Please sit down.', 'Where is my book?', 'The book is blue.', 'B', 'Where is my book? asks for information.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 1 AND question_text = 'Which sentence is a question?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 1, 'PUNCTUATION_EXPRESSION', NULL, 'Which mark signals a short pause in a list?', 'Comma', 'Question mark', 'Period', 'A', 'Commas separate items in a list.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 1 AND question_text = 'Which mark signals a short pause in a list?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 1, 'PUNCTUATION_EXPRESSION', NULL, 'Which sentence should be read with an excited tone?', 'It is Monday.', 'Close the door.', 'We won the game!', 'C', 'The exclamation mark signals excitement.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 1 AND question_text = 'Which sentence should be read with an excited tone?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 2, 'PHRASE_GROUPING', NULL, 'Which grouping makes the sentence easiest to understand?', 'After lunch / we played outside.', 'After / lunch we / played outside.', 'After lunch we played / outside.', 'A', 'Grouping after lunch as one phrase supports meaning.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 2 AND question_text = 'Which grouping makes the sentence easiest to understand?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 2, 'PHRASE_GROUPING', NULL, 'Where is a natural pause? In the morning, birds sang.', 'After In', 'After morning,', 'After birds', 'B', 'The introductory phrase ends after morning.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 2 AND question_text = 'Where is a natural pause? In the morning, birds sang.');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 2, 'PHRASE_GROUPING', NULL, 'Which grouping is most natural?', 'The little / dog ran home.', 'The / little dog / ran home.', 'The little dog / ran home.', 'C', 'The little dog is a complete noun phrase.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 2 AND question_text = 'Which grouping is most natural?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 2, 'PHRASE_GROUPING', NULL, 'Which phrase should stay together when reading?', 'a bright red kite', 'a / bright / red / kite', 'a bright / red / kite', 'A', 'The full noun phrase belongs together.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 2 AND question_text = 'Which phrase should stay together when reading?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 2, 'PHRASE_GROUPING', NULL, 'Where is a natural pause? Before the storm, we closed the windows.', 'After Before', 'After storm,', 'After we', 'B', 'The introductory phrase ends after storm.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 2 AND question_text = 'Where is a natural pause? Before the storm, we closed the windows.');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 3, 'SENTENCE_FLOW', NULL, 'Which reading best fits: Although it rained, we continued hiking.', 'Pause briefly after rained', 'Pause after Although', 'Read each word separately', 'A', 'A short pause after the introductory clause supports meaning.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 3 AND question_text = 'Which reading best fits: Although it rained, we continued hiking.');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 3, 'SENTENCE_FLOW', NULL, 'How should you read: Really? You finished already?', 'In a questioning tone', 'As a command', 'Without any expression', 'A', 'Question marks indicate questions.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 3 AND question_text = 'How should you read: Really? You finished already?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 3, 'SENTENCE_FLOW', NULL, 'Which phrase is emphasized in: I said the BLUE folder, not the red one.', 'folder', 'BLUE', 'said', 'B', 'BLUE contrasts with red.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 3 AND question_text = 'Which phrase is emphasized in: I said the BLUE folder, not the red one.');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 3, 'SENTENCE_FLOW', NULL, 'How should you read dialogue ending with whispered?', 'Shout', 'Speak softly', 'Speak very quickly', 'B', 'Whispered suggests a soft voice.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 3 AND question_text = 'How should you read dialogue ending with whispered?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'FLUENCY', 3, 'SENTENCE_FLOW', NULL, 'Where should the voice pause: If you finish early, please help a friend.', 'After If', 'After early,', 'After please', 'B', 'Pause after the introductory conditional clause.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'FLUENCY' AND difficulty = 3 AND question_text = 'Where should the voice pause: If you finish early, please help a friend.');
