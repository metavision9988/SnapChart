import { describe, it, expect } from 'vitest';
import { generateCacheKey, generateId, generateShortHash } from './hash';

describe('generateCacheKey', () => {
  it('should generate consistent keys for same input', () => {
    const key1 = generateCacheKey('flowchart', 'test prompt');
    const key2 = generateCacheKey('flowchart', 'test prompt');
    expect(key1).toBe(key2);
  });

  it('should generate different keys for different types', () => {
    const key1 = generateCacheKey('flowchart', 'test prompt');
    const key2 = generateCacheKey('sequence', 'test prompt');
    expect(key1).not.toBe(key2);
  });

  it('should generate different keys for different prompts', () => {
    const key1 = generateCacheKey('flowchart', 'test prompt 1');
    const key2 = generateCacheKey('flowchart', 'test prompt 2');
    expect(key1).not.toBe(key2);
  });

  it('should trim whitespace from prompt', () => {
    const key1 = generateCacheKey('flowchart', 'test prompt');
    const key2 = generateCacheKey('flowchart', '  test prompt  ');
    expect(key1).toBe(key2);
  });

  it('should return a hex string', () => {
    const key = generateCacheKey('flowchart', 'test');
    expect(key).toMatch(/^[0-9a-f]+$/);
  });
});

describe('generateId', () => {
  it('should generate valid UUIDs', () => {
    const id = generateId();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    expect(id).toMatch(uuidRegex);
  });

  it('should generate unique IDs', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });
});

describe('generateShortHash', () => {
  it('should generate hash of specified length', () => {
    const hash = generateShortHash('test input', 8);
    expect(hash).toHaveLength(8);
  });

  it('should default to length 8', () => {
    const hash = generateShortHash('test input');
    expect(hash).toHaveLength(8);
  });

  it('should generate consistent hashes for same input', () => {
    const hash1 = generateShortHash('test input');
    const hash2 = generateShortHash('test input');
    expect(hash1).toBe(hash2);
  });

  it('should generate different hashes for different inputs', () => {
    const hash1 = generateShortHash('input 1');
    const hash2 = generateShortHash('input 2');
    expect(hash1).not.toBe(hash2);
  });

  it('should return hex characters', () => {
    const hash = generateShortHash('test');
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });
});
