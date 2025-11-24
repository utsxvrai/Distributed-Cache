import schedule from 'node-schedule';
import config from './config.js';

/**
 * CacheScheduler - Scheduled cleanup of expired cache entries
 * 
 * Features:
 * - Runs on configurable cron schedule
 * - Only active when using local cache (Redis handles TTL automatically)
 * - Configurable via environment variables
 */
class CacheScheduler {
    constructor(cacheWrapper) {
        this.cacheWrapper = cacheWrapper;
        this.job = null;
        this.enabled = config.schedulerEnabled && !config.redisEnabled;
        this.cronPattern = config.schedulerCron;
    }

    /**
     * Start the cleanup scheduler
     */
    start() {
        if (!this.enabled) {
            console.log('[Scheduler] Disabled (Redis mode or scheduler disabled in config)');
            return;
        }

        console.log(`[Scheduler] Starting cleanup schedule: ${this.cronPattern}`);

        this.job = schedule.scheduleJob(this.cronPattern, () => {
            console.log('[Scheduler] Running cleanup...');
            const cleaned = this.cacheWrapper.cleanupExpired();

            if (cleaned === 0) {
                console.log('[Scheduler] No expired entries found');
            }
        });

        console.log('[Scheduler] ✓ Active');
    }

    /**
     * Stop the scheduler
     */
    stop() {
        if (this.job) {
            this.job.cancel();
            console.log('[Scheduler] Stopped');
        }
    }

    /**
     * Get scheduler status
     */
    getStatus() {
        return {
            enabled: this.enabled,
            cronPattern: this.cronPattern,
            nextRun: this.job ? this.job.nextInvocation() : null
        };
    }
}

export default CacheScheduler;
