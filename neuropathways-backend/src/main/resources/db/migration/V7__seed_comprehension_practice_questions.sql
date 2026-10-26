-- COMPREHENSION: 15 reviewed starter questions (5 per difficulty).
-- Inserts are idempotent against existing manually entered questions with identical skill, difficulty, and question text.

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 1, 'KEY_DETAILS', 'Ana packed an apple and a sandwich for lunch.', 'What did Ana pack for lunch?', 'Soup', 'An apple', 'Rice', 'B', 'The passage states that Ana packed an apple.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 1 AND question_text = 'What did Ana pack for lunch?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 1, 'KEY_DETAILS', 'Max went to the library to return two books.', 'Where did Max go?', 'Library', 'Park', 'Store', 'A', 'The passage says Max went to the library.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 1 AND question_text = 'Where did Max go?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 1, 'KEY_DETAILS', 'Lena rode her blue bicycle to the park.', 'What color was the bicycle?', 'Green', 'Yellow', 'Blue', 'C', 'The bicycle is described as blue.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 1 AND question_text = 'What color was the bicycle?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 1, 'KEY_DETAILS', 'Tara watered the plants before school.', 'Who watered the plants?', 'Grandpa', 'Tara', 'Sam', 'B', 'The passage identifies Tara as the person watering the plants.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 1 AND question_text = 'Who watered the plants?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 1, 'KEY_DETAILS', 'The family left for the beach early in the morning.', 'When did the family leave?', 'Morning', 'Evening', 'Midnight', 'A', 'The passage says they left in the morning.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 1 AND question_text = 'When did the family leave?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 2, 'SEQUENCE', 'Leo washed the carrots, chopped them, and added them to the soup.', 'What happened immediately after Leo washed the carrots?', 'He chopped them', 'He planted them', 'He ate dessert', 'A', 'The passage says Leo chopped them after washing.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 2 AND question_text = 'What happened immediately after Leo washed the carrots?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 2, 'SEQUENCE', 'Noor mixed the batter, baked the cake, and added frosting after it cooled.', 'What did Noor do first?', 'Opened the oven', 'Mixed the batter', 'Frosted the cake', 'B', 'Mixing the batter happened before baking and frosting.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 2 AND question_text = 'What did Noor do first?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 2, 'SEQUENCE', 'The bell rang. Students lined up outside. Then the bus arrived.', 'What happened last?', 'The bell rang', 'Students lined up', 'The bus arrived', 'C', 'The bus arrived after the bell and line-up.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 2 AND question_text = 'What happened last?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 2, 'SEQUENCE', 'Eli dug a hole, placed the seed inside, and covered it with soil.', 'What did Eli do before planting the seed?', 'Dug a hole', 'Watered the sprout', 'Picked a flower', 'A', 'Digging a hole happened before planting.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 2 AND question_text = 'What did Eli do before planting the seed?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 2, 'SEQUENCE', 'The team practiced every afternoon. On Saturday, they played the match.', 'What did the team do after practicing?', 'Bought shoes', 'Played the match', 'Chose a captain', 'B', 'The passage says the match followed practice.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 2 AND question_text = 'What did the team do after practicing?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 3, 'MAIN_IDEA', 'Trees give shade on hot days, provide homes for birds, and help clean the air.', 'What is the main idea of the passage?', 'Trees provide several benefits', 'All trees grow quickly', 'Leaves are always green', 'A', 'The passage lists several ways trees help people and animals.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 3 AND question_text = 'What is the main idea of the passage?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 3, 'MAIN_IDEA', 'At the library, visitors can borrow books, attend workshops, and use computers.', 'What is the main idea?', 'Libraries sell food', 'Libraries offer more than books', 'Libraries are always silent', 'B', 'The passage mentions books, classes, and computers.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 3 AND question_text = 'What is the main idea?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 3, 'MAIN_IDEA', 'Recycling paper and cans allows materials to be used again instead of thrown away.', 'What is the main idea?', 'Recycling uses more water', 'Plastic cannot be recycled', 'Recycling can reduce waste', 'C', 'The passage describes how recycling keeps materials out of landfills.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 3 AND question_text = 'What is the main idea?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 3, 'MAIN_IDEA', 'As bees visit flowers for nectar, pollen sticks to their bodies and moves to other flowers.', 'What is the main idea?', 'Bees help plants reproduce', 'Bees only live in gardens', 'All flowers need the same insects', 'A', 'The passage explains bees moving pollen between flowers.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 3 AND question_text = 'What is the main idea?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'COMPREHENSION', 3, 'MAIN_IDEA', 'Walking, dancing, and cycling can strengthen muscles and support heart health.', 'What is the main idea?', 'Exercise always requires a gym', 'Daily movement benefits health', 'Walking is a competitive sport', 'B', 'The passage lists health benefits of different forms of movement.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'COMPREHENSION' AND difficulty = 3 AND question_text = 'What is the main idea?');
