/**
 * Tests for feedback form validation logic
 *
 * Covers:
 * - requiresExplanation: which choice answers need explanation text
 * - Server-side enforcement of requireExplanationFor config
 * - Edge cases: case-insensitivity, empty arrays, back-and-forth answers
 */

/**
 * Pure function extracted to match the validation logic used in both
 * the frontend (requiresExplanation) and the backend submission route.
 */
function requiresExplanation(value: string | null | undefined, requireExplanationFor: string[]): boolean {
  if (!value || typeof value !== 'string') return false;
  const lower = value.toLowerCase();
  return requireExplanationFor.some((opt) => opt.toLowerCase() === lower);
}

/**
 * Simulates the server-side validation loop from feedback-form.routes.ts
 * Returns an error message if validation fails, or null if valid.
 */
function validateResponses(
  responses: Record<string, string | number>,
  questions: Array<{ id: string; type: string; question: string; required?: boolean }>,
  requireExplanationFor: string[]
): string | null {
  for (const q of questions) {
    if (q.type !== 'choice_with_text') continue;
    const choiceVal = responses[q.id];
    if (typeof choiceVal !== 'string') continue;
    const needsExplanation = requireExplanationFor.some(
      (opt) => opt.toLowerCase() === choiceVal.toLowerCase()
    );
    if (needsExplanation) {
      const textVal = responses[`${q.id}_text`];
      if (!textVal || (typeof textVal === 'string' && !textVal.trim())) {
        return `Please provide an explanation for "${q.question}" when answering "${choiceVal}"`;
      }
    }
  }
  return null;
}

// ============================================
// Tests
// ============================================

describe('requiresExplanation', () => {
  const defaultConfig = ['No', 'Unsure'];

  it('returns true for "No" (case-insensitive)', () => {
    expect(requiresExplanation('No', defaultConfig)).toBe(true);
    expect(requiresExplanation('no', defaultConfig)).toBe(true);
    expect(requiresExplanation('NO', defaultConfig)).toBe(true);
  });

  it('returns true for "Unsure" (case-insensitive)', () => {
    expect(requiresExplanation('Unsure', defaultConfig)).toBe(true);
    expect(requiresExplanation('unsure', defaultConfig)).toBe(true);
    expect(requiresExplanation('UNSURE', defaultConfig)).toBe(true);
  });

  it('returns false for "Yes"', () => {
    expect(requiresExplanation('Yes', defaultConfig)).toBe(false);
  });

  it('returns false for null/undefined/empty', () => {
    expect(requiresExplanation(null, defaultConfig)).toBe(false);
    expect(requiresExplanation(undefined, defaultConfig)).toBe(false);
    expect(requiresExplanation('', defaultConfig)).toBe(false);
  });

  it('respects custom config with "Yes" included', () => {
    const allRequired = ['Yes', 'No', 'Unsure'];
    expect(requiresExplanation('Yes', allRequired)).toBe(true);
    expect(requiresExplanation('No', allRequired)).toBe(true);
  });

  it('respects config with only "No"', () => {
    const noOnly = ['No'];
    expect(requiresExplanation('No', noOnly)).toBe(true);
    expect(requiresExplanation('Unsure', noOnly)).toBe(false);
    expect(requiresExplanation('Yes', noOnly)).toBe(false);
  });

  it('handles empty config (no answers require explanation)', () => {
    expect(requiresExplanation('No', [])).toBe(false);
    expect(requiresExplanation('Unsure', [])).toBe(false);
    expect(requiresExplanation('Yes', [])).toBe(false);
  });

  it('handles custom option names', () => {
    const custom = ['Not really', 'Somewhat'];
    expect(requiresExplanation('Not really', custom)).toBe(true);
    expect(requiresExplanation('Somewhat', custom)).toBe(true);
    expect(requiresExplanation('Definitely', custom)).toBe(false);
  });
});

