import CodeBlock from '../components/CodeBlock'
import { Terminal, Package, Rocket } from 'lucide-react'

export default function GettingStarted() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4 gradient-text">Getting Started</h1>
      <p className="text-xl text-gray-300 mb-12">
        Start caching in 3 simple steps
      </p>

      {/* Installation */}
      <Section icon={<Package />} title="Step 1: Install" id="installation">
        <p className="text-gray-300 mb-4">
          Install CacheFlow via NPM:
        </p>
        <CodeBlock code="npm install cacheflow" language="bash" />
      </Section>

      {/* Quick Start */}
      <Section icon={<Rocket />} title="Step 2: Use It" id="quick-start">
        <h3 className="text-lg font-semibold mb-3 text-primary-400">Simple Example</h3>
        <CodeBlock
          code={`import { createCache } from 'cacheflow';

// Create cache
const cache = await createCache();

// Save data
await cache.set('user:123', { name: 'John' }, 600); // 10 min

// Get data
const user = await cache.get('user:123');

// Delete data
await cache.delete('user:123');`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-purple-400">Smart Caching</h3>
        <p className="text-gray-300 mb-4">
          Let CacheFlow handle everything for you:
        </p>
        <CodeBlock
          code={`// Auto-fetch from database if not cached
const user = await cache.getOrFetch('user:123', async () => {
  return await database.getUser(123);
}, 600); // Cache for 10 minutes

// That's it! CacheFlow handles caching automatically`}
        />
      </Section>

      {/* Configuration */}
      <Section icon={<Terminal />} title="Step 3: Configure (Optional)" id="configuration">
        <p className="text-gray-300 mb-4">
          Create a <code className="px-2 py-1 bg-gray-800 rounded">.env</code> file to customize:
        </p>
        <CodeBlock
          code={`# Use Redis (optional - local cache by default)
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379

# How long to cache (in seconds)
DEFAULT_TTL=3600

# Auto-cleanup old data
SCHEDULER_ENABLED=true`}
          language="bash"
        />

        <div className="mt-6 glass rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-primary-400">All Settings</h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-800">
              <ConfigRow name="REDIS_ENABLED" default="false" description="Turn on Redis caching" />
              <ConfigRow name="REDIS_URL" default="redis://localhost:6379" description="Where Redis is running" />
              <ConfigRow name="DEFAULT_TTL" default="3600" description="Cache duration (seconds)" />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Configuration */}
      <Section icon={<Terminal />} title="Configuration" id="configuration">
        <p className="text-gray-300 mb-4">
          Configure via environment variables in <code className="px-2 py-1 bg-gray-800 rounded">.env</code>:
        </p>
        <CodeBlock
          code={`# Redis Configuration
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379

# Cache Settings
DEFAULT_TTL=3600

# Scheduler
SCHEDULER_ENABLED=true
SCHEDULER_CRON=*/1 * * * *

# Application
PORT=8080
NODE_ENV=production`}
          language="bash"
        />

        <div className="mt-6 glass rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-primary-400">Configuration Options</h4>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-800">
              <ConfigRow name="REDIS_ENABLED" type="boolean" default="false" description="Enable Redis cache" />
              <ConfigRow name="REDIS_URL" type="string" default="redis://localhost:6379" description="Redis connection URL" />
              <ConfigRow name="DEFAULT_TTL" type="number" default="3600" description="Default TTL in seconds" />
              <ConfigRow name="SCHEDULER_ENABLED" type="boolean" default="true" description="Enable cleanup scheduler" />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Next Steps */}
      <div className="mt-12 glass rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary-400 rounded-full mr-3"></span>
            <a href="/api" className="hover:text-primary-400 transition-colors">Explore the API Reference</a>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
            <a href="/examples" className="hover:text-purple-400 transition-colors">Check out Examples</a>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
            <a href="/docker" className="hover:text-pink-400 transition-colors">Deploy with Docker</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

function Section({ icon, title, id, children }) {
  return (
    <section className="mb-12" id={id}>
      <div className="flex items-center mb-6">
        <div className="text-primary-400 mr-3">{icon}</div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function ConfigRow({ name, type, default: defaultValue, description }) {
  return (
    <tr>
      <td className="py-2 pr-4 font-mono text-primary-400">{name}</td>
      <td className="py-2 px-4 text-gray-400">{type}</td>
      <td className="py-2 px-4 font-mono text-gray-500">{defaultValue}</td>
      <td className="py-2 pl-4 text-gray-300">{description}</td>
    </tr>
  )
}
