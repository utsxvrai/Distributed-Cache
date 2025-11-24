import express from 'express';
import { createCache, shutdownCache } from './index.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Initialize cache
let cache;

async function startServer() {
    try {
        cache = await createCache();

        // Root endpoint
        app.get('/', (req, res) => {
            res.json({
                service: 'Universal Cache System',
                version: '1.0.0',
                status: 'running',
                endpoints: {
                    health: '/health',
                    stats: '/stats',
                    demo: '/demo/:key'
                }
            });
        });

        // Health check
        app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString()
            });
        });

        // Cache statistics
        app.get('/stats', async (req, res) => {
            try {
                const stats = await cache.stats();
                res.json(stats);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Demo: Get or set cache
        app.get('/demo/:key', async (req, res) => {
            try {
                const { key } = req.params;
                const value = await cache.getOrFetch(key, async () => {
                    // Simulate fetching data
                    return {
                        key,
                        value: `Generated at ${new Date().toISOString()}`,
                        random: Math.random()
                    };
                }, 60); // 60 second TTL

                res.json({
                    cached: value,
                    message: 'Data fetched successfully'
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Start server
        const server = app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ Health check: http://localhost:${PORT}/health`);
            console.log(`✓ Stats: http://localhost:${PORT}/stats`);
            console.log('='.repeat(50));
        });

        // Graceful shutdown
        const shutdown = async (signal) => {
            console.log(`\n${signal} received, shutting down gracefully...`);

            server.close(async () => {
                console.log('HTTP server closed');
                await shutdownCache(cache);
                console.log('✓ Shutdown complete');
                process.exit(0);
            });

            setTimeout(() => {
                console.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
