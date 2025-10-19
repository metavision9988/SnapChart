import { describe, it, expect, vi } from 'vitest';
import { formatDuration, formatTimestamp, timeDiff, delay, isExpired } from './time';

describe('formatDuration', () => {
  it('should format milliseconds under 1 second', () => {
    expect(formatDuration(500)).toBe('500ms');
    expect(formatDuration(0)).toBe('0ms');
    expect(formatDuration(999)).toBe('999ms');
  });

  it('should format seconds', () => {
    expect(formatDuration(1000)).toBe('1.0s');
    expect(formatDuration(1500)).toBe('1.5s');
    expect(formatDuration(2345)).toBe('2.3s');
  });

  it('should format large durations', () => {
    expect(formatDuration(60000)).toBe('60.0s');
  });
});

describe('formatTimestamp', () => {
  it('should format current date by default', () => {
    const result = formatTimestamp();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  });

  it('should format provided date', () => {
    const date = new Date('2025-01-15T12:00:00.000Z');
    const result = formatTimestamp(date);
    expect(result).toBe('2025-01-15T12:00:00.000Z');
  });
});

describe('timeDiff', () => {
  it('should calculate difference between two dates', () => {
    const start = new Date('2025-01-15T12:00:00.000Z');
    const end = new Date('2025-01-15T12:00:05.000Z');
    expect(timeDiff(start, end)).toBe(5000);
  });

  it('should use current time if end is not provided', () => {
    const start = new Date(Date.now() - 1000); // 1 second ago
    const diff = timeDiff(start);
    expect(diff).toBeGreaterThanOrEqual(1000);
    expect(diff).toBeLessThan(1100); // Allow 100ms variance
  });

  it('should return negative for end before start', () => {
    const start = new Date('2025-01-15T12:00:05.000Z');
    const end = new Date('2025-01-15T12:00:00.000Z');
    expect(timeDiff(start, end)).toBe(-5000);
  });
});

describe('delay', () => {
  it('should delay execution', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(100);
    expect(elapsed).toBeLessThan(150); // Allow 50ms variance
  });

  it('should resolve promise', async () => {
    const result = await delay(10);
    expect(result).toBeUndefined();
  });
});

describe('isExpired', () => {
  it('should return false for non-expired timestamps', () => {
    const timestamp = Date.now();
    const ttl = 60000; // 1 minute
    expect(isExpired(timestamp, ttl)).toBe(false);
  });

  it('should return true for expired timestamps', () => {
    const timestamp = Date.now() - 60000; // 1 minute ago
    const ttl = 30000; // 30 seconds TTL
    expect(isExpired(timestamp, ttl)).toBe(true);
  });

  it('should handle edge case at exact expiration', () => {
    const timestamp = Date.now() - 60001; // Slightly more than TTL
    const ttl = 60000;
    // Should be expired (current time > timestamp + ttl)
    expect(isExpired(timestamp, ttl)).toBe(true);
  });

  it('should work with different TTL values', () => {
    const timestamp = Date.now() - 5000; // 5 seconds ago
    expect(isExpired(timestamp, 10000)).toBe(false); // 10s TTL
    expect(isExpired(timestamp, 3000)).toBe(true);   // 3s TTL
  });
});
