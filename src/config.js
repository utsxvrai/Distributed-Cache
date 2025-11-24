import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configuration validator and loader
 * Loads and validates environment variables
 */
class Config {
  constructor() {
    // Redis Configuration
    this.redisEnabled = process.env.REDIS_ENABLED === 'true';
    this.redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    // Cache Configuration
    this.defaultTTL = this._parseNumber(process.env.DEFAULT_TTL, 3600);

    // Scheduler Configuration
    this.schedulerEnabled = process.env.SCHEDULER_ENABLED !== 'false'; // Default true
    this.schedulerCron = process.env.SCHEDULER_CRON || '*/1 * * * *';

    // Logging
    this.logLevel = process.env.LOG_LEVEL || 'info';

    // Application
    this.port = this._parseNumber(process.env.PORT, 8080);
    this.nodeEnv = process.env.NODE_ENV || 'development';

    this._validate();
    this._printConfig();
  }

  /**
   * Parse number from string with default
   * @private
   */
  _parseNumber(value, defaultValue) {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Validate configuration
   * @private
   */
  _validate() {
    if (this.redisEnabled && !this.redisUrl) {
      throw new Error('REDIS_URL must be provided when REDIS_ENABLED=true');
    }

    if (this.defaultTTL < 1) {
      throw new Error('DEFAULT_TTL must be greater than 0');
    }

    if (this.port < 1 || this.port > 65535) {
      throw new Error('PORT must be between 1 and 65535');
    }
  }

  /**
   * Print configuration (without sensitive data)
   * @private
   */
  _printConfig() {
    console.log('='.repeat(50));
    console.log('📋 Configuration Loaded');
    console.log('='.repeat(50));
    console.log(`Environment: ${this.nodeEnv}`);
    console.log(`Port: ${this.port}`);
    console.log(`Redis Enabled: ${this.redisEnabled}`);
    if (this.redisEnabled) {
      // Hide password in URL for logging
      const sanitizedUrl = this.redisUrl.replace(/:([^@]+)@/, ':***@');
      console.log(`Redis URL: ${sanitizedUrl}`);
    }
    console.log(`Default TTL: ${this.defaultTTL}s`);
    console.log(`Scheduler Enabled: ${this.schedulerEnabled}`);
    console.log(`Scheduler Cron: ${this.schedulerCron}`);
    console.log(`Log Level: ${this.logLevel}`);
    console.log('='.repeat(50));
  }
}

// Export singleton instance
const config = new Config();
export default config;
