/**
 * Format a date to a readable string (e.g., "Jan 1, 2023")
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a time to a readable string (e.g., "2:30 PM")
 */
export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format a date and time to a readable string (e.g., "Jan 1, 2023 at 2:30 PM")
 */
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return `${formatDate(d)} at ${formatTime(d)}`;
};

/**
 * Get a relative time string (e.g., "2 hours ago", "just now", "in 3 days")
 */
export const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < -60) {
    if (diffMin > -60) return `${Math.abs(diffMin)} minute${Math.abs(diffMin) !== 1 ? 's' : ''} ago`;
    if (diffHour > -24) return `${Math.abs(diffHour)} hour${Math.abs(diffHour) !== 1 ? 's' : ''} ago`;
    if (diffDay > -30) return `${Math.abs(diffDay)} day${Math.abs(diffDay) !== 1 ? 's' : ''} ago`;
    return formatDate(d);
  } else if (diffSec > 60) {
    if (diffMin < 60) return `in ${diffMin} minute${diffMin !== 1 ? 's' : ''}`;
    if (diffHour < 24) return `in ${diffHour} hour${diffHour !== 1 ? 's' : ''}`;
    if (diffDay < 30) return `in ${diffDay} day${diffDay !== 1 ? 's' : ''}`;
    return formatDate(d);
  } else {
    return 'just now';
  }
};

/**
 * Format a countdown timer (e.g., "01:30:45" for 1 hour, 30 minutes, 45 seconds)
 */
export const formatCountdown = (endTime: Date | string): string => {
  const end = new Date(endTime);
  const now = new Date();
  
  // If the end time is in the past, return "00:00:00"
  if (end <= now) {
    return '00:00:00';
  }
  
  const diffMs = end.getTime() - now.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
}; 