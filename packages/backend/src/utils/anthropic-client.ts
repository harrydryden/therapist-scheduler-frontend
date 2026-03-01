/**
 * Shared Anthropic Client Singleton
 *
 * Provides a single Anthropic client instance for the entire application,
 * along with shared retry utilities (isTransientError, addJitter) used
 * by both ai.service.ts and justin-time.service.ts.
 *
 * This eliminates duplicate client instantiations and duplicated retry
 * helper functions across services.
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  RateLimitError,
  APIConnectionError,
  APIConnectionTimeoutError,
  InternalServerError,
  APIError,
} from '@anthropic-ai/sdk';
import { config } from '../config';
import { TIMEOUTS, CLAUDE_API } from '../constants';

/**
 * Singleton Anthropic client instance.
 * Configured with the API-level timeout from constants.
 */
export const anthropicClient = new Anthropic({
  apiKey: config.anthropicApiKey,
  timeout: TIMEOUTS.ANTHROPIC_API_MS,
});

/**
 * Check if an error from the Anthropic API is transient and should be retried.
 * Transient errors include connection issues and 5xx server errors.
 */
export function isTransientError(error: unknown): boolean {
  if (error instanceof APIConnectionError || error instanceof APIConnectionTimeoutError) {
    return true;
  }
  if (error instanceof InternalServerError) {
    return true;
  }
  if (error instanceof APIError && typeof error.status === 'number') {
    return error.status >= 500 && error.status < 600;
  }
  return false;
}

/**
 * Add random jitter to a delay to prevent thundering herd.
 *
 * @param delayMs - Base delay in milliseconds
 * @param jitterFactor - Fraction of delay to add as jitter (default: CLAUDE_API.JITTER_FACTOR)
 * @returns Delay with jitter applied
 */
export function addJitter(delayMs: number, jitterFactor: number = CLAUDE_API.JITTER_FACTOR): number {
  const jitter = delayMs * jitterFactor * Math.random();
  return Math.floor(delayMs + jitter);
}

// Re-export error types for convenience so consumers don't need direct SDK imports
export {
  RateLimitError,
  APIConnectionError,
  APIConnectionTimeoutError,
  InternalServerError,
  APIError,
};
