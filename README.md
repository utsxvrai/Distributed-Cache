# 🚀 Universal Cache

**A production-ready, universal caching library for Node.js** with seamless support for both **local in-memory** and **distributed Redis** caching strategies.

Perfect for NPM publishing, Docker deployments, and microservices architectures.

![Local Cache Architecture](C:/Users/acer/.gemini/antigravity/brain/e2360a21-1ca3-45b1-958e-b9d7521c5899/uploaded_image_2_1763968124087.png)

![Redis Distributed Cache Architecture](C:/Users/acer/.gemini/antigravity/brain/e2360a21-1ca3-45b1-958e-b9d7521c5899/uploaded_image_3_1763968124087.png)

## ✨ Features

- 🔄 **Dual Strategies**: Toggle between local and Redis with one config flag
- ⚡ **High Performance**: In-memory Map-based caching
- 🌐 **Distributed Ready**: Redis support for multi-instance apps
- 🎯 **Cache-Aside Pattern**: `getOrFetch()` for automatic fallback
- 🔌 **Adapter Pattern**: Clean separation of concerns
- 📊 **Statistics Tracking**: Hit/miss ratios and performance metrics
- ⏱️ **TTL Support**: Automatic expiration management
- 🧹 **Auto Cleanup**: Scheduled cleanup for local cache
- 🐳 **Docker Ready**: Full orchestration with NGINX
- 📦 **NPM Ready**: ES modules, publishable package
- 🔒 **Production Grade**: Error handling, reconnection logic, graceful shutdown

## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Configuration](#-configuration)
- [Docker Deployment](#-docker-deployment)
- [NGINX Reverse Proxy](#-nginx-reverse-proxy)
- [NPM Publishing](#-npm-publishing)
- [Benchmarking](#-benchmarking)

## 📦 Installation

### As NPM Package (Future)

```bash
npm install universal-cache
```

### Clone Repository

```bash
git clone <your-repo>
cd universal-cache
npm install
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { createCache } from 'universal-cache';

// Initialize cache (auto-detects from .env)
const cache = await createCache();

// Set value with TTL
await cache.set('user:123', { name: 'John', email: 'john@example.com' }, 600);

// Get value
const user = await cache.get('user:123');
console.log(user); // { name: 'John', email: 'john@example.com' }

// Delete value
await cache.delete('user:123');
```

### Cache-Aside Pattern

```javascript
// Automatically fetch if not cached
const userData = await cache.getOrFetch('user:123', async () => {
  // This function only runs on cache miss
  return await fetchUserFromDatabase(123);
}, 600); // TTL: 10 minutes
```

### Get Statistics

```javascript
const stats = await cache.stats();
console.log(stats);
/*
{
  mode: 'redis+local',
  global: {
    localHits: 45,
    localMisses: 12,
    redisHits: 123,
    redisMisses: 8,
    totalRequests: 188
  },
  local: { type: 'local', entries: 15, hits: 45, misses: 12, evictions: 3 },
  redis: { type: 'redis', entries: 42, hits: 123, misses: 8, connected: true }
}
*/
```

### Run Demo Server

```bash
# Local cache mode
npm start

# Redis mode (requires Redis running)
REDIS_ENABLED=true npm start

# Development with auto-reload
npm run dev
```

Test endpoints:
```bash
# Health check
curl http://localhost:8080/health

# Cache statistics
curl http://localhost:8080/stats

# Demo cache operation
curl http://localhost:8080/demo/mykey
```

## 🏗️ Architecture

### Overview

Universal Cache uses the **Adapter Pattern** to provide a unified caching API:

```
┌─────────────────────────────────────┐
│    CacheServiceWrapper (API)        │
│  ┌─────────────────────────────┐   │
│  │ get(), set(), delete()      │   │
│  │ getOrFetch(), stats()       │   │
│  └─────────────────────────────┘   │
└──────────┬──────────────┬───────────┘
           │              │
    ┌──────▼─────┐  ┌────▼──────┐
    │LocalCache  │  │RedisCache │
    │  Adapter   │  │  Adapter  │
    └────────────┘  └───────────┘
```

### Local Cache Strategy

**Components:**
- `LocalCacheService.js` - In-memory Map storage
- `CacheScheduler.js` - Cron-based cleanup

**When to use:**
- Single-instance applications
- Development/testing
- Low-latency requirements
- No persistence needed

**Features:**
- ✅ Zero external dependencies
- ✅ Microsecond latency
- ✅ Automatic TTL expiration
- ✅ Scheduled cleanup (every minute)

### Redis Distributed Cache Strategy

**Components:**
- `RedisCacheService.js` - Redis client adapter
- Auto-reconnection logic

**When to use:**
- Multi-instance deployments
- Microservices architecture
- Data persistence required
- Horizontal scaling

**Features:**
- ✅ Distributed across instances
- ✅ Persistence to disk
- ✅ TTL managed by Redis (SETEX)
- ✅ Connection pooling
- ✅ Auto-reconnect on failure

### Orchestration & Failover

The `CacheServiceWrapper` provides:

1. **Dual-layer Read Flow:**
   ```
   Request → Redis (check) → Found? Return
                         → Not Found? → Local (check) → Found? Return
                                                    → Not Found? null
   ```

2. **Write Flow (Both Layers):**
   ```
   set(key, value) → Redis.set() + Local.set()
   ```

3. **Failover Logic:**
   ```
   Redis fails → Automatic fallback to Local Cache
   ```

4. **Redis Hydration:**
   - On Redis hit, value is copied to local cache
   - Subsequent reads are ultra-fast from local

## 📚 API Reference

### CacheServiceWrapper

#### `constructor({ redisUrl, ttl })`

```javascript
const cache = new CacheServiceWrapper({
  redisUrl: 'redis://username:password@host:6379',
  ttl: 3600 // Default TTL in seconds
});
```

#### `async initialize()`

Initialize cache conections.

```javascript
await cache.initialize();
```

#### `async get(key)`

Get value from cache. Returns `null` if not found or expired.

```javascript
const value = await cache.get('mykey');
```

#### `async set(key, value, ttl?)`

Set value in cache with optional TTL override.

```javascript
await cache.set('mykey', { data: 'value' }, 600); // 10 minutes
```

#### `async delete(key)`

Delete key from cache.

```javascript
await cache.delete('mykey');
```

#### `async getOrFetch(key, asyncFn, ttl?)`

**Cache-aside pattern**: Get from cache or fetch using provided function.

```javascript
const data = await cache.getOrFetch('user:123', async () => {
  return await db.users.findById(123);
}, 600);
```

#### `async stats()`

Get comprehensive statistics from all cache layers.

```javascript
const stats = await cache.stats();
```

#### `async shutdown()`

Gracefully shutdown cache connections.

```javascript
await cache.shutdown();
```

## ⚙️ Configuration

All configuration via environment variables:

### `.env` File

```env
# Redis Configuration
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379

# Cache Settings
DEFAULT_TTL=3600

# Scheduler
SCHEDULER_ENABLED=true
SCHEDULER_CRON=*/1 * * * *

# Application
PORT=8080
NODE_ENV=production
LOG_LEVEL=info
```

### Configuration Options

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REDIS_ENABLED` | boolean | `false` | Enable Redis cache |
| `REDIS_URL` | string | `redis://localhost:6379` | Redis connection URL |
| `DEFAULT_TTL` | number | `3600` | Default TTL in seconds |
| `SCHEDULER_ENABLED` | boolean | `true` | Enable cleanup scheduler |
| `SCHEDULER_CRON` | string | `*/1 * * * *` | Cron pattern for cleanup |
| `PORT` | number | `8080` | HTTP server port |
| `NODE_ENV` | string | `development` | Environment mode |
| `LOG_LEVEL` | string | `info` | Logging verbosity |

## 🐳 Docker Deployment

### Project Structure

```
universal-cache/
├── src/                  # Source code
├── infra/nginx/          # NGINX config & Dockerfile
├── docker-compose.yml    # Full stack orchestration (root)
├── Dockerfile            # Node.js app
└── .env
```

### Full Stack with Docker Compose

```bash
# From project root
docker-compose up -d
```

This starts:
- **Redis** on port 6379
- **Node.js App** on port 8080
- **NGINX** on port 80 (reverse proxy)

Access via: `http://localhost`

### Architecture

```
User → NGINX:80 → Node:8080 → Cache Wrapper → Redis:6379
                                            → Local Cache
```

### Individual Containers

```bash
# Redis only
docker run -d -p 6379:6379 redis:7-alpine

# Build and run Node.js app
docker build -t universal-cache .
docker run -p 8080:8080 --env-file .env universal-cache
```

### Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Check health
docker-compose ps
```

## 🌐 NGINX Reverse Proxy

### Features

- ✅ Reverse proxy to Node.js app
- ✅ Gzip compression
- ✅ Rate limiting (commented, ready to enable)
- ✅  Static file caching
- ✅ Health check bypass
- ✅ Custom error pages

### Configuration Highlights

```nginx
# /infra/nginx/nginx.conf

upstream nodejs_backend {
    server node:8080;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://nodejs_backend;
        # Rate limiting available
        # limit_req zone=api_limit burst=20;
    }
}
```

### Enable Rate Limiting

Uncomment in `nginx.conf`:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location / {
    limit_req zone=api_limit burst=20 nodelay;
    proxy_pass http://nodejs_backend;
}
```

## 📦 NPM Publishing

### Pre-Publishing Checklist

1. **Update package.json**:
   ```json
   {
     "name": "universal-cache",
     "version": "1.0.0",
     "author": "Your Name <your.email@example.com>",
     "repository": {
       "type": "git",
       "url": "https://github.com/yourusername/universal-cache.git"
     }
   }
   ```

2. **Add LICENSE file** (MIT recommended)

3. **Test package locally**:
   ```bash
   npm pack
   # Creates universal-cache-1.0.0.tgz
   
   # Test in another project
   npm install /path/to/universal-cache-1.0.0.tgz
   ```

4. **Verify exports**:
   ```javascript
   import Cache from 'universal-cache';
   import { createCache, shutdownCache } from 'universal-cache';
   ```

### Publishing Steps

```bash
# Login to NPM
npm login

# Publish to NPM registry
npm publish

# Or publish with access
npm publish --access public
```

###Usage After Publishing

```bash
npm install universal-cache
```

```javascript
import { createCache } from 'universal-cache';

const cache = await createCache({
  redisUrl: 'redis://localhost:6379',
  ttl: 3600
});

await cache.set('key', 'value');
const value = await cache.get('key');
```

## 📊 Benchmarking

### Local Cache Performance

```bash
# Run benchmark script
node benchmark.js
```

Expected results:
- **Local cache**: < 1ms per operation
- **Redis cache**: 1-5ms per operation (network overhead)

### Load Testing

```bash
# Install Apache Bench
apt-get install apache2-utils

# Test 10,000 requests with 100 concurrent
ab -n 10000 -c 100 http://localhost:8080/demo/testkey

# View statistics
curl http://localhost:8080/stats
```

### Performance Tips

1. **Use Local Cache** for hot data and single instances
2. **Use Redis** for shared state across instances
3. **Set appropriate TTL** to balance freshness vs. hit rate
4. **Monitor hit/miss ratios** via `/stats` endpoint
5. **Tune scheduler interval** based on your TTL patterns

## 🧪 Testing

### Unit Tests (Coming Soon)

```bash
npm test
```

### Integration Testing

```bash
# Start Redis
docker-compose up -d redis

# Test local cache mode
REDIS_ENABLED=false npm start

# Test Redis mode
REDIS_ENABLED=true npm start

# Test failover (stop Redis while running)
docker stop universal-cache-redis
# App should continue with local cache
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file

## 🎓 Learn More

- [Redis Best Practices](https://redis.io/topics/best-practices)
- [Caching Strategies](https://aws.amazon.com/caching/best-practices/)
- [Node.js Performance](https://nodejs.org/en/docs/guides/simple-profiling/)

## 🆘 Support

- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/universal-cache/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/universal-cache/discussions)

---

**Made with ❤️ for the Node.js community**

Ready to publish to NPM and use in production! 🚀
