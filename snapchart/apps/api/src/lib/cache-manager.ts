/**
 * Simple in-memory cache manager
 * Will be replaced with Redis for production
 */

import type { CacheEntry } from '@snapchart/types';
import { generateCacheKey } from '@snapchart/utils';

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set(key: string, value: any, ttlSeconds: number = 86400): Promise<void> {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  // Cleanup expired entries periodically
  startCleanup(intervalMs: number = 60000) {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          this.cache.delete(key);
        }
      }
    }, intervalMs);
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export class CacheManager {
  private cache: MemoryCache;

  constructor() {
    this.cache = new MemoryCache();
    this.cache.startCleanup();
  }

  async get<T>(key: string): Promise<T | null> {
    return this.cache.get<T>(key);
  }

  async set(key: string, value: any, ttl: number = 86400): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  generateKey(type: string, prompt: string): string {
    return generateCacheKey(type, prompt);
  }

  async clear(): Promise<void> {
    await this.cache.clear();
  }

  getStats() {
    return this.cache.getStats();
  }
}

// Singleton instance
export const cacheManager = new CacheManager();
