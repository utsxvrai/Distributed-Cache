# CacheFlow

> Simple and powerful caching for Node.js. Local memory and Redis made easy.

[![NPM Version](https://img.shields.io/npm/v/cacheflow.svg)](https://www.npmjs.com/package/cacheflow)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Quick Start

```bash
npm install cacheflow
```

```javascript
import { createCache } from 'cacheflow';

// Create cache
const cache = await createCache();

// Cache your data - it's that simple!
const user = await cache.getOrFetch('user:123', async () => {
  return await database.getUser(123);
});
```

## Features

- 🚀 **Simple** - 3 lines to get started
- ⚡ **Fast** - In-memory Map-based caching
- 📈 **Scalable** - Add Redis when you need it
- 🛡️ **Production Ready** - Auto-reconnect, health checks, graceful shutdown
- 🔄 **Smart Failover** - Automatic Redis → Local fallback
- 🧹 **Auto Cleanup** - Scheduled expiration management

## Documentation

📚 **[Full Documentation](https://your-docs-url.com)** - Visit our documentation website for:

- Getting Started Guide
- Complete API Reference  
- Real-world Examples
- Docker Setup Guide
- Why CacheFlow?

## Quick Links

- [GitHub Repository](https://github.com/utsxvrai/Distributed-Cache)
- [NPM Package](https://www.npmjs.com/package/cacheflow)
- [Documentation](https://your-docs-url.com)
- [Issues](https://github.com/utsxvrai/Distributed-Cache/issues)

## Configuration

Create a `.env` file:

```bash
# Optional - defaults to local cache
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379
DEFAULT_TTL=3600
```

## Docker

```bash
docker-compose up -d
```

See [Docker Guide](https://your-docs-url.com/docker) for details.

## License

MIT © [Your Name](https://github.com/utsxvrai)

---

Made with ❤️ by developers, for developers
