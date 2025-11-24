import LocalCacheService from './adapters/LocalCacheService.js';
import RedisCacheService from './adapters/RedisCacheService.js';

/**
 * CacheServiceWrapper - Universal caching orchestrator
 * 
 * Features:
 * - Unified API for local and Redis caching
 * - Cache-aside pattern with getOrFetch()
 * - Automatic failover: Redis → Local
 * - Comprehensive statistics tracking
 * 
 * @example
 * const cache = new CacheServiceWrapper({ 
 *   redisUrl: 'redis://localhost:6379',
 *   ttl: 3600 
 * });
 * await cache.initialize();
 * await cache.set('key', { data: 'value' });
 * const value = await cache.get('key');
 */
export default class CacheServiceWrapper {
    constructor({ redisUrl = null, ttl = 3600 } = {}) {
        this.defaultTTL = ttl;
        this.redisUrl = redisUrl;
        this.redisEnabled = !!redisUrl;

        this.localCache = new LocalCacheService();
        this.redisCache = null;

        this.globalStats = {
            localHits: 0,
            localMisses: 0,
            redisHits: 0,
            redisMisses: 0,
            totalRequests: 0
        };

        console.log('[CacheWrapper] Initialized', {
            redisEnabled: this.redisEnabled,
            defaultTTL: this.defaultTTL
        });
    }

    /**
     * Initialize cache services
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.redisEnabled) {
            try {
                console.log('[CacheWrapper] Initializing Redis cache...');
                this.redisCache = new RedisCacheService(this.redisUrl);
                await this.redisCache.connect();
                console.log('[CacheWrapper] ✓ Redis cache active');
            } catch (error) {
                console.error('[CacheWrapper] Redis initialization failed, using local cache');
                console.error('[CacheWrapper] Error:', error.message);
                this.redisEnabled = false;
                this.redisCache = null;
            }
        } else {
            console.log('[CacheWrapper] ✓ Local cache active (Redis disabled)');
        }
    }

    /**
     * Get a value from cache
     * Flow: Redis (if enabled) → Local → null
     * 
     * @param {string} key - Cache key
     * @returns {Promise<any|null>} Cached value or null
     */
    async get(key) {
        this.globalStats.totalRequests++;

        // Try Redis first if enabled
        if (this.redisEnabled && this.redisCache) {
            try {
                const value = await this.redisCache.get(key);
                if (value !== null) {
                    this.globalStats.redisHits++;

                    // Hydrate local cache
                    await this.localCache.set(key, value, this.defaultTTL);

                    return value;
                }
                this.globalStats.redisMisses++;
            } catch (error) {
                console.error('[CacheWrapper] Redis GET failed, trying local:', error.message);
            }
        }

        // Fallback to local cache
        const value = await this.localCache.get(key);
        if (value !== null) {
            this.globalStats.localHits++;
        } else {
            this.globalStats.localMisses++;
        }

        return value;
    }

    /**
     * Set a value in cache
     * Writes to both Redis (if enabled) and local cache
     * 
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} [ttl] - Time to live in seconds (optional)
     */
    async set(key, value, ttl = this.defaultTTL) {
        // Set in local cache
        await this.localCache.set(key, value, ttl);

        // Set in Redis if enabled
        if (this.redisEnabled && this.redisCache) {
            try {
                await this.redisCache.set(key, value, ttl);
            } catch (error) {
                console.error('[CacheWrapper] Redis SET failed:', error.message);
            }
        }
    }

    /**
     * Delete a key from cache
     * Removes from both Redis and local cache
     * 
     * @param {string} key - Cache key
     * @returns {Promise<boolean>} True if deleted
     */
    async delete(key) {
        let deleted = false;

        // Delete from local
        deleted = await this.localCache.delete(key) || deleted;

        // Delete from Redis if enabled
        if (this.redisEnabled && this.redisCache) {
            try {
                deleted = await this.redisCache.delete(key) || deleted;
            } catch (error) {
                console.error('[CacheWrapper] Redis DELETE failed:', error.message);
            }
        }

        return deleted;
    }

    /**
     * Cache-aside pattern: Get from cache or fetch and store
     * 
     * @param {string} key - Cache key
     * @param {Function} asyncFn - Async function to fetch data if not cached
     * @param {number} [ttl] - Time to live in seconds (optional)
     * @returns {Promise<any>} Cached or fetched value
     * 
     * @example
     * const userData = await cache.getOrFetch('user:123', async () => {
     *   return await fetchUserFromDB(123);
     * }, 600);
     */
    async getOrFetch(key, asyncFn, ttl = this.defaultTTL) {
        // Try to get from cache
        const cached = await this.get(key);
        if (cached !== null) {
            return cached;
        }

        // Cache miss - fetch data
        console.log(`[CacheWrapper] Cache miss for ${key}, fetching...`);
        const value = await asyncFn();

        // Store in cache
        await this.set(key, value, ttl);

        return value;
    }

    /**
     * Get comprehensive statistics
     * @returns {Promise<object>} Statistics from all cache layers
     */
    async stats() {
        const localStats = this.localCache.getStats();

        let redisStats = null;
        if (this.redisEnabled && this.redisCache) {
            redisStats = await this.redisCache.getStats();
        }

        return {
            mode: this.redisEnabled ? 'redis+local' : 'local-only',
            global: this.globalStats,
            local: localStats,
            redis: redisStats
        };
    }

    /**
     * Cleanup expired entries in local cache
     * Called by scheduler
     */
    cleanupExpired() {
        return this.localCache.cleanupExpired();
    }

    /**
     * Shutdown cache services gracefully
     */
    async shutdown() {
        if (this.redisEnabled && this.redisCache) {
            await this.redisCache.disconnect();
        }
        console.log('[CacheWrapper] Shutdown complete');
    }
}
