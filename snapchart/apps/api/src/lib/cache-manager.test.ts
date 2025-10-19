import { describe, it, expect, beforeEach } from 'vitest';
import { CacheManager } from './cache-manager';

describe('CacheManager', () => {
  let cache: CacheManager;

  beforeEach(() => {
    cache = new CacheManager();
  });

  describe('set and get', () => {
    it('should store and retrieve values', async () => {
      await cache.set('test-key', 'test-value');
      const result = await cache.get('test-key');
      expect(result).toBe('test-value');
    });

    it('should store objects', async () => {
      const obj = { id: '123', name: 'Test' };
      await cache.set('obj-key', obj);
      const result = await cache.get('obj-key');
      expect(result).toEqual(obj);
    });

    it('should return null for non-existent keys', async () => {
      const result = await cache.get('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('TTL expiration', () => {
    it('should expire values after TTL', async () => {
      await cache.set('expire-key', 'value', 1); // 1 second TTL

      // Should exist immediately
      const before = await cache.get('expire-key');
      expect(before).toBe('value');

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Should be expired
      const after = await cache.get('expire-key');
      expect(after).toBeNull();
    });

    it('should use default TTL of 24 hours', async () => {
      await cache.set('default-ttl', 'value');
      const result = await cache.get('default-ttl');
      expect(result).toBe('value');
    });
  });

  describe('generateKey', () => {
    it('should generate consistent keys', () => {
      const key1 = cache.generateKey('flowchart', 'test prompt');
      const key2 = cache.generateKey('flowchart', 'test prompt');
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different inputs', () => {
      const key1 = cache.generateKey('flowchart', 'prompt1');
      const key2 = cache.generateKey('flowchart', 'prompt2');
      expect(key1).not.toBe(key2);
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');

      await cache.clear();

      const result1 = await cache.get('key1');
      const result2 = await cache.get('key2');

      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');

      const stats = cache.getStats();

      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });

    it('should return zero size for empty cache', () => {
      const stats = cache.getStats();
      expect(stats.size).toBe(0);
      expect(stats.keys).toHaveLength(0);
    });
  });
});
