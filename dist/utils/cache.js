"use strict";
/**
 * LRU Cache implementation for email validation results
 * Improves performance for repeated validations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationCache = void 0;
exports.getGlobalCache = getGlobalCache;
exports.resetGlobalCache = resetGlobalCache;
exports.createCacheKey = createCacheKey;
class ValidationCache {
    constructor(options = {}) {
        this.cache = new Map();
        this.maxSize = options.maxSize || 1000;
        this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes default
    }
    /**
     * Get value from cache
     */
    get(key) {
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
    set(key, value) {
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
    has(key) {
        return this.get(key) !== undefined;
    }
    /**
     * Delete specific key
     */
    delete(key) {
        return this.cache.delete(key);
    }
    /**
     * Clear all cache entries
     */
    clear() {
        this.cache.clear();
    }
    /**
     * Get current cache size
     */
    size() {
        return this.cache.size;
    }
    /**
     * Get cache statistics
     */
    stats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            ttl: this.ttl,
        };
    }
    /**
     * Clean up expired entries
     */
    cleanup() {
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
exports.ValidationCache = ValidationCache;
// Global cache instance for email validation results
let globalCache = null;
/**
 * Get or create global validation cache
 */
function getGlobalCache(options) {
    if (!globalCache) {
        globalCache = new ValidationCache(options);
    }
    return globalCache;
}
/**
 * Reset global cache
 */
function resetGlobalCache() {
    if (globalCache) {
        globalCache.clear();
    }
    globalCache = null;
}
/**
 * Create a cache key from email and options
 */
function createCacheKey(email, options = {}) {
    const sortedOptions = Object.keys(options)
        .sort()
        .map(key => `${key}:${options[key]}`)
        .join('|');
    return `${email.toLowerCase()}|${sortedOptions}`;
}
