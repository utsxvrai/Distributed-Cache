import CacheServiceWrapper from './CacheServiceWrapper.js';
import CacheScheduler from './CacheScheduler.js';
import config from './config.js';

let schedulerInstance = null;

/**
 * Create and initialize cache with optional scheduler
 * @param {object} options - Cache configuration
 * @param {string} [options.redisUrl] - Redis connection URL
 * @param {number} [options.ttl=3600] - Default TTL in seconds
 * @returns {CacheServiceWrapper} Initialized cache instance
 */
export async function createCache(options = {}) {
  const cacheOptions = {
    redisUrl: options.redisUrl || (config.redisEnabled ? config.redisUrl : null),
    ttl: options.ttl || config.defaultTTL
  };

  const cache = new CacheServiceWrapper(cacheOptions);
  await cache.initialize();

  // Initialize scheduler if enabled
  if (config.schedulerEnabled && !config.redisEnabled) {
    schedulerInstance = new CacheScheduler(cache);
    schedulerInstance.start();
  }

  return cache;
}

/**
 * Get scheduler instance
 * @returns {CacheScheduler|null}
 */
export function getScheduler() {
  return schedulerInstance;
}

/**
 * Shutdown cache and scheduler gracefully
 * @param {CacheServiceWrapper} cache - Cache instance
 */
export async function shutdownCache(cache) {
  if (schedulerInstance) {
    schedulerInstance.stop();
  }
  await cache.shutdown();
}

// Export main class for direct usage
export { CacheServiceWrapper };
export default CacheServiceWrapper;