describe('validateResponses (server-side submission validation)', () => {
  const questions = [
    { id: 'comfortable', type: 'choice_with_text', question: 'Did you feel comfortable?' },
    { id: 'heard', type: 'choice_with_text', question: 'Did you feel heard?' },
    { id: 'takeaways', type: 'text', question: 'Key takeaways' },
  ];
  const defaultConfig = ['No', 'Unsure'];

  it('passes when "Yes" is selected (no explanation needed)', () => {
    const responses = { comfortable: 'Yes', heard: 'Yes' };
    expect(validateResponses(responses, questions, defaultConfig)).toBeNull();
  });

  it('passes when "No" is selected with explanation text', () => {
    const responses = {
      comfortable: 'No',
      comfortable_text: 'The therapist was late.',
      heard: 'Yes',
    };
    expect(validateResponses(responses, questions, defaultConfig)).toBeNull();
  });

  it('fails when "No" is selected without explanation text', () => {
    const responses = { comfortable: 'No', heard: 'Yes' };
    const error = validateResponses(responses, questions, defaultConfig);
    expect(error).toContain('comfortable');
    expect(error).toContain('No');
  });

  it('fails when "Unsure" is selected without explanation text', () => {
    const responses = { comfortable: 'Yes', heard: 'Unsure' };
    const error = validateResponses(responses, questions, defaultConfig);
    expect(error).toContain('heard');
    expect(error).toContain('Unsure');
  });

  it('fails when explanation text is whitespace-only', () => {
    const responses = {
      comfortable: 'No',
      comfortable_text: '   ',
      heard: 'Yes',
    };
    expect(validateResponses(responses, questions, defaultConfig)).not.toBeNull();
  });

  it('skips non-choice_with_text questions', () => {
    const responses = { takeaways: '' as string | number };
    expect(validateResponses(responses, questions, defaultConfig)).toBeNull();
  });

  it('skips questions without a response', () => {
    const responses = {};
    expect(validateResponses(responses, questions, defaultConfig)).toBeNull();
  });

  describe('back-and-forth answer changes', () => {
    it('validates final state, not history: "No" with text passes', () => {
      // User selected No, typed explanation, went back, confirmed No
      const responses = {
        comfortable: 'No',
        comfortable_text: 'Changed my mind but still no.',
        heard: 'Yes',
      };
      expect(validateResponses(responses, questions, defaultConfig)).toBeNull();
    });

    it('validates final state: "Yes" with stale text from prior "No" passes', () => {
      // User selected No, typed explanation, went back, changed to Yes
      // The stale text is still in responses but doesn't matter
      const responses = {
        comfortable: 'Yes',
        comfortable_text: 'This was from when I said No',
        heard: 'Yes',
      };
      expect(validateResponses(responses, questions, defaultConfig)).toBeNull();
    });

    it('validates final state: "No" with cleared text fails', () => {
      // User selected No, cleared the explanation
      const responses = {
        comfortable: 'No',
        comfortable_text: '',
        heard: 'Yes',
      };
      expect(validateResponses(responses, questions, defaultConfig)).not.toBeNull();
    });
  });

  describe('custom requireExplanationFor config', () => {
    it('requires explanation for "Yes" when configured', () => {
      const allRequired = ['Yes', 'No', 'Unsure'];
      const responses = { comfortable: 'Yes', heard: 'Yes' };
      expect(validateResponses(responses, questions, allRequired)).not.toBeNull();
    });

    it('does not require explanation for "Unsure" when removed from config', () => {
      const noOnly = ['No'];
      const responses = { comfortable: 'Unsure', heard: 'Yes' };
      expect(validateResponses(responses, questions, noOnly)).toBeNull();
    });

    it('allows all answers without explanation when config is empty', () => {
      const responses = { comfortable: 'No', heard: 'Unsure' };
      expect(validateResponses(responses, questions, [])).toBeNull();
    });
  });
});
