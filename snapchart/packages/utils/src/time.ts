/**
 * Formats a duration in milliseconds to a human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}

/**
 * Formats a timestamp to ISO string
 */
export function formatTimestamp(date?: Date): string {
  return (date || new Date()).toISOString();
}

/**
 * Calculates the difference between two timestamps in milliseconds
 */
export function timeDiff(start: Date, end: Date = new Date()): number {
  return end.getTime() - start.getTime();
}

/**
 * Creates a delay promise for testing or rate limiting
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks if a timestamp is expired based on TTL
 */
export function isExpired(timestamp: number, ttlMs: number): boolean {
  return Date.now() > timestamp + ttlMs;
}
