import crypto from 'crypto';

/**
 * Generates a SHA-256 hash for cache keys
 */
export function generateCacheKey(type: string, prompt: string): string {
  const input = `${type}:${prompt.trim()}`;
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Generates a unique ID for diagrams
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Generates a short hash for display purposes
 */
export function generateShortHash(input: string, length = 8): string {
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, length);
}
