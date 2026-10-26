-- Use ONLY if practice_questions already exists in the target database.
ALTER TABLE practice_questions ADD COLUMN question_type VARCHAR(50);

UPDATE practice_questions SET question_type = CASE skill
  WHEN 'DECODING' THEN 'INITIAL_SOUNDS'
  WHEN 'VOCABULARY' THEN 'WORD_MEANING'
  WHEN 'FLUENCY' THEN 'PUNCTUATION_EXPRESSION'
  WHEN 'COMPREHENSION' THEN 'KEY_DETAILS'
  WHEN 'INFERENCE' THEN 'EVIDENCE_BASED_INFERENCE'
  ELSE 'WORD_MEANING'
END WHERE question_type IS NULL;

ALTER TABLE practice_questions ALTER COLUMN question_type SET NOT NULL;
