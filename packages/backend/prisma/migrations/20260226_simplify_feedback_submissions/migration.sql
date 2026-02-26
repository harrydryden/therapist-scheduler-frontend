-- Simplify feedback_submissions table: remove hardcoded score/text columns.
-- All response data is stored in the `responses` JSONB column, making the form
-- flexible for future question changes without schema migrations.
--
-- Safe to run because existing feedback data has been cleared.

-- Drop hardcoded score/text columns
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "safety_score";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "listened_to_score";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "professional_score";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "understood_score";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "would_book_again";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "would_book_again_text";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "would_recommend";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "would_recommend_text";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "session_benefits";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "improvement_suggestions";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "additional_comments";

-- Add form_version to track which question set was used for each submission
ALTER TABLE "feedback_submissions" ADD COLUMN "form_version" INTEGER NOT NULL DEFAULT 0;

-- Deprecate Notion sync for feedback - drop sync-related columns
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "synced_to_notion";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "notion_page_id";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "synced_at";
ALTER TABLE "feedback_submissions" DROP COLUMN IF EXISTS "sync_error";

-- Drop the Notion sync index (no longer needed)
DROP INDEX IF EXISTS "feedback_submissions_synced_to_notion_idx";

-- Update form config with new questions (resets to version 2 so the app
-- knows this is the rebuilt form). The questionsVersion check in the app
-- only auto-seeds when version is 0, so we explicitly set the new questions here.
UPDATE "feedback_form_config"
SET
  "questions" = '[
    {
      "id": "comfortable",
      "type": "choice_with_text",
      "question": "Did you feel comfortable with them from the outset?",
      "helperText": "Consider how they introduced themselves, their opening remarks, and the professionalism of their setup.",
      "required": true,
      "options": ["Yes", "No", "Unsure"],
      "followUpPlaceholder": "Any additional thoughts (optional)..."
    },
    {
      "id": "session_structure",
      "type": "choice_with_text",
      "question": "Did they explain the session structure clearly?",
      "helperText": "This includes explaining their therapeutic style, setting expectations for the session, and managing time.",
      "required": true,
      "options": ["Yes", "No", "Unsure"],
      "followUpPlaceholder": "Any additional thoughts (optional)..."
    },
    {
      "id": "felt_heard",
      "type": "choice_with_text",
      "question": "During the session, did you feel heard?",
      "helperText": "Did you feel able to express your thoughts and concerns fully?",
      "required": true,
      "options": ["Yes", "No", "Unsure"],
      "followUpPlaceholder": "Any additional thoughts (optional)..."
    },
    {
      "id": "felt_understood",
      "type": "choice_with_text",
      "question": "Did you feel understood?",
      "helperText": "For example: did they summarise accurately, offer helpful perspectives, and correctly identify your emotions and behaviours?",
      "required": true,
      "options": ["Yes", "No", "Unsure"],
      "followUpPlaceholder": "Any additional thoughts (optional)..."
    },
    {
      "id": "provided_insights",
      "type": "choice_with_text",
      "question": "Did the session provide new insights, strategies, or a sense of resolution?",
      "helperText": "Did you feel the session offered significant value?",
      "required": true,
      "options": ["Yes", "No", "Unsure"],
      "followUpPlaceholder": "Any additional thoughts (optional)..."
    },
    {
      "id": "key_takeaways",
      "type": "text",
      "question": "Please share the main things you took away from the session.",
      "required": true
    },
    {
      "id": "would_book_again",
      "type": "choice_with_text",
      "question": "Would you book another session with this therapist in the future?",
      "required": true,
      "options": ["Yes", "No", "Unsure"],
      "followUpPlaceholder": "Any additional thoughts (optional)..."
    },
    {
      "id": "would_recommend",
      "type": "choice_with_text",
      "question": "Based on this session, would you recommend Spill to someone else?",
      "required": true,
      "options": ["Yes", "No", "Unsure"],
      "followUpPlaceholder": "Any additional thoughts (optional)..."
    },
    {
      "id": "improvement_suggestions",
      "type": "text",
      "question": "Is there anything that could have made the session better?",
      "required": false
    }
  ]'::jsonb,
  "questions_version" = 2,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'default';
