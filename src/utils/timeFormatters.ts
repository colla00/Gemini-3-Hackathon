// Time-related formatting utilities

/**
 * Formats a number of minutes into a relative time string (e.g., "~2h", "Just now")
 */
export const formatRelativeTime = (minutes: number): string => {
  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '~1h';
  if (minutes < 60) return `~${minutes}h`;
  if (minutes < 120) return '~1h';
  return `~${Math.floor(minutes / 60)}h`;
};

/**
 * Formats a timestamp into a human-readable "time ago" string
 */
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
};
