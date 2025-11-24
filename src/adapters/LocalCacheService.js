/**
 * LocalCacheService - In-memory caching adapter
 * Uses JavaScript Map for storage with TTL support
 * 
 * Features:
 * - TTL-based expiration
 * - Hit/Miss/Eviction statistics
 * - No external dependencies
 */
export default class LocalCacheService {
    constructor() {
        this.cache = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0,
            sets: 0
        };
        console.log('[LocalCache] Initialized');
    }

    /**
     * Check if a cache entry is expired
     * @private
     */
    _isExpired(entry) {
        return Date.now() > entry.expiresAt;
    }

    /**
     * Get a value from cache
     * @param {string} key - Cache key
     * @returns {any|null} Cached value or null if not found/expired
     */
    async get(key) {
        const entry = this.cache.get(key);

        if (!entry) {
            this.stats.misses++;
            console.log(`[LocalCache] MISS: ${key}`);
            return null;
        }

        if (this._isExpired(entry)) {
            this.cache.delete(key);
            this.stats.evictions++;
            this.stats.misses++;
            console.log(`[LocalCache] EXPIRED: ${key}`);
            return null;
        }

        this.stats.hits++;
        console.log(`[LocalCache] HIT: ${key}`);
        return entry.value;
    }

    /**
     * Set a value in cache with TTL
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttl - Time to live in seconds
     */
    async set(key, value, ttl = 3600) {
        const expiresAt = Date.now() + (ttl * 1000);

        this.cache.set(key, {
            value,
            expiresAt,
            createdAt: Date.now()
        });

        this.stats.sets++;
        console.log(`[LocalCache] SET: ${key} (TTL: ${ttl}s)`);
    }

    /**
     * Delete a key from cache
     * @param {string} key - Cache key
     * @returns {boolean} True if deleted, false if not found
     */
    async delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.stats.evictions++;
            console.log(`[LocalCache] DELETE: ${key}`);
        }
        return deleted;
    }

    /**
     * Get cache statistics
     * @returns {object} Statistics object
     */
    getStats() {
        return {
            type: 'local',
            entries: this.cache.size,
            ...this.stats
        };
    }

    /**
     * Clean up expired entries
     * Called by scheduler
     * @returns {number} Number of cleaned entries
     */
    cleanupExpired() {
        let cleaned = 0;

        for (const [key, entry] of this.cache.entries()) {
            if (this._isExpired(entry)) {
                this.cache.delete(key);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            this.stats.evictions += cleaned;
            console.log(`[LocalCache] Cleanup: Removed ${cleaned} expired entries`);
        }

        return cleaned;
    }

    /**
     * Clear all cache entries
     */
    async clear() {
        const size = this.cache.size;
        this.cache.clear();
        console.log(`[LocalCache] CLEARED ${size} entries`);
    }
}
