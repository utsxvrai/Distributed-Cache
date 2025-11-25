import CodeBlock from '../components/CodeBlock'
import { Container, Play, StopCircle, Eye } from 'lucide-react'

export default function DockerGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4 gradient-text">Docker Setup</h1>
      <p className="text-xl text-gray-300 mb-12">
        Run CacheFlow with Docker - super easy!
      </p>

      <DockerSection
        icon={<Container />}
        title="Quick Start"
        description="Get the full stack running in 3 commands"
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">1. Configure Environment</h4>
            <CodeBlock
              code={`# Edit .env
REDIS_ENABLED=true
REDIS_URL=redis://redis:6379`}
              language="bash"
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">2. Start Services</h4>
            <CodeBlock code="docker-compose up -d" language="bash" />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">3. Test</h4>
            <CodeBlock code="curl http://localhost/health" language="bash" />
          </div>
        </div>
      </DockerSection>

      <DockerSection
        icon={<Play />}
        title="What Gets Started"
        description="Three services working together"
      >
        <div className="space-y-4">
          <ServiceCard
            name="Redis"
            port="6379"
            description="Distributed cache storage with persistence"
          />
          <ServiceCard
            name="Node.js App"
            port="8080"
            description="Your cache application with Express server"
          />
          <ServiceCard
            name="NGINX"
            port="80"
            description="Reverse proxy with gzip and rate limiting"
          />
        </div>
      </DockerSection>

      <DockerSection
        icon={<Eye />}
        title="Useful Commands"
        description="Manage your Docker stack"
      >
        <CommandGroup title="View Logs">
          <CodeBlock
            code={`# All services
docker-compose logs -f

# Specific service
docker-compose logs -f node
docker-compose logs -f redis`}
            language="bash"
          />
        </CommandGroup>

        <CommandGroup title="Check Status">
          <CodeBlock code="docker-compose ps" language="bash" />
        </CommandGroup>

        <CommandGroup title="Restart Services">
          <CodeBlock
            code={`# Restart all
docker-compose restart

# Restart specific service
docker-compose restart node`}
            language="bash"
          />
        </CommandGroup>

        <CommandGroup title="Rebuild">
          <CodeBlock code="docker-compose up -d --build" language="bash" />
        </CommandGroup>
      </DockerSection>

      <DockerSection
        icon={<StopCircle />}
        title="Stopping Services"
        description="Clean shutdown"
      >
        <CodeBlock
          code={`# Stop all services
docker-compose down

# Stop and remove volumes (clears Redis data)
docker-compose down -v`}
          language="bash"
        />
      </DockerSection>

      {/* Architecture */}
      <div className="mt-12 glass rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary-400">Architecture Flow</h3>
        <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm">
          <pre className="text-gray-300">
            {`User Request
     ↓
NGINX :80 (Reverse Proxy)
     ↓
Node.js :8080 (Application)
     ↓
Cache Wrapper (Orchestrator)
     ↓          ↓
Redis :6379   Local Cache (Map)
(Distributed) (In-Memory)`}
          </pre>
        </div>
      </div>

      {/* Testing */}
      <div className="mt-8 glass rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-purple-400">Testing the Setup</h3>
        <CodeBlock
          code={`# Via NGINX (port 80)
curl http://localhost/health
curl http://localhost/stats
curl http://localhost/demo/testkey

# Direct to Node.js (port 8080)
curl http://localhost:8080/health

# Check Redis has data
docker exec -it universal-cache-redis redis-cli
> KEYS *
> exit`}
          language="bash"
        />
      </div>
    </div>
  )
}

function DockerSection({ icon, title, description, children }) {
  return (
    <section className="mb-12">
      <div className="flex items-center mb-6">
        <div className="text-primary-400 mr-3">{icon}</div>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function ServiceCard({ name, port, description }) {
  return (
    <div className="glass rounded-lg p-4 flex items-start">
      <div className="w-16 h-16 flex items-center justify-center bg-primary-900/20 rounded-lg mr-4">
        <span className="text-2xl font-bold text-primary-400">{port}</span>
      </div>
      <div>
        <h4 className="font-semibold text-lg">{name}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  )
}

function CommandGroup({ title, children }) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-400 mb-2">{title}</h4>
      {children}
    </div>
  )
}
