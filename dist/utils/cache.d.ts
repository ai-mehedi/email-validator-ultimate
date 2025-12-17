/**
 * LRU Cache implementation for email validation results
 * Improves performance for repeated validations
 */
export interface CacheOptions {
    maxSize?: number;
    ttl?: number;
}
export declare class ValidationCache<T> {
    private cache;
    private maxSize;
    private ttl;
    constructor(options?: CacheOptions);
    /**
     * Get value from cache
     */
    get(key: string): T | undefined;
    /**
     * Set value in cache
     */
    set(key: string, value: T): void;
    /**
     * Check if key exists and is not expired
     */
    has(key: string): boolean;
    /**
     * Delete specific key
     */
    delete(key: string): boolean;
    /**
     * Clear all cache entries
     */
    clear(): void;
    /**
     * Get current cache size
     */
    size(): number;
    /**
     * Get cache statistics
     */
    stats(): {
        size: number;
        maxSize: number;
        ttl: number;
    };
    /**
     * Clean up expired entries
     */
    cleanup(): number;
}
/**
 * Get or create global validation cache
 */
export declare function getGlobalCache<T>(options?: CacheOptions): ValidationCache<T>;
/**
 * Reset global cache
 */
export declare function resetGlobalCache(): void;
/**
 * Create a cache key from email and options
 */
export declare function createCacheKey(email: string, options?: Record<string, unknown>): string;
