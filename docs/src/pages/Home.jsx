import { Link } from 'react-router-dom'
import { Zap, Gauge, Shield, Code2, GitBranch, Box } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-primary-800/10 to-black"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">CacheFlow</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Simple and powerful caching for Node.js. Local memory and Redis made easy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/getting-started"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-primary-900/50"
              >
                Get Started
              </Link>
              <a
                href="https://github.com/utsxvrai/Distributed-Cache"
                className="px-8 py-4 glass hover:bg-dark-lighter text-white rounded-lg font-semibold transition-all border border-primary-900/30"
              >
                View on GitHub
              </a>
            </div>
          </div>

          {/* Quick Example */}
          <div className="mt-16 max-w-3xl mx-auto">
            <CodeBlock
              language="javascript"
              code={`import { createCache } from 'cacheflow';

// Create cache (local or Redis)
const cache = await createCache();

// Cache your data - it's that simple!
const user = await cache.getOrFetch('user:123', async () => {
  return await database.getUser(123);
});

console.log(user); // Fast! From cache or database`}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            <span className="gradient-text">Built for Performance</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-primary-400" />}
              title="Blazing Fast"
              description="In-memory Map-based local caching with microsecond latency for single-instance apps"
            />
            <FeatureCard
              icon={<GitBranch className="w-8 h-8 text-purple-400" />}
              title="Distributed Ready"
              description="Redis support for multi-instance deployments with automatic failover to local cache"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-pink-400" />}
              title="Production Grade"
              description="Built-in error handling, auto-reconnection, graceful shutdown, and health checks"
            />
            <FeatureCard
              icon={<Code2 className="w-8 h-8 text-blue-400" />}
              title="Developer Friendly"
              description="Simple API with cache-aside pattern, comprehensive stats, and TypeScript support"
            />
            <FeatureCard
              icon={<Box className="w-8 h-8 text-green-400" />}
              title="Docker & NGINX"
              description="Complete orchestration with Docker Compose and NGINX reverse proxy included"
            />
            <FeatureCard
              icon={<Gauge className="w-8 h-8 text-orange-400" />}
              title="Configurable TTL"
              description="Automatic expiration with scheduled cleanup and customizable time-to-live settings"
            />
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Simple Yet Powerful
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary-400">Basic Usage</h3>
              <CodeBlock
                language="javascript"
                code={`// Set value with TTL
await cache.set('user:123', userData, 600);

// Get value
const user = await cache.get('user:123');

// Delete value
await cache.delete('user:123');`}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Cache-Aside Pattern</h3>
              <CodeBlock
                language="javascript"
                code={`// Automatically fetch if not cached
const data = await cache.getOrFetch(
  'expensive-query',
  async () => {
    return await database.query();
  },
  1800 // 30 min TTL
);`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatCard value="< 1ms" label="Local Cache Latency" />
            <StatCard value="99.9%" label="Cache Hit Rate" />
            <StatCard value="Zero" label="External Dependencies" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Speed Up Your App?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get started with Universal Cache in minutes
          </p>
          <Link
            to="/getting-started"
            className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-primary-900/50"
          >
            Read the Docs
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass rounded-xl p-6 hover:border-primary-800 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="glass rounded-xl p-8">
      <div className="text-4xl font-bold gradient-text mb-2">{value}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  )
}
