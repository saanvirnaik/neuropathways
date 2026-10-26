-- INFERENCE: 15 reviewed starter questions (5 per difficulty).
-- Inserts are idempotent against existing manually entered questions with identical skill, difficulty, and question text.

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 1, 'EVIDENCE_BASED_INFERENCE', 'Ava looked at the dark clouds and put an umbrella in her bag.', 'Why might Ava need an umbrella?', 'It may rain', 'It is very hot', 'It is snowing indoors', 'A', 'Dark clouds suggest rain may be coming.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 1 AND question_text = 'Why might Ava need an umbrella?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 1, 'EVIDENCE_BASED_INFERENCE', 'Ben smiled and clapped when his name was announced.', 'How does Ben probably feel?', 'Angry', 'Happy', 'Sleepy', 'B', 'Smiling and clapping suggest happiness.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 1 AND question_text = 'How does Ben probably feel?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 1, 'EVIDENCE_BASED_INFERENCE', 'After the storm, puddles covered the sidewalk.', 'What can you infer about the ground?', 'It is dry', 'It is frozen', 'It is wet', 'C', 'Puddles suggest the ground is wet.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 1 AND question_text = 'What can you infer about the ground?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 1, 'EVIDENCE_BASED_INFERENCE', 'Maya shivered as she opened the door and reached for her coat.', 'Why did Maya put on a coat?', 'She felt cold', 'She was going swimming', 'She was cooking', 'A', 'Shivering suggests she was cold.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 1 AND question_text = 'Why did Maya put on a coat?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 1, 'EVIDENCE_BASED_INFERENCE', 'The puppy stood beside its empty food bowl and whined.', 'What can you infer about the puppy?', 'It is sleeping', 'It wants food', 'It dislikes toys', 'B', 'Waiting by the empty bowl suggests hunger.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 1 AND question_text = 'What can you infer about the puppy?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 2, 'CHARACTER_INTENT', 'Omar checked his bag, noticed his notebook was missing, and hurried back to class.', 'Why did Omar return to the classroom?', 'To get his forgotten notebook', 'To meet a friend', 'To play a game', 'A', 'He checked his bag and realized the notebook was missing.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 2 AND question_text = 'Why did Omar return to the classroom?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 2, 'CHARACTER_INTENT', 'When Priya saw the sleeping baby, she began speaking softly.', 'Why did Priya lower her voice?', 'She was angry', 'She did not want to disturb others', 'She forgot the words', 'B', 'The baby was sleeping nearby.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 2 AND question_text = 'Why did Priya lower her voice?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 2, 'CHARACTER_INTENT', 'Jules noticed that a teammate had forgotten water, so Jules packed an extra bottle.', 'Why did Jules bring an extra water bottle?', 'To wash a car', 'To make tea', 'To share with a teammate', 'C', 'A teammate had forgotten water.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 2 AND question_text = 'Why did Jules bring an extra water bottle?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 2, 'CHARACTER_INTENT', 'The classroom felt hot and stuffy, so the teacher opened two windows.', 'Why did the teacher open the windows?', 'To cool the room', 'To hear music', 'To keep out light', 'A', 'The room was hot and stuffy.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 2 AND question_text = 'Why did the teacher open the windows?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 2, 'CHARACTER_INTENT', 'Iris was visiting a new neighborhood and checked the map twice before leaving.', 'Why did Iris check the map twice?', 'She wanted to draw it', 'She wanted to avoid getting lost', 'She wanted to count roads', 'B', 'She was visiting an unfamiliar neighborhood.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 2 AND question_text = 'Why did Iris check the map twice?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 3, 'IMPLIED_MEANING', 'The first bridge model collapsed. The team studied where it broke, changed the supports, and tested again.', 'What does the ending imply about the experiment?', 'The first attempt failed but helped them improve', 'The experiment was never started', 'The team stopped trying', 'A', 'Revising a design after a failed trial shows learning from evidence.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 3 AND question_text = 'What does the ending imply about the experiment?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 3, 'IMPLIED_MEANING', 'Backstage, my hands trembled. I rehearsed the opening line one last time as the curtain rose.', 'What can be inferred about the narrator?', 'They dislike music', 'They are nervous about performing', 'They forgot the event', 'B', 'Shaky hands and repeated rehearsal suggest nervousness.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 3 AND question_text = 'What can be inferred about the narrator?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 3, 'IMPLIED_MEANING', 'Where orchards once stretched to the hills, new houses and shops now lined the road.', 'What does the author imply about the town?', 'It never changes', 'It is near an ocean', 'It has grown over time', 'C', 'The comparison between old fields and new homes indicates growth.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 3 AND question_text = 'What does the author imply about the town?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 3, 'IMPLIED_MEANING', 'The sensor gave an unexpected reading, so the scientist measured the sample three more times.', 'Why might the scientist repeat the measurement?', 'To check reliability', 'To hide the result', 'To use more paper', 'A', 'Repeating a measurement helps determine whether a result is consistent.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 3 AND question_text = 'Why might the scientist repeat the measurement?');

INSERT INTO practice_questions (skill, difficulty, question_type, passage, question_text, optiona, optionb, optionc, correct_option, explanation, active)
SELECT 'INFERENCE', 3, 'IMPLIED_MEANING', 'The hikers saw the sky darken. A low rumble echoed across the valley.', 'What is suggested by the final sentence?', 'The hikers are lost', 'The storm is approaching', 'The hike is over', 'B', 'Darkening skies and distant thunder suggest an approaching storm.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM practice_questions WHERE skill = 'INFERENCE' AND difficulty = 3 AND question_text = 'What is suggested by the final sentence?');
