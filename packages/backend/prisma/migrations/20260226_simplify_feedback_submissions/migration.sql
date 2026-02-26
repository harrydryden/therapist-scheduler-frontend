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
