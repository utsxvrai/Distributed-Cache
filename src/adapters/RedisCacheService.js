import { createClient } from 'redis';

/**
 * RedisCacheService - Distributed caching adapter using Redis
 * 
 * Features:
 * - Redis URL support (redis://username:password@host:port)
 * - Auto-reconnect logic
 * - Health checks
 * - SETEX for TTL
 */
export default class RedisCacheService {
  constructor(redisUrl) {
    this.redisUrl = redisUrl;
    this.client = null;
    this.isConnected = false;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }

  /**
   * Connect to Redis server
   */
  async connect() {
    if (this.isConnected) {
      return;
    }

    try {
      this.client = createClient({
        url: this.redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.error('[RedisCache] Max reconnection attempts reached');
              return new Error('Max reconnection attempts');
            }
            const delay = Math.min(retries * 100, 3000);
            console.log(`[RedisCache] Reconnecting in ${delay}ms (attempt ${retries})`);
            return delay;
          }
        }
      });

      // Event handlers
      this.client.on('connect', () => {
        console.log('[RedisCache] Connecting...');
      });

      this.client.on('ready', () => {
        console.log('[RedisCache] ✓ Connected and ready');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        console.error('[RedisCache] Error:', err.message);
      });

      this.client.on('reconnecting', () => {
        console.log('[RedisCache] Reconnecting...');
      });

      this.client.on('end', () => {
        console.log('[RedisCache] Connection closed');
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      console.error('[RedisCache] Connection failed:', error.message);
      throw error;
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      console.log('[RedisCache] Disconnected');
    }
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if not found
   */
  async get(key) {
    try {
      const value = await this.client.get(key);
      
      if (value === null) {
        this.stats.misses++;
        console.log(`[RedisCache] MISS: ${key}`);
        return null;
      }

      this.stats.hits++;
      console.log(`[RedisCache] HIT: ${key}`);
      return JSON.parse(value);
    } catch (error) {
      console.error(`[RedisCache] GET Error for ${key}:`, error.message);
      return null;
    }
  }

  /**
   * Set a value in cache with TTL using SETEX
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds
   */
  async set(key, value, ttl = 3600) {
    try {
      const serialized = JSON.stringify(value);
      await this.client.setEx(key, ttl, serialized);
      this.stats.sets++;
      console.log(`[RedisCache] SET: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      console.error(`[RedisCache] SET Error for ${key}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete a key from cache
   * @param {string} key - Cache key
   * @returns {boolean} True if deleted, false if not found
   */
  async delete(key) {
    try {
      const deleted = await this.client.del(key);
      console.log(`[RedisCache] DELETE: ${key} (${deleted ? 'success' : 'not found'})`);
      return deleted > 0;
    } catch (error) {
      console.error(`[RedisCache] DELETE Error for ${key}:`, error.message);
      return false;
    }
  }

  /**
   * Check if Redis is healthy
   * @returns {boolean} Health status
   */
  async isHealthy() {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get cache statistics
   * @returns {object} Statistics object
   */
  async getStats() {
    try {
      const dbSize = await this.client.dbSize();
      return {
        type: 'redis',
        entries: dbSize,
        connected: this.isConnected,
        ...this.stats
      };
    } catch (error) {
      return {
        type: 'redis',
        entries: 0,
        connected: false,
        ...this.stats
      };
    }
  }

  /**
   * Clear all cache entries
   */
  async clear() {
    try {
      await this.client.flushDb();
      console.log('[RedisCache] CLEARED all entries');
    } catch (error) {
      console.error('[RedisCache] CLEAR Error:', error.message);
    }
  }
}
