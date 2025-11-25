import CodeBlock from '../components/CodeBlock'

export default function APIReference() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4 gradient-text">API Reference</h1>
      <p className="text-xl text-gray-300 mb-12">
        Everything you need to know about CacheFlow's API
      </p>

      {/* createCache */}
      <APIMethod
        name="createCache(options)"
        returns="Promise<CacheServiceWrapper>"
        description="Initialize and create a cache instance"
      >
        <h4 className="font-semibold mb-3">Parameters</h4>
        <div className="space-y-2 mb-4">
          <ParamRow name="options.redisUrl" type="string" optional description="Redis connection URL (e.g., redis://localhost:6379)" />
          <ParamRow name="options.ttl" type="number" optional default="3600" description="Default TTL in seconds" />
        </div>

        <h4 className="font-semibold  mb-3">Example</h4>
        <CodeBlock
          code={`const cache = await createCache({
  redisUrl: 'redis://localhost:6379',
  ttl: 3600
});`}
        />
      </APIMethod>

      {/* get */}
      <APIMethod
        name="cache.get(key)"
        returns="Promise<any|null>"
        description="Retrieve a value from cache. Returns null if not found or expired."
      >
        <h4 className="font-semibold mb-3">Parameters</h4>
        <ParamRow name="key" type="string" description="Cache key" />

        <h4 className="font-semibold mt-4 mb-3">Example</h4>
        <CodeBlock code={`const user = await cache.get('user:123');\nconsole.log(user); // { name: 'John' } or null`} />
      </APIMethod>

      {/* set */}
      <APIMethod
        name="cache.set(key, value, ttl?)"
        returns="Promise<void>"
        description="Store a value in cache with optional TTL"
      >
        <h4 className="font-semibold mb-3">Parameters</h4>
        <div className="space-y-2 mb-4">
          <ParamRow name="key" type="string" description="Cache key" />
          <ParamRow name="value" type="any" description="Value to cache (will be JSON serialized)" />
          <ParamRow name="ttl" type="number" optional description="Time to live in seconds" />
        </div>

        <h4 className="font-semibold mb-3">Example</h4>
        <CodeBlock code={`await cache.set('user:123', { name: 'John' }, 600); // 10 min TTL`} />
      </APIMethod>

      {/* delete */}
      <APIMethod
        name="cache.delete(key)"
        returns="Promise<boolean>"
        description="Delete a key from cache. Returns true if deleted, false if not found."
      >
        <h4 className="font-semibold mb-3">Parameters</h4>
        <ParamRow name="key" type="string" description="Cache key to delete" />

        <h4 className="font-semibold mt-4 mb-3">Example</h4>
        <CodeBlock code={`const deleted = await cache.delete('user:123');\nconsole.log(deleted); // true or false`} />
      </APIMethod>

      {/* getOrFetch */}
      <APIMethod
        name="cache.getOrFetch(key, asyncFn, ttl?)"
        returns="Promise<any>"
        description="Cache-aside pattern: get from cache or fetch and store"
      >
        <h4 className="font-semibold mb-3">Parameters</h4>
        <div className="space-y-2 mb-4">
          <ParamRow name="key" type="string" description="Cache key" />
          <ParamRow name="asyncFn" type="Function" description="Async function to fetch data if cache misses" />
          <ParamRow name="ttl" type="number" optional description="Time to live in seconds" />
        </div>

        <h4 className="font-semibold mb-3">Example</h4>
        <CodeBlock
          code={`const userData = await cache.getOrFetch('user:123', async () => {
  // Only called on cache miss
  return await database.users.findById(123);
}, 600);`}
        />
      </APIMethod>

      {/* stats */}
      <APIMethod
        name="cache.stats()"
        returns="Promise<object>"
        description="Get comprehensive cache statistics"
      >
        <h4 className="font-semibold mb-3">Returns</h4>
        <CodeBlock
          code={`{
  mode: 'redis+local' | 'local-only',
  global: {
    localHits: number,
    localMisses: number,
    redisHits: number,
    redisMisses: number,
    totalRequests: number
  },
  local: { type, entries, hits, misses, evictions, sets },
  redis: { type, entries, hits, sets, connected } | null
}`}
        />
      </APIMethod>

      {/* shutdown */}
      <APIMethod
        name="cache.shutdown()"
        returns="Promise<void>"
        description="Gracefully shutdown cache connections"
      >
        <h4 className="font-semibold mb-3">Example</h4>
        <CodeBlock code={`await cache.shutdown();\nconsole.log('Cache shutdown complete');`} />
      </APIMethod>
    </div>
  )
}

function APIMethod({ name, returns, description, children }) {
  return (
    <div className="mb-12 glass rounded-lg p-6">
      <div className="mb-4">
        <code className="text-lg font-bold text-primary-400">{name}</code>
        <div className="text-sm text-gray-400 mt-2">
          Returns: <code className="text-purple-400">{returns}</code>
        </div>
      </div>
      <p className="text-gray-300 mb-4">{description}</p>
      {children}
    </div>
  )
}

function ParamRow({ name, type, optional, default: defaultValue, description }) {
  return (
    <div className="flex items-start py-2">
      <code className="text-sm font-mono text-primary-400 mr-3">{name}</code>
      <span className="text-xs text-gray-500 mr-2">{type}</span>
      {optional && <span className="text-xs text-gray-600 mr-2">(optional)</span>}
      {defaultValue && <span className="text-xs text-gray-600 mr-2">= {defaultValue}</span>}
      <span className="text-sm text-gray-300">{description}</span>
    </div>
  )
}
