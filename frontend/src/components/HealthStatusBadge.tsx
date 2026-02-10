import type { HealthStatus } from '../types';
import { getHealthColor } from '../config/color-mappings';

interface HealthStatusBadgeProps {
  status: HealthStatus;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

/**
 * Health status indicator dot with optional score
 * - Green: Healthy conversation
 * - Yellow: Needs monitoring (approaching thresholds)
 * - Red: Needs attention (has issues)
 */
export default function HealthStatusBadge({
  status,
  score,
  showScore = false,
  size = 'sm',
  pulse = true,
}: HealthStatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5';
  const colorClass = getHealthColor(status);

  // Pulse animation only for red status
  const pulseClass = pulse && status === 'red' ? 'animate-pulse' : '';

  return (
    <span className="inline-flex items-center gap-1.5" title={`Health: ${status}${score !== undefined ? ` (${score}%)` : ''}`}>
      <span className={`${sizeClasses} ${colorClass} ${pulseClass} rounded-full inline-block`} />
      {showScore && score !== undefined && (
        <span className="text-xs text-slate-500">{score}%</span>
      )}
    </span>
  );
}
