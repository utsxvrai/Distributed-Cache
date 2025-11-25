import CodeBlock from '../components/CodeBlock'
import { Database, Users, ShoppingCart, FileText } from 'lucide-react'

export default function Examples() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4 gradient-text">Examples</h1>
      <p className="text-xl text-gray-300 mb-12">
        See how easy CacheFlow makes caching
      </p>

      <Example
        icon={<Database className="w-6 h-6" />}
        title="Database Query Caching"
        description="Cache expensive database queries to reduce load"
      >
        <CodeBlock
          code={`import { createCache } from 'cacheflow';
const cache = await createCache({ ttl: 1800 }); // 30 min

// Express route
app.get('/api/products', async (req, res) => {
  const products = await cache.getOrFetch('all-products', async () => {
    return await db.query('SELECT * FROM products');
  });
  
  res.json(products);
});`}
        />
      </Example>

      <Example
        icon={<Users className="w-6 h-6" />}
        title="User Session Management"
        description="Store user sessions with automatic expiration"
      >
        <CodeBlock
          code={`// Store session data
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  
  const sessionId = generateSessionId();
  await cache.set(\`session:\${sessionId}\`, user, 3600); // 1 hour
  
  res.json({ sessionId });
});

// Retrieve session
app.get('/profile', async (req, res) => {
  const { sessionId } = req.headers;
  const user = await cache.get(\`session:\${sessionId}\`);
  
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  res.json(user);
});`}
        />
      </Example>

      <Example
        icon={<ShoppingCart className="w-6 h-6" />}
        title="E-Commerce Product Cache"
        description="Cache product details with inventory updates"
      >
        <CodeBlock
          code={`// Fetch product with caching
async function getProduct(productId) {
  return await cache.getOrFetch(\`product:\${productId}\`, async () => {
    return await db.products.findById(productId);
  }, 600); // 10 minutes
}

// Invalidate on update
async function updateProduct(productId, updates) {
  await db.products.update(productId, updates);
  await cache.delete(\`product:\${productId}\`); // Invalidate cache
}

// Usage in routes
app.get('/products/:id', async (req, res) => {
  const product = await getProduct(req.params.id);
  res.json(product);
});`}
        />
      </Example>

      <Example
        icon={<FileText className="w-6 h-6" />}
        title="API Response Caching"
        description="Cache external API responses to reduce rate limits"
      >
        <CodeBlock
          code={`import axios from 'axios';

// Cache external API response
async function getWeatherData(city) {
  return await cache.getOrFetch(\`weather:\${city}\`, async () => {
    const response = await axios.get(
      \`https://api.weather.com/data?city=\${city}\`
    );
    return response.data;
  }, 1800); // Cache for 30 minutes
}

// Express endpoint
app.get('/weather/:city', async (req, res) => {
  const weather = await getWeatherData(req.params.city);
  res.json(weather);
});`}
        />
      </Example>

      {/* Multi-tenant Example */}
      <Example
        icon={<Users className="w-6 h-6" />}
        title="Multi-Tenant Caching"
        description="Organize cache keys by tenant/organization"
      >
        <CodeBlock
          code={`// Tenant-specific cache keys
async function getTenantData(tenantId, dataType) {
  const key = \`tenant:\${tenantId}:\${dataType}\`;
  
  return await cache.getOrFetch(key, async () => {
    return await db.tenants.getData(tenantId, dataType);
  }, 900); // 15 minutes
}

// Clear all tenant cache
async function clearTenantCache(tenantId) {
  // Note: In production, use pattern matching with Redis
  const keys = [\n    \`tenant:\${tenantId}:users\`,\n    \`tenant:\${tenantId}:settings\`,\n    \`tenant:\${tenantId}:permissions\`\n  ];
  
  await Promise.all(keys.map(key => cache.delete(key)));
}`}
        />
      </Example>

      {/* Monitoring Example */}
      <div className="mt-12 glass rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary-400">Monitoring Cache Performance</h3>
        <CodeBlock
          code={`// Monitor cache statistics
setInterval(async () => {
  const stats = await cache.stats();
  
  const hitRate = stats.global.totalRequests > 0
    ? (stats.global.localHits + stats.global.redisHits) / stats.global.totalRequests
    : 0;
  
  console.log(\`Cache Hit Rate: \${(hitRate * 100).toFixed(2)}%\`);
  console.log(\`Total Requests: \${stats.global.totalRequests}\`);
  console.log(\`Cache Entries: \${stats.local.entries}\`);
}, 60000); // Log every minute`}
        />
      </div>
    </div>
  )
}

function Example({ icon, title, description, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="text-primary-400 mr-3">{icon}</div>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
