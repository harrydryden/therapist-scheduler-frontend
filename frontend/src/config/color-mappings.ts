/**
 * Centralized color mappings for badges and status indicators
 * Single source of truth for consistent UI theming
 * Uses Spill color palette (spill-blue, spill-teal, spill-yellow, spill-red, spill-grey)
 */

// Appointment status badge colors
export const STATUS_BADGE_COLORS: Record<string, string> = {
  pending: 'bg-spill-yellow-100 text-spill-yellow-600',
  contacted: 'bg-spill-blue-100 text-spill-blue-800',
  negotiating: 'bg-spill-blue-200 text-spill-blue-900',
  confirmed: 'bg-spill-teal-100 text-spill-teal-600',
  cancelled: 'bg-spill-red-100 text-spill-red-600',
} as const;

// Knowledge base audience colors
export const AUDIENCE_BADGE_COLORS: Record<string, string> = {
  therapist: 'bg-spill-blue-200 text-spill-blue-900',
  user: 'bg-spill-blue-100 text-spill-blue-800',
  both: 'bg-spill-teal-100 text-spill-teal-600',
} as const;

// Priority level colors
export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-spill-grey-100 text-spill-grey-600',
  medium: 'bg-spill-yellow-100 text-spill-yellow-600',
  high: 'bg-spill-red-200 text-spill-red-600',
  urgent: 'bg-spill-red-400 text-spill-white',
} as const;

// Common badge styles for labels/tags
export const TAG_COLORS = {
  default: 'bg-spill-grey-100 text-spill-grey-600',
  custom: 'bg-spill-blue-100 text-spill-blue-800',
  inactive: 'bg-spill-grey-200 text-spill-grey-600',
  warning: 'bg-spill-yellow-200 text-spill-yellow-600',
  success: 'bg-spill-teal-100 text-spill-teal-600',
  error: 'bg-spill-red-100 text-spill-red-600',
  info: 'bg-spill-blue-100 text-spill-blue-800',
  human: 'bg-spill-yellow-400 text-spill-grey-600',
  stale: 'bg-spill-red-100 text-spill-red-600',
} as const;

// Utility function to get status color with fallback
export function getStatusColor(status: string): string {
  return STATUS_BADGE_COLORS[status] || 'bg-slate-100 text-slate-800';
}

// Utility function to get audience color with fallback
export function getAudienceColor(audience: string): string {
  return AUDIENCE_BADGE_COLORS[audience] || 'bg-slate-100 text-slate-800';
}
