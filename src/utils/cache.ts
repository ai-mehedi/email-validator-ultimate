/**
 * LRU Cache implementation for email validation results
 * Improves performance for repeated validations
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

export interface CacheOptions {
  maxSize?: number;      // Maximum number of entries (default: 1000)
  ttl?: number;          // Time-to-live in milliseconds (default: 5 minutes)
}

export class ValidationCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;
  private ttl: number;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes default
  }

  /**
   * Get value from cache
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T): void {
    // Remove oldest entry if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Delete specific key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; maxSize: number; ttl: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }
}

// Global cache instance for email validation results
let globalCache: ValidationCache<unknown> | null = null;

/**
 * Get or create global validation cache
 */
export function getGlobalCache<T>(options?: CacheOptions): ValidationCache<T> {
  if (!globalCache) {
    globalCache = new ValidationCache<T>(options);
  }
  return globalCache as ValidationCache<T>;
}

/**
 * Reset global cache
 */
export function resetGlobalCache(): void {
  if (globalCache) {
    globalCache.clear();
  }
  globalCache = null;
}

/**
 * Create a cache key from email and options
 */
export function createCacheKey(email: string, options: Record<string, unknown> = {}): string {
  const sortedOptions = Object.keys(options)
    .sort()
    .map(key => `${key}:${options[key]}`)
    .join('|');
  return `${email.toLowerCase()}|${sortedOptions}`;
}
