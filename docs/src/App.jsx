import { Routes, Route, Link } from 'react-router-dom'
import { Zap, Menu, X, Github } from 'lucide-react'
import { useState } from 'react'
import Home from './pages/Home'
import WhyCacheFlow from './pages/WhyCacheFlow'
import GettingStarted from './pages/GettingStarted'
import APIReference from './pages/APIReference'
import Examples from './pages/Examples'
import DockerGuide from './pages/DockerGuide'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Why CacheFlow?', path: '/why' },
    { name: 'Getting Started', path: '/getting-started' },
    { name: 'API Reference', path: '/api' },
    { name: 'Examples', path: '/examples' },
    { name: 'Docker', path: '/docker' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
        <nav className="glass sticky top-0 z-50 border-b border-primary-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-primary-500" />
                <span className="text-xl font-bold gradient-text">CacheFlow</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <a
                  href="https://github.com/utsxvrai/Distributed-Cache"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-gray-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/why" element={<WhyCacheFlow />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/api" element={<APIReference />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/docker" element={<DockerGuide />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="glass border-t border-primary-900/30 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-sm text-gray-400">
                © 2024 CacheFlow. MIT License.
              </div>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <a href="https://github.com/utsxvrai/Distributed-Cache" className="text-sm text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  NPM
                </a>
                <a href="/getting-started" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Documentation
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

export default App
