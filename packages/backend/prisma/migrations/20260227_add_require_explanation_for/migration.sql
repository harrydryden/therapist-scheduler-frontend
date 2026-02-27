-- Add require_explanation_for column to feedback_form_config
-- This controls which choice answers require explanation text (e.g., "No", "Unsure")
ALTER TABLE "feedback_form_config" ADD COLUMN "require_explanation_for" JSONB NOT NULL DEFAULT '["No", "Unsure"]';
