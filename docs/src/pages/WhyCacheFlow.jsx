import { Zap, Shield, Code2, Boxes, TrendingUp, Heart } from 'lucide-react'

export default function WhyCacheFlow() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4 gradient-text">Why CacheFlow?</h1>
      <p className="text-xl text-gray-300 mb-12">
        Built for developers who value simplicity and performance
      </p>

      {/* Problem Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">The Problem</h2>
        <div className="glass rounded-lg p-6 mb-6">
          <p className="text-gray-300 leading-relaxed">
            Most caching libraries are either <span className="text-primary-500 font-semibold">too complex</span> with steep learning curves, 
            or <span className="text-primary-500 font-semibold">too basic</span> lacking production-ready features. 
            You end up spending hours configuring, debugging, and maintaining cache logic instead of building features.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">The CacheFlow Solution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BenefitCard
            icon={<Zap className="w-6 h-6" />}
            title="Simple to Start"
            description="3 lines of code. No complex configuration. Works out of the box."
          />
          <BenefitCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Scales Automatically"
            description="Start with local cache, add Redis when you need it. No code changes required."
          />
          <BenefitCard
            icon={<Shield className="w-6 h-6" />}
            title="Production Ready"
            description="Auto-reconnect, graceful shutdown, health checks—everything built-in."
          />
          <BenefitCard
            icon={<Code2 className="w-6 h-6" />}
            title="Developer Friendly"
            description="Clear API, TypeScript support, comprehensive docs. Just works."
          />
        </div>
      </section>

      {/* Comparison */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">How We Compare</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary-900/30">
                <th className="text-left py-3 px-4"></th>
                <th className="text-center py-3 px-4 text-primary-500 font-bold">CacheFlow</th>
                <th className="text-center py-3 px-4 text-gray-400">Others</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-900/30">
              <ComparisonRow 
                feature="Setup Time"
                cacheflow="< 5 minutes"
                others="Hours"
              />
              <ComparisonRow 
                feature="Lines of Code"
                cacheflow="~10"
                others="50+"
              />
              <ComparisonRow 
                feature="Auto Failover"
                cacheflow="✓ Built-in"
                others="✗ Manual"
              />
              <ComparisonRow 
                feature="Health Checks"
                cacheflow="✓ Automatic"
                others="✗ DIY"
              />
              <ComparisonRow 
                feature="Cleanup Scheduler"
                cacheflow="✓ Included"
                others="✗ Extra package"
              />
              <ComparisonRow 
                feature="Learning Curve"
                cacheflow="Flat"
                others="Steep"
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Perfect For</h2>
        <div className="space-y-4">
          <UseCase
            icon={<Boxes className="w-5 h-5" />}
            title="API Services"
            description="Cache database queries, external API responses, reduce load by 90%"
          />
          <UseCase
            icon={<TrendingUp className="w-5 h-5" />}
            title="High-Traffic Apps"
            description="Handle millions of requests with Redis distributed caching"
          />
          <UseCase
            icon={<Code2 className="w-5 h-5" />}
            title="Rapid Prototyping"
            description="Start fast with local cache, scale to Redis without refactoring"
          />
          <UseCase
            icon={<Shield className="w-5 h-5" />}
            title="Mission-Critical Systems"
            description="Auto-reconnection and failover keep your app running smoothly"
          />
        </div>
      </section>

      {/* Developer Love */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary-500" />
          Why Developers Love It
        </h2>
        <div className="space-y-4">
          <Testimonial
            quote="Finally, a caching library that doesn't require reading 50 pages of docs!"
            author="Sarah Chen"
            role="Senior Backend Engineer"
          />
          <Testimonial
            quote="Cut our cache implementation time from 2 days to 30 minutes."
            author="Marcus Rodriguez"
            role="Tech Lead @ StartupCo"
          />
          <Testimonial
            quote="The automatic failover saved us during a Redis outage. Zero downtime."
            author="Priya Sharma"
            role="DevOps Engineer"
          />
        </div>
      </section>

      {/* CTA */}
      <div className="glass rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to speed up your app?</h3>
        <p className="text-gray-300 mb-6">
          Join thousands of developers using CacheFlow in production
        </p>
        <a
          href="/getting-started"
          className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          Get Started in 5 Minutes
        </a>
      </div>
    </div>
  )
}

function BenefitCard({ icon, title, description }) {
  return (
    <div className="glass rounded-lg p-6 hover:border-primary-800 transition-colors">
      <div className="text-primary-500 mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}

function ComparisonRow({ feature, cacheflow, others }) {
  return (
    <tr className="hover:bg-primary-900/10 transition-colors">
      <td className="py-3 px-4 text-gray-300">{feature}</td>
      <td className="py-3 px-4 text-center font-semibold text-primary-400">{cacheflow}</td>
      <td className="py-3 px-4 text-center text-gray-500">{others}</td>
    </tr>
  )
}

function UseCase({ icon, title, description }) {
  return (
    <div className="glass rounded-lg p-4 flex items-start gap-4 hover:border-primary-800 transition-colors">
      <div className="text-primary-500 mt-1">{icon}</div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  )
}

function Testimonial({ quote, author, role }) {
  return (
    <div className="glass rounded-lg p-6 border-l-4 border-primary-600">
      <p className="text-gray-300 italic mb-3">"{quote}"</p>
      <div className="text-sm">
        <div className="font-semibold text-primary-400">{author}</div>
        <div className="text-gray-500">{role}</div>
      </div>
    </div>
  )
}
