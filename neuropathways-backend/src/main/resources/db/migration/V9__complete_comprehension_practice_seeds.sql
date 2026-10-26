-- Restore distinct passages skipped by the V7 text-only duplicate check.
-- Preserve existing questions and migration checksums.

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 3, 'MAIN_IDEA', 'At the library, visitors can borrow books, attend workshops, and use computers.', 'What is the main idea?', 'Libraries sell food', 'Libraries offer more than books', 'Libraries are always silent', 'B', 'The passage mentions books, classes, and computers.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 3 AND question_text = 'What is the main idea?' AND passage = 'At the library, visitors can borrow books, attend workshops, and use computers.');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 3, 'MAIN_IDEA', 'Recycling paper and cans allows materials to be used again instead of thrown away.', 'What is the main idea?', 'Recycling uses more water', 'Plastic cannot be recycled', 'Recycling can reduce waste', 'C', 'The passage describes how recycling keeps materials out of landfills.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 3 AND question_text = 'What is the main idea?' AND passage = 'Recycling paper and cans allows materials to be used again instead of thrown away.');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 3, 'MAIN_IDEA', 'As bees visit flowers for nectar, pollen sticks to their bodies and moves to other flowers.', 'What is the main idea?', 'Bees help plants reproduce', 'Bees only live in gardens', 'All flowers need the same insects', 'A', 'The passage explains bees moving pollen between flowers.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 3 AND question_text = 'What is the main idea?' AND passage = 'As bees visit flowers for nectar, pollen sticks to their bodies and moves to other flowers.');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 3, 'MAIN_IDEA', 'Walking, dancing, and cycling can strengthen muscles and support heart health.', 'What is the main idea?', 'Exercise always requires a gym', 'Daily movement benefits health', 'Walking is a competitive sport', 'B', 'The passage lists health benefits of different forms of movement.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 3 AND question_text = 'What is the main idea?' AND passage = 'Walking, dancing, and cycling can strengthen muscles and support heart health.');

