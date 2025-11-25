import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeBlock({ code, language = 'javascript', showLineNumbers = false }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Custom theme based on VS Code Dark+
  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: '#1e1e1e',
      padding: '1rem',
      margin: 0,
      fontSize: '0.875rem',
      lineHeight: '1.7',
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: 'transparent',
      fontSize: '0.875rem',
      fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
    },
  }

  return (
    <div className="relative group my-4">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-lg opacity-20 group-hover:opacity-40 blur transition-opacity"></div>
      
      <div className="relative bg-[#1e1e1e] backdrop-blur-xl border border-primary-900/30 rounded-lg overflow-hidden shadow-2xl">
        {/* Language badge & copy button */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-dark-card border-b border-primary-900/30">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {language}
          </span>
          
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              copied
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-dark-lighter/50 text-gray-300 hover:bg-primary-900/30 hover:text-primary-400 border border-primary-900/30'
            }`}
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code content with syntax highlighting */}
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={customStyle}
            showLineNumbers={showLineNumbers}
            wrapLines={true}
            lineProps={{
              style: { 
                wordBreak: 'break-all', 
                whiteSpace: 'pre-wrap',
                display: 'block',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                marginLeft: '-0.5rem',
                marginRight: '-0.5rem',
                borderRadius: '0.25rem',
                transition: 'background-color 0.2s',
              }
            }}
            customStyle={{
              margin: 0,
              background: 'transparent',
              padding: '1rem',
            }}
            codeTagProps={{
              style: {
                fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                fontSize: '0.875rem',
              }
            }}
            PreTag="div"
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}
